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
  
  // Set default initial month using the date passed from props or current year-month
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (selectedDate && selectedDate.includes("-")) {
      return selectedDate.substring(0, 7);
    }
    return new Date().toISOString().slice(0, 7);
  });

  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";
  
  const [dynamicMatrix, setDynamicMatrix] = useState<MatrixData>(initialData);
  const [deptOptions, setDeptOptions] = useState<string[]>(["全部部门"]);
  const [loading, setLoading] = useState(false);

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
            const deptParam = selectedDept === "全部部门" ? "" : selectedDept;
            const url = `/api/plugins/hr/monthly-check/${apiScope}?month=${selectedMonth}&department=${encodeURIComponent(deptParam)}&keyword=${encodeURIComponent(keyword)}`;
            
            const res = await fetch(url, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });
            if (res.ok && active) {
              const resJson = await res.json();
              
              // Direct extraction from server response fields
              const rawDays = resJson.days || (resJson.data && resJson.data.days) || getDaysForMonth(selectedMonth);
              const rowsData = resJson.rows || (resJson.data && resJson.data.rows) || resJson.data || [];
              const serverSummary = resJson.summary || (resJson.data && resJson.data.summary) || {};
              const serverDepts = resJson.departments || (resJson.data && resJson.data.departments) || [];

              const rows: MatrixRow[] = rowsData.map((item: any, index: number) => {
                const name = item.name || item.employee_name || item.student_name || item.line_name || item.vendor_name || "未知";
                const employee_name = item.employee_name || name;
                const dept = item.department_2 || item.dept || item.department || item.school || item.line_name || item.vendor_name || "核心生产";
                const department_1 = item.department_1 || item.school || item.vendor_name || "核心生产";
                const department_2 = item.department_2 || item.work_type || item.line_name || dept;
                
                // Read from the server's real daily mapping directly to prevent manual averages
                const daily: { [key: string]: any } = {};
                
                rawDays.forEach((day: string) => {
                  const dVal = item.daily ? item.daily[day] : null;
                  if (dVal) {
                    daily[day] = {
                      qty: dVal.qty !== undefined ? dVal.qty : 0,
                      hours: dVal.hours !== undefined ? dVal.hours : 0,
                      regular_hours: dVal.regular_hours !== undefined ? dVal.regular_hours : 0,
                      overtime_hours: dVal.overtime_hours !== undefined ? dVal.overtime_hours : 0,
                      hourly_rate: dVal.hourly_rate !== undefined ? dVal.hourly_rate : (item.hourly_rate || item.billing_rate || 22),
                      overtime_hourly_rate: dVal.overtime_hourly_rate !== undefined ? dVal.overtime_hourly_rate : (item.hourly_rate || 22) * 1.5,
                      cost: dVal.cost !== undefined ? dVal.cost : 0,
                      attendance: dVal.attendance !== undefined ? dVal.attendance : "正常",
                      people: dVal.people !== undefined ? dVal.people : 1,
                      is_fallback_rate: dVal.is_fallback_rate || false,
                    };
                  } else {
                    daily[day] = {
                      qty: 0,
                      hours: 0,
                      regular_hours: 0,
                      overtime_hours: 0,
                      hourly_rate: item.hourly_rate || item.billing_rate || 22,
                      overtime_hourly_rate: (item.hourly_rate || 22) * 1.5,
                      cost: 0,
                      attendance: "休息",
                      people: 0,
                      is_fallback_rate: false
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
                  total_hours: parseFloat(item.total_hours || item.audited_hours || item.standard_hours || "0"),
                  total_cost: parseFloat(item.total_cost || item.net_cost || item.total_amount || item.salary || "0"),
                  total_qty: parseFloat(item.total_qty || item.qty || item.output_qty || "0"),
                  attendance_days: parseFloat(item.attendance_days || item.dispatched_headcount || "0"),
                  fallback_rate_cells: item.fallback_rate_cells || [],
                  daily
                };
              });

              // Apply front-end department and keyword filtering (just in case)
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

              // Update department options dynamically from server departments list
              const availableDepts = serverDepts.length > 0 ? serverDepts : Array.from(new Set(rows.map(r => r.department_2 || r.dept)));
              setDeptOptions(["全部部门", ...availableDepts]);

              // Calculate of summary based on active view filtering (with server fallbacks)
              const hasFrontendFilter = selectedDept !== "全部部门" || keyword.trim() !== "";
              const summary = {
                total_hours: (hasFrontendFilter || serverSummary.total_hours === undefined) ? filteredRows.reduce((acc, r) => acc + (r.total_hours || 0), 0) : serverSummary.total_hours,
                total_cost: (hasFrontendFilter || serverSummary.total_cost === undefined) ? filteredRows.reduce((acc, r) => acc + (r.total_cost || 0), 0) : serverSummary.total_cost,
                total_qty: (hasFrontendFilter || serverSummary.total_qty === undefined) ? filteredRows.reduce((acc, r) => acc + (r.total_qty || 0), 0) : serverSummary.total_qty,
                total_people: (hasFrontendFilter || serverSummary.total_people === undefined) ? filteredRows.reduce((acc, r) => acc + (r.attendance_days || 0), 0) : serverSummary.total_people
              };

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
        // DEMO/MOCK MODE (Directly uses mockData functions that construct proper daily structures)
        const timer = setTimeout(() => {
          const result = getMockMonthlyCheckData(apiScope, selectedMonth, selectedDept, keyword);
          setDynamicMatrix({
            days: result.days,
            rows: result.rows,
            summary: result.summary
          });
          setDeptOptions(["全部部门", ...result.departments]);
          setLoading(false);
        }, 200);
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

      // Extract unique departments dynamically from initialData.rows
      const parentDepts = (initialData.rows || [])
        .filter(r => !r.parent_id && !r.name.includes("└"))
        .map(r => r.name.trim());
      
      const extractedDepts = parentDepts.length > 0 
        ? parentDepts 
        : Array.from(new Set((initialData.rows || []).map(r => r.dept || r.name).filter(Boolean)));
      
      const uniqueDepts = Array.from(new Set(extractedDepts)).sort();

      // Recalculate summary if there is active frontend filtering
      const hasFrontendFilter = selectedDept !== "全部部门" || keyword.trim() !== "";
      const baseSummary = initialData.summary || {};
      const summary = {
        total_hours: (hasFrontendFilter || baseSummary.total_hours === undefined) ? filteredRows.reduce((acc, r) => acc + (r.total_hours || 0), 0) : baseSummary.total_hours,
        total_cost: (hasFrontendFilter || baseSummary.total_cost === undefined) ? filteredRows.reduce((acc, r) => acc + (r.total_cost || 0), 0) : baseSummary.total_cost,
        total_qty: (hasFrontendFilter || baseSummary.total_qty === undefined) ? filteredRows.reduce((acc, r) => acc + (r.total_qty || 0), 0) : baseSummary.total_qty,
        total_people: (hasFrontendFilter || baseSummary.total_people === undefined) ? filteredRows.reduce((acc, r) => acc + (r.attendance_days || r.total_people || 0), 0) : baseSummary.total_people
      };

      setDynamicMatrix({
        days: initialData.days || [],
        rows: filteredRows,
        summary
      });
      setDeptOptions(["全部部门", ...uniqueDepts]);
    }
  }, [scope, selectedMonth, selectedDept, keyword, initialData, isDemo, token]);

  // Determine cell color based on values (heatmap style)
  const getCellBg = (val: number, type: ViewMode, isFallback?: boolean) => {
    if (isFallback) {
      return "bg-amber-50 text-amber-900 border border-amber-300/60";
    }
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

  const formatCost = (val: number) => {
    if (val >= 10000) return `¥${(val/10000).toFixed(1)}万`;
    return `¥${Math.round(val).toLocaleString()}`;
  };

  // Get dynamic combined cell layouts for enhanced double density visualization
  const getCellLabel = (row: MatrixRow, day: string) => {
    const daily = row.daily[day];
    if (!daily) return <div className="text-slate-300">-</div>;

    // Common values
    const qty = daily.qty || 0;
    const cost = daily.cost || 0;
    const hours = daily.hours || 0;
    const people = daily.people || 0;

    if (qty === 0 && cost === 0 && hours === 0 && people === 0) {
      return <div className="text-slate-300">-</div>;
    }

    if (scope === "work_matrix") {
      const peopleCount = people > 0 ? people : 1;
      const deviation = hours - peopleCount * 8;
      const isDevPositive = deviation > 0;
      const devText = deviation === 0 ? "" : (isDevPositive ? `+${deviation.toFixed(1)}h` : `${deviation.toFixed(1)}h`);
      const devColor = deviation === 0 ? "" : (isDevPositive ? "text-rose-500" : "text-emerald-500");
      
      return (
        <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
          <span className="font-bold">{hours}h</span>
          <span className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1">
            <span>{people}人</span>
            {deviation !== 0 && <span className={devColor}>{devText}</span>}
          </span>
        </div>
      );
    }
    
    if (scope === "student_meal_cost") {
      return (
        <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
          <span className="font-bold">¥{cost}</span>
          <span className="text-[9px] text-slate-400 mt-0.5">
            {hours}h / {people}人
          </span>
        </div>
      );
    }

    if (scope === "total_cost_matrix") {
      return (
        <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
          <span className="font-bold">¥{cost}</span>
          <span className="text-[9px] text-slate-400 mt-0.5">
            {people}人
          </span>
        </div>
      );
    }

    if (scope === "baimao") {
      return (
        <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
          <span className="font-bold">{qty}件</span>
          <span className="text-[9px] text-slate-400 mt-0.5">¥{cost}</span>
        </div>
      );
    }

    if (scope === "campus") {
      return (
        <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
          <span className="font-bold">{hours}h / {people}人</span>
          <span className="text-[9px] text-slate-400 mt-0.5">¥{cost}</span>
        </div>
      );
    }

    if (scope === "convenience" || scope === "third_party") {
      return (
        <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
          <span className="font-bold">{hours}h</span>
          <span className="text-[9px] text-slate-400 mt-0.5">¥{cost} / {people}人</span>
        </div>
      );
    }

    return <div className="text-slate-300">-</div>;
  };

  const getRowTotalLabel = (row: MatrixRow) => {
    if (scope === "work_matrix") {
      return (
        <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
          <span className="font-bold text-slate-800">{Math.round(row.total_hours || 0)}h</span>
          <span className="text-[9px] text-slate-500 mt-0.5">{(row.attendance_days || row.total_people || 0)}人</span>
        </div>
      );
    }

    if (scope === "student_meal_cost" || scope === "total_cost_matrix") {
      return (
        <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
          <span className="font-bold text-slate-800">{formatCost(row.total_cost || 0)}</span>
          <span className="text-[9px] text-slate-500 mt-0.5">{(row.attendance_days || row.total_people || 0)}人</span>
        </div>
      );
    }

    if (scope === "baimao") {
      return (
        <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
          <span className="font-bold text-slate-800">{Math.round(row.total_qty || 0)}件</span>
          <span className="text-[9px] text-slate-500 mt-0.5">{formatCost(row.total_cost || 0)}</span>
        </div>
      );
    }
    
    if (scope === "campus") {
      return (
        <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
          <span className="font-bold text-slate-800">{Math.round(row.total_hours || 0)}h</span>
          <span className="text-[9px] text-slate-500 mt-0.5">{formatCost(row.total_cost || 0)}</span>
        </div>
      );
    }
    
    if (scope === "convenience" || scope === "third_party") {
      return (
        <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
          <span className="font-bold text-slate-800">{Math.round(row.total_hours || 0)}h</span>
          <span className="text-[9px] text-slate-500 mt-0.5">{formatCost(row.total_cost || 0)}</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-0.5 leading-tight">
        <span className="font-bold text-slate-800">{Math.round(row.total_hours || 0)}h</span>
        <span className="text-[9px] text-slate-500 mt-0.5">{formatCost(row.total_cost || 0)}</span>
      </div>
    );
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

  // Compute daily sum row totals (parent rows only to prevent double counting)
  const getDailySum = (day: string) => {
    let sum = 0;
    const parentRows = dynamicMatrix.rows.filter(row => !row.parent_id && !row.name.includes("└"));
    parentRows.forEach(row => {
      const dVal = row.daily[day];
      if (dVal) {
        if (viewMode === "hours") {
          sum += parseFloat(dVal.hours || 0);
        } else if (viewMode === "cost") {
          sum += parseFloat(dVal.cost || 0);
        } else if (viewMode === "qty") {
          sum += parseFloat(dVal.qty || 0);
        } else if (viewMode === "people") {
          sum += parseFloat(dVal.people || 0);
        }
      }
    });
    return sum;
  };

  // Grand total for daily sums (parent rows only to prevent double counting)
  const getGrandTotal = () => {
    let sum = 0;
    const parentRows = dynamicMatrix.rows.filter(row => !row.parent_id && !row.name.includes("└"));
    parentRows.forEach(row => {
      if (viewMode === "hours") sum += parseFloat(row.total_hours || 0);
      else if (viewMode === "cost") sum += parseFloat(row.total_cost || 0);
      else if (viewMode === "qty") sum += parseFloat(row.total_qty || 0);
      else if (viewMode === "people") sum += parseFloat(row.attendance_days || row.total_people || 0);
    });
    return sum;
  };

  // Render KBI Cards dynamically according to scope and specifications (recalculated dynamically)
  const renderKbiCards = () => {
    const hasFilter = selectedDept !== "全部部门" || keyword.trim() !== "";
    const summary = dynamicMatrix.summary || {};
    
    // Filter parent rows to prevent double counting
    const activeRows = dynamicMatrix.rows.filter(r => !r.parent_id && !r.name.includes("└"));
    const activeCount = activeRows.length;

    const totalHours = (hasFilter || summary.total_hours === undefined) ? activeRows.reduce((acc, r) => acc + (r.total_hours || 0), 0) : summary.total_hours;
    const totalCost = (hasFilter || summary.total_cost === undefined) ? activeRows.reduce((acc, r) => acc + (r.total_cost || 0), 0) : summary.total_cost;
    const totalQty = (hasFilter || summary.total_qty === undefined) ? activeRows.reduce((acc, r) => acc + (r.total_qty || 0), 0) : summary.total_qty;
    const totalPeople = (hasFilter || summary.total_people === undefined) ? activeRows.reduce((acc, r) => acc + (r.attendance_days || r.total_people || 0), 0) : summary.total_people;

    let cards: Array<{ label: string, value: string | number, color: string, icon: any }> = [];

    if (scope === "baimao") {
      cards = [
        { label: "矩阵周期", value: selectedMonth, color: "bg-orange-50 text-orange-600 border-orange-200", icon: Calendar },
        { label: "计费项目", value: `${activeCount} 个`, color: "bg-blue-50 text-blue-600 border-blue-200", icon: Filter },
        { label: "累计数量", value: `${Math.round(totalQty).toLocaleString()} 箱`, color: "bg-teal-50 text-teal-600 border-teal-200", icon: Layers },
        { label: "清洗成本", value: `¥${Math.round(totalCost).toLocaleString()}`, color: "bg-indigo-50 text-indigo-600 border-indigo-200", icon: DollarSign }
      ];
    } else if (scope === "campus") {
      cards = [
        { label: "矩阵周期", value: selectedMonth, color: "bg-orange-50 text-orange-600 border-orange-200", icon: Calendar },
        { label: "兼职人数", value: `${Math.round(totalPeople || activeCount)} 人`, color: "bg-blue-50 text-blue-600 border-blue-200", icon: Filter },
        { label: "累计工时", value: `${Math.round(totalHours).toLocaleString()} h`, color: "bg-teal-50 text-teal-600 border-teal-200", icon: Clock },
        { label: "人工成本", value: `¥${Math.round(totalCost).toLocaleString()}`, color: "bg-indigo-50 text-indigo-600 border-indigo-200", icon: DollarSign }
      ];
    } else if (scope === "convenience") {
      cards = [
        { label: "矩阵周期", value: selectedMonth, color: "bg-orange-50 text-orange-600 border-orange-200", icon: Calendar },
        { label: "核对人数", value: `${Math.round(totalPeople || activeCount)} 人`, color: "bg-blue-50 text-blue-600 border-blue-200", icon: Filter },
        { label: "累计工时", value: `${Math.round(totalHours).toLocaleString()} h`, color: "bg-teal-50 text-teal-600 border-teal-200", icon: Clock },
        { label: "人工成本", value: `¥${Math.round(totalCost).toLocaleString()}`, color: "bg-indigo-50 text-indigo-600 border-indigo-200", icon: DollarSign }
      ];
    } else if (scope === "third_party") {
      cards = [
        { label: "矩阵周期", value: selectedMonth, color: "bg-orange-50 text-orange-600 border-orange-200", icon: Calendar },
        { label: "核对人数", value: `${Math.round(totalPeople || activeCount)} 人`, color: "bg-blue-50 text-blue-600 border-blue-200", icon: Filter },
        { label: "累计工时", value: `${Math.round(totalHours).toLocaleString()} h`, color: "bg-teal-50 text-teal-600 border-teal-200", icon: Clock },
        { label: "人工成本", value: `¥${Math.round(totalCost).toLocaleString()}`, color: "bg-indigo-50 text-indigo-600 border-indigo-200", icon: DollarSign }
      ];
    } else if (scope === "work_matrix") {
      const avgHours = activeCount > 0 ? (totalHours / activeCount).toFixed(1) : "0";
      cards = [
        { label: "矩阵周期", value: dynamicMatrix.days.length > 0 ? `${dynamicMatrix.days[0]} ~ ${dynamicMatrix.days[dynamicMatrix.days.length-1]}` : selectedDate, color: "bg-orange-50 text-orange-600 border-orange-200", icon: Calendar },
        { label: "核对人数", value: `${activeCount} 人`, color: "bg-blue-50 text-blue-600 border-blue-200", icon: Filter },
        { label: "确认工时", value: `${Math.round(totalHours).toLocaleString()} h`, color: "bg-teal-50 text-teal-600 border-teal-200", icon: Clock },
        { label: "人均工时", value: `${avgHours} h`, color: "bg-indigo-50 text-indigo-600 border-indigo-200", icon: HelpCircle }
      ];
    } else if (scope === "student_meal_cost") {
      const avgCost = activeCount > 0 ? Math.round(totalCost / activeCount) : 0;
      cards = [
        { label: "核算周期", value: dynamicMatrix.days.length > 0 ? `${dynamicMatrix.days[0]} ~ ${dynamicMatrix.days[dynamicMatrix.days.length-1]}` : selectedDate, color: "bg-orange-50 text-orange-600 border-orange-200", icon: Calendar },
        { label: "核算对象数", value: `${activeCount} 个`, color: "bg-blue-50 text-blue-600 border-blue-200", icon: Filter },
        { label: "核算总额", value: `¥${Math.round(totalCost).toLocaleString()}`, color: "bg-teal-50 text-teal-600 border-teal-200", icon: DollarSign },
        { label: "平均成本 / 对象", value: `¥${avgCost.toLocaleString()}`, color: "bg-indigo-50 text-indigo-600 border-indigo-200", icon: HelpCircle }
      ];
    } else {
      // total_cost_matrix (总成本矩阵)
      const avgCost = activeCount > 0 ? Math.round(totalCost / activeCount) : 0;
      cards = [
        { label: "核算周期", value: dynamicMatrix.days.length > 0 ? `${dynamicMatrix.days[0]} ~ ${dynamicMatrix.days[dynamicMatrix.days.length-1]}` : selectedDate, color: "bg-orange-50 text-orange-600 border-orange-200", icon: Calendar },
        { label: "成本构成数", value: `${activeCount} 项`, color: "bg-blue-50 text-blue-600 border-blue-200", icon: Filter },
        { label: "核定总成本", value: `¥${Math.round(totalCost).toLocaleString()}`, color: "bg-teal-50 text-teal-600 border-teal-200", icon: DollarSign },
        { label: "平均成本 / 项", value: `¥${avgCost.toLocaleString()}`, color: "bg-indigo-50 text-indigo-600 border-indigo-200", icon: HelpCircle }
      ];
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className={`bg-white border border-slate-200/80 rounded-xl flex items-center justify-between shadow-xs ${
              isFoldable ? "p-2.5" : "p-4"
            }`}>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">{c.label}</span>
                <span className="text-sm md:text-base font-bold text-slate-800 font-mono truncate block">{c.value || "0"}</span>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ml-2 ${c.color}`}>
                <Icon size={14} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* 1. Monthly Filter + Search + Department Selection */}
      <div className={`bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between ${
        isFoldable ? "p-3 gap-2.5" : "p-4 gap-4"
      }`}>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* YYYY-MM Month Selector (Native dynamic date month picker - prevents 2026/2027 hardcoding completely!) */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs text-slate-600">
            <Calendar size={13} className="text-orange-500 font-bold" />
            <span className="font-bold">核算月份:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-bold font-mono outline-none cursor-pointer pr-1 text-xs"
            />
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

      {/* 2. Top KBI Cards (Web aligned 4-Column Summary Cards) */}
      {!loading && renderKbiCards()}

      {/* 3. Analytical Trends & Proportion Structure Charts */}
      {!loading && dynamicMatrix.rows.length > 0 && (
        <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "lg:grid-cols-12 gap-5"}`}>
          {/* Trend Line */}
          <div className={`${isFoldable ? "" : "lg:col-span-8"} bg-white rounded-xl border border-slate-200 p-4 shadow-xs`}>
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
              <TrendingUp size={14} className="text-orange-500" />
              {selectedMonth} 每日趋势波动分析 ({viewMode === "hours" ? "核定工时" : viewMode === "cost" ? "归集成本" : viewMode === "qty" ? "折算箱数" : "出勤人数"})
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
                    <Area name={viewMode === "cost" ? "归集成本" : viewMode === "qty" ? "箱量" : "在岗人数"} type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={0.05} strokeWidth={2} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
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
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            {/* Minimalist Legend */}
            <div className="grid grid-cols-2 gap-1 px-1 mt-1 text-[9px] font-semibold text-slate-500">
              {pieChartData.slice(0, 4).map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                  <span className="truncate">{entry.name}:</span>
                  <span className="font-mono text-slate-700 font-bold shrink-0">{Math.round(entry.value).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Multi-Dimensional Density Interactive Attendance & Costs Matrix Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              工时与结算核对矩阵
              {loading && <span className="text-[10px] text-orange-500 animate-pulse font-normal">载入最新周期数据中...</span>}
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5 font-medium">多密度数据矩阵：各单元格双排组合展示，上排代表主业务值（如件数/工时），下排代表对应的核算金额。</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded text-slate-500 font-bold">
              对账单实时固化核准
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin cursor-wait">
              ↻
            </div>
            <span className="text-xs text-slate-400 mt-2">载入核算月份矩阵中...</span>
          </div>
        ) : (
          <div className="overflow-x-auto matrix-scroll relative w-full">
            <table className="w-full border-collapse table-fixed min-w-[1300px]">
              <thead>
                {/* 1st Header Row: Dates & Weekdays */}
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
                        style={{ minWidth: isFoldable ? 58 : 64, width: isFoldable ? 58 : 64 }}
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

                {/* 2nd Header Row: Web-aligned "按日汇总" (Daily sum totals) row */}
                {dynamicMatrix.rows.length > 0 && (
                  <tr className="bg-slate-100/60 border-b border-slate-200 text-[9px] font-bold text-slate-700">
                    <th className="sticky left-0 bg-slate-100 text-left px-3 py-2 border-r border-slate-200 z-10 font-bold shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                      按日汇总
                    </th>
                    {dynamicMatrix.days.map((day) => {
                      const sum = getDailySum(day);
                      return (
                        <th key={`sum-${day}`} style={{ minWidth: isFoldable ? 58 : 64, width: isFoldable ? 58 : 64 }} className="text-center py-1.5 border-r border-slate-200/50 font-mono text-[9px] text-slate-700">
                          {viewMode === "cost" ? formatCost(sum) : viewMode === "hours" ? `${sum.toFixed(1)}h` : viewMode === "people" ? `${Math.round(sum)}人` : `${Math.round(sum)}`}
                        </th>
                      );
                    })}
                    <th className="text-center bg-slate-100 border-l border-slate-200 sticky right-0 z-10 font-mono text-slate-800 shadow-[-2px_0_5px_rgba(0,0,0,0.02)]">
                      {viewMode === "cost" ? formatCost(getGrandTotal()) : viewMode === "hours" ? `${getGrandTotal().toFixed(1)}h` : viewMode === "people" ? `${Math.round(getGrandTotal())}人` : `${Math.round(getGrandTotal())}`}
                    </th>
                  </tr>
                )}
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
                        {(() => {
                          const isChild = row.name.includes("└") || !!row.parent_id;
                          const cleanName = row.name.replace(/^[ └]+/, "").trim();
                          return (
                            <div className="flex items-center gap-0.5 min-w-0">
                              {isChild && <span className="text-orange-500 font-mono text-[9px] shrink-0 font-extrabold">└</span>}
                              <div className="truncate text-slate-900 leading-tight font-extrabold">{cleanName}</div>
                            </div>
                          );
                        })()}
                        <div className="text-[8px] text-slate-400 font-normal mt-0.5 truncate">
                          {row.department_1 ? `${row.department_1} > ${row.department_2 || row.dept}` : (row.dept || "核心生产")}
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

                        const isFallback = row.daily[day]?.is_fallback_rate || (row.fallback_rate_cells && row.fallback_rate_cells.includes(day));
                        const cellClass = getCellBg(val || 0, viewMode, isFallback);

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
    </div>
  );
}
