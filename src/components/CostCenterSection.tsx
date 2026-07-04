import React from "react";
import { useDevice } from "../context/DeviceContext";
import { CostCenterData } from "../types";
import { TrendingUp, DollarSign, Clock, PieChart as PieChartIcon, AlertCircle, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function CostCenterSection({ data }: { data: CostCenterData }) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  if (!data) return <div className="p-8 text-center text-slate-400">暂无成本中心数据</div>;

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* KBIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.mainKPIs.map((kbi, i) => (
          <div key={i} className={`bg-white border rounded-xl p-5 shadow-xs flex justify-between items-center group relative ${kbi.highlight ? 'border-orange-200 bg-orange-50/20' : 'border-slate-200'}`}>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                {kbi.label}
                <div className="group-hover:block hidden absolute z-10 bg-slate-800 text-white p-2 rounded text-[9px] w-64 top-full left-0 mt-1 shadow-lg">
                  {kbi.formula}
                </div>
                <Info size={11} className="text-slate-300" />
              </div>
              <div className={`text-2xl font-bold font-mono ${kbi.highlight ? 'text-orange-600' : 'text-slate-800'}`}>{kbi.value}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${kbi.compare.startsWith('+') ? (kbi.isPositive ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600') : (kbi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}`}>
                  {kbi.compare} 同比
                </span>
                <span className="text-[10px] text-slate-400">{kbi.desc}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kbi.highlight ? 'bg-orange-500 text-white shadow-orange-200 shadow-lg' : 'bg-slate-100 text-slate-600'}`}>
              {i === 0 ? <TrendingUp size={20} /> : <DollarSign size={20} />}
            </div>
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "lg:grid-cols-12 gap-4"}`}>
        {/* Trend */}
        <div className={`bg-white rounded-xl border border-slate-200 p-4 shadow-xs ${isFoldable ? "" : "lg:col-span-7"}`}>
          <h3 className="text-[11px] font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-l-2 border-orange-500 pl-1.5">人工成本与成本率月度趋势</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trendData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis yAxisId="left" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area yAxisId="left" type="monotone" dataKey="labor_cost" name="人工成本" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                <Area yAxisId="right" type="step" dataKey="cost_rate" name="成本率(%)" stroke="#ef4444" fill="none" strokeWidth={2} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Structure */}
        <div className={`bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col ${isFoldable ? "" : "lg:col-span-5"}`}>
          <h3 className="text-[11px] font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-l-2 border-orange-500 pl-1.5">人工成本构成分析</h3>
          <div className="flex-1 min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.structure} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" nameKey="name">
                  {data.structure.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => `¥${val.toLocaleString()}`} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {data.structure.map((item, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] text-slate-600 font-bold truncate">{item.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-800">{item.displayValue}</span>
                  <span className="text-[9px] text-slate-400">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={14} className="text-rose-500" />
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">成本预警与异常洞察</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.alerts.map((alert, i) => (
            <div key={i} className="bg-white/80 border border-rose-100 rounded-lg p-3 flex justify-between items-center">
              <div>
                <div className="text-[11px] font-bold text-slate-800 mb-0.5">{alert.department}</div>
                <div className="text-[10px] text-rose-600">{alert.message}</div>
              </div>
              <div className="text-xs font-bold font-mono text-rose-700">{alert.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className={`text-[11px] font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider ${isFoldable ? "truncate" : ""}`} title="部门成本明细列表">部门成本明细列表</h3>
          <div className="flex items-center gap-4 text-[11px]">
            {!isFoldable && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock size={12} /> <span className="font-mono">总工时: {data.totals.hours.toLocaleString()}h</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-orange-600 font-bold">
              <DollarSign size={12} /> <span className="font-mono">总成本: ¥{data.totals.labor_cost.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto text-[10px] custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className={`p-3 font-bold ${isFoldable ? "min-w-[100px]" : "min-w-[120px]"}`}>
                  <span className="truncate block" title="核算部门 / 车间">{isFoldable ? "核算部门" : "核算部门 / 车间"}</span>
                </th>
                <th className="p-3 font-bold text-right">核准工时 (h)</th>
                <th className="p-3 font-bold text-right">单位工时成本</th>
                <th className="p-3 font-bold text-right">成本占比</th>
                <th className="p-3 font-bold text-right">人工总成本 (元)</th>
                <th className="p-3 font-bold text-center">风险状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.departmentRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-700">{row.name}</td>
                  <td className="p-3 font-mono text-right text-slate-600">{row.hours.toLocaleString()}</td>
                  <td className="p-3 font-mono text-right text-slate-600">¥{row.cost_per_hour.toFixed(1)}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1 overflow-hidden">
                        <div className="bg-orange-400 h-full" style={{ width: `${row.costShare}%` }}></div>
                      </div>
                      <span className="font-mono w-8 text-right">{row.costShare}%</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-right text-slate-800">¥{row.labor_cost.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${row.risk === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' : row.risk === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {row.risk === 'high' ? '高风险' : row.risk === 'medium' ? '中风险' : '正常'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[9px] text-slate-400 text-right">
          数据来源: {data.source.note}
        </div>
      </div>
    </div>
  );
}
