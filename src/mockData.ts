import { 
  DashboardResponse, 
  MonthlyCheckResponse, 
  MatrixRow, 
  MatrixDailyData,
  TrendPoint,
  DepartmentItem,
  EmployeeItem,
  SupportRecord,
  BusinessEfficiencyRow,
  SupportEfficiencyRow,
  FunctionalEfficiencyRow,
  EfficiencyTrendRow,
  CostStructureItem,
  CostDepartmentRow,
  CostAlert,
  CostTrendPoint,
  PositionCostAnalysisRow,
  PositionCostRecord,
  RiskFactor,
  HeatmapPoint,
  RiskWorseningItem,
  FocusDepartmentItem,
  HighRiskPersonItem
} from "./types";

// Helper to generate dates of a month
export function getDaysInMonth(year: number, month: number): string[] {
  const numDays = new Date(year, month, 0).getDate();
  const days: string[] = [];
  for (let i = 1; i <= numDays; i++) {
    days.push(`${year}-${String(month).padStart(2, "0")}-${String(i).padStart(2, "0")}`);
  }
  return days;
}

// Generate complete Mock Data for executive dashboard (strictly matching real Web specs)
export function getMockDashboardData(date: string): DashboardResponse {
  const days = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    return `2026-06-${String(dayNum).padStart(2, "0")}`;
  });

  const departmentNames = [
    "学生餐一车间",
    "学生餐二车间",
    "方便菜加工部",
    "净菜生产线",
    "面点面食车间",
    "冷链物流配送部",
    "品质检验中心",
    "校园餐饮客服组"
  ];

  // 1. Work hour matrix rows (tree structure simulation with children)
  const workHourRows: MatrixRow[] = departmentNames.map((name, index) => {
    const daily: { [key: string]: MatrixDailyData } = {};
    let total_hours = 0;
    days.forEach((d) => {
      const base = 120 + (index * 15) % 40;
      const noise = Math.floor(Math.sin(parseInt(d.split("-")[2]) * 0.4) * 20);
      const isWeekend = new Date(d).getDay() === 0 || new Date(d).getDay() === 6;
      const hours = isWeekend ? Math.floor((base + noise) * 0.3) : (base + noise);
      daily[d] = { hours, abnormal: hours > 150 };
      total_hours += hours;
    });

    const is_expanded = false;

    // Simulate 2 sub-production lines as children
    const line1Daily: { [key: string]: MatrixDailyData } = {};
    const line2Daily: { [key: string]: MatrixDailyData } = {};
    let line1Total = 0;
    let line2Total = 0;
    days.forEach((d) => {
      const parentHours = daily[d].hours || 0;
      const line1 = Math.round(parentHours * 0.6);
      const line2 = parentHours - line1;
      line1Daily[d] = { hours: line1 };
      line2Daily[d] = { hours: line2 };
      line1Total += line1;
      line2Total += line2;
    });

    const children: MatrixRow[] = [
      {
        id: `dept-${index + 1}-line-a`,
        name: "  └ 生产线-甲组",
        dept: name,
        parent_id: `dept-${index + 1}`,
        total_hours: line1Total,
        daily: line1Daily
      },
      {
        id: `dept-${index + 1}-line-b`,
        name: "  └ 生产线-乙组",
        dept: name,
        parent_id: `dept-${index + 1}`,
        total_hours: line2Total,
        daily: line2Daily
      }
    ];

    return {
      id: `dept-${index + 1}`,
      name,
      total_hours,
      avg_hours: Number((total_hours / 22).toFixed(1)),
      daily,
      is_expanded,
      children
    };
  });

  // 2. Cost matrix rows (Student meals artificial cost)
  const costRows: MatrixRow[] = departmentNames.map((name, index) => {
    const daily: { [key: string]: MatrixDailyData } = {};
    let total_cost = 0;
    days.forEach((d) => {
      const hoursRow = workHourRows[index].daily[d].hours || 0;
      const rate = 28 + (index * 2) % 6;
      const cost = Math.round(hoursRow * rate);
      daily[d] = { cost };
      total_cost += cost;
    });

    const children: MatrixRow[] = [
      {
        id: `dept-cost-${index + 1}-line-a`,
        name: "  └ 生产线-甲组成本",
        parent_id: `dept-cost-${index + 1}`,
        total_cost: Math.round(total_cost * 0.6),
        daily: {} // simplified
      },
      {
        id: `dept-cost-${index + 1}-line-b`,
        name: "  └ 生产线-乙组成本",
        parent_id: `dept-cost-${index + 1}`,
        total_cost: total_cost - Math.round(total_cost * 0.6),
        daily: {}
      }
    ];

    return {
      id: `dept-cost-${index + 1}`,
      name,
      total_cost,
      daily,
      is_expanded: false,
      children
    };
  });

  // 3. Total cost matrix rows (Compiles student meals, convenience, campus part-time, baimao)
  const totalCostRows: MatrixRow[] = departmentNames.map((name, index) => {
    const daily: { [key: string]: MatrixDailyData } = {};
    let total_cost = 0;
    days.forEach((d) => {
      const studentMealCost = costRows[index].total_cost ? Math.round(costRows[index].total_cost! / 30) : 1200;
      const convenienceCost = Math.round(studentMealCost * (0.15 + (index * 0.04) % 0.2));
      const partTimeCost = Math.round(studentMealCost * (0.08 + (index * 0.02) % 0.1));
      const baimaoCost = Math.round(studentMealCost * 0.04);
      const total = studentMealCost + convenienceCost + partTimeCost + baimaoCost;
      daily[d] = { cost: total };
      total_cost += total;
    });

    return {
      id: `dept-tcost-${index + 1}`,
      name,
      total_cost,
      daily,
      is_expanded: false
    };
  });

  // 4. Trend Data
  const trend_data: TrendPoint[] = [
    { date: "06-24", staff: 338, hours: 2680, labor_cost: 84200, efficiency: 91.2, overtime: 280 },
    { date: "06-25", staff: 340, hours: 2710, labor_cost: 85000, efficiency: 92.5, overtime: 240 },
    { date: "06-26", staff: 342, hours: 2750, labor_cost: 86400, efficiency: 93.1, overtime: 310 },
    { date: "06-27", staff: 155, hours: 1120, labor_cost: 38200, efficiency: 94.0, overtime: 60 }, // weekend drop
    { date: "06-28", staff: 148, hours: 1040, labor_cost: 35500, efficiency: 93.8, overtime: 50 },
    { date: "06-29", staff: 345, hours: 2820, labor_cost: 88500, efficiency: 94.5, overtime: 350 },
    { date: "06-30", staff: 342, hours: 2804, labor_cost: 87800, efficiency: 95.2, overtime: 320 }
  ];

  // 5. KPI formulas metadata
  const kpi_formulas = {
    "员工总数": "当前选择日期在册打卡并生成有效考勤记录的独立员工去重总数",
    "生产工时": "经现场组长、厂长两级确认核准后的各工段实际生产作业时间累计",
    "出勤工时": "排班考勤系统的打卡原始总时长（扣除计划内休假与午休）",
    "人均工时": "总确认生产工时 / 实际出勤总人数",
    "单位工时产值": "当日生产产品总折算产值 / 总生产确认工时",
    "人均销售额": "当日总营收销售净额 / 实际出勤总人数",
    "人工工时成本": "确认工时 × 协议核算时薪（含公摊与派遣管理服务费）",
    "人工成本率": "人工工时成本总额 / 对应周期总营收额 × 100%",
    "单位工时人工成本": "人工工时成本总额 / 总确认工时",
    "工时覆盖率": "有对应生产量绩效关联的工时 / 厂区总核准工时 × 100%"
  };

  return {
    review_date: date,
    meta: {
      available_review_dates: [
        "2026-07-02",
        "2026-07-01",
        "2026-06-30",
        "2026-06-15",
        "2026-06-01",
        "2026-05-15"
      ],
      kpi_formulas
    },
    // Strictly align with Web version metrics
    summary: {
      total_staff: 342,
      production_hours: 2804,
      attendance_rate: 96.5,
      avg_hours: 8.2,
      overtime_staff: 48,
      unit_hour_output_value: 124.5,
      avg_sales_per_person: 1058,
      labor_cost: 87800,
      labor_cost_rate: 22.4,
      unit_hour_labor_cost: 31.3,
      coverage_rate: 94.2,
      
      workforce_load: {
        segments: [
          {
            label: "职员",
            worked_employee_count: 45,
            total_work_hours: 360,
            overtime_employee_count: 5,
            overtime_work_hours: 15,
            load_percent: 85,
            note: "职员工作负荷正常，加班呈周期性分布。"
          },
          {
            label: "自有员工",
            worked_employee_count: 180,
            total_work_hours: 1480,
            overtime_employee_count: 32,
            overtime_work_hours: 120,
            load_percent: 102,
            note: "生产主力，负荷处于饱和警戒线。"
          },
          {
            label: "小时工",
            worked_employee_count: 117,
            total_work_hours: 964,
            overtime_employee_count: 11,
            overtime_work_hours: 48,
            load_percent: 112,
            note: "小时工负荷偏高，主要应对生产波峰排班。"
          }
        ]
      },

      total_staff_compare: 1.2,
      production_hours_compare: 3.5,
      attendance_rate_compare: 2.1,
      avg_hours_compare: -1.2,
      overtime_staff_compare: -8.3,
      unit_hour_output_value_compare: 4.2,
      avg_sales_per_person_compare: 3.1,
      labor_cost_compare: 2.8,
      labor_cost_rate_compare: -1.5,
      unit_hour_labor_cost_compare: 0.8,
      coverage_rate_compare: 1.5
    },
    trend_data,
    departments: [
      {
        department_id: "dept-1",
        department_name: "学生餐一车间",
        path_text: "学生餐业务群 / 烹饪包装一车间",
        headcount: 58,
        total_hours: 4520,
        avg_hours: 8.2,
        overtime_hours: 320,
        labor_cost: 144640,
        efficiency_index: 94.5,
        rule_status: "normal",
        manager: "王志刚",
        exception_count: 2,
        top_staff: [
          { name: "李建国", job_number: "XY0120", hours: 196, risk_score: 12 },
          { name: "张芳", job_number: "XY0158", hours: 184, risk_score: 8 },
          { name: "赵铁柱", job_number: "XY0092", hours: 172, risk_score: 25 }
        ]
      },
      {
        department_id: "dept-2",
        department_name: "学生餐二车间",
        path_text: "学生餐业务群 / 烹饪包装二车间",
        headcount: 62,
        total_hours: 4980,
        avg_hours: 8.5,
        overtime_hours: 480,
        labor_cost: 159360,
        efficiency_index: 91.2,
        rule_status: "warning",
        manager: "徐丽",
        exception_count: 8,
        top_staff: [
          { name: "刘开山", job_number: "XY0221", hours: 210, risk_score: 48 },
          { name: "孙利", job_number: "XY0244", hours: 198, risk_score: 35 },
          { name: "周梅", job_number: "XY0135", hours: 180, risk_score: 15 }
        ]
      },
      {
        department_id: "dept-3",
        department_name: "方便菜加工部",
        path_text: "方便食品群 / 方便菜调理部",
        headcount: 45,
        total_hours: 3800,
        avg_hours: 8.9,
        overtime_hours: 510,
        labor_cost: 125400,
        efficiency_index: 87.8,
        rule_status: "danger",
        manager: "陈建国",
        exception_count: 15,
        top_staff: [
          { name: "刘伟", job_number: "XY0056", hours: 228, risk_score: 82 },
          { name: "钱华", job_number: "XY0311", hours: 204, risk_score: 64 },
          { name: "王萍", job_number: "XY0285", hours: 190, risk_score: 55 }
        ]
      },
      {
        department_id: "dept-4",
        department_name: "净菜生产线",
        path_text: "净菜前处理群 / 挑拣清洗线",
        headcount: 38,
        total_hours: 2850,
        avg_hours: 7.9,
        overtime_hours: 90,
        labor_cost: 85500,
        efficiency_index: 95.0,
        rule_status: "normal",
        manager: "赵海",
        exception_count: 0,
        top_staff: [
          { name: "徐大宏", job_number: "XY0401", hours: 168, risk_score: 5 },
          { name: "马爱珍", job_number: "XY0412", hours: 162, risk_score: 2 }
        ]
      },
      {
        department_id: "dept-5",
        department_name: "面点面食车间",
        path_text: "学生餐业务群 / 面点中面食线",
        headcount: 42,
        total_hours: 3240,
        avg_hours: 8.1,
        overtime_hours: 180,
        labor_cost: 97200,
        efficiency_index: 93.4,
        rule_status: "normal",
        manager: "杨兰",
        exception_count: 1,
        top_staff: [
          { name: "陈林", job_number: "XY0288", hours: 174, risk_score: 10 }
        ]
      },
      {
        department_id: "dept-6",
        department_name: "冷链物流配送部",
        path_text: "供应链群 / 冷链仓储运输部",
        headcount: 35,
        total_hours: 2980,
        avg_hours: 8.7,
        overtime_hours: 390,
        labor_cost: 95360,
        efficiency_index: 89.5,
        rule_status: "warning",
        manager: "高伟",
        exception_count: 4,
        top_staff: [
          { name: "张强", job_number: "XY0032", hours: 208, risk_score: 45 }
        ]
      }
    ],
    employees: [
      {
        id: "emp-1",
        name: "张建国",
        job_number: "XY0120",
        department: "学生餐一车间",
        position: "主配班长",
        hire_date: "2022-04-12",
        status: "在职",
        avg_hours: 8.5,
        attendance_rate: 98.2,
        risk_level: "low",
        daily_hours: { "2026-06-25": 8.5, "2026-06-26": 8.0, "2026-06-27": 0, "2026-06-28": 0, "2026-06-29": 8.5, "2026-06-30": 9.0 },
        punch_records: [
          { date: "2026-06-29", clock_in: "07:55", clock_out: "17:35", status: "正常" },
          { date: "2026-06-30", clock_in: "07:50", clock_out: "18:05", status: "加班" }
        ],
        applications: [
          { id: "app-101", type: "加班", start: "2026-06-30 17:30", end: "2026-06-30 18:30", hours: 1.0, status: "已批准" }
        ],
        adjustments: [
          { date: "2026-06-18", before_hours: 8.0, after_hours: 8.5, reason: "下班漏刷主管补签确认", operator: "王志刚" }
        ],
        exception_logs: [
          { date: "2026-06-18", type: "漏打卡", description: "下班打卡缺失，已由主管补签", score_impact: -5 }
        ]
      },
      {
        id: "emp-2",
        name: "李秀英",
        job_number: "XY0185",
        department: "学生餐一车间",
        position: "包装操作工",
        hire_date: "2023-08-15",
        status: "在职",
        avg_hours: 9.2,
        attendance_rate: 99.1,
        risk_level: "medium",
        daily_hours: { "2026-06-25": 9.5, "2026-06-26": 9.0, "2026-06-27": 5.0, "2026-06-28": 0, "2026-06-29": 9.5, "2026-06-30": 10.0 },
        punch_records: [
          { date: "2026-06-29", clock_in: "07:30", clock_out: "18:00", status: "正常" },
          { date: "2026-06-30", clock_in: "07:28", clock_out: "18:30", status: "加班" }
        ],
        applications: [
          { id: "app-102", type: "加班", start: "2026-06-30 17:00", end: "2026-06-30 18:30", hours: 1.5, status: "已批准" }
        ],
        adjustments: [],
        exception_logs: [
          { date: "2026-06-24", type: "超长加班", description: "单日加班超过2小时，触碰过度负荷预警线", score_impact: -15 }
        ]
      },
      {
        id: "emp-3",
        name: "王超",
        job_number: "XY0244",
        department: "学生餐二车间",
        position: "切配操作工",
        hire_date: "2024-01-10",
        status: "在职",
        avg_hours: 8.1,
        attendance_rate: 95.5,
        risk_level: "low",
        daily_hours: { "2026-06-25": 8.0, "2026-06-26": 8.0, "2026-06-27": 0, "2026-06-28": 0, "2026-06-29": 8.0, "2026-06-30": 8.0 },
        punch_records: [],
        applications: [],
        adjustments: [],
        exception_logs: []
      },
      {
        id: "emp-4",
        name: "刘伟",
        job_number: "XY0056",
        department: "方便菜加工部",
        position: "车间主管",
        hire_date: "2021-03-01",
        status: "在职",
        avg_hours: 10.4,
        attendance_rate: 100,
        risk_level: "high",
        daily_hours: { "2026-06-25": 11.0, "2026-06-26": 10.5, "2026-06-27": 6.0, "2026-06-28": 4.0, "2026-06-29": 11.0, "2026-06-30": 11.5 },
        punch_records: [
          { date: "2026-06-29", clock_in: "07:00", clock_out: "19:00", status: "严重加班" },
          { date: "2026-06-30", clock_in: "06:55", clock_out: "19:30", status: "严重加班" }
        ],
        applications: [
          { id: "app-104", type: "加班", start: "2026-06-30 17:00", end: "2026-06-30 19:30", hours: 2.5, status: "已批准" }
        ],
        adjustments: [],
        exception_logs: [
          { date: "2026-06-20", type: "连续加班", description: "连续12天无休打卡，违反集团劳动健康准则", score_impact: -40 },
          { date: "2026-06-28", type: "周末打卡", description: "未提报流程的周末非计划打卡记录", score_impact: -10 }
        ]
      }
    ],
    work_hour_matrix: { days, rows: workHourRows, summary: { total_hours: 38450, avg_hours: 8.2, abnormal_count: 5 } },
    cost_matrix: { days, rows: costRows, summary: { total_cost: 1153500 }, segmentOptions: ["一期冷链", "二期热厨", "方便菜二期"] },
    total_cost_matrix: { days, rows: totalCostRows, summary: { total_cost: 1425800 }, segmentOptions: ["一期冷链", "二期热厨", "方便菜二期", "第三方归集"] },
    
    // 6. 支援工时 (HealthTab)
    support_hours: {
      range: "2026-06-01 至 2026-06-30",
      records: [
        { id: "s-1", source_department: "学生餐二车间", target_department: "学生餐一车间", support_hours: 120, people_count: 8, efficiency_rating: 92, cost_saved: 3600, date: "2026-06-25" },
        { id: "s-2", source_department: "方便菜加工部", target_department: "学生餐二车间", support_hours: 45, people_count: 3, efficiency_rating: 88, cost_saved: 1350, date: "2026-06-26" },
        { id: "s-3", source_department: "面点面食车间", target_department: "学生餐一车间", support_hours: 64, people_count: 5, efficiency_rating: 95, cost_saved: 1920, date: "2026-06-27" },
        { id: "s-4", source_department: "品质检验中心", target_department: "方便菜加工部", support_hours: 18, people_count: 2, efficiency_rating: 90, cost_saved: 540, date: "2026-06-28" }
      ],
      filters: {
        supportDepartments: ["学生餐二车间", "方便菜加工部", "面点面食车间", "品质检验中心"],
        outgoingDepartments: ["学生餐一车间", "学生餐二车间", "方便菜加工部"]
      },
      ranking: [
        { department_name: "学生餐一车间", hours: 184 },
        { department_name: "学生餐二车间", hours: 45 },
        { department_name: "方便菜加工部", hours: 18 }
      ],
      trend: [
        { date: "06-24", hours: 12 },
        { date: "06-25", hours: 120 },
        { date: "06-26", hours: 45 },
        { date: "06-27", hours: 64 },
        { date: "06-28", hours: 18 }
      ]
    },

    // 7. 经营效率 (EfficiencyTab)
    efficiency_dashboard: {
      mainKPIs: [
        { label: "综合人均毛利", value: "¥4,250/人", compare: "+4.5%", formula: "人均毛利 = (业务部门总营收 - 物料毛成本) / 实际出勤人天", change: "+4.5%", desc: "反映业务车间基础毛利贡献", isPositive: true },
        { label: "支撑时效系数", value: "1.14h/百元", compare: "-2.1%", formula: "支撑时效 = 支持与职能总工时 / 业务部门营收(百元)", change: "-2.1%", desc: "支持性职能工时消耗比例", isPositive: false },
        { label: "标准工时达成率", value: "95.2%", compare: "+1.8%", formula: "达成率 = 标准工艺配额工时 / 实际确认工时 × 100%", change: "+1.8%", desc: "标准制造工艺配额符合度", isPositive: true }
      ],
      businessRows: [
        { id: "b-1", name: "学生餐烹饪组", margin: 185000, hours: 4520, margin_per_hour: 40.9, perPersonGross: 4520, salaryGrossEfficiency: 7.2 },
        { id: "b-2", name: "方便菜酱包调配", margin: 95000, hours: 2100, margin_per_hour: 45.2, perPersonGross: 5120, salaryGrossEfficiency: 8.1 },
        { id: "b-3", name: "面食面点烘焙", margin: 112000, hours: 3240, margin_per_hour: 34.5, perPersonGross: 3950, salaryGrossEfficiency: 6.5 },
        { id: "b-4", name: "冷链配送车队", margin: 85000, hours: 2980, margin_per_hour: 28.5, perPersonGross: 3100, salaryGrossEfficiency: 5.4 }
      ],
      supportRows: [
        { id: "sp-1", name: "前处理前挑挑拣", support_value: 350000, labor_cost: 85500, ratio: 24.4, unitSupport: 1.25 },
        { id: "sp-2", name: "蒸汽动力设备组", support_value: 480000, labor_cost: 32000, ratio: 6.6, unitSupport: 3.12 }
      ],
      functionalRows: [
        { id: "f-1", name: "行政人事组", workload_score: 92, staff_count: 5, loadRatio: 92 },
        { id: "f-2", name: "安全生产监管科", workload_score: 85, staff_count: 3, loadRatio: 85 },
        { id: "f-3", name: "财务分析审计中心", workload_score: 96, staff_count: 4, loadRatio: 96 }
      ],
      trendRows: [
        { date: "06-25", margin_per_hour: 38.5, avg_line: 35.0, industry_line: 30.0, support_ratio: 15.2, perPersonGross: 3850, grossMargin: 65.2, unitSupport: 1.15, laborCostRateTotalCost: 22.4 },
        { date: "06-26", margin_per_hour: 39.1, avg_line: 35.0, industry_line: 30.0, support_ratio: 14.8, perPersonGross: 3910, grossMargin: 65.8, unitSupport: 1.13, laborCostRateTotalCost: 22.1 },
        { date: "06-27", margin_per_hour: 40.2, avg_line: 35.0, industry_line: 30.0, support_ratio: 14.1, perPersonGross: 4020, grossMargin: 66.5, unitSupport: 1.11, laborCostRateTotalCost: 21.8 },
        { date: "06-28", margin_per_hour: 37.8, avg_line: 35.0, industry_line: 30.0, support_ratio: 15.6, perPersonGross: 3780, grossMargin: 64.9, unitSupport: 1.18, laborCostRateTotalCost: 23.2 },
        { date: "06-29", margin_per_hour: 41.5, avg_line: 35.0, industry_line: 30.0, support_ratio: 13.9, perPersonGross: 4150, grossMargin: 67.2, unitSupport: 1.09, laborCostRateTotalCost: 21.4 },
        { date: "06-30", margin_per_hour: 40.9, avg_line: 35.0, industry_line: 30.0, support_ratio: 14.2, perPersonGross: 4090, grossMargin: 66.8, unitSupport: 1.12, laborCostRateTotalCost: 21.6 }
      ],
      referenceLines: {
        avg_line: 35.0,
        industry_line: 30.0,
        perPersonGrossInternal: 3500,
        grossMarginPreparedFoodStrong: 65.0,
        unitSupportInternal: 1.20,
        laborCostToTotalCostFoodProcessing: 22.0
      },
      referenceNotes: [
        "食品加工制造行业单位工时人均产出毛利参考基线为 30.0 元/小时",
        "集团核定二季度综合人均时效达标红线为 35.0 元/小时"
      ],
      source: { note: "数据源自金蝶HR与现场ERP每日出餐量交叉合并计算所得" }
    },

    // 8. 成本中心 (CostTab)
    cost: {
      mainKPIs: [
        { label: "人工工时成本率", value: "22.4%", compare: "-1.5%", formula: "成本率 = 确认工时人工总成本 / 厂区销售营收 × 100%", change: "-1.5%", desc: "人工总成本比销售营收", isPositive: false, highlight: true },
        { label: "单位工时费用", value: "¥31.3/h", compare: "+0.8%", formula: "单位工时成本 = 人工总成本 (含平台管理费) / 审计核准工时", change: "+0.8%", desc: "平均小时确认单价", isPositive: true, highlight: false }
      ],
      trendData: [
        { date: "06-25", labor_cost: 85000, cost_rate: 22.8, unit_cost: 31.4, industry_line: 28.5, totalCost: 85000, costRate: 22.8, unitHourCost: 31.4 },
        { date: "06-26", labor_cost: 86400, cost_rate: 22.6, unit_cost: 31.3, industry_line: 28.5, totalCost: 86400, costRate: 22.6, unitHourCost: 31.3 },
        { date: "06-27", labor_cost: 38200, cost_rate: 23.5, unit_cost: 34.1, industry_line: 28.5, totalCost: 38200, costRate: 23.5, unitHourCost: 34.1 },
        { date: "06-28", labor_cost: 35500, cost_rate: 23.8, unit_cost: 34.1, industry_line: 28.5, totalCost: 35500, costRate: 23.8, unitHourCost: 34.1 },
        { date: "06-29", labor_cost: 88500, cost_rate: 22.1, unit_cost: 31.3, industry_line: 28.5, totalCost: 88500, costRate: 22.1, unitHourCost: 31.3 },
        { date: "06-30", labor_cost: 87800, cost_rate: 22.4, unit_cost: 31.3, industry_line: 28.5, totalCost: 87800, costRate: 22.4, unitHourCost: 31.3 }
      ],
      structure: [
        { name: "直接在册人工", value: 245800, percentage: 63.9, color: "#f97316", ratio: 63.9, source: "在册编制员工", displayValue: "¥245,800" },
        { name: "第三方劳务派遣", value: 78500, percentage: 20.4, color: "#3b82f6", ratio: 20.4, source: "第三方人力派遣", displayValue: "¥78,500" },
        { name: "校园兼职福利", value: 32400, percentage: 8.4, color: "#10b981", ratio: 8.4, source: "校园勤工俭学", displayValue: "¥32,400" },
        { name: "白猫清洗外包", value: 27800, percentage: 7.3, color: "#8b5cf6", ratio: 7.3, source: "清洗洗消外包", displayValue: "¥27,800" }
      ],
      departmentRows: [
        { id: "dp-1", name: "学生餐一车间", labor_cost: 144640, hours: 4520, cost_per_hour: 32.0, department: "学生餐一车间", workHours: 4520, allocatedCost: 144640, costShare: 23.6, unitHourCost: 32.0, risk: "none" },
        { id: "dp-2", name: "学生餐二车间", labor_cost: 159360, hours: 4980, cost_per_hour: 32.0, department: "学生餐二车间", workHours: 4980, allocatedCost: 159360, costShare: 26.0, unitHourCost: 32.0, risk: "none" },
        { id: "dp-3", name: "方便菜加工部", labor_cost: 125400, hours: 3800, cost_per_hour: 33.0, department: "方便菜加工部", workHours: 3800, allocatedCost: 125400, costShare: 20.5, unitHourCost: 33.0, risk: "high" },
        { id: "dp-4", name: "净菜生产线", labor_cost: 85500, hours: 2850, cost_per_hour: 30.0, department: "净菜生产线", workHours: 2850, allocatedCost: 85500, costShare: 14.0, unitHourCost: 30.0, risk: "none" },
        { id: "dp-5", name: "面点面食车间", labor_cost: 97200, hours: 3240, cost_per_hour: 30.0, department: "面点面食车间", workHours: 3240, allocatedCost: 97200, costShare: 15.9, unitHourCost: 30.0, risk: "medium" }
      ],
      alerts: [
        { level: "high", message: "方便菜加工部超出月人工预算支出15.4%", department: "方便菜加工部", value: "超支¥16,800" },
        { level: "medium", message: "第三方派遣劳务溢价突破协议控制线", department: "物流配送中心", value: "单价+¥2.5/h" }
      ],
      totals: {
        labor_cost: 612100,
        hours: 19390,
        cost_per_hour: 31.5,
        totalCost: 612100
      },
      source: { note: "数据关联自ERP金蝶核准财务账目口径" }
    },

    // 9. 职位成本 (PositionCostTab)
    position_cost: {
      kpis: [
        { label: "职位最高时薪中位数", value: "¥38.5/h", compare: "+1.2%", change: "+1.2%", desc: "各级岗位核心时薪中位数", isPositive: true },
        { label: "劳务替代率", value: "28.5%", compare: "-2.4%", change: "-2.4%", desc: "外部劳务顶岗时间占比", isPositive: false },
        { label: "成本集中度", value: "72.4%", compare: "+0.5%", change: "+0.5%", desc: "TOP 5 岗位成本归集占比", isPositive: true }
      ],
      analysisRows: [
        { position: "切配操作工", department: "学生餐一车间", avg_cost: 5800, headcount: 20, total_cost: 116000, people: 20, averageHours: 184, unitHourCost: 31.5 },
        { position: "切配操作工", department: "学生餐二车间", avg_cost: 5900, headcount: 22, total_cost: 129800, people: 22, averageHours: 188, unitHourCost: 31.4 },
        { position: "主配班长", department: "学生餐一车间", avg_cost: 8200, headcount: 5, total_cost: 41000, people: 5, averageHours: 205, unitHourCost: 40.0 },
        { position: "包装操作工", department: "方便菜加工部", avg_cost: 5200, headcount: 18, total_cost: 93600, people: 18, averageHours: 192, unitHourCost: 27.1 },
        { position: "物流车队司机", department: "物流配送中心", avg_cost: 6800, headcount: 8, total_cost: 54400, people: 8, averageHours: 200, unitHourCost: 34.0 }
      ],
      costRanking: [
        { position: "切配操作工", cost: 245800, averageHours: 186, unitHourCost: 31.45 },
        { position: "包装操作工", cost: 93600, averageHours: 192, unitHourCost: 27.1 },
        { position: "物流车队司机", cost: 54400, averageHours: 200, unitHourCost: 34.0 },
        { position: "主配班长", cost: 41000, averageHours: 205, unitHourCost: 40.0 }
      ],
      concentration: [
        { name: "低阶简单体力操作岗", value: 339400, percentage: 55.4 },
        { name: "配送物流驾驶岗", value: 54400, percentage: 8.9 },
        { name: "管理与技术班长", value: 41000, percentage: 6.7 },
        { name: "其他职能后勤支持", value: 177300, percentage: 29.0 }
      ],
      concentrationTop5Ratio: 71.0,
      records: [
        { position: "主配班长", name: "张强", salary: 7800, allowance: 400, cost: 8200 },
        { position: "主配班长", name: "李勇", salary: 7600, allowance: 600, cost: 8200 },
        { position: "切配操作工", name: "王超", salary: 5600, allowance: 200, cost: 5800 }
      ]
    },

    // 10. 风险管控 (RiskTab)
    risk: {
      overview: {
        total_alerts: 12,
        high_risk_count: 3,
        medium_risk_count: 4,
        low_risk_count: 5,
        levels: { green: 18, yellow: 4, orange: 2, red: 1 },
        netDelta: 3
      },
      worsening_top: [
        { id: "w-1", department: "方便菜加工部", change_rate: 45.2, factor: "连续超时疲劳作业" },
        { id: "w-2", department: "学生餐二车间", change_rate: 28.5, factor: "代班漏打卡异常" }
      ],
      improving_top: [
        { id: "i-1", department: "净菜生产线", change_rate: -32.4, factor: "排班跨天脱岗改善" },
        { id: "i-2", department: "物流配送车队", change_rate: -15.0, factor: "高负荷合规风险下降" }
      ],
      heatmap: [
        { date: "06-25", department: "学生餐一车间", score: 15, path_text: "学生餐一车间", name: "学生餐一车间", worked_employee_count: 45, total_work_hours: 360, average_work_hours: 8.0 },
        { date: "06-25", department: "方便菜加工部", score: 85, path_text: "方便菜加工部", name: "方便菜加工部", worked_employee_count: 28, total_work_hours: 280, average_work_hours: 10.0 },
        { date: "06-26", department: "学生餐一车间", score: 12, path_text: "学生餐一车间", name: "学生餐一车间", worked_employee_count: 45, total_work_hours: 350, average_work_hours: 7.78 },
        { date: "06-26", department: "方便菜加工部", score: 88, path_text: "方便菜加工部", name: "方便菜加工部", worked_employee_count: 28, total_work_hours: 288, average_work_hours: 10.28 },
        { date: "06-29", department: "学生餐二车间", score: 55, path_text: "学生餐二车间", name: "学生餐二车间", worked_employee_count: 52, total_work_hours: 468, average_work_hours: 9.0 },
        { date: "06-30", department: "方便菜加工部", score: 92, path_text: "方便菜加工部", name: "方便菜加工部", worked_employee_count: 28, total_work_hours: 302, average_work_hours: 10.78 }
      ],
      department_details: {
        "方便菜加工部": {
          factors: [
            { name: "超时作业疲劳风险", score: 92, level: "high" },
            { name: "无审批打卡异常", score: 65, level: "medium" },
            { name: "健康证效期预警", score: 15, level: "low" }
          ],
          trend_7_days: [
            { date: "06-24", hours: 102 },
            { date: "06-25", hours: 110 },
            { date: "06-26", hours: 105 },
            { date: "06-27", hours: 60 },
            { date: "06-28", hours: 40 },
            { date: "06-29", hours: 110 },
            { date: "06-30", hours: 115 }
          ],
          staff: [
            { name: "刘伟", risk_score: 82, status: "已督办" },
            { name: "钱华", risk_score: 64, status: "处理中" }
          ],
          factorBreakdown: [
            { name: "超时作业疲劳风险", score: 92, level: "high" },
            { name: "无审批打卡异常", score: 65, level: "medium" },
            { name: "健康证效期预警", score: 15, level: "low" }
          ],
          sevenDayTrend: [
            { date: "06-24", hours: 102 },
            { date: "06-25", hours: 110 },
            { date: "06-26", hours: 105 },
            { date: "06-27", hours: 60 },
            { date: "06-28", hours: 40 },
            { date: "06-29", hours: 110 },
            { date: "06-30", hours: 115 }
          ],
          continuousPeople: [
            { name: "刘伟", risk_score: 82, status: "已督办" },
            { name: "钱华", risk_score: 64, status: "处理中" }
          ]
        },
        "学生餐二车间": {
          factors: [
            { name: "漏刷卡及代签率", score: 72, level: "medium" },
            { name: "连续排班无休", score: 45, level: "medium" }
          ],
          trend_7_days: [
            { date: "06-24", hours: 145 },
            { date: "06-25", hours: 152 },
            { date: "06-26", hours: 155 },
            { date: "06-27", hours: 30 },
            { date: "06-28", hours: 25 },
            { date: "06-29", hours: 148 },
            { date: "06-30", hours: 150 }
          ],
          staff: [
            { name: "刘开山", risk_score: 48, status: "已下达通知" }
          ],
          factorBreakdown: [
            { name: "漏刷卡及代签率", score: 72, level: "medium" },
            { name: "连续排班无休", score: 45, level: "medium" }
          ],
          sevenDayTrend: [
            { date: "06-24", hours: 145 },
            { date: "06-25", hours: 152 },
            { date: "06-26", hours: 155 },
            { date: "06-27", hours: 30 },
            { date: "06-28", hours: 25 },
            { date: "06-29", hours: 148 },
            { date: "06-30", hours: 150 }
          ],
          continuousPeople: [
            { name: "刘开山", risk_score: 48, status: "已下达通知" }
          ]
        }
      }
    },

    // 11. 战略管理追踪 (StrategicTab)
    strategic: {
      summaryCards: [
        { label: "疲劳用工风险综合指数", value: "42.5", trend: "-8.4% (上周 46.4)", desc: "综合疲劳评估分值", tone: "warning" },
        { label: "劳务外包红线控制状态", value: "合规安全", trend: "派遣比 20.4% / 红线 22%", desc: "派遣及外包用工限值", tone: "success" },
        { label: "跨厂区顶岗合规审计率", value: "100%", trend: "本月无越级顶岗违规", desc: "越级顶岗合规违规审计", tone: "success" }
      ],
      riskTrend: [
        { date: "06-25", risk_index: 48, avg_line: 40, name: "06-25", warningRecords: 4, riskPeople: 2, consecutiveUp: 2, weekend: false, issueBreakdown: "超时疲劳" },
        { date: "06-26", risk_index: 45, avg_line: 40, name: "06-26", warningRecords: 3, riskPeople: 1, consecutiveUp: 1, weekend: false, issueBreakdown: "超时疲劳" },
        { date: "06-27", risk_index: 30, avg_line: 40, name: "06-27", warningRecords: 1, riskPeople: 0, consecutiveUp: 0, weekend: true, issueBreakdown: "无异常" },
        { date: "06-28", risk_index: 28, avg_line: 40, name: "06-28", warningRecords: 0, riskPeople: 0, consecutiveUp: 0, weekend: true, issueBreakdown: "无异常" },
        { date: "06-29", risk_index: 43, avg_line: 40, name: "06-29", warningRecords: 3, riskPeople: 2, consecutiveUp: 1, weekend: false, issueBreakdown: "考勤漏打卡" },
        { date: "06-30", risk_index: 42, avg_line: 40, name: "06-30", warningRecords: 2, riskPeople: 1, consecutiveUp: 1, weekend: false, issueBreakdown: "漏刷卡" }
      ],
      focusDepartments: [
        { name: "方便菜加工部", issue_count: 5, status: "danger", department: "方便菜加工部", riskPeople: 3, hours: 228, changeRate: 15.4, changeLabel: "超限", issueBreakdown: "疲劳与漏刷卡" },
        { name: "学生餐二车间", issue_count: 3, status: "warning", department: "学生餐二车间", riskPeople: 1, hours: 188, changeRate: 5.2, changeLabel: "警示", issueBreakdown: "代签卡风险" },
        { name: "冷链配送部", issue_count: 2, status: "warning", department: "冷链配送部", riskPeople: 1, hours: 190, changeRate: 2.1, changeLabel: "警示", issueBreakdown: "长途疲劳" }
      ],
      highRiskPeople: [
        { name: "刘伟", department: "方便菜加工部", risk_type: "超时加班疲劳", hours: 228, longDays: 14, lowDays: 0, missingClock: 2, riskLabel: "高疲劳警告", reviewStatus: "已督办下达" },
        { name: "李秀英", department: "学生餐一车间", risk_type: "连续顶班脱岗", hours: 198, longDays: 8, lowDays: 0, missingClock: 4, riskLabel: "违规代班警告", reviewStatus: "下达核查中" }
      ]
    }
  };
}

