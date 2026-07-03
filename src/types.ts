export interface DashboardMeta {
  available_review_dates: string[];
  kpi_formulas: { [key: string]: string };
}

// 1. 经营总览 KPI Summary (Aligned with Xianyu Web Executive Cabin)
export interface SummaryKPI {
  total_staff: number;              // 员工总数
  production_hours: number;         // 所选日期生产工时 (h)
  attendance_rate: number;          // 出勤率 (%)
  avg_hours: number;                // 人均工时 (h)
  overtime_staff: number;           // 加班人数 (人)
  unit_hour_output_value: number;   // 单位工时产值 (元/h)
  avg_sales_per_person: number;     // 人均销售额 (元/人)
  labor_cost: number;               // 人工工时成本 (元)
  labor_cost_rate: number;          // 人工成本率 (%)
  unit_hour_labor_cost: number;     // 单位工时人工成本 (元/h)
  coverage_rate: number;            // 工时覆盖率 (%)
  
  // Compares
  total_staff_compare: number;
  production_hours_compare: number;
  attendance_rate_compare: number;
  avg_hours_compare: number;
  overtime_staff_compare: number;
  unit_hour_output_value_compare: number;
  avg_sales_per_person_compare: number;
  labor_cost_compare: number;
  labor_cost_rate_compare: number;
  unit_hour_labor_cost_compare: number;
  coverage_rate_compare: number;
}

// Trend Data for near 7 days
export interface TrendPoint {
  date: string;
  staff: number;
  hours: number;
  labor_cost: number;
  efficiency: number;
}

// 2. 部门穿透 Item
export interface DepartmentItem {
  department_id: string;
  department_name: string;
  path_text: string;               // e.g. "学生餐业务群 / 一车间"
  headcount: number;
  total_hours: number;
  avg_hours: number;
  overtime_hours: number;
  labor_cost: number;
  efficiency_index: number;        // 0-100 scale
  rule_status: "normal" | "warning" | "danger";
  manager: string;
  top_staff: Array<{ name: string; job_number: string; hours: number; risk_score: number }>;
}

// 3. 员工画像 Item (Aligned with PortraitTab)
export interface EmployeeItem {
  id: string;
  name: string;
  job_number: string;
  department: string;
  position: string;
  hire_date: string;
  status: string;
  avg_hours: number;
  attendance_rate: number;
  risk_level: "low" | "medium" | "high";
  daily_hours: { [date: string]: number };
  punch_records: Array<{ date: string; clock_in: string; clock_out: string; status: string }>;
  applications: Array<{ id: string; type: "加班" | "请假" | "支援"; start: string; end: string; hours: number; status: string }>;
  adjustments: Array<{ date: string; before_hours: number; after_hours: number; reason: string; operator: string }>;
  exception_logs: Array<{ date: string; type: string; description: string; score_impact: number }>;
}

// Matrix Cell Data & Rows
export interface MatrixDailyData {
  hours?: number;
  cost?: number;
  people?: number;
  qty?: number;
  abnormal?: boolean;
  is_fallback_rate?: boolean;
}

export interface MatrixRow {
  id: string;
  name: string;
  dept?: string;
  parent_id?: string;
  path?: string;
  is_expanded?: boolean;
  total_hours?: number;
  total_cost?: number;
  total_people?: number;
  total_qty?: number;
  avg_hours?: number;
  employee_name?: string;
  department_1?: string;
  department_2?: string;
  attendance_days?: number;
  fallback_rate_cells?: string[];
  daily: { [day: string]: MatrixDailyData };
  children?: MatrixRow[];
}

// Matrices definitions
export interface MatrixData {
  days: string[];
  rows: MatrixRow[];
  summary: {
    total_hours?: number;
    total_cost?: number;
    total_people?: number;
    total_qty?: number;
    avg_hours?: number;
    abnormal_count?: number;
  };
  segmentOptions?: string[];
}

