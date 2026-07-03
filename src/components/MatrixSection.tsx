import React, { useState, useEffect } from "react";
import { MatrixData, MatrixRow, MatrixDailyData } from "../types";
import { useDevice } from "../context/DeviceContext";
import { getMockMonthlyCheckData } from "../mockData";
import { 
  Search, 
  Filter, 
  HelpCircle, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Layers, 
  Calendar,
  PieChart as LucidePieIcon
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell 
} from "recharts";

interface MatrixSectionProps {
  scope: "work_matrix" | "total_cost_matrix" | "student_meal_cost" | "baimao" | "campus" | "convenience" | "third_party";
  initialData: MatrixData;
  selectedDate: string;
  isDemo?: boolean;
  token?: string | null;
}

type ViewMode = "hours" | "cost" | "qty" | "people";

const CHART_COLORS = [
  "#f97316", // orange
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#eab308", // yellow
  "#6366f1"  // indigo
];

// Helper to calculate days of a month
function getDaysForMonth(monthStr: string): string[] {
  const [year, month] = monthStr.split("-").map(Number);
  const numDays = new Date(year, month, 0).getDate();
  const days: string[] = [];
  for (let i = 1; i <= numDays; i++) {
    days.push(`${year}-${String(month).padStart(2, "0")}-${String(i).padStart(2, "0")}`);
  }
  return days;
}

