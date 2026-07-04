import React, { useState } from "react";
import { SupportHoursData, SupportRecord } from "../types";
import { useDevice } from "../context/DeviceContext";
import { 
  Users, Clock, Building2, TrendingUp, Search, Calendar, Filter, FileSpreadsheet, ArrowRight
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie, Legend
} from "recharts";

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

export default function SupportSection({ data }: { data: SupportHoursData }) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";
  
  // Filters
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-30");
  const [supportDept, setSupportDept] = useState("全部");
  const [dispatchDept, setDispatchDept] = useState("全部");

  // Filter records
  const filteredRecords = data.records.filter(r => {
    if (supportDept !== "全部" && r.target_department !== supportDept) return false;
    if (dispatchDept !== "全部" && r.source_department !== dispatchDept) return false;
    return true;
  });

  // Calculate KBIs
  const totalHours = filteredRecords.reduce((sum, r) => sum + r.support_hours, 0);
  const totalCost = filteredRecords.reduce((sum, r) => sum + r.cost_saved, 0);
  const totalPeople = filteredRecords.reduce((sum, r) => sum + r.people_count, 0);
  const targetDepts = new Set(filteredRecords.map(r => r.target_department)).size;
  const avgHours = totalPeople > 0 ? (totalHours / totalPeople).toFixed(1) : 0;

  // Chart Data Preparation
  // 1. Top 10 Supported (Target) Depts
  const targetDeptMap: Record<string, number> = {};
  filteredRecords.forEach(r => {
    targetDeptMap[r.target_department] = (targetDeptMap[r.target_department] || 0) + r.support_hours;
  });
  const topTargetDepts = Object.entries(targetDeptMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, hours]) => ({ name, hours }));

  // 2. Dispatch Depts Pie
  const dispatchDeptMap: Record<string, number> = {};
  filteredRecords.forEach(r => {
    dispatchDeptMap[r.source_department] = (dispatchDeptMap[r.source_department] || 0) + r.support_hours;
  });
  const dispatchDepts = Object.entries(dispatchDeptMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, hours]) => ({ name, value: hours }));

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* Filters */}
      <div className={`bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 ${isFoldable ? "p-3" : "p-4"}`}>
        <div className="flex items-center gap-1.5 border border-slate-200 p-1 rounded-lg bg-slate-50">
          <button className="px-3 py-1 bg-white text-orange-600 font-bold text-[10px] rounded shadow-xs border border-orange-200">今日</button>
          <button className="px-3 py-1 text-slate-500 font-bold text-[10px] rounded hover:bg-slate-200 transition-colors">本周</button>
          <button className="px-3 py-1 text-slate-500 font-bold text-[10px] rounded hover:bg-slate-200 transition-colors">本月</button>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg outline-none font-mono" />
          <span>至</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg outline-none font-mono" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <span className="text-slate-500 font-bold">派出部门:</span>
            <select value={dispatchDept} onChange={e => setDispatchDept(e.target.value)} className="bg-transparent border-none outline-none font-bold text-slate-800">
              <option value="全部">全部</option>
              {data.filters.outgoingDepartments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <span className="text-slate-500 font-bold">支援部门:</span>
            <select value={supportDept} onChange={e => setSupportDept(e.target.value)} className="bg-transparent border-none outline-none font-bold text-slate-800">
              <option value="全部">全部</option>
              {data.filters.supportDepartments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg font-bold shadow-sm transition-all flex items-center gap-1.5">
            <Search size={14} /> 查询
          </button>
        </div>
      </div>

      {/* KBIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "总支援工时", value: `${totalHours} h`, icon: Clock, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "支援总成本", value: `¥${totalCost}`, icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
          { label: "支援总人次", value: `${totalPeople} 人次`, icon: Users, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100" },
          { label: "涉及支援部门", value: `${targetDepts} 个`, icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
          { label: "人均支援工时", value: `${avgHours} h/人`, icon: FileSpreadsheet, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
        ].map((kbi, i) => (
          <div key={i} className={`bg-white border ${kbi.border} rounded-xl p-3 sm:p-4 shadow-xs flex items-center justify-between`}>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{kbi.label}</div>
              <div className="text-sm sm:text-lg font-bold text-slate-800 font-mono">{kbi.value}</div>
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${kbi.bg} ${kbi.color}`}>
              <kbi.icon size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top 10 Supported */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs lg:col-span-1">
          <h3 className="text-[11px] font-bold text-slate-800 mb-4 flex items-center gap-1.5">
            <Building2 size={14} className="text-orange-500" /> 被支援部门排行 TOP10
          </h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTargetDepts} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={12}>
                  {topTargetDepts.map((_, i) => <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs lg:col-span-1">
          <h3 className="text-[11px] font-bold text-slate-800 mb-4 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-orange-500" /> 每日支援趋势
          </h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="supportColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Area type="monotone" dataKey="hours" name="支援工时" stroke="#3b82f6" fill="url(#supportColor)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dispatch Pie */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs lg:col-span-1">
          <h3 className="text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <Users size={14} className="text-orange-500" /> 派出部门占比
          </h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dispatchDepts} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value">
                  {dispatchDepts.map((_, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 9 }} layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-0">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-[11px] font-bold text-slate-800">支援明细台账</h3>
          <button className="text-[10px] text-blue-600 font-bold hover:underline">导出 Excel</button>
        </div>
        <div className="overflow-x-auto p-1 custom-scrollbar">
          <table className="w-full text-left border-collapse text-[10px]">
            <thead>
              <tr className="bg-slate-100/50 text-slate-500 font-bold border-b border-slate-200">
                <th className="p-2.5">支援日期</th>
                <th className="p-2.5">员工信息</th>
                <th className="p-2.5">派出部门</th>
                <th className="p-2.5"></th>
                <th className="p-2.5">支援部门</th>
                <th className="p-2.5">时段</th>
                <th className="p-2.5 text-right">支援工时</th>
                <th className="p-2.5 text-right">折算成本</th>
                <th className="p-2.5 text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="p-2.5 font-mono text-slate-600">{r.date}</td>
                  <td className="p-2.5 font-bold text-slate-800">张三_{i} (100{i})</td>
                  <td className="p-2.5 text-slate-600">{r.source_department}</td>
                  <td className="p-2.5 text-slate-300"><ArrowRight size={12}/></td>
                  <td className="p-2.5 font-bold text-orange-600">{r.target_department}</td>
                  <td className="p-2.5 font-mono text-slate-500">08:00-12:00</td>
                  <td className="p-2.5 font-mono font-bold text-right text-slate-800">{r.support_hours}h</td>
                  <td className="p-2.5 font-mono font-bold text-right text-rose-600">¥{r.cost_saved}</td>
                  <td className="p-2.5 text-center">
                    <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold border border-emerald-100">已核准</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