// 4. 支援工时 (HealthTab)
export interface SupportRecord {
  id: string;
  source_department: string;
  target_department: string;
  support_hours: number;
  people_count: number;
  efficiency_rating: number; // 0-100
  cost_saved: number;
  date: string;
}

export interface SupportHoursData {
  range: string;
  records: SupportRecord[];
  filters: {
    supportDepartments: string[];
    outgoingDepartments: string[];
  };
  ranking: Array<{ department_name: string; hours: number }>;
  trend: Array<{ date: string; hours: number }>;
}

// 5. 经营效率 (EfficiencyTab)
export interface EfficiencyKPI {
  label: string;
  value: string;
  compare: string;
  formula: string;
  change?: string;
  desc?: string;
  isPositive?: boolean;
}

export interface BusinessEfficiencyRow {
  id: string;
  name: string;
  margin: number;
  hours: number;
  margin_per_hour: number;
  perPersonGross?: number;
  salaryGrossEfficiency?: number;
}

export interface SupportEfficiencyRow {
  id: string;
  name: string;
  support_value: number;
  labor_cost: number;
  ratio: number;
  unitSupport?: number;
}

export interface FunctionalEfficiencyRow {
  id: string;
  name: string;
  workload_score: number;
  staff_count: number;
  loadRatio?: number;
}

export interface EfficiencyTrendRow {
  date: string;
  margin_per_hour: number;
  avg_line: number;
  industry_line: number;
  support_ratio: number;
  perPersonGross?: number;
  grossMargin?: number;
  unitSupport?: number;
  laborCostRateTotalCost?: number;
}

export interface EfficiencyDashboardData {
  mainKPIs: EfficiencyKPI[];
  businessRows: BusinessEfficiencyRow[];
  supportRows: SupportEfficiencyRow[];
  functionalRows: FunctionalEfficiencyRow[];
  trendRows: EfficiencyTrendRow[];
  referenceLines: {
    avg_line: number;
    industry_line: number;
    perPersonGrossInternal?: number;
    grossMarginPreparedFoodStrong?: number;
    unitSupportInternal?: number;
    laborCostToTotalCostFoodProcessing?: number;
  };
  referenceNotes: string[];
  source: { note: string };
}

// 6. 成本中心 (CostTab)
export interface CostStructureItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
  ratio?: number;
  source?: string;
  displayValue?: string;
}

export interface CostDepartmentRow {
  id: string;
  name: string;
  labor_cost: number;
  hours: number;
  cost_per_hour: number;
  department?: string;
  workHours?: number;
  allocatedCost?: number;
  costShare?: number;
  unitHourCost?: number;
  risk?: "high" | "medium" | "low" | "none";
}

export interface CostAlert {
  level: "high" | "medium" | "low";
  message: string;
  department: string;
  value: string;
}

export interface CostTrendPoint {
  date: string;
  labor_cost: number;
  cost_rate: number;
  unit_cost: number;
  industry_line: number;
  totalCost?: number;
  costRate?: number;
  unitHourCost?: number;
}

export interface CostCenterData {
  mainKPIs: Array<EfficiencyKPI & { highlight?: boolean }>;
  trendData: CostTrendPoint[];
  structure: CostStructureItem[];
  departmentRows: CostDepartmentRow[];
  alerts: CostAlert[];
  totals: {
    labor_cost: number;
    hours: number;
    cost_per_hour: number;
    totalCost?: number;
  };
  source: { note: string };
}

// 7. 职位成本 (PositionCostTab)
export interface PositionCostAnalysisRow {
  position: string;
  department: string;
  avg_cost: number;
  headcount: number;
  total_cost: number;
  people?: number;
  averageHours?: number;
  unitHourCost?: number;
}

export interface PositionCostRecord {
  position: string;
  name: string;
  salary: number;
  allowance: number;
  cost: number;
}