export default function MatrixSection({ scope, initialData, selectedDate, isDemo = true, token }: MatrixSectionProps) {
  const [keyword, setKeyword] = useState("");
  const [selectedDept, setSelectedDept] = useState("全部部门");
  const [viewMode, setViewMode] = useState<ViewMode>("hours");
  const [selectedMonth, setSelectedMonth] = useState("2026-06"); // Month Filter YYYY-MM
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";
  
  const [dynamicMatrix, setDynamicMatrix] = useState<MatrixData>(initialData);
  const [deptOptions, setDeptOptions] = useState<string[]>(["全部部门"]);
  const [loading, setLoading] = useState(false);

  // Generate dynamic month list for 2026 to avoid hardcoding
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, "0");
    return `2026-${m}`;
  });

  // Synchronize and render Monthly content
  useEffect(() => {
    // Default view modes for different scopes
    if (scope === "total_cost_matrix" || scope === "student_meal_cost") {
      setViewMode("cost");
    } else if (scope === "baimao") {
      setViewMode("qty");
    } else if (scope === "campus") {
      setViewMode("people");
    } else {
      setViewMode("hours");
    }

    const isDynamic = ["baimao", "campus", "convenience", "third_party"].includes(scope);
    if (isDynamic) {
      setLoading(true);
      const apiScope = scope === "campus" ? "campus-part-time" : scope;

      if (!isDemo && token) {
        // PRODUCTION MODE: Fetch real data from live Express backend REST API
        let active = true;
        const fetchRealData = async () => {
          try {
            const res = await fetch(`/api/plugins/hr/monthly-check/${apiScope}?review_date=${selectedMonth}`, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });
            if (res.ok && active) {
              const resJson = await res.json();
              const rawDays = getDaysForMonth(selectedMonth);
              const serverData = resJson.data || [];
              
              const weekdaysInMonth = rawDays.filter(day => {
                const d = new Date(day);
                const w = d.getDay();
                return w !== 0 && w !== 6;
              });
              const numWeekdays = weekdaysInMonth.length || 22;

              const rows: MatrixRow[] = serverData.map((item: any, index: number) => {
                const name = item.name || item.student_name || item.line_name || item.vendor_name || "未知";
                const employee_name = item.name || item.student_name || item.audited_by || name;
                const dept = item.department || item.school || item.line_name || item.vendor_name || "核心生产";
                const department_1 = item.department_1 || item.school || item.vendor_name || dept;
                const department_2 = item.department_2 || item.work_type || item.line_name || "清洗核算组";
                
                const total_hours = parseFloat(item.total_hours || item.audited_hours || item.standard_hours || "160");
                const total_cost = parseFloat(item.net_cost || item.total_cost || item.total_amount || item.salary || "4000");
                const total_qty = parseFloat(item.qty || item.output_qty || Math.round(total_hours * 32.5));
                const attendance_days = parseFloat(item.attendance_days || item.dispatched_headcount || "22");
                
                const daily: { [key: string]: any } = {};
                
                rawDays.forEach(day => {
                  const d = new Date(day);
                  const w = d.getDay();
                  const isWeekend = w === 0 || w === 6;
                  
                  if (isWeekend) {
                    daily[day] = {
                      qty: 0,
                      hours: 0,
                      regular_hours: 0,
                      overtime_hours: 0,
                      hourly_rate: parseFloat(item.hourly_rate || item.billing_rate || "22"),
                      overtime_hourly_rate: parseFloat(item.hourly_rate || "22") * 1.5,
                      cost: 0,
                      attendance: "休息",
                      people: 0
                    };
                  } else {
                    const dailyHours = parseFloat((total_hours / numWeekdays).toFixed(1));
                    const dailyCost = Math.round(total_cost / numWeekdays);
                    const dailyQty = Math.round(total_qty / numWeekdays);
                    
                    daily[day] = {
                      qty: dailyQty,
                      hours: dailyHours,
                      regular_hours: dailyHours > 8 ? 8 : dailyHours,
                      overtime_hours: dailyHours > 8 ? dailyHours - 8 : 0,
                      hourly_rate: parseFloat(item.hourly_rate || item.billing_rate || "22"),
                      overtime_hourly_rate: parseFloat(item.hourly_rate || "22") * 1.5,
                      cost: dailyCost,
                      attendance: "正常",
                      people: 1
                    };
                  }
                });
                
                return {
                  id: item.id || `real-${scope}-${index}`,
                  user_id: item.id || `real-${scope}-${index}`,
                  employee_name,
                  department_1,
                  department_2,
                  dept: department_2,
                  name: employee_name,
                  total_hours,
                  total_cost,
                  total_qty,
                  attendance_days,
                  daily
                };
              });

              // Apply front-end department and keyword filtering
              let filteredRows = rows;
              if (selectedDept !== "全部部门") {
                filteredRows = filteredRows.filter(r => r.department_2 === selectedDept || r.dept === selectedDept || r.department_1 === selectedDept);
              }
              const kw = keyword.toLowerCase().trim();
              if (kw) {
                filteredRows = filteredRows.filter(r => 
                  r.employee_name.toLowerCase().includes(kw) || 
                  r.department_1.toLowerCase().includes(kw) || 
                  r.department_2.toLowerCase().includes(kw)
                );
              }

              const availableDepts = Array.from(new Set(rows.map(r => r.department_2 || r.dept)));
              setDeptOptions(["全部部门", ...availableDepts]);

              const summary = { total_hours: 0, total_cost: 0, total_people: 0, total_qty: 0 };
              filteredRows.forEach(r => {
                summary.total_hours += r.total_hours || 0;
                summary.total_cost += r.total_cost || 0;
                summary.total_qty += r.total_qty || 0;
                summary.total_people += r.attendance_days || 0;
              });

              setDynamicMatrix({
                days: rawDays,
                rows: filteredRows,
                summary
              });
            }
          } catch (error) {
            console.error("Failed to load real monthly check matrix:", error);
          } finally {
            if (active) setLoading(false);
          }
        };
        fetchRealData();
        return () => { active = false; };
      } else {
        // DEMO/MOCK MODE
        const timer = setTimeout(() => {
          const result = getMockMonthlyCheckData(apiScope, selectedMonth, selectedDept, keyword);
          setDynamicMatrix({
            days: result.days,
            rows: result.rows,
            summary: result.summary
          });
          setDeptOptions(["全部部门", ...result.departments]);
          setLoading(false);
        }, 250);
        return () => clearTimeout(timer);
      }
    } else {
      // Use real data passed down from production API / App.tsx
      let filteredRows = initialData.rows || [];
      if (selectedDept !== "全部部门") {
        filteredRows = filteredRows.filter(r => r.name.includes(selectedDept) || r.dept?.includes(selectedDept));
      }
      
      const kw = keyword.toLowerCase().trim();
      if (kw) {
        filteredRows = filteredRows.filter(r => r.name.toLowerCase().includes(kw));
      }

      setDynamicMatrix({
        days: initialData.days || [],
        rows: filteredRows,
        summary: initialData.summary || {}
      });
      setDeptOptions(["全部部门", "学生餐一车间", "学生餐二车间", "方便菜加工部", "净菜生产线", "面点面食车间", "冷链物流配送部", "品质检验中心"]);
    }
  }, [scope, selectedMonth, selectedDept, keyword, initialData, isDemo, token]);

  // Determine cell color based on values (heatmap style)
  const getCellBg = (val: number, type: ViewMode) => {
    if (!val || val === 0) return "bg-slate-50 text-slate-300";
    
    if (type === "hours") {
      if (val < 4) return "bg-emerald-50 text-emerald-600";
      if (val <= 8) return "bg-emerald-100 text-emerald-800 font-semibold";
      if (val <= 10) return "bg-amber-100 text-amber-800 font-semibold";
      return "bg-rose-100 text-rose-800 font-bold border border-rose-200";
    }
    
    if (type === "cost") {
      if (val < 150) return "bg-blue-50 text-blue-600";
      if (val <= 300) return "bg-blue-100 text-blue-800";
      if (val <= 500) return "bg-indigo-100 text-indigo-900 font-semibold";
      return "bg-purple-100 text-purple-900 font-bold";
    }

    if (type === "qty") {
      if (val < 150) return "bg-teal-50 text-teal-600";
      if (val <= 250) return "bg-teal-100 text-teal-800";
      return "bg-teal-200 text-teal-900 font-bold";
    }

    return "bg-emerald-100 text-emerald-800 font-semibold";
  };

  const getCellLabel = (row: MatrixRow, day: string) => {
    const daily = row.daily[day];
    if (!daily) return "-";
    
    if (viewMode === "hours") return daily.hours !== undefined ? `${daily.hours}h` : "-";
    if (viewMode === "cost") return daily.cost !== undefined ? `¥${daily.cost}` : "-";
    if (viewMode === "qty") return daily.qty !== undefined ? `${daily.qty}箱` : "-";
    if (viewMode === "people") return daily.people !== undefined ? `${daily.people}人` : "-";
    return "-";
  };

  const getRowTotalLabel = (row: MatrixRow) => {
    if (viewMode === "hours") return `${row.total_hours || 0}h`;
    if (viewMode === "cost") return `¥${(row.total_cost || 0).toLocaleString()}`;
    if (viewMode === "qty") return `${(row.total_qty || 0).toLocaleString()}箱`;
    if (viewMode === "people") return `${row.total_people || 0}人天`;
    return "-";
  };

  // Process data for Recharts Trend Curve
  const trendChartData = dynamicMatrix.days.map((day) => {
    let total = 0;
    let normal = 0;
    let overtime = 0;

    dynamicMatrix.rows.forEach((row) => {
      const daily = row.daily[day] || {};
      const val = viewMode === "hours"
        ? (daily.hours || 0)
        : viewMode === "cost"
        ? (daily.cost || 0)
        : viewMode === "qty"
        ? (daily.qty || 0)
        : (daily.people || 0);
      
      total += val;
      if (viewMode === "hours") {
        normal += Math.round(val * 0.85);
        overtime += Math.round(val * 0.15);
      }
    });

    return {
      day: String(day).split("-")[2] + "日",
      total,
      normal,
      overtime
    };
  });

  // Process data for Recharts Pie Chart
  const pieChartData = dynamicMatrix.rows.map((row) => {
    let totalVal = 0;
    dynamicMatrix.days.forEach((day) => {
      const daily = row.daily[day] || {};
      const val = viewMode === "hours"
        ? (daily.hours || 0)
        : viewMode === "cost"
        ? (daily.cost || 0)
        : viewMode === "qty"
        ? (daily.qty || 0)
        : (daily.people || 0);
      totalVal += val;
    });

    return {
      name: row.name.replace("  └ ", "").trim(),
      value: totalVal
    };
  }).filter((item) => item.value > 0);

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* 1. Monthly Filter + Search + Department Selection */}
      <div className={`bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between ${
        isFoldable ? "p-3 gap-2.5" : "p-4 gap-4"
      }`}>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* YYYY-MM Month Selector (Crucial core requirement!) */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs text-slate-600">
            <Calendar size={13} className="text-orange-500 font-bold" />
            <span className="font-bold">核算月份:</span>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-bold font-mono outline-none cursor-pointer pr-1"
            >
              {monthOptions.map(m => (
                <option key={m} value={m}>{m} ({parseInt(m.split("-")[1])}月核算)</option>
              ))}
            </select>
          </div>

          {/* Keyword Query Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索班组或人员姓名..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-lg text-xs text-slate-700 outline-none transition-all w-44"
            />
          </div>

          {/* Department Selection Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs text-slate-600">
            <Filter size={11} className="text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent border-none font-medium text-slate-700 outline-none cursor-pointer pr-1 text-xs"
            >
              {deptOptions.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Scope-dependent view toggle */}
          {["baimao", "campus", "convenience", "third_party"].includes(scope) && (
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/60">
              {scope === "baimao" && (
                <>
                  <button
                    onClick={() => setViewMode("qty")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "qty" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    清洗件数
                  </button>
                  <button
                    onClick={() => setViewMode("cost")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "cost" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    结算成本
                  </button>
                </>
              )}
              {scope === "campus" && (
                <>
                  <button
                    onClick={() => setViewMode("people")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "people" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    出勤人数
                  </button>
                  <button
                    onClick={() => setViewMode("cost")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "cost" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    劳务费用
                  </button>
                </>
              )}
              {scope === "convenience" && (
                <>
                  <button
                    onClick={() => setViewMode("hours")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "hours" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    加工工时
                  </button>
                  <button
                    onClick={() => setViewMode("cost")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "cost" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    核算成本
                  </button>
                  <button
                    onClick={() => setViewMode("people")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "people" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    出勤人数
                  </button>
                </>
              )}
              {scope === "third_party" && (
                <>
                  <button
                    onClick={() => setViewMode("hours")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "hours" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    派遣工时
                  </button>
                  <button
                    onClick={() => setViewMode("cost")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "cost" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    派遣费用
                  </button>
                  <button
                    onClick={() => setViewMode("people")}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "people" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    在岗人数
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Legend color code labels */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold self-end md:self-auto">
          <span>色阶:</span>
          <div className="flex items-center gap-0.5">
            <span className="w-2 h-2 rounded bg-slate-100 inline-block border border-slate-200" />
            <span>无/休</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="w-2 h-2 rounded bg-emerald-100 inline-block" />
            <span>正常</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="w-2 h-2 rounded bg-amber-100 inline-block" />
            <span>偏高</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="w-2 h-2 rounded bg-rose-100 inline-block border border-rose-200" />
            <span>超负荷</span>
          </div>
        </div>
      </div>

      {/* 2. Analytical Trends & Proportion Structure Charts */}
      {!loading && dynamicMatrix.rows.length > 0 && (
        <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "lg:grid-cols-12 gap-5"}`}>
          {/* Trend Line (65% width on tablet/desktop) */}
          <div className={`${isFoldable ? "" : "lg:col-span-8"} bg-white rounded-xl border border-slate-200 p-4 shadow-xs`}>
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
              <TrendingUp size={14} className="text-orange-500" />
              {selectedMonth} 每日趋势波动分析 ({viewMode === "hours" ? "核定工时" : viewMode === "cost" ? "生产费用" : viewMode === "qty" ? "折算箱数" : "出勤人天"})
            </span>
            <div style={{ height: isFoldable ? 150 : 210, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  {viewMode === "hours" ? (
                    <>
                      <Area name="正班工时" type="monotone" dataKey="normal" stroke="#10b981" fillOpacity={0} strokeWidth={1.5} />
                      <Area name="加班工时" type="monotone" dataKey="overtime" stroke="#ef4444" fillOpacity={0} strokeWidth={1.5} />
                      <Area name="总工时" type="monotone" dataKey="total" stroke="#f97316" fill="url(#colorTotal)" strokeWidth={2} />
                    </>
                  ) : (
                    <Area name={viewMode === "cost" ? "归集成本" : viewMode === "qty" ? "箱量" : "在岗人天"} type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={0.05} strokeWidth={2} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart (35% width on tablet/desktop) */}
          <div className={`${isFoldable ? "" : "lg:col-span-4"} bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between`}>
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
              <LucidePieIcon size={14} className="text-orange-500" />
              组织/班组结构占比统计
            </span>
            <div className="flex-1 flex items-center justify-center relative my-1" style={{ height: isFoldable ? 140 : 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isFoldable ? 35 : 45}
                    outerRadius={isFoldable ? 50 : 60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[8px] text-slate-400 font-bold uppercase">合计</span>
                <span className="text-[11px] font-bold text-slate-800 font-mono mt-0.5">
                  {viewMode === "cost"
                    ? `¥${pieChartData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}`
                    : `${pieChartData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}${viewMode === "hours" ? "h" : viewMode === "qty" ? "箱" : "人"}`}
                </span>
              </div>
            </div>
            
            {/* Legend layout */}
            <div className="grid grid-cols-2 gap-1.5 max-h-[52px] overflow-y-auto touch-scroll pr-1">
              {pieChartData.slice(0, 6).map((item, idx) => (
                <div key={item.name} className="flex items-center gap-1 text-[9px] text-slate-500 font-medium truncate">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                  <span className="truncate flex-1">{item.name}</span>
                  <span className="font-mono text-slate-400 text-[8px]">({Math.round((item.value / pieChartData.reduce((a, b) => a + b.value, 0)) * 100) || 0}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center border border-orange-200 animate-spin text-orange-600 font-bold text-sm">
              ↻
            </div>
            <span className="text-xs text-slate-400 mt-2">载入核算月份矩阵中...</span>
          </div>
        ) : (
          <div className="overflow-x-auto matrix-scroll relative w-full">
            <table className="w-full border-collapse table-fixed min-w-[1300px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[9px] font-bold uppercase">
                  {/* Narrowed Roster first column */}
                  <th className="sticky left-0 bg-slate-50 w-[110px] text-left px-3 py-3 border-r border-slate-200 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    组织 / 车间班组
                  </th>
                  {dynamicMatrix.days.map((day) => {
                    const dateObj = new Date(day);
                    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                    return (
                      <th
                        key={day}
                        className={`text-center py-2 border-r border-slate-200/50 ${
                          isWeekend ? "bg-rose-50/20 text-rose-500" : ""
                        }`}
                      >
                        <div>{String(day).split("-")[2]}</div>
                        <div className="text-[8px] font-normal text-slate-400 mt-0.5">
                          {["日", "一", "二", "三", "四", "五", "六"][dateObj.getDay()]}
                        </div>
                      </th>
                    );
                  })}
                  <th className="w-[85px] text-center bg-slate-50 border-l border-slate-200 sticky right-0 z-10 shadow-[-2px_0_5px_rgba(0,0,0,0.02)]">
                    累计汇总
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-[10px]">
                {dynamicMatrix.rows.length === 0 ? (
                  <tr>
                    <td colSpan={dynamicMatrix.days.length + 2} className="text-center py-12 text-slate-400 text-xs">
                      无对应核算周期的矩阵数据记录。
                    </td>
                  </tr>
                ) : (
                  dynamicMatrix.rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="sticky left-0 bg-white font-bold text-slate-800 px-3 py-2 border-r border-slate-200 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)] truncate max-w-[110px]" title={row.name}>
                        <div className="truncate text-slate-900 leading-tight">{row.name}</div>
                        <div className="text-[8px] text-slate-400 font-normal mt-0.5 truncate">
                          {scope === "campus" && row.department_1 ? `${row.department_1} · ${row.department_2 || row.dept}` : (row.dept || "核心生产")}
                        </div>
                      </td>

                      {dynamicMatrix.days.map((day) => {
                        const val =
                          viewMode === "hours"
                            ? row.daily[day]?.hours
                            : viewMode === "cost"
                            ? row.daily[day]?.cost
                            : viewMode === "qty"
                            ? row.daily[day]?.qty
                            : row.daily[day]?.people;

                        const cellClass = getCellBg(val || 0, viewMode);
                        return (
                          <td
                            key={day}
                            className={`py-1 px-0.5 border-r border-slate-100/40 text-center font-mono text-[9px] select-none transition-all ${cellClass}`}
                          >
                            {getCellLabel(row, day)}
                          </td>
                        );
                      })}

                      <td className="text-center font-bold text-slate-800 bg-slate-50/40 border-l border-slate-200 sticky right-0 z-10 shadow-[-2px_0_5px_rgba(0,0,0,0.02)] font-mono">
                        {getRowTotalLabel(row)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Monthly Summary Cards */}
      {dynamicMatrix.summary && (
        <div className={`grid grid-cols-2 lg:grid-cols-4 ${isFoldable ? "gap-2" : "gap-4"}`}>
          {dynamicMatrix.summary.total_hours !== undefined && (
            <div className={`bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between ${
              isFoldable ? "p-2" : "p-3.5"
            }`}>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase">月度累计总工时</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{(dynamicMatrix.summary.total_hours).toLocaleString()}h</span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Clock size={13} />
              </div>
            </div>
          )}
          {dynamicMatrix.summary.total_cost !== undefined && (
            <div className={`bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between ${
              isFoldable ? "p-2" : "p-3.5"
            }`}>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase">月度累计核算成本</span>
                <span className="text-xs font-bold text-orange-600 font-mono">¥{(dynamicMatrix.summary.total_cost).toLocaleString()}</span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <DollarSign size={13} />
              </div>
            </div>
          )}
          {dynamicMatrix.summary.total_qty !== undefined && dynamicMatrix.summary.total_qty > 0 && (
            <div className={`bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between ${
              isFoldable ? "p-2" : "p-3.5"
            }`}>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase">月度累计加工量</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{(dynamicMatrix.summary.total_qty).toLocaleString()} 箱</span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                <Layers size={13} />
              </div>
            </div>
          )}
          {dynamicMatrix.summary.total_people !== undefined && dynamicMatrix.summary.total_people > 0 && (
            <div className={`bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between ${
              isFoldable ? "p-2" : "p-3.5"
            }`}>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase">核定在岗人次</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{(dynamicMatrix.summary.total_people)} 人天</span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Clock size={13} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
