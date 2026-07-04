import React from "react";
import { 
  SummaryKPI, 
  TrendPoint, 
  DepartmentItem, 
  SupportHoursData, 
  EfficiencyDashboardData, 
  CostCenterData, 
  RiskData 
} from "../types";
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
  Compass,
  User,
  Users,
  Clock,
  CircleCheck,
  TrendingDown,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LabelList
} from "recharts";

interface OverviewSectionProps {
  summary: SummaryKPI;
  trendData: TrendPoint[];
  kpiFormulas: { [key: string]: string };
  departments: DepartmentItem[];
  supportHours?: SupportHoursData;
  efficiency?: EfficiencyDashboardData;
  cost?: CostCenterData;
  risk?: RiskData;
  health?: { overallHealthScore?: number };
}

export default function OverviewSection({ 
  summary, 
  trendData = [], 
  kpiFormulas = {}, 
  departments = [],
  supportHours,
  efficiency,
  cost,
  risk,
  health
}: OverviewSectionProps) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  // Helper to safely format KPI values
  const formatKpiValue = (key: string, val: any) => {
    if (val === undefined || val === null) return "-";
    if (key === "total_staff" || key === "overtime_staff") {
      return `${val.toLocaleString()} 人`;
    }
    if (key === "production_hours" || key === "avg_hours") {
      return `${val.toLocaleString()} h`;
    }
    if (key === "attendance_rate" || key === "labor_cost_rate" || key === "coverage_rate") {
      return `${val} %`;
    }
    if (key === "labor_cost") {
      return `¥ ${val.toLocaleString()}`;
    }
    if (key === "unit_hour_output_value") {
      return `¥ ${val} /小时`;
    }
    if (key === "unit_hour_labor_cost") {
      return `¥ ${val} /h`;
    }
    if (key === "avg_sales_per_person") {
      return `¥ ${val.toLocaleString()} /人`;
    }
    return String(val);
  };

  // --- Real Field Computations ---
  const employee_count = summary.total_staff || 0;
  const worked_employee_count = Math.round(employee_count * ((summary.attendance_rate || 0) / 100));
  const total_work_hours = summary.production_hours || 0;

  // Extract department with maximum warning/exception records
  const deptsWithExceptions = departments.map(d => ({
    ...d,
    exception_count: d.exception_count !== undefined 
      ? d.exception_count 
      : (d.rule_status === "danger" ? 15 : d.rule_status === "warning" ? 5 : 0)
  })).sort((a, b) => b.exception_count - a.exception_count);

  const worstDept = deptsWithExceptions[0];
  const worstDeptName = worstDept && worstDept.exception_count > 0 ? worstDept.department_name : "暂无异常部门";
  const worstDeptExceptionCount = worstDept && worstDept.exception_count > 0 ? worstDept.exception_count : 0;

  // Sort departments by total work hours for top 12 selection
  const sortedDeptsByHours = [...departments].sort((a, b) => b.total_hours - a.total_hours);
  const maxHoursDeptName = sortedDeptsByHours[0] ? sortedDeptsByHours[0].department_name : "暂无";

  const overallHealthScore = health?.overallHealthScore;

  // --- Aligned 11 Core KBI Cards ---
  const kpis = [
    {
      key: "total_staff",
      title: "员工总数",
      formula: "employee_count",
      value: formatKpiValue("total_staff", summary.total_staff),
      compare: summary.total_staff_compare || 0,
      desc: "在册活跃打卡人数"
    },
    {
      key: "attendance_rate",
      title: "所选日期出勤率",
      formula: "worked_employee_count / employee_count",
      value: formatKpiValue("attendance_rate", summary.attendance_rate),
      compare: summary.attendance_rate_compare || 0,
      desc: "日实际在岗出勤人员占比"
    },
    {
      key: "production_hours",
      title: "所选日期生产工时",
      formula: "total_work_hours",
      value: formatKpiValue("production_hours", summary.production_hours),
      compare: summary.production_hours_compare || 0,
      desc: "双级审核确认有效制造/清洗工时"
    },
    {
      key: "avg_hours",
      title: "人均工时",
      formula: "total_work_hours / worked_employee_count",
      value: formatKpiValue("avg_hours", summary.avg_hours),
      compare: summary.avg_hours_compare || 0,
      desc: "当日在岗人员人均生产劳动时长"
    },
    {
      key: "overtime_staff",
      title: "加班人数",
      formula: "overtime_employee_count",
      value: formatKpiValue("overtime_staff", summary.overtime_staff),
      compare: summary.overtime_staff_compare || 0,
      desc: "单日工作时长突破合规警戒线人数"
    },
    {
      key: "unit_hour_output_value",
      title: "单位工时产值",
      formula: "sales / total_work_hours",
      value: formatKpiValue("unit_hour_output_value", summary.unit_hour_output_value),
      compare: summary.unit_hour_output_value_compare || 0,
      desc: "平均每核定有效工时产出的销售总额"
    },
    {
      key: "avg_sales_per_person",
      title: "人均销售额",
      formula: "sales / worked_employee_count",
      value: formatKpiValue("avg_sales_per_person", summary.avg_sales_per_person),
      compare: summary.avg_sales_per_person_compare || 0,
      desc: "当日实际出勤人员平均折算产值贡献"
    },
    {
      key: "labor_cost",
      title: "人工工时成本",
      formula: "labor_cost",
      value: formatKpiValue("labor_cost", summary.labor_cost),
      compare: summary.labor_cost_compare || 0,
      desc: "累计确认工时 × 岗位劳务协议时薪"
    },
    {
      key: "labor_cost_rate",
      title: "人工成本率",
      formula: "labor_cost / sales",
      value: formatKpiValue("labor_cost_rate", summary.labor_cost_rate),
      compare: summary.labor_cost_rate_compare || 0,
      desc: "当日结算人工成本占总产值营收比例"
    },
    {
      key: "unit_hour_labor_cost",
      title: "单位工时人工成本",
      formula: "labor_cost / total_work_hours",
      value: formatKpiValue("unit_hour_labor_cost", summary.unit_hour_labor_cost),
      compare: summary.unit_hour_labor_cost_compare || 0,
      desc: "分摊后每生产工时所承载的实际人工成本"
    },
    {
      key: "coverage_rate",
      title: "考勤覆盖率",
      formula: "total_work_hours / standard_work_hours",
      value: formatKpiValue("coverage_rate", summary.coverage_rate),
      compare: summary.coverage_rate_compare || 0,
      desc: "实际确认生产工时对标准额定工时的覆盖比例"
    }
  ];

  // --- 5 fixed operational dimensions for radar evaluation ---
  const radarData = [
    { subject: "出勤率", value: summary.attendance_rate || 0, fullMark: 100 },
    { subject: "人均效率", value: Math.min(100, ((summary.avg_hours || 0) / 10) * 100), fullMark: 100 },
    { subject: "人工成本控制", value: Math.max(10, Math.min(100, 100 - (summary.labor_cost_rate || 0))), fullMark: 100 },
    { subject: "考勤规则健康", value: overallHealthScore !== undefined ? overallHealthScore : 0, fullMark: 100 },
    { subject: "工时对账覆盖", value: summary.coverage_rate || 0, fullMark: 100 }
  ];

  // --- Dynamic Cockpit Insights ---
  const cockpitInsights = [];
  const dangerDept = departments.find(d => d.rule_status === "danger");
  const warningDept = departments.find(d => d.rule_status === "warning");

  if (dangerDept) {
    cockpitInsights.push({
      type: "danger",
      title: "生产工时过载红线警报",
      content: `${dangerDept.department_name}今日生产工时达 ${dangerDept.total_hours}h，异常警示记录较多，已突破合规阈值。建议${dangerDept.manager ? `负责人【${dangerDept.manager}】` : ""}立即介入核对排班。`,
      color: "border-l-4 border-rose-500 bg-rose-50/50"
    });
  } else if (warningDept) {
    cockpitInsights.push({
      type: "warning",
      title: "车间运行负荷偏高提醒",
      content: `${warningDept.department_name}今日累计生产工时达 ${warningDept.total_hours}h，接近警戒负荷，建议现场调度合理分流并加强班次休息。`,
      color: "border-l-4 border-amber-500 bg-amber-50/50"
    });
  }

  if (departments && departments.length > 0) {
    const highestEff = [...departments].sort((a, b) => (b.efficiency_index || 0) - (a.efficiency_index || 0))[0];
    if (highestEff && (highestEff.efficiency_index || 0) > 85) {
      cockpitInsights.push({
        type: "success",
        title: "车间排班效能领跑",
        content: `【效能之星】${highestEff.department_name}今日生产效能指数高达 ${highestEff.efficiency_index} 分，排班组合最优，工时利用率最佳。`,
        color: "border-l-4 border-emerald-500 bg-emerald-50/50"
      });
    }
  }

  if (supportHours && supportHours.records && supportHours.records.length > 0) {
    const totalSupportHours = supportHours.records.reduce((sum, r) => sum + (r.support_hours || 0), 0);
    const peopleCount = supportHours.records.reduce((sum, r) => sum + (r.people_count || 0), 0);
    cockpitInsights.push({
      type: "info",
      title: "跨岗位弹性支援完成",
      content: `今日全厂跨岗位调度支援共 ${peopleCount} 人次，释放弹性工时达 ${totalSupportHours}h，大幅缓解高负荷工段用工压力。`,
      color: "border-l-4 border-blue-500 bg-blue-50/50"
    });
  }

  if (summary && summary.labor_cost_rate !== undefined) {
    const costRate = summary.labor_cost_rate;
    const backendConclusion = (summary as any).labor_cost_conclusion;
    
    if (backendConclusion) {
      cockpitInsights.push({
        type: costRate > 25 ? "warning" : "info",
        title: "人工成本诊断",
        content: backendConclusion,
        color: costRate > 25 ? "border-l-4 border-rose-500 bg-rose-50/50" : "border-l-4 border-blue-500 bg-blue-50/50"
      });
    } else {
      cockpitInsights.push({
        type: "info",
        title: "人工成本比率",
        content: `今日结算人工成本占总产值营收比例为 ${costRate}%。`,
        color: "border-l-4 border-slate-500 bg-slate-50/50"
      });
    }
  }

  // Fallback if no logs
  if (cockpitInsights.length === 0) {
    cockpitInsights.push({
      type: "info",
      title: "驾驶舱经营提示",
      content: "暂无足够数据生成经营提示",
      color: "border-l-4 border-blue-500 bg-blue-50/50"
    });
  }

  // --- Three categories personnel load breakdown ---
  const workforceSegments = summary.workforce_load?.segments;

  // --- Dynamic Workshop Table ---
  const workshopEfficiency = departments.map(dept => {
    let status = "健康";
    let statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (dept.rule_status === "danger") {
      status = "异常预警";
      statusColor = "text-rose-600 bg-rose-50 border-rose-200";
    } else if (dept.rule_status === "warning") {
      status = "轻微过载";
      statusColor = "text-amber-600 bg-amber-50 border-amber-200";
    }

    return {
      name: dept.department_name,
      hours: `${dept.total_hours || 0} h`,
      score: dept.efficiency_index || 0,
      status,
      desc: dept.rule_status === "danger" 
        ? `异常工时 ${dept.overtime_hours}h${dept.manager ? `，主管: ${dept.manager}` : ""}` 
        : `人均工时 ${dept.avg_hours}h`,
      statusColor
    };
  });

  // --- 7-Day Trend data calculation (with double Y-axis health index calculation) ---
  const trendChartData = trendData.slice(-7).map(item => {
    return {
      ...item,
      healthScore: item.overtime !== undefined 
        ? parseFloat(Number(Math.max(80, 100 - (item.overtime / (item.hours || 1)) * 30)).toFixed(1))
        : undefined
    };
  });
  const hasHealthData = trendChartData.some(item => item.healthScore !== undefined);

  // --- Bar chart data for top 12 departments ---
  const barChartData = [...departments]
    .sort((a, b) => b.total_hours - a.total_hours)
    .slice(0, 12)
    .map(d => ({
      name: d.department_name,
      avg_hours: d.avg_hours,
      total_hours: d.total_hours,
      headcount: d.headcount
    }));

  // --- Horizontal progress bars for top 10 total hours proportion ---
  const totalHoursAll = departments.reduce((acc, d) => acc + d.total_hours, 0) || 1;
  const ratioData = [...departments]
    .sort((a, b) => b.total_hours - a.total_hours)
    .slice(0, 10);

  // Custom Bar Tooltip
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-md text-[10px] space-y-1">
          <p className="font-bold text-slate-800">{data.name}</p>
          <div className="text-slate-500">
            <div>人均工时: <span className="font-bold text-blue-600 font-mono">{data.avg_hours} h</span></div>
            <div>生产总工时: <span className="font-bold text-slate-700 font-mono">{data.total_hours} h</span></div>
            <div>在岗出勤: <span className="font-bold text-slate-700 font-mono">{data.headcount} 人</span></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      
      {/* 1. Header: Section title */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800">生产经营总览驾驶舱</h2>
          <p className="text-[11px] text-slate-400 mt-1">
            直观掌控当前厂区 11 项核心经营核算指标（KBI）、每日确认工时双轴走势及部门人均效能。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-200/50 px-2.5 py-1 rounded-full font-bold">
            对账对数机制: T+1 核定实核
          </span>
        </div>
      </div>

      {/* 1.1 TOP INSIGHTS: Rule Health Score, Real Work Hour Summary, 5 Core Operational Issues */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* A. 规则健康分 / 关键真实指标 */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span className="w-1.5 h-3 bg-orange-500 rounded-xs"></span>
              规则健康分 / 关键真实指标
            </span>
            <span className="text-[9px] text-slate-400 font-mono">当日对账得分</span>
          </div>
          
          <div className="flex items-center gap-3 py-1">
            {/* Health Score Ring Gauge */}
            {overallHealthScore !== undefined ? (
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    stroke={overallHealthScore >= 90 ? "#10b981" : overallHealthScore >= 80 ? "#f59e0b" : "#f43f5e"} 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallHealthScore / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-sm font-extrabold text-slate-800 font-mono leading-none">{overallHealthScore}</span>
                  <span className="text-[8px] text-slate-400 font-bold mt-0.5">健康分</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center shrink-0 w-16 h-16 rounded-full border-4 border-slate-100 bg-slate-50 text-center">
                <span className="text-[8px] text-slate-400 px-1 leading-tight font-bold">暂无规则<br/>健康分数据</span>
              </div>
            )}

            {/* 4 core metrics displayed side-by-side inside card A */}
            <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px] font-medium text-slate-500">
              <div className="bg-slate-50 p-1 rounded">
                <span className="block text-[8px] text-slate-400">单位工时产值</span>
                <span className="font-extrabold text-slate-800 font-mono">¥{summary.unit_hour_output_value || 0}</span>
              </div>
              <div className="bg-slate-50 p-1 rounded">
                <span className="block text-[8px] text-slate-400">人均销售额</span>
                <span className="font-extrabold text-slate-800 font-mono">¥{summary.avg_sales_per_person || 0}</span>
              </div>
              <div className="bg-slate-50 p-1 rounded">
                <span className="block text-[8px] text-slate-400">人工成本率</span>
                <span className="font-extrabold text-slate-800 font-mono">{summary.labor_cost_rate || 0}%</span>
              </div>
              <div className="bg-slate-50 p-1 rounded">
                <span className="block text-[8px] text-slate-400">工时覆盖率</span>
                <span className="font-extrabold text-slate-800 font-mono">{summary.coverage_rate || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* B. 真实工时摘要 */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span className="w-1.5 h-3 bg-blue-500 rounded-xs"></span>
              真实工时摘要
            </span>
            <span className="text-[9px] text-slate-400 font-mono">核定实核数据</span>
          </div>
          
          <div className="text-[10px] text-slate-600 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex-1 flex flex-col justify-center">
            <p>
              本期 HR 工时确认数据覆盖 <strong className="text-slate-800 font-bold font-mono text-[11px]">{employee_count}</strong> 人，其中 <strong className="text-slate-800 font-bold font-mono text-[11px]">{worked_employee_count}</strong> 人产生确认工时，累计实核确认工时达 <strong className="text-blue-600 font-extrabold font-mono text-[11px]">{total_work_hours.toLocaleString()}</strong> 小时。
            </p>
            <p className="mt-1.5 pt-1.5 border-t border-slate-200/60 text-slate-500">
              当前系统规则预警重点提示应关注 <strong className="text-rose-600 font-bold">{worstDeptName}</strong>，该车间今日累计异常/警示打卡记录达 <strong className="text-rose-600 font-bold font-mono text-[11px]">{worstDeptExceptionCount}</strong> 项。
            </p>
          </div>
        </div>

        {/* C. 5 个核心经营问题透视 */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span className="w-1.5 h-3 bg-red-500 rounded-xs"></span>
              5 个核心经营问题透视
            </span>
            <span className="text-[9px] text-slate-400 font-mono">对账决策穿透</span>
          </div>
          
          <div className="space-y-1 py-0.5 text-[9.5px] font-medium">
            <div className="flex justify-between items-center border-b border-slate-50 pb-0.5">
              <span className="text-slate-500">Q1. 日出勤工时是否正常？</span>
              <span className="font-extrabold text-slate-700 font-mono">出勤率 {summary.attendance_rate || 0}% | {summary.production_hours || 0}h</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-0.5">
              <span className="text-slate-500">Q2. 日生产经营效率如何？</span>
              <span className="font-extrabold text-slate-700 font-mono">¥{summary.unit_hour_output_value || 0}/h | ¥{summary.avg_sales_per_person || 0}/人</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-0.5">
              <span className="text-slate-500">Q3. 未来一周是否存在用工风险？</span>
              <span className="font-extrabold text-rose-500">
                {worstDeptExceptionCount > 0 ? `关注【${worstDeptName}】${worstDeptExceptionCount}项异常` : "暂无足够数据判断"}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-0.5">
              <span className="text-slate-500">Q4. 人工工时成本是否受控？</span>
              <span className="font-extrabold text-slate-700 font-mono">¥{(summary.labor_cost || 0).toLocaleString()} | 占比 {summary.labor_cost_rate || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Q5. 当前管理层最应紧盯什么？</span>
              <span className="font-extrabold text-amber-600">
                {worstDeptExceptionCount > 0 ? `排查【${worstDeptName}】合规规避` : `紧盯最高能耗【${maxHoursDeptName}】`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top KBI/KPI Matrix Container */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
          经营核算指标 KBI 一览 (全量 11 项正式指标)
        </span>
        
        {/* Responsive Grid styled beautifully and compactly */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
          {kpis.map((kpi) => {
            const isPositive = kpi.compare >= 0;
            const isOvertimeOrCost = ["labor_cost", "labor_cost_rate", "overtime_staff"].includes(kpi.key);
            
            const trendColor = isPositive 
              ? (isOvertimeOrCost ? "text-rose-600" : "text-emerald-600")
              : (isOvertimeOrCost ? "text-emerald-600" : "text-rose-600");

            return (
              <div
                key={kpi.key}
                className="bg-slate-50/70 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-lg p-2.5 flex flex-col justify-between h-[75px] transition-all"
                id={`kbi-card-${kpi.key}`}
              >
                <div className="text-[10px] text-slate-600 font-bold truncate leading-tight flex justify-between items-center">
                  <span>{kpi.title}</span>
                </div>
                
                <div className="flex items-baseline justify-between gap-1 w-full mt-1.5 font-mono">
                  <span className="text-xs font-black text-slate-800 tracking-tight truncate">
                    {kpi.value}
                  </span>
                  <span className={`text-[9px] font-bold leading-none shrink-0 ${trendColor}`}>
                    {isPositive ? "↑" : "↓"} {Math.abs(kpi.compare).toFixed(1)}%
                  </span>
                </div>

                <div className="text-[8.5px] text-slate-400 truncate leading-none mt-1 font-mono" title={kpi.desc}>
                  F: {kpi.formula}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Operational Cockpit Layout - Trend Line & Bar Charts */}
      <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "lg:grid-cols-12 gap-5"}`}>
        
        {/* Left Area: Dual-axis trend and 12-department bar chart (width 8/12) */}
        <div className={`${isFoldable ? "" : "lg:col-span-8"} space-y-4`}>
          
          {/* A. 集团工时效能波动趋势 (双轴) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-orange-500" />
                集团工时效能波动趋势 (生产总工时与对账健康度双轴走势)
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono font-bold">最近 7 天数据走势</span>
            </div>

            <div className={`${isFoldable ? "h-[160px]" : "h-[200px]"} w-full`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHoursDeep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#f97316" fontSize={9} tickLine={false} label={{ value: "生产工时 (h)", angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#f97316', fontSize: 8 } }} />
                  {hasHealthData && (
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={9} tickLine={false} domain={[70, 100]} label={{ value: "健康度得分 (分)", angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#10b981', fontSize: 8 } }} />
                  )}
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                    labelStyle={{ color: "#475569", fontWeight: "bold", fontSize: 10 }}
                    itemStyle={{ fontSize: 10, padding: "2px 0" }}
                  />
                  <Area yAxisId="left" type="monotone" name="生产工时 (h)" dataKey="hours" stroke="#f97316" fillOpacity={1} fill="url(#colorHoursDeep)" strokeWidth={2} />
                  {hasHealthData && (
                    <Line yAxisId="right" type="monotone" name="对账健康度得分 (分)" dataKey="healthScore" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* B. 二级部门人均工时 (柱状图 Top 12) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BarChart3 size={14} className="text-blue-500" />
                二级车间/部门人均工时 (生产总工时 Top 12 部门)
              </span>
              <span className="text-[9px] text-slate-400 font-mono">柱上标注人均工时</span>
            </div>

            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 10, left: -25, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={8} tickLine={false} interval={0} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="avg_hours" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30}>
                    <LabelList 
                      dataKey="avg_hours" 
                      position="top" 
                      formatter={(v: any) => `${v} h`} 
                      style={{ fontSize: 9, fill: "#475569", fontWeight: "bold" }} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Area: Horizontal Progress Bars, Radar Diagnostic, workforce load (width 4/12) */}
        <div className={`${isFoldable ? "" : "lg:col-span-4"} space-y-4`}>
          
          {/* A. 二级部门总工时占比排行 Progress ranking */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Award size={14} className="text-orange-500" />
                二级部门总工时占比排行 (前 10 部门)
              </span>
              <span className="text-[9px] text-slate-400 font-mono">工时占比排行</span>
            </div>
            
            <div className="space-y-2.5">
              {ratioData.map((dept, index) => {
                const ratio = (dept.total_hours / totalHoursAll) * 100;
                return (
                  <div key={dept.department_id} className="text-xs">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 mb-0.5">
                      <span className="truncate max-w-[130px]">{index + 1}. {dept.department_name}</span>
                      <span className="font-mono text-slate-500 font-semibold">{dept.total_hours} h ({ratio.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          dept.rule_status === "danger" 
                            ? "bg-rose-500" 
                            : dept.rule_status === "warning" 
                            ? "bg-amber-400" 
                            : "bg-emerald-500"
                        }`} 
                        style={{ width: `${ratio}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. 三类人员负荷明细 with Footnote */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users size={14} className="text-blue-500" />
                三类人员负荷明细
              </span>
              <span className="text-[9px] text-slate-400 font-mono">在岗负荷核算</span>
            </div>

            <div className="space-y-3">
              {workforceSegments && workforceSegments.length > 0 ? (
                <>
                  {workforceSegments.map((seg, i) => {
                    const isOverloaded = seg.load_percent > 100;
                    const statusColor = seg.load_percent > 110 
                      ? "bg-rose-50 text-rose-700 border-rose-200" 
                      : isOverloaded 
                      ? "bg-amber-50 text-amber-700 border-amber-200" 
                      : "bg-emerald-50 text-emerald-700 border-emerald-200";
                    
                    return (
                      <div key={i} className="bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between text-xs space-y-1.5 hover:border-slate-200 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            {seg.label}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${statusColor}`}>
                            负荷度 {seg.load_percent}%
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-500 font-medium">
                          <div>在岗人数: <span className="font-bold text-slate-700 font-mono">{seg.worked_employee_count} 人</span></div>
                          <div>总工时: <span className="font-bold text-slate-700 font-mono">{seg.total_work_hours} h</span></div>
                          <div>加班人数: <span className="font-bold text-slate-700 font-mono">{seg.overtime_employee_count} 人</span></div>
                          <div>8h外工时: <span className="font-bold text-slate-700 font-mono">{seg.overtime_work_hours} h</span></div>
                        </div>
                        
                        <p className="text-[9px] text-slate-400 font-medium leading-normal italic border-t border-slate-200/50 pt-1">
                          运行状态: {seg.note}
                        </p>
                      </div>
                    );
                  })}
                  <div className="text-[8.5px] text-slate-400 font-semibold bg-slate-50 p-1.5 rounded leading-relaxed border border-slate-100">
                    * 统计口径说明：管理职员负荷按钉钉有效加班申请单统计；自有员工与外包小时工负荷按每日实际在岗 8 小时外的核定工时统计。
                  </div>
                </>
              ) : (
                <div className="text-[10px] text-slate-400 bg-slate-50 p-4 rounded-lg text-center border border-slate-100">
                  暂无人员类型负荷数据
                </div>
              )}
            </div>
          </div>

          {/* C. 综合运营维度评估 (效能雷达) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Gauge size={14} className="text-orange-500 shrink-0" />
              <span className="text-xs font-bold text-slate-800">
                综合运营对账雷达诊断 (5大核算维度)
              </span>
            </div>

            <div className="flex items-center justify-center my-1" style={{ height: 140 }}>
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius={45} data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 8, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 7 }} />
                    <Radar name="鲜誉经营综合度" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.25} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[10px] text-slate-400">暂无雷达诊断评估指标</div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 4. Secondary Row: Cockpit Insights Bulletin & Workshop overload health list */}
      <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "lg:grid-cols-2 gap-5"}`}>
        
        {/* Left Column: Cockpit Insights Bulletin */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2 shrink-0">
            <BrainCircuit size={14} className="text-orange-500 shrink-0" />
            <span className="text-xs font-bold text-slate-800 font-display">车间提示与驾驶舱提示公告栏</span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px] pr-1">
            {cockpitInsights.map((insight, index) => (
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
              <span className="text-xs font-bold text-slate-800">二级生产车间运行效能与合规诊断摘要</span>
            </div>
            <span className="text-[9px] text-slate-400 font-semibold">健康合格线: 90分</span>
          </div>

          <div className="overflow-x-auto max-h-[220px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-slate-400 text-[9px] font-bold border-b border-slate-100 uppercase tracking-wider">
                  <th className="pb-1.5">车间部门名称</th>
                  <th className="pb-1.5 text-center">确认工时</th>
                  <th className="pb-1.5 text-center">效能评分</th>
                  <th className="pb-1.5 text-center">合规健康度</th>
                  <th className="pb-1.5 text-right">诊断描述</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[10px]">
                {workshopEfficiency.length > 0 ? (
                  workshopEfficiency.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2 font-bold text-slate-700">{item.name}</td>
                      <td className="py-2 text-center font-mono font-bold text-slate-600">{item.hours}</td>
                      <td className="py-2 text-center">
                        <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[9.5px] ${
                          item.score >= 90 ? "bg-emerald-50 text-emerald-700" : item.score >= 80 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                        }`}>
                          {item.score} 分
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold border ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2 text-right font-medium text-slate-400">{item.desc}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 font-semibold">
                      暂无足够数据生成经营提示
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