export interface PositionCostData {
  kpis: Array<{ label: string; value: string; compare: string; change?: string; desc?: string; isPositive?: boolean }>;
  analysisRows: PositionCostAnalysisRow[];
  costRanking: Array<{ position: string; cost: number; averageHours?: number; unitHourCost?: number }>;
  concentration: Array<{ name: string; value: number; percentage: number }>;
  concentrationTop5Ratio: number;
  records: PositionCostRecord[];
}

// 8. 风险管控 (RiskTab)
export interface RiskFactor {
  name: string;
  score: number;
  level: "high" | "medium" | "low";
}

export interface HeatmapPoint {
  date: string;
  department: string;
  score: number;
  path_text?: string;
  name?: string;
  worked_employee_count?: number;
  total_work_hours?: number;
  average_work_hours?: number;
}

export interface RiskWorseningItem {
  id: string;
  department: string;
  change_rate: number;
  factor: string;
}

export interface RiskDepartmentDetail {
  factors: RiskFactor[];
  trend_7_days: Array<{ date: string; hours: number }>;
  staff: Array<{ name: string; risk_score: number; status: string }>;
  factorBreakdown?: Array<{ name: string; score: number; level: string }>;
  sevenDayTrend?: Array<{ date: string; hours: number }>;
  continuousPeople?: Array<{ name: string; risk_score: number; status: string }>;
}

export interface RiskData {
  overview: {
    total_alerts: number;
    high_risk_count: number;
    medium_risk_count: number;
    low_risk_count: number;
    levels?: { green: number; yellow: number; orange: number; red: number };
    netDelta?: number;
  };
  worsening_top: RiskWorseningItem[];
  improving_top: RiskWorseningItem[];
  heatmap: HeatmapPoint[];
  department_details: { [dept_name: string]: RiskDepartmentDetail };
}

// 9. 战略管理追踪 (StrategicTab)
export interface FocusDepartmentItem {
  name: string;
  issue_count: number;
  status: "danger" | "warning" | "normal";
  department?: string;
  riskPeople?: number;
  hours?: number;
  changeRate?: number;
  changeLabel?: string;
  issueBreakdown?: string;
}

export interface HighRiskPersonItem {
  name: string;
  department: string;
  risk_type: string;
  hours: number;
  longDays?: number;
  lowDays?: number;
  missingClock?: number;
  riskLabel?: string;
  reviewStatus?: string;
}

export interface StrategicRiskTrendPoint {
  date: string;
  risk_index: number;
  avg_line: number;
  name?: string;
  warningRecords?: number;
  riskPeople?: number;
  consecutiveUp?: number;
  weekend?: boolean;
  issueBreakdown?: string;
}

export interface StrategicData {
  summaryCards: Array<{ label: string; value: string; trend: string; desc?: string; tone?: "danger" | "warning" | "success" | "info" }>;
  riskTrend: StrategicRiskTrendPoint[];
  focusDepartments: FocusDepartmentItem[];
  highRiskPeople: HighRiskPersonItem[];
}

// Full Dashboard Response schema (The Core Dashboard Contract)
export interface DashboardResponse {
  review_date: string;
  meta: DashboardMeta;
  summary: SummaryKPI;
  trend_data: TrendPoint[];
  departments: DepartmentItem[];
  employees: EmployeeItem[];
  work_hour_matrix: MatrixData;
  cost_matrix: MatrixData;
  total_cost_matrix: MatrixData;
  support_hours: SupportHoursData;
  efficiency_dashboard: EfficiencyDashboardData;
  cost: CostCenterData;
  position_cost: PositionCostData;
  risk: RiskData;
  strategic: StrategicData;
}

// Scope response for the 4 newly requested monthly check modules
export interface MonthlyCheckResponse {
  month: string;
  days: string[];
  rows: MatrixRow[];
  summary: {
    total_hours?: number;
    total_cost?: number;
    total_people?: number;
    total_qty?: number;
    avg_hours?: number;
    headcount?: number;
  };
  departments?: string[];
  meta?: any;
}
