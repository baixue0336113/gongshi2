import React, { useState } from "react";
import { MatrixData } from "../types";
import { useDevice } from "../context/DeviceContext";
import { 
  Calendar, DollarSign, Filter, Layers, PieChart as PieChartIcon,
  TrendingUp, Box
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function TotalCostMatrixSection({ initialData, selectedDate }: { initialData: MatrixData, selectedDate: string }) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (selectedDate && selectedDate.includes("-")) {
      return selectedDate.substring(0, 7);
    }
    return new Date().toISOString().slice(0, 7);
  });

  const summary = initialData.summary || {};
  const totalCost = summary.total_cost || 0;
  
  // Calculate composition from rows
  const compositionMap: Record<string, number> = {};
  initialData.rows.forEach(row => {
    let category = "其他成本";
    if (row.name.includes("学生餐")) category = "学生餐人工成本";
    else if (row.name.includes("方便菜")) category = "方便菜肴人工成本";
    else if (row.name.includes("兼职")) category = "校园兼职成本";
    else if (row.name.includes("白猫") || row.name.includes("清洗")) category = "白猫清洗成本";
    else if (row.name.includes("劳务") || row.name.includes("派遣")) category = "第三方劳务成本";
    
    compositionMap[category] = (compositionMap[category] || 0) + (row.total_cost || 0);
  });

  const compositionData = Object.entries(compositionMap)
    .map(([name, value], i) => ({
      name,
      value,
      color: CHART_COLORS[i % CHART_COLORS.length]
    }))
    .sort((a, b) => b.value - a.value);

  const hasComposition = compositionData.length > 0;

  // Daily Trend 
  const trendData = initialData.days.map(day => {
    let dayTotal = 0;
    initialData.rows.forEach(row => {
      dayTotal += (row.daily[day]?.cost || 0);
    });
    return {
      date: day.split("-")[2] + "日",
      total: dayTotal,
      average: Math.round(totalCost / initialData.days.length)
    };
  });

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* KBIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "核算周期", value: selectedMonth, icon: Calendar, color: "bg-orange-50 text-orange-600 border-orange-200" },
          { label: "核定总成本", value: `¥${Math.round(totalCost).toLocaleString()}`, icon: DollarSign, color: "bg-teal-50 text-teal-600 border-teal-200" },
          { label: "成本构成", value: `4 大类`, icon: Layers, color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
          { label: "当前月份", value: selectedMonth.split("-")[1] + "月", icon: Filter, color: "bg-blue-50 text-blue-600 border-blue-200" },
        ].map((c, i) => (
          <div key={i} className={`bg-white border border-slate-200/80 rounded-xl p-4 flex items-center justify-between shadow-xs`}>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">{c.label}</span>
              <span className="text-sm md:text-base font-bold text-slate-800 font-mono block">{c.value}</span>
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.color}`}>
              <c.icon size={14} />
            </div>
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "lg:grid-cols-12 gap-4"}`}>
        {/* Trend */}
        <div className={`bg-white rounded-xl border border-slate-200 p-4 shadow-xs ${isFoldable ? "" : "lg:col-span-8"}`}>
          <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-orange-500" /> 每日总成本趋势
          </h3>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalCostGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Area name="日总成本" type="monotone" dataKey="total" stroke="#f97316" fill="url(#totalCostGrad)" strokeWidth={2} />
                <Area name="平均线" type="step" dataKey="average" stroke="#94a3b8" strokeDasharray="3 3" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Composition */}
        <div className={`bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col ${isFoldable ? "" : "lg:col-span-4"}`}>
          <h3 className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
            <PieChartIcon size={14} className="text-orange-500" /> 成本构成占比
          </h3>
          <div className="flex-1 min-h-[140px] mt-2 relative flex items-center justify-center">
            {hasComposition ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={compositionData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                    {compositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => `¥${Math.round(val).toLocaleString()}`} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-[10px] text-slate-400">暂无成本构成明细</div>
            )}
          </div>
          {hasComposition && (
            <div className="space-y-1.5 mt-2">
              {compositionData.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-[9px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-slate-600">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{((d.value / (totalCost || 1)) * 100).toFixed(1)}%</span>
                    <span className="font-mono text-slate-800">¥{Math.round(d.value).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col min-h-[400px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Box size={14} className="text-orange-500"/>
            总成本日历视图
          </span>
        </div>
        <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg">
          <table className="w-full border-collapse table-fixed min-w-[1300px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[9px] font-bold">
                <th className="sticky left-0 bg-slate-50 w-[120px] text-left px-3 py-2 border-r border-slate-200 z-10">成本分类 / 部门</th>
                {initialData.days.map((day) => (
                  <th key={day} className="text-center py-2 border-r border-slate-200 w-[60px]">
                    {String(day).split("-")[2]}日
                  </th>
                ))}
                <th className="w-[85px] text-center bg-slate-50 border-l border-slate-200 sticky right-0 z-10">累计汇总</th>
              </tr>
            </thead>
            <tbody className="text-[10px]">
              {initialData.rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="sticky left-0 bg-white font-bold text-slate-700 px-3 py-2 border-r border-slate-200 z-10 truncate" title={row.name}>
                    {row.name}
                  </td>
                  {initialData.days.map((day) => {
                    const c = row.daily[day]?.cost || 0;
                    return (
                      <td key={day} className="text-center py-1.5 border-r border-slate-200/50 font-mono text-slate-600">
                        {c > 0 ? `¥${Math.round(c).toLocaleString()}` : <span className="text-slate-300">-</span>}
                      </td>
                    );
                  })}
                  <td className="sticky right-0 bg-slate-50 text-center py-1.5 border-l border-slate-200 z-10 font-mono font-bold text-slate-800">
                    ¥{Math.round(row.total_cost || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