// Generate complete, robust data for the 4 scope matrices (Baimao, Campus Part-Time, Convenience, Third-Party)
export function getMockMonthlyCheckData(scope: string, month: string, department: string, keyword: string): MonthlyCheckResponse {
  const [yearStr, monthStr] = (month || "2026-06").split("-");
  const year = parseInt(yearStr || "2026");
  const monthNum = parseInt(monthStr || "06");
  const rawDays = getDaysInMonth(year, monthNum);
  const keywordLower = keyword.trim().toLowerCase();

  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const daysInfo = rawDays.map(dayStr => {
    const d = new Date(dayStr);
    const dayOnly = dayStr.split("-")[2];
    const weekdayNum = d.getDay();
    const isWeekend = weekdayNum === 0 || weekdayNum === 6;
    return {
      date: dayStr,
      day: dayOnly,
      weekday: weekdays[weekdayNum],
      is_weekend: isWeekend
    };
  });

  let rows: any[] = [];
  let summary = { total_hours: 0, total_cost: 0, total_people: 0, total_qty: 0, headcount: 0 };
  const deptList = ["一车间", "二车间", "三车间", "外包车间", "客服组", "配送中心"];

  if (scope === "baimao") {
    const rawRows = [
      { employee_name: "王亮", department_1: "白猫洗消部", department_2: "餐盒清洗组" },
      { employee_name: "韩雷", department_1: "白猫洗消部", department_2: "保温箱冲洗" },
      { employee_name: "刘洋", department_1: "白猫洗消部", department_2: "消毒车间" },
      { employee_name: "孙华", department_1: "白猫洗消部", department_2: "周转箱清点" }
    ];

    rows = rawRows.map((person, index) => {
      const daily: { [key: string]: any } = {};
      let total_qty = 0;
      let total_cost = 0;
      let total_hours = 0;
      let attendance_days = 0;

      daysInfo.forEach((dayInfo) => {
        const isWeekend = dayInfo.is_weekend;
        const qty = isWeekend ? 0 : 250 + Math.floor(Math.sin(index + parseInt(dayInfo.day)) * 40);
        const hours = isWeekend ? 0 : 8;
        const regular_hours = hours;
        const overtime_hours = 0;
        const hourly_rate = 22;
        const overtime_hourly_rate = 33;
        const cost = Math.round(qty * 0.45); // 0.45 CNY per box wash
        const attendance = qty > 0 ? "正常" : "休息";

        daily[dayInfo.date] = {
          qty,
          hours,
          regular_hours,
          overtime_hours,
          hourly_rate,
          overtime_hourly_rate,
          cost,
          attendance
        };

        total_qty += qty;
        total_cost += cost;
        total_hours += hours;
        if (qty > 0) attendance_days++;
      });

      return {
        id: `bm-${index + 1}`,
        user_id: `u-bm-${index + 1}`,
        employee_name: person.employee_name,
        department_1: person.department_1,
        department_2: person.department_2,
        dept: person.department_2, // fallback compat
        name: person.employee_name, // fallback compat
        total_qty,
        total_hours,
        total_cost,
        attendance_days,
        daily
      };
    });

  } else if (scope === "campus-part-time") {
    const rawRows = [
      { employee_name: "陈波", department_1: "杭州电子科技大学", department_2: "客服组" },
      { employee_name: "高远", department_1: "浙江工业大学", department_2: "配送支持" },
      { employee_name: "周杰", department_1: "浙江工商大学", department_2: "分拣班组" },
      { employee_name: "徐婷婷", department_1: "杭州师范大学", department_2: "文书组" }
    ];

    rows = rawRows.map((person, index) => {
      const daily: { [key: string]: any } = {};
      let total_hours = 0;
      let total_cost = 0;
      let attendance_days = 0;

      daysInfo.forEach((dayInfo) => {
        const isWeekend = dayInfo.is_weekend;
        const hours = isWeekend ? 0 : 6 + (index % 2) * 2;
        const regular_hours = hours > 8 ? 8 : hours;
        const overtime_hours = hours > 8 ? hours - 8 : 0;
        const hourly_rate = 18;
        const overtime_hourly_rate = 27;
        const cost = hours * hourly_rate;
        const attendance = hours > 0 ? "出勤" : "休息";

        daily[dayInfo.date] = {
          hours,
          regular_hours,
          overtime_hours,
          hourly_rate,
          overtime_hourly_rate,
          cost,
          attendance
        };

        total_hours += hours;
        total_cost += cost;
        if (hours > 0) attendance_days++;
      });

      return {
        id: `cp-${index + 1}`,
        user_id: `u-cp-${index + 1}`,
        employee_name: person.employee_name,
        department_1: person.department_1,
        department_2: person.department_2,
        dept: person.department_2,
        name: person.employee_name,
        total_hours,
        total_cost,
        attendance_days,
        daily
      };
    });

  } else if (scope === "convenience") {
    const rawRows = [
      { employee_name: "陈建", department_1: "方便菜肴部", department_2: "红烧肉调理线" },
      { employee_name: "赵一鸣", department_1: "方便菜肴部", department_2: "黑椒牛柳线" },
      { employee_name: "李志刚", department_1: "方便菜肴部", department_2: "配料包装线" },
      { employee_name: "钱卫东", department_1: "方便菜肴部", department_2: "香菇滑鸡线" }
    ];

    rows = rawRows.map((person, index) => {
      const daily: { [key: string]: any } = {};
      let total_hours = 0;
      let total_cost = 0;
      let attendance_days = 0;

      daysInfo.forEach((dayInfo) => {
        const isWeekend = dayInfo.is_weekend;
        const hours = isWeekend ? Math.floor(Math.random() * 4) : 8 + Math.floor(Math.random() * 3);
        const regular_hours = hours > 8 ? 8 : hours;
        const overtime_hours = hours > 8 ? hours - 8 : 0;
        const hourly_rate = 25;
        const overtime_hourly_rate = 37.5;
        const cost = (regular_hours * hourly_rate) + (overtime_hours * overtime_hourly_rate);
        const attendance = hours > 0 ? "正常" : "休息";

        daily[dayInfo.date] = {
          hours,
          regular_hours,
          overtime_hours,
          hourly_rate,
          overtime_hourly_rate,
          cost,
          attendance
        };

        total_hours += hours;
        total_cost += cost;
        if (hours > 0) attendance_days++;
      });

      return {
        id: `cv-${index + 1}`,
        user_id: `u-cv-${index + 1}`,
        employee_name: person.employee_name,
        department_1: person.department_1,
        department_2: person.department_2,
        dept: person.department_2,
        name: person.employee_name,
        total_hours,
        total_cost,
        attendance_days,
        daily
      };
    });

  } else {
    const rawRows = [
      { employee_name: "张明", department_1: "万宝盛华劳务", department_2: "一车间顶岗" },
      { employee_name: "李静", department_1: "中力外包服务", department_2: "二车间分拣" },
      { employee_name: "周强", department_1: "顺捷人力派遣", department_2: "配送中心辅助" },
      { employee_name: "孙利", department_1: "中力外包服务", department_2: "二车间打包" }
    ];

    rows = rawRows.map((person, index) => {
      const daily: { [key: string]: any } = {};
      let total_hours = 0;
      let total_cost = 0;
      let attendance_days = 0;

      daysInfo.forEach((dayInfo) => {
        const isWeekend = dayInfo.is_weekend;
        const hours = isWeekend ? 0 : 8 + (index % 2) * 2;
        const regular_hours = hours > 8 ? 8 : hours;
        const overtime_hours = hours > 8 ? hours - 8 : 0;
        const hourly_rate = 22;
        const overtime_hourly_rate = 33;
        const cost = (regular_hours * hourly_rate) + (overtime_hours * overtime_hourly_rate);
        const attendance = hours > 0 ? "正常" : "休息";

        daily[dayInfo.date] = {
          hours,
          regular_hours,
          overtime_hours,
          hourly_rate,
          overtime_hourly_rate,
          cost,
          attendance
        };

        total_hours += hours;
        total_cost += cost;
        if (hours > 0) attendance_days++;
      });

      return {
        id: `tp-${index + 1}`,
        user_id: `u-tp-${index + 1}`,
        employee_name: person.employee_name,
        department_1: person.department_1,
        department_2: person.department_2,
        dept: person.department_2,
        name: person.employee_name,
        total_hours,
        total_cost,
        attendance_days,
        daily
      };
    });
  }

  // Filter rows based on department selection
  if (department && department !== "all" && department !== "全部部门") {
    rows = rows.filter((r: any) => r.department_2 === department || r.dept === department);
  }

  // Filter rows based on keyword
  if (keywordLower) {
    rows = rows.filter(
      (r) =>
        r.employee_name.toLowerCase().includes(keywordLower) ||
        r.department_1.toLowerCase().includes(keywordLower) ||
        r.department_2.toLowerCase().includes(keywordLower)
    );
  }

  // Calculate summaries
  rows.forEach((r) => {
    summary.total_hours += r.total_hours || 0;
    summary.total_cost += r.total_cost || 0;
    summary.total_qty += r.total_qty || 0;
    summary.total_people += r.attendance_days || 0;
  });
  summary.headcount = rows.length;

  return {
    month,
    days: rawDays,
    rows,
    summary,
    departments: deptList
  };
}
