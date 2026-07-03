import React from "react";
import { CostCenterData } from "../types";
import { useDevice } from "../context/DeviceContext";
import { DollarSign, ShieldAlert, TrendingUp, HelpCircle, AlertTriangle, PieChart as PieIcon, Info } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Cell, Pie, PieChart as RechartsPieChart } from "recharts";

interface CostCenterSectionProps {
  data: CostCenterData;
}

export default function CostCenterSection({ data }: CostCenterSectionProps) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  if (!data) return <div className="text-slate-400 p-6">暂无成本中心数据</div>;

  const {
    mainKPIs = [],
    trendData = [],
    structure = [],
    departmentRows = [],
    alerts = [],
    totals = { labor_cost: 0, hours: 0, cost_per_hour: 0 },
    source = { note: "" }
  } = data;

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-6"}>
      
      {/* 1. Main KPIs with formulas */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isFoldable ? "gap-3" : "gap-5"}`}>
        {mainKPIs.map((kpi, idx) => (
          <div key={idx} className={`bg-white border border-slate-200 rounded-xl flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xs group ${
            isFoldable ? "p-3" : "p-5"
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">{kpi.label}</span>
                <h2 className={`${isFoldable ? "text-lg mt-0.5" : "text-2xl mt-1.5"} font-bold font-mono text-slate-900 group-hover:text-orange-500 transition-colors`}>
                  {kpi.value}
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 font-bold font-mono bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                {kpi.compare}
              </span>
            </div>
            
            <div className={`${isFoldable ? "mt-2 pt-2 p-1.5 text-[9px]" : "mt-4 pt-3 p-2.5 text-[10px]"} border-t border-slate-100 bg-slate-50 rounded-lg text-slate-500 flex items-start gap-1.5`}>
              <HelpCircle size={12} className="text-orange-500 shrink-0 mt-0.5" />
              <span className="font-mono leading-normal">{kpi.formula}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Daily artificial labor cost & rate trends */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 ${isFoldable ? "gap-3" : "gap-6"}`}>
        
        {/* Trend Area */}
        <div className={`lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3" : "p-5"}`}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-orange-500" />
              <h3 className="text-xs font-bold text-slate-800">每日人工工时成本与实际单位工时费走势</h3>
            </div>
          </div>

          <div className={isFoldable ? "h-[160px]" : "h-60"}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ left: -25, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCostRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                  labelStyle={{ color: "#475569", fontWeight: "bold", fontSize: 10 }}
                  itemStyle={{ fontSize: 10, padding: "2px 0" }}
                />
                <Area type="monotone" name="每日确认人工成本 (元)" dataKey="labor_cost" stroke="#ef4444" strokeWidth={2} fill="url(#colorCostRed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Structure Donut List */}
        <div className={`lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between ${
          isFoldable ? "p-3" : "p-5"
        }`}>
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <PieIcon size={14} className="text-orange-500" />
              <h4 className="text-xs font-bold text-slate-800">人工成本要素分配结构</h4>
            </div>

            <div className="space-y-2">
              {structure.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] text-slate-700 font-medium truncate">{item.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-slate-900 font-mono">¥{item.value?.toLocaleString()}</span>
                    <span className="text-[8px] text-slate-400 block font-mono">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Cost warnings & Department Table */}
      <div className={`grid grid-cols-1 xl:grid-cols-3 items-start ${isFoldable ? "gap-3" : "gap-6"}`}>
        
        {/* Department cost grid */}
        <div className={`xl:col-span-2 bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3" : "p-5"}`}>
          <h4 className="text-xs font-bold text-slate-800 mb-3">部门级确认人工成本归集表</h4>
          <div className="overflow-x-auto matrix-scroll rounded-lg border border-slate-100">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2 px-2.5">业务部门/工段</th>
                  <th className="py-2 px-2.5 text-right">人工总成本 (元)</th>
                  <th className="py-2 px-2.5 text-right">核准工时 (h)</th>
                  <th className="py-2 px-2.5 text-right">单位工时费 (元/h)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departmentRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 px-2.5 font-semibold text-slate-700">{row.name}</td>
                    <td className="py-2 px-2.5 text-right text-orange-600 font-mono font-bold">¥{row.labor_cost?.toLocaleString()}</td>
                    <td className="py-2 px-2.5 text-right text-slate-600 font-mono">{row.hours} h</td>
                    <td className="py-2 px-2.5 text-right text-slate-500 font-mono">¥{row.cost_per_hour}/h</td>
                  </tr>
                ))}
                {/* Summary total row */}
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-200 text-orange-700">
                  <td className="py-2.5 px-2.5">合计归集总额</td>
                  <td className="py-2.5 px-2.5 text-right font-mono text-[13px]">¥{totals.labor_cost?.toLocaleString()}</td>
                  <td className="py-2.5 px-2.5 text-right font-mono">{totals.hours} h</td>
                  <td className="py-2.5 px-2.5 text-right font-mono">¥{totals.cost_per_hour}/h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Budget Warning Alert Center */}
        <div className={`bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3" : "p-5"}`}>
          <div className="flex items-center gap-1.5 mb-3">
            <ShieldAlert size={14} className="text-rose-500" />
            <h4 className="text-xs font-bold text-slate-800">成本风险预警中心</h4>
          </div>

          <div className="space-y-2.5">
            {alerts.map((alt, idx) => (
              <div 
                key={idx} 
                className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                  alt.level === "high" 
                    ? "bg-rose-50 border-rose-100 text-rose-800" 
                    : "bg-amber-50 border-amber-100 text-amber-800"
                }`}
              >
                <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                <div className="text-[11px]">
                  <span className="font-bold block text-slate-800">{alt.department}</span>
                  <p className="mt-0.5 leading-relaxed text-[10px] text-slate-500">{alt.message}</p>
                  <span className="inline-block mt-1.5 font-mono text-[9px] font-bold px-1 py-0.5 bg-white border border-slate-200 rounded text-orange-600">
                    {alt.value}
                  </span>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                暂无异常成本和预算溢价警报
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Source metadata footnote */}
      {source?.note && (
        <div className="text-[10px] text-slate-500 bg-slate-100/80 px-3 py-2 rounded-lg border border-slate-200/80 flex items-center gap-1.5 font-mono shadow-xs">
          <Info size={11} className="text-slate-400 shrink-0" />
          <span>{source.note}</span>
        </div>
      )}

    </div>
  );
}
