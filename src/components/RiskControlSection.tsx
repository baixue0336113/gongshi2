import React from "react";
import { useDevice } from "../context/DeviceContext";
import { ShieldAlert, AlertTriangle, TrendingUp, Search, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, ZAxis } from "recharts";

export default function RiskControlSection({ data }: any) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  if (!data) return <div className="p-8 text-center text-slate-400">暂无风险管理数据</div>;

  // Derived Data from Props
  const heatmapData = data.heatmap?.map((d: any) => ({
    x: d.average_work_hours || 0,
    y: d.score || 0,
    z: (d.score || 0) * 2,
    name: d.department || d.name,
    risk: d.score > 80 ? "高风险" : d.score > 50 ? "中风险" : "低风险"
  })) || [];

  const riskSummary = data.overview || {
    high_risk_count: 0,
    medium_risk_count: 0,
    low_risk_count: 0,
    total_alerts: 0,
    score: 0
  };

  // Flatten department details for the list if needed, or use worsening_top
  const alertsDetail = Object.entries(data.department_details || {}).flatMap(([dept, detail]: [string, any]) => 
    (detail.factors || []).map((f: any) => ({
      type: f.name,
      target: dept,
      desc: f.name,
      severity: f.level,
      status: "待处理",
      time: "-" 
    }))
  ).slice(0, 5);

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* Risk KBI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "风险综合评分", value: riskSummary.score || "-", icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "高风险项", value: riskSummary.high_risk_count || 0, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "中风险项", value: riskSummary.medium_risk_count || 0, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "待闭环预警", value: riskSummary.total_alerts || 0, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
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
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Heatmap */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h3 className={`text-[11px] font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-l-2 border-rose-500 pl-1.5 uppercase tracking-wider ${isFoldable ? "truncate" : ""}`} title="部门合规风险热力图">
            {isFoldable ? "风险热力图" : "部门合规风险热力图"}
          </h3>
          <div className="h-[200px] relative">
            {heatmapData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                  <XAxis type="number" dataKey="x" name="频次" hide />
                  <YAxis type="number" dataKey="y" name="影响" hide />
                  <ZAxis type="number" dataKey="z" range={[20, 400]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                  <Scatter name="风险点" data={heatmapData}>
                    {heatmapData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.y > 70 ? '#ef4444' : entry.y > 40 ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[10px] text-slate-400">暂无热力图数据</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <div className="grid grid-cols-2 grid-rows-2 w-full h-full border border-slate-300">
                <div className="border-r border-b border-slate-300 bg-emerald-50"></div>
                <div className="border-b border-slate-300 bg-amber-50"></div>
                <div className="border-r border-slate-300 bg-amber-50"></div>
                <div className="bg-rose-50"></div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-slate-400 font-bold px-1">
            <span>合规程度 ➔</span>
            <span>严重程度 ➔</span>
          </div>
        </div>

        {/* Top Risk Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h3 className={`text-[11px] font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-l-2 border-rose-500 pl-1.5 uppercase tracking-wider ${isFoldable ? "truncate" : ""}`} title="今日风险恶化 TOP3">
            {isFoldable ? "风险恶化 TOP3" : "今日风险恶化 TOP3"}
          </h3>
          <div className="space-y-3">
            {(data.worsening_top || []).length > 0 ? (data.worsening_top || []).slice(0, 3).map((alert: any, i: number) => (
              <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${alert.change_rate > 30 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                    <ShieldAlert size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-800 truncate" title={alert.department}>{alert.department}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate" title={alert.factor}>{alert.factor}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-[10px] font-bold ${alert.change_rate > 30 ? 'text-rose-600' : 'text-amber-600'}`}>+{alert.change_rate}%</div>
                  <div className="text-[8px] text-slate-400 mt-0.5 font-bold uppercase">较昨日</div>
                </div>
              </div>
            )) : (
              <div className="py-8 text-center text-[10px] text-slate-400">暂无今日风险恶化数据</div>
            )}
          </div>
        </div>
      </div>

      {/* Seven Day Labor Trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className={`text-[11px] font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-l-2 border-rose-500 pl-1.5 uppercase tracking-wider ${isFoldable ? "truncate" : ""}`} title="全厂异常工时趋势 (近7天)">
          {isFoldable ? "异常工时趋势" : "全厂异常工时趋势 (近7天)"}
        </h3>
        <div className="h-[200px]">
          {(data.summaryTrend || []).length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.summaryTrend || []} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Area type="monotone" dataKey="abnormal_hours" name="异常工时" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="approved_hours" name="核准工时" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.05} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[10px] text-slate-400">暂无趋势数据</div>
          )}
        </div>
      </div>

      {/* Risk Detail List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className={`text-[11px] font-bold text-slate-800 flex items-center gap-1.5 border-l-2 border-rose-500 pl-1.5 uppercase tracking-wider ${isFoldable ? "truncate" : ""}`} title="风险预警明细列表">风险预警明细列表</h3>
          <div className="flex gap-2">
            <button className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded hover:bg-slate-100 border border-slate-200">导出数据</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold whitespace-nowrap">风险类型</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">涉及人员/部门</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">风险描述</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">严重度</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">状态</th>
                <th className="px-4 py-3 font-bold text-right whitespace-nowrap">发现时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alertsDetail.length > 0 ? alertsDetail.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-700">{row.type}</td>
                  <td className="px-4 py-3 text-slate-600">{row.target}</td>
                  <td className="px-4 py-3 text-slate-500">{row.desc}</td>
                  <td className="px-4 py-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${row.severity === 'high' || row.severity === 'danger' ? 'bg-rose-50 text-rose-600' : row.severity === 'medium' || row.severity === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                      {row.severity === 'high' || row.severity === 'danger' ? '高' : row.severity === 'medium' || row.severity === 'warning' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${row.status === '待处理' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">{row.time}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">暂无风险预警明细</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {alertsDetail.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button className="text-[10px] font-bold text-indigo-600 hover:underline">查看更多风险记录 ➔</button>
          </div>
        )}
      </div>
    </div>
  );
}
