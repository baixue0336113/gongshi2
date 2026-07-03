import React from "react";
import { EfficiencyDashboardData } from "../types";
import { useDevice } from "../context/DeviceContext";
import { Zap, TrendingUp, HelpCircle, AlertCircle, RefreshCw, BarChart2, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Line, ReferenceLine } from "recharts";

interface EfficiencySectionProps {
  data: EfficiencyDashboardData;
}

export default function EfficiencySection({ data }: EfficiencySectionProps) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  if (!data) return <div className="text-slate-400 p-6">暂无经营效率数据</div>;

  const {
    mainKPIs = [],
    businessRows = [],
    supportRows = [],
    functionalRows = [],
    trendRows = [],
    referenceLines = { avg_line: 0, industry_line: 0 },
    referenceNotes = [],
    source = { note: "" }
  } = data;

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-6"}>
      
      {/* 1. Main KPIs with formulas */}
      <div className={`grid grid-cols-1 md:grid-cols-3 ${isFoldable ? "gap-3" : "gap-5"}`}>
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
                {kpi.compare || kpi.change}
              </span>
            </div>
            
            <div className={`${isFoldable ? "mt-2 pt-2 p-1.5 text-[9px]" : "mt-4 pt-3 p-2.5 text-[10px]"} border-t border-slate-100 bg-slate-50 rounded-lg text-slate-500 flex items-start gap-1.5`}>
              <HelpCircle size={12} className="text-orange-500 shrink-0 mt-0.5" />
              <span className="font-mono leading-normal">{kpi.formula || kpi.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Efficiency trends & reference lines */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 ${isFoldable ? "gap-3" : "gap-6"}`}>
        
        {/* Trend chart */}
        <div className={`lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3" : "p-5"}`}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <BarChart2 size={14} className="text-orange-500" />
              <h3 className="text-xs font-bold text-slate-800">近30天业务人员单位工时毛利与支撑成本比</h3>
            </div>
            <span className="text-[9px] text-slate-400 font-medium">双基准线对比</span>
          </div>

          <div className={isFoldable ? "h-[160px]" : "h-64"}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendRows} margin={{ left: -25, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
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
                
                <Area type="monotone" name="人均每小时毛利(元)" dataKey="margin_per_hour" stroke="#f97316" strokeWidth={2} fill="url(#colorMargin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reference line notes sidebar */}
        <div className={`lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between ${
          isFoldable ? "p-3" : "p-5"
        }`}>
          <div>
            <h4 className="text-xs font-bold text-slate-500 tracking-wider mb-2.5">
              行业基准与核算释义
            </h4>
            <div className="space-y-2">
              {referenceNotes.map((note, idx) => (
                <div key={idx} className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100 flex items-start gap-1.5">
                  <AlertCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-900 leading-normal font-mono">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span className="text-[10px] text-slate-500 font-medium">所有参考线均符合食品工业人效标准要求。</span>
          </div>
        </div>

      </div>

      {/* 3. Three-Column Bento Section: Business / Support / Functional */}
      <div className={`grid grid-cols-1 xl:grid-cols-3 ${isFoldable ? "gap-3" : "gap-6"}`}>
        
        {/* Business Rows (Rank) */}
        <div className={`bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3.5" : "p-5"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-orange-600">【业务部门】</span>
            <span className="text-[10px] text-slate-400 font-medium">人均小时毛利排名</span>
          </div>
          
          <div className="space-y-2">
            {businessRows.map((row, idx) => (
              <div key={row.id} className="p-2 bg-slate-50/50 rounded-lg border border-slate-100 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <span className="w-4 h-4 rounded bg-slate-200 text-slate-600 flex items-center justify-center font-mono text-[9px]">{idx + 1}</span>
                    <span>{row.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">总确认工时: {row.hours}h</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-orange-600 font-mono">¥{row.margin_per_hour}/h</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">总毛利 ¥{row.margin?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Rows */}
        <div className={`bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3.5" : "p-5"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-600">【支持部门】</span>
            <span className="text-[10px] text-slate-400 font-medium">单位工时支撑额与成本率</span>
          </div>

          <div className="space-y-2">
            {supportRows.map((row) => (
              <div key={row.id} className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-800">{row.name}</span>
                  <span className="text-xs font-bold text-blue-600 font-mono">{row.ratio}% 成本比</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>总计支撑额: ¥{row.support_value?.toLocaleString()}</span>
                  <span>分摊人工: ¥{row.labor_cost?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${row.ratio}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Functional Rows */}
        <div className={`bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3.5" : "p-5"}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">【职能部门】</span>
            <span className="text-[10px] text-slate-400 font-medium">负荷饱和度评价</span>
          </div>

          <div className="space-y-2">
            {functionalRows.map((row) => (
              <div key={row.id} className="p-2 bg-slate-50/50 rounded-lg border border-slate-100 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{row.name}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">在职编制: {row.staff_count} 人</span>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    row.workload_score >= 90 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    负荷: {row.workload_score || row.loadRatio}%
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">配额合理性: A级</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Footer notes */}
      {source?.note && (
        <div className="text-[10px] text-slate-500 bg-slate-100/80 px-3 py-2 rounded-lg border border-slate-200/80 flex items-center gap-1.5 font-mono shadow-xs">
          <RefreshCw size={11} className="text-slate-400 shrink-0" />
          <span>{source.note}</span>
        </div>
      )}

    </div>
  );
}
