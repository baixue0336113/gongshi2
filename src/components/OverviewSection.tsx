import React from "react";
import { SummaryKPI, TrendPoint, DepartmentItem } from "../types";
import { useDevice } from "../context/DeviceContext";
import { 
  TrendingUp, 
  Award,
  HelpCircle,
  BrainCircuit,
  Activity,
  AlertCircle,
  CheckCircle2,
  Gauge,
  Compass
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
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

  // Radar chart data modeling: 工时覆盖 / 经营效率 / 成本控制 / 规则健康等综合雷达
  const radarData = [
    { subject: "工时覆盖率", value: summary.coverage_rate || 92, fullMark: 100 },
    { subject: "经营生产效率", value: 85, fullMark: 100 },
    { subject: "人工成本控制", value: Math.max(10, 100 - (summary.labor_cost_rate || 12)), fullMark: 100 },
    { subject: "考勤规则健康", value: 94, fullMark: 100 },
    { subject: "跨岗支援协作", value: 88, fullMark: 100 }
  ];

  // AI-driven Smart Insight Data
  const aiInsights = [
    {
      type: "warning",
      title: "连续超时警戒",
      content: "冷链物流配送部今日 2 名配送组组员已累计打卡工时达 10.5h，已提示班组长做跨岗工时对调，防范过劳风险。",
      color: "border-l-4 border-amber-500 bg-amber-50/50"
    },
    {
      type: "success",
      title: "效率效能领跑",
      content: "学生餐一车间今日单位工时产值提升至 ¥48.5/h，产能负荷率 94% 达到行业先进线，推荐复制其排班精益范式。",
      color: "border-l-4 border-emerald-500 bg-emerald-50/50"
    },
    {
      type: "info",
      title: "支援调配通报",
      content: "今日发生车间跨岗支援 8 人次（累计 64 小时），其中冷链调往净菜生产线 48 小时，高效解冻洗箱线临时用工荒。",
      color: "border-l-4 border-blue-500 bg-blue-50/50"
    },
    {
      type: "danger",
      title: "单价成本上浮",
      content: "净菜生产线由于调拨半成品增加，单位工时人工成本比上周上浮 3.2%，建议结合明日配餐量重新厘定兼职比例。",
      color: "border-l-4 border-rose-500 bg-rose-50/50"
    }
  ];

  // Workshop Efficiency List
  const workshopEfficiency = [
    { name: "学生餐一车间", hours: "185.0h", score: 96, status: "健康", desc: "生产平稳，出勤率 98%", statusColor: "text-emerald-600 bg-emerald-50" },
    { name: "学生餐二车间", hours: "148.5h", score: 91, status: "健康", desc: "排班结构优良", statusColor: "text-emerald-600 bg-emerald-50" },
    { name: "方便菜加工部", hours: "120.0h", score: 85, status: "轻微超负荷", desc: "2人轻微超时打卡", statusColor: "text-amber-600 bg-amber-50" },
    { name: "净菜生产线", hours: "96.0h", score: 88, status: "健康", desc: "工时覆盖率 100%", statusColor: "text-emerald-600 bg-emerald-50" },
    { name: "冷链物流配送部", hours: "78.5h", score: 79, status: "异常预警", desc: "配送组2人连续超时", statusColor: "text-rose-600 bg-rose-50" }
  ];

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      
      {/* 1. Header: Section title */}
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

      {/* 3. Operational Cockpit Layout - Trend Line (Double Axis) & Radar Chart */}
      <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "lg:grid-cols-12 gap-5"}`}>
        
        {/* Left Area: Group Work Hour Efficiency Trend Line */}
        <div className={`${isFoldable ? "" : "lg:col-span-8"} bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3`}>
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

          {/* Sub-departments ratio summary */}
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

        {/* Right Area: Comprehensive Radar Diagnostic */}
        <div className={`${isFoldable ? "" : "lg:col-span-4"} bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between`}>
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <Gauge size={14} className="text-orange-500 shrink-0" />
            <span className="text-xs font-bold text-slate-800">
              综合运营维度评估 (效能雷达)
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center my-2" style={{ height: isFoldable ? 160 : 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius={isFoldable ? 50 : 70} data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar name="鲜誉综合评分" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[9px] text-slate-400 text-center leading-normal px-2 bg-slate-50/50 py-2 rounded-lg border border-slate-100">
            <strong>雷达分析结果：</strong>当前考勤合规与跨岗支援健康度最高，成本控制受制于原料调拨时薪稍需改善。
          </div>
        </div>

      </div>

      {/* 4. Secondary Row: AI Insights bullet bulletin & Workshop overload health list */}
      <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "lg:grid-cols-2 gap-5"}`}>
        
        {/* Left Column: AI-driven Smart Insight Bulletin */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2 shrink-0">
            <BrainCircuit size={14} className="text-orange-500 shrink-0" />
            <span className="text-xs font-bold text-slate-800">鲜誉智能问答与经营提示</span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[280px] pr-1">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-2.5 rounded-lg border border-slate-100/60 flex gap-2.5 ${insight.color}`}>
                <div className="mt-0.5 shrink-0">
                  {insight.type === "warning" && <AlertCircle size={14} className="text-amber-500" />}
                  {insight.type === "success" && <CheckCircle2 size={14} className="text-emerald-500" />}
                  {insight.type === "info" && <Activity size={14} className="text-blue-500" />}
                  {insight.type === "danger" && <AlertCircle size={14} className="text-rose-500" />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold text-slate-700 leading-tight mb-0.5">{insight.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{insight.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Workshop load health summary table */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <Compass size={14} className="text-orange-500 shrink-0" />
              <span className="text-xs font-bold text-slate-800">二级生产车间运行效能与异常摘要</span>
            </div>
            <span className="text-[9px] text-slate-400 font-semibold">健康评估基准: 90分</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-slate-400 text-[9px] font-bold border-b border-slate-100 uppercase tracking-wider">
                  <th className="pb-1.5">车间部门名称</th>
                  <th className="pb-1.5 text-center">生产工时</th>
                  <th className="pb-1.5 text-center">效能评分</th>
                  <th className="pb-1.5 text-center">合规健康</th>
                  <th className="pb-1.5 text-right">诊断描述</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[10px]">
                {workshopEfficiency.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 font-bold text-slate-700">{item.name}</td>
                    <td className="py-2.5 text-center font-mono font-bold text-slate-600">{item.hours}</td>
                    <td className="py-2.5 text-center">
                      <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[9.5px] ${
                        item.score >= 90 ? "bg-emerald-50 text-emerald-700" : item.score >= 80 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {item.score}分
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-medium text-slate-400">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
