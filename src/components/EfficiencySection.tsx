import React from "react";
import { useDevice } from "../context/DeviceContext";
import { EfficiencyDashboardData } from "../types";
import { TrendingUp, Users, DollarSign, Activity, BarChart2, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from "recharts";

export default function EfficiencySection({ data }: { data: EfficiencyDashboardData }) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  if (!data) return <div className="p-8 text-center text-slate-400">暂无效率分析数据</div>;

  const trendData = data.trendRows.map(row => ({
    date: row.date,
    gross: row.perPersonGross || 0,
    costRate: row.support_ratio || 0,
    marginPerHour: row.margin_per_hour || 0
  }));

  const businessRank = data.businessRows.map(row => ({
    name: row.name,
    margin: row.salaryGrossEfficiency || 0,
    marginPerHour: row.margin_per_hour
  })).sort((a, b) => b.margin - a.margin);

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* KBIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.mainKPIs.map((kbi, i) => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex justify-between items-center group relative">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                {kbi.label}
                <div className="group-hover:block hidden absolute z-10 bg-slate-800 text-white p-2 rounded text-[9px] w-48 top-full left-0 mt-1 shadow-lg">
                  {kbi.formula}
                </div>
                <Info size={10} className="text-slate-300" />
              </div>
              <div className="text-base font-bold text-slate-800 font-mono">{kbi.value}</div>
              <div className={`text-[9px] font-bold mt-1 ${kbi.compare.startsWith('+') ? (kbi.isPositive ? 'text-emerald-500' : 'text-rose-500') : (kbi.isPositive ? 'text-rose-500' : 'text-emerald-500')}`}>
                {kbi.compare} 同比
              </div>
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 ${i === 0 ? 'text-emerald-600' : i === 1 ? 'text-blue-600' : 'text-orange-600'}`}>
              {i === 0 ? <DollarSign size={14} /> : i === 1 ? <Activity size={14} /> : <TrendingUp size={14} />}
            </div>
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "lg:grid-cols-2 gap-4"}`}>
        {/* Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-2 border-orange-500 pl-1.5">经营效率趋势 (人均毛利与支撑成本率)</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis yAxisId="left" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area yAxisId="left" type="monotone" dataKey="gross" name="人均毛利" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                <Area yAxisId="right" type="monotone" dataKey="costRate" name="支撑成本率(%)" stroke="#f59e0b" fill="none" strokeWidth={2} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col">
          <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-2 border-orange-500 pl-1.5">业务部门薪资毛利效率排名</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={businessRank} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Bar dataKey="margin" name="效率指数 (薪资毛利比)" radius={[0, 4, 4, 0]} barSize={12}>
                  {businessRank.map((_, i) => <Cell key={`cell-${i}`} fill={i < 2 ? '#f97316' : '#3b82f6'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Support Dept Heatmap */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-2 border-orange-500 pl-1.5">支持部门支撑负荷与时效对比</h3>
        <div className="overflow-x-auto text-[10px] custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="p-2 font-bold">职能/支持部门</th>
                <th className="p-2 font-bold">支撑人工成本</th>
                <th className="p-2 font-bold">关联业务价值</th>
                <th className="p-2 font-bold">时效比 (Ratio)</th>
                <th className="p-2 font-bold">单位支撑值</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.supportRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.name}</td>
                  <td className="p-2 font-mono">¥{row.labor_cost.toLocaleString()}</td>
                  <td className="p-2 font-mono text-emerald-600">¥{row.support_value.toLocaleString()}</td>
                  <td className="p-2 font-mono font-bold text-orange-600">{row.ratio}%</td>
                  <td className="p-2 font-mono">{row.unitSupport}</td>
                </tr>
              ))}
              {data.functionalRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 bg-slate-50/30">
                  <td className="p-2 font-bold text-slate-500">{row.name} (职能)</td>
                  <td className="p-2 text-slate-400">-</td>
                  <td className="p-2 font-mono">得分: {row.workload_score}</td>
                  <td className="p-2 font-mono text-slate-500">人员: {row.staff_count}</td>
                  <td className="p-2 font-mono">{row.loadRatio}% 负荷</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 p-2 bg-slate-50 rounded text-[9px] text-slate-500 italic">
          注: {data.source.note}
        </div>
      </div>
    </div>
  );
}
