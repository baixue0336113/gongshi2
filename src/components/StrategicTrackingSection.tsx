import React from "react";
import { useDevice } from "../context/DeviceContext";
import { Activity, Target, MessageSquare, AlertCircle, TrendingDown, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

export default function StrategicTrackingSection({ data }: any) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  if (!data) return <div className="p-8 text-center text-slate-400">暂无管理追踪数据</div>;

  // Derived Data from Props
  const summaryCards = data.summaryCards || [];
  const interventions = data.interventions || data.focusDepartments || [];
  const trackingList = data.highRiskPeople || [];

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* Tracking KBI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.length > 0 ? summaryCards.map((kbi: any, i: number) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`p-1.5 rounded-lg ${kbi.tone === 'success' ? 'bg-emerald-50 text-emerald-600' : kbi.tone === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                {kbi.tone === 'success' ? <Target size={14} /> : kbi.tone === 'warning' ? <Activity size={14} /> : <Clock size={14} />}
              </div>
              <span className={`text-[10px] text-slate-500 font-bold ${isFoldable ? "truncate" : ""}`} title={kbi.label}>{kbi.label}</span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-800">{kbi.value}</div>
            <div className="text-[8px] text-slate-400 mt-0.5 truncate">{kbi.trend}</div>
          </div>
        )) : (
          [
            { label: "待处理事项", value: "-", icon: Clock, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "处理中事项", value: "-", icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "已完成(周)", value: "-", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "平均闭环耗时", value: "-", icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((kbi, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`p-1.5 rounded-lg ${kbi.bg} ${kbi.color}`}>
                  <kbi.icon size={14} />
                </div>
                <span className={`text-[10px] text-slate-500 font-bold ${isFoldable ? "truncate" : ""}`} title={kbi.label}>{kbi.label}</span>
              </div>
              <div className="text-lg font-mono font-bold text-slate-800">{kbi.value}</div>
            </div>
          ))
        )}
      </div>

      {/* Risk Trend (14 Days) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className={`text-[11px] font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-l-2 border-indigo-500 pl-1.5 uppercase tracking-wider ${isFoldable ? "truncate" : ""}`} title="合规指数趋势 (近14天)">
          {isFoldable ? "合规指数趋势" : "合规指数趋势 (近14天)"}
        </h3>
        <div className="h-[200px]">
          {(data.summaryTrend || data.riskTrend || []).length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.summaryTrend || data.riskTrend || []} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Line type="monotone" dataKey="compliance_rate" name="合规率(%)" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="risk_index" name="风险指数" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[10px] text-slate-400">暂无合规趋势数据</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Intervention Tasks */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h3 className={`text-[11px] font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-l-2 border-indigo-500 pl-1.5 uppercase tracking-wider ${isFoldable ? "truncate" : ""}`} title="需紧急干预的任务">需紧急干预的任务</h3>
          <div className="space-y-2">
            {interventions.length > 0 ? interventions.slice(0, 5).map((task: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'danger' || task.priority === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : task.status === 'warning' || task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                  <div className="text-[11px] font-medium text-slate-700 truncate" title={task.name || task.title}>{task.name || task.title}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[9px] text-slate-400 font-bold">{task.owner || task.manager}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${task.status === 'success' || task.status === '已完成' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>{task.changeLabel || task.status}</span>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center text-[10px] text-slate-400">暂无紧急干预任务</div>
            )}
          </div>
        </div>

        {/* Dept Rules Tracking */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h3 className={`text-[11px] font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-l-2 border-indigo-500 pl-1.5 uppercase tracking-wider ${isFoldable ? "truncate" : ""}`} title="重点部门规则触达排行">重点部门规则触达排行</h3>
          <div className="h-[160px]">
            {(data.efficiencyData?.businessRows || []).length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(data.efficiencyData?.businessRows || []).slice(0, 5)} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                  <Bar dataKey="salaryGrossEfficiency" name="违规指数" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[10px] text-slate-400">暂无规则触达排名</div>
            )}
          </div>
          <div className="mt-2 text-center">
            <span className="text-[9px] text-slate-400 italic">注: 数值代表该部门触犯管理红线的加权指数</span>
          </div>
        </div>
      </div>

      {/* Personnel/Anomaly Tracking List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className={`text-[11px] font-bold text-slate-800 flex items-center gap-1.5 border-l-2 border-indigo-500 pl-1.5 uppercase tracking-wider ${isFoldable ? "truncate" : ""}`} title="重点人员与异常事项追踪">重点人员与异常事项追踪</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold whitespace-nowrap">追踪对象</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">关联事项</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">当前阶段</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">最近跟进</th>
                <th className="px-4 py-3 font-bold text-right whitespace-nowrap">跟进人</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trackingList.length > 0 ? trackingList.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-700">{row.name} ({row.department})</td>
                  <td className="px-4 py-3 text-slate-500">{row.risk_type || row.riskLabel}</td>
                  <td className="px-4 py-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${row.reviewStatus === '已闭环' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {row.reviewStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400">-</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-600">
                    {row.owner || row.manager || row.handler || row.follow_user || "-"}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">暂无重点人员追踪数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
