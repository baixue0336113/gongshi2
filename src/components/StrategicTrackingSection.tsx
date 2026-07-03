import React from "react";
import { StrategicData } from "../types";
import { Activity, ShieldCheck, Users, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

interface StrategicTrackingSectionProps {
  data: StrategicData;
}

export default function StrategicTrackingSection({ data }: StrategicTrackingSectionProps) {
  if (!data) return <div className="text-slate-400 p-6">暂无管理追踪数据</div>;

  const {
    summaryCards = [],
    riskTrend = [],
    focusDepartments = [],
    highRiskPeople = []
  } = data;

  return (
    <div className="space-y-6">
      
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-orange-500/40 transition-all shadow-xs group">
            <span className="text-[11px] text-slate-500 font-bold block">{card.label}</span>
            <h2 className="text-2xl font-bold font-mono text-slate-900 mt-1.5 group-hover:text-orange-500 transition-colors">{card.value}</h2>
            <div className="mt-3 text-[10px] text-slate-500 font-mono">
              <span>状态指引: </span>
              <span className="text-orange-600 font-bold">{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Risk Trend & Focus Departments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Trend Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={15} className="text-orange-500" />
              <h3 className="text-xs font-bold text-slate-800">核心疲劳与用工风险中枢综合走势图</h3>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">风控预警线 40</span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrend} margin={{ left: -25, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRiskIdx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  labelStyle={{ color: "#475569", fontWeight: "bold" }}
                />
                
                {/* Benchmark threshold */}
                <ReferenceLine y={40} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "风险控制上限红线", fill: "#ef4444", fontSize: 9, position: "top" }} />
                
                <Area type="monotone" name="综合风险指数" dataKey="risk_index" stroke="#f97316" strokeWidth={2.5} fill="url(#colorRiskIdx)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Focus Departments */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-rose-500" />
              <span>本月重点督办车间</span>
            </h3>
            <span className="text-[9px] text-slate-400 font-mono">触发次数</span>
          </div>

          <div className="space-y-3">
            {focusDepartments.map((dept, idx) => (
              <div key={idx} className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 flex justify-between items-center text-xs hover:bg-slate-50 transition-colors">
                <div>
                  <span className="font-semibold text-slate-800 block">{dept.name}</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">状态: {dept.status === "danger" ? "🚨 极高负荷" : "⚠️ 需关注"}</span>
                </div>
                <span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${
                  dept.status === "danger" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {dept.issue_count}次违规
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Top Risk People Oversight */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Users size={15} className="text-orange-500" />
            <h4 className="text-xs font-bold text-slate-800">全集团重点提示人员及疲劳监管Top 10</h4>
          </div>
          <span className="text-[9px] text-slate-400 font-mono">每日更新合规底单</span>
        </div>

        <div className="overflow-x-auto matrix-scroll rounded-lg border border-slate-100">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5 px-3">监管人员</th>
                <th className="py-2.5 px-3">归属车间部所</th>
                <th className="py-2.5 px-3">触发异常类型</th>
                <th className="py-2.5 px-3 text-right">本月累计工时 (h)</th>
                <th className="py-2.5 px-3 text-right">系统督办状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {highRiskPeople.map((person, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">{person.name}</td>
                  <td className="py-3 px-3 text-slate-600">{person.department}</td>
                  <td className="py-3 px-3 text-rose-600 font-semibold">{person.risk_type}</td>
                  <td className="py-3 px-3 text-right text-orange-600 font-mono font-bold">{person.hours} h</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      已通知主管
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer warning info */}
      <div className="p-3 bg-slate-100/80 border border-slate-200/80 text-[10px] text-slate-500 rounded-lg flex items-center gap-2 font-mono">
        <RefreshCw size={11} className="text-slate-400 shrink-0" />
        <span>系统根据工时合规模型自动检测用工异常，请督促相关业务主管及时核对异常并优化考勤排班合理性。</span>
      </div>

    </div>
  );
}
