import React from "react";
import { SummaryKPI, TrendPoint, DepartmentItem } from "../types";
import { useDevice } from "../context/DeviceContext";
import { 
  TrendingUp, 
  Award,
  HelpCircle
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from "recharts";

interface OverviewSectionProps {
  summary: SummaryKPI;
  trendData: TrendPoint[];
  kpiFormulas: { [key: string]: string };
  departments: DepartmentItem[];
}

export default function OverviewSection({ 
  summary, 
  trendData = [], 
  kpiFormulas = {}, 
  departments = [] 
}: OverviewSectionProps) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  // Aligned 11 Core Web KPI cards from the summary prop
  const kpis = [
    {
      key: "total_staff",
      title: "员工总数",
      value: `${summary.total_staff?.toLocaleString() || "0"}人`,
      compare: summary.total_staff_compare || 0,
      desc: "在册出勤活跃员工总数"
    },
    {
      key: "attendance_rate",
      title: "所选日期出勤率",
      value: `${summary.attendance_rate || "0"}%`,
      compare: summary.attendance_rate_compare || 0,
      desc: "当日实际打卡出勤比例"
    },
    {
      key: "production_hours",
      title: "所选日期生产工时",
      value: `${summary.production_hours?.toLocaleString() || "0"}h`,
      compare: summary.production_hours_compare || 0,
      desc: "经审核有效实际生产工时"
    },
    {
      key: "avg_hours",
      title: "人均工时",
      value: `${summary.avg_hours || "0"}h`,
      compare: summary.avg_hours_compare || 0,
      desc: "当日人均确认生产时长"
    },
    {
      key: "overtime_staff",
      title: "加班人数",
      value: `${summary.overtime_staff || "0"}人`,
      compare: summary.overtime_staff_compare || 0,
      desc: "日出勤时长溢出报警人数"
    },
    {
      key: "unit_hour_output_value",
      title: "单位工时产值",
      value: `¥${summary.unit_hour_output_value || "0"}/h`,
      compare: summary.unit_hour_output_value_compare || 0,
      desc: "折算产值 / 确认总生产工时"
    },
    {
      key: "avg_sales_per_person",
      title: "人均销售额",
      value: `¥${summary.avg_sales_per_person?.toLocaleString() || "0"}/人`,
      compare: summary.avg_sales_per_person_compare || 0,
      desc: "销售营收 / 实际在岗总人天"
    },
    {
      key: "labor_cost",
      title: "人工工时成本",
      value: `¥${summary.labor_cost?.toLocaleString() || "0"}`,
      compare: summary.labor_cost_compare || 0,
      desc: "确认工时 × 核定综合时薪"
    },
    {
      key: "labor_cost_rate",
      title: "人工成本率",
      value: `${summary.labor_cost_rate || "0"}%`,
      compare: summary.labor_cost_rate_compare || 0,
      desc: "人工成本总额 / 销售总营收"
    },
    {
      key: "unit_hour_labor_cost",
      title: "单位工时人工成本",
      value: `¥${summary.unit_hour_labor_cost || "0"}/h`,
      compare: summary.unit_hour_labor_cost_compare || 0,
      desc: "人工成本总额 / 确认总工时"
    },
    {
      key: "coverage_rate",
      title: "工时覆盖率",
      value: `${summary.coverage_rate || "0"}%`,
      compare: summary.coverage_rate_compare || 0,
      desc: "关联工时产出绩效考核占比"
    }
  ];

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      
      {/* 1. Header: Section title with dynamic overview context */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-800">生产经营总览驾驶舱</h2>
        <p className="text-[11px] text-slate-400 mt-1">
          直观掌控当前厂区 11 项核心经营核算指标（KBI）、双轴效能走势及部门工时占比。
        </p>
      </div>

      {/* 2. Top KBI/KPI Matrix Container */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
          经营核算指标 KBI 一览 (全量 11 项正式指标)
        </span>
        
        {/* Responsive Grid with strict card height */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {kpis.map((kpi) => {
            const isPositive = kpi.compare >= 0;
            const isOvertimeOrCost = ["labor_cost", "labor_cost_rate", "overtime_staff"].includes(kpi.key);
            
            // Highlight color based on business meaning
            const trendColor = isPositive 
              ? (isOvertimeOrCost ? "text-rose-600 font-bold" : "text-emerald-600 font-bold")
              : (isOvertimeOrCost ? "text-emerald-600 font-bold" : "text-rose-600 font-bold");

            return (
              <div
                key={kpi.key}
                className="bg-slate-50/70 border border-slate-100 hover:border-slate-200 rounded-lg p-2 flex flex-col justify-between h-[74px] transition-colors"
              >
                <div className="text-[9px] text-slate-500 font-semibold truncate leading-tight">
                  {kpi.title}
                </div>
                <div className="flex items-baseline justify-between gap-1 w-full mt-1">
                  <span className="text-xs font-extrabold text-slate-800 font-mono tracking-tight truncate">
                    {kpi.value}
                  </span>
                  <span className={`text-[8.5px] font-mono leading-none shrink-0 ${trendColor}`}>
                    {isPositive ? "↑" : "↓"}{Math.abs(kpi.compare)}%
                  </span>
                </div>
                <div className="text-[8px] text-slate-400 truncate leading-none mt-1">
                  {kpi.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Operational Cockpit Layout */}
      <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "gap-5"}`}>
        
        {/* Group Work Hour Efficiency Trend Line (Double Axis) */}
        <div className={`bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3`}>
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-orange-500" />
              集团工时效能波动趋势 (生产总工时与人工成本双轴走势)
            </span>
            <span className="text-[9px] text-slate-400 font-mono font-bold">每日自动对账核算</span>
          </div>

          <div className={`${isFoldable ? "h-[160px]" : "h-[220px]"} w-full`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHoursDeep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCostDeep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                <Area type="monotone" name="生产工时 (h)" dataKey="hours" stroke="#f97316" fillOpacity={1} fill="url(#colorHoursDeep)" strokeWidth={2} />
                <Area type="monotone" name="人工成本 (元)" dataKey="labor_cost" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCostDeep)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 二级部门人均工时 / 二级部门总工时占比 (Web layout) */}
          <div className="border-t border-slate-100 pt-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
              二级车间生产班组总工时占比分析 (二级车间人均工时)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {departments.slice(0, 3).map((dept) => {
                const totalHoursAll = departments.reduce((acc, d) => acc + d.total_hours, 0) || 1;
                const ratio = Math.round((dept.total_hours / totalHoursAll) * 100);
                const isAbnormal = dept.rule_status === "danger";
                return (
                  <div key={dept.department_id} className="bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span className="truncate max-w-[130px]">{dept.department_name}</span>
                      <span className="font-mono text-[10px] font-semibold">{dept.total_hours}h</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden my-1.5">
                      <div className={`h-full ${isAbnormal ? "bg-rose-500 animate-pulse" : "bg-orange-500"}`} style={{ width: `${ratio}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold leading-none mt-0.5">
                      <span>人均: {dept.avg_hours}h/d</span>
                      <span className={isAbnormal ? "text-rose-600" : "text-emerald-600"}>占比 {ratio}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
