import React, { useState } from "react";
import { MatrixData, MatrixRow } from "../types";
import { useDevice } from "../context/DeviceContext";
import { 
  Calendar, DollarSign, Filter, Users, UserCircle, Settings, X, Search, FileText,
  TrendingUp, PieChart as PieChartIcon
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function StudentMealCostSection({ initialData, selectedDate }: { initialData: MatrixData, selectedDate: string }) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (selectedDate && selectedDate.includes("-")) return selectedDate.substring(0, 7);
    return new Date().toISOString().slice(0, 7);
  });
  
  const [empType, setEmpType] = useState("all");
  const [costType, setCostType] = useState("all");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  // Derive dynamic values
  const totalCost = initialData.summary?.total_cost || 0;
  const activeCount = initialData.rows.length;
  const avgCost = activeCount > 0 ? totalCost / activeCount : 0;

  const trendData = initialData.days.map(day => {
    let dayTotal = 0;
    initialData.rows.forEach(row => {
      dayTotal += (row.daily[day]?.cost || 0);
    });
    return {
      date: day.split("-")[2] + "日",
      total: dayTotal
    };
  });

  const onCellClick = (row: MatrixRow, day: string) => {
    const dVal = row.daily[day] || {};
    if (!dVal.cost) return;
    
    setModalData({
      date: day,
      deptName: row.name,
      totalCost: dVal.cost,
      totalHours: dVal.hours || 0,
      unitCost: (dVal.cost / (dVal.hours || 1)).toFixed(1),
      regularHours: dVal.regular_hours || 0,
      overtimeCost: (dVal.overtime_hours || 0) * (dVal.overtime_hourly_rate || 33),
      fallbackCost: dVal.is_fallback_rate ? dVal.cost : 0,
      employees: [
        { name: "张强", type: "自有员工", hours: 8, reason: "正常", cost: 240 },
        { name: "李华", type: "小时工", hours: 10, reason: "加班", cost: 300 },
        { name: "王伟", type: "小时工", hours: 8, reason: "正常", cost: 176 },
      ]
    });
    setModalOpen(true);
  };

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* Filters */}
      <div className={`bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 ${isFoldable ? "p-3" : "p-4"}`}>
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs text-slate-600">
          <span className="font-bold">核算月份:</span>
          <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="bg-transparent border-none outline-none font-bold font-mono" />
        </div>
        
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs text-slate-600">
          <span className="font-bold">员工类型:</span>
          <select value={empType} onChange={e => setEmpType(e.target.value)} className="bg-transparent border-none outline-none font-bold">
            <option value="all">全部</option>
            <option value="own">自有员工</option>
            <option value="hourly">小时工</option>
            <option value="staff">职员</option>
          </select>
        </div>
        
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs text-slate-600">
          <span className="font-bold">成本类型:</span>
          <select value={costType} onChange={e => setCostType(e.target.value)} className="bg-transparent border-none outline-none font-bold">
            <option value="all">全部人工成本</option>
            <option value="normal">正常工时成本</option>
            <option value="overtime">加班/周末成本</option>
            <option value="fallback">兜底小时工成本</option>
          </select>
        </div>
      </div>

      {/* KBIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "核算周期", value: selectedMonth, icon: Calendar, color: "bg-orange-50 text-orange-600 border-orange-200" },
          { label: "核算对象数", value: `${activeCount} 个`, icon: Filter, color: "bg-blue-50 text-blue-600 border-blue-200" },
          { label: "核算总额", value: `¥${Math.round(totalCost).toLocaleString()}`, icon: DollarSign, color: "bg-teal-50 text-teal-600 border-teal-200" },
          { label: "平均成本 / 对象", value: `¥${Math.round(avgCost).toLocaleString()}`, icon: TrendingUp, color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
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

      {/* Trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <TrendingUp size={14} className="text-orange-500" /> 每日学生餐人工成本趋势
        </h3>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="mealCostGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
              <Area name="学生餐成本" type="monotone" dataKey="total" stroke="#3b82f6" fill="url(#mealCostGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col min-h-[400px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FileText size={14} className="text-orange-500"/>
            学生餐人工成本矩阵 (点击单元格查看人员穿透)
          </span>
        </div>
        <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg">
          <table className="w-full border-collapse table-fixed min-w-[1300px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[9px] font-bold">
                <th className="sticky left-0 bg-slate-50 w-[120px] text-left px-3 py-2 border-r border-slate-200 z-10">实际工作部门</th>
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
                      <td 
                        key={day} 
                        className={`text-center py-1.5 border-r border-slate-200/50 font-mono text-slate-600 ${c > 0 ? "cursor-pointer hover:bg-orange-50" : ""}`}
                        onClick={() => onCellClick(row, day)}
                      >
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

      {/* Drilldown Modal */}
      {modalOpen && modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-orange-500" />
                <h2 className="text-sm font-bold text-slate-800">
                  成本明细穿透: {modalData.deptName} ({modalData.date})
                </h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                  <div className="text-[10px] text-blue-600 font-bold mb-1">人工成本</div>
                  <div className="text-base font-bold font-mono text-blue-800">¥{modalData.totalCost}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                  <div className="text-[10px] text-emerald-600 font-bold mb-1">总工时</div>
                  <div className="text-base font-bold font-mono text-emerald-800">{modalData.totalHours}h</div>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                  <div className="text-[10px] text-amber-600 font-bold mb-1">单位工时成本</div>
                  <div className="text-base font-bold font-mono text-amber-800">¥{modalData.unitCost}/h</div>
                </div>
                <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg">
                  <div className="text-[10px] text-rose-600 font-bold mb-1">加班或周末成本</div>
                  <div className="text-base font-bold font-mono text-rose-800">¥{modalData.overtimeCost}</div>
                </div>
                <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg">
                  <div className="text-[10px] text-purple-600 font-bold mb-1">兜底小时工成本</div>
                  <div className="text-base font-bold font-mono text-purple-800">¥{modalData.fallbackCost}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-600 font-bold mb-1">8小时基准偏差</div>
                  <div className="text-base font-bold font-mono text-slate-800">
                    {(modalData.totalHours - 8).toFixed(1)}h
                  </div>
                </div>
              </div>

              {/* Personnel Detail List */}
              <h3 className="text-xs font-bold text-slate-800 mb-2 border-l-2 border-orange-500 pl-1.5">人员成本明细 Top 10</h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-2 font-bold">姓名</th>
                      <th className="p-2 font-bold">员工类型</th>
                      <th className="p-2 font-bold">工时</th>
                      <th className="p-2 font-bold">原因</th>
                      <th className="p-2 font-bold text-right">成本</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {modalData.employees.map((e: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-800">{e.name}</td>
                        <td className="p-2 text-slate-600">{e.type}</td>
                        <td className="p-2 font-mono text-slate-700">{e.hours}h</td>
                        <td className="p-2 text-slate-600">{e.reason}</td>
                        <td className="p-2 font-mono font-bold text-orange-600 text-right">¥{e.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
