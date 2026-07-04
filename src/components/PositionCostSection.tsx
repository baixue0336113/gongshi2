import React from "react";
import { useDevice } from "../context/DeviceContext";
import { PositionCostData } from "../types";
import { TrendingUp, Users, DollarSign, Award, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function PositionCostSection({ data }: { data: PositionCostData }) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  if (!data) return <div className="p-8 text-center text-slate-400">暂无职位成本数据</div>;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* KBIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.kpis.map((kbi, i) => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{kbi.label}</div>
              <div className="text-lg font-bold text-slate-800 font-mono">{kbi.value}</div>
              <div className={`text-[9px] font-bold mt-1 ${kbi.change?.startsWith('+') ? (kbi.isPositive ? 'text-emerald-500' : 'text-rose-500') : (kbi.isPositive ? 'text-rose-500' : 'text-emerald-500')}`}>
                {kbi.change} 同比
              </div>
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 ${i === 0 ? 'text-blue-600' : i === 1 ? 'text-emerald-600' : 'text-purple-600'}`}>
              {i === 0 ? <Award size={14} /> : i === 1 ? <Users size={14} /> : <TrendingUp size={14} />}
            </div>
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "lg:grid-cols-2 gap-4"}`}>
        {/* Ranking */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col">
          <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-2 border-orange-500 pl-1.5 uppercase tracking-wider">各职位累计成本排名</h3>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.costRanking} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="position" type="category" width={80} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(val: number) => `¥${val.toLocaleString()}`} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Bar dataKey="cost" name="累计成本" radius={[0, 4, 4, 0]} barSize={16}>
                  {data.costRanking.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Concentration */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col">
          <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-2 border-orange-500 pl-1.5 uppercase tracking-wider">岗位成本集中度分析</h3>
          <div className="flex-1 min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.concentration} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value" nameKey="name">
                  {data.concentration.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => `¥${val.toLocaleString()}`} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-bold">TOP 5 岗位成本占比</span>
              <span className="text-orange-600 font-bold">{data.concentrationTop5Ratio}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full" style={{ width: `${data.concentrationTop5Ratio}%` }}></div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {data.concentration.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-[9px] text-slate-500 truncate">{item.name}</span>
                  <span className="text-[9px] text-slate-400 ml-auto">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">职位成本明细分析表</h3>
        </div>
        <div className="overflow-x-auto text-[10px] custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="p-3 font-bold">核心职位</th>
                <th className="p-3 font-bold">归属部门</th>
                <th className="p-3 font-bold text-right">编制人数</th>
                <th className="p-3 font-bold text-right">月人均成本</th>
                <th className="p-3 font-bold text-right">单位工时成本</th>
                <th className="p-3 font-bold text-right">总成本 (元)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.analysisRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-700">{row.position}</td>
                  <td className="p-3 text-slate-500">{row.department}</td>
                  <td className="p-3 font-mono text-right">{row.headcount || row.people}</td>
                  <td className="p-3 font-mono text-right text-slate-600">¥{(row.avg_cost || 0).toLocaleString()}</td>
                  <td className="p-3 font-mono text-right text-slate-600">¥{(row.unitHourCost || 0).toFixed(1)}</td>
                  <td className="p-3 font-mono font-bold text-right text-slate-800">¥{row.total_cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
