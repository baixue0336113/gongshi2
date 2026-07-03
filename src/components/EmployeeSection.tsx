import React, { useState } from "react";
import { EmployeeItem } from "../types";
import { useDevice } from "../context/DeviceContext";
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Award, 
  Clock, 
  User,
  FileText,
  Clock3,
  TrendingUp,
  ArrowRightLeft,
  ChevronRight,
  ClipboardList
} from "lucide-react";

interface EmployeeSectionProps {
  employees: EmployeeItem[];
}

export default function EmployeeSection({ employees }: EmployeeSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("全部部门");
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || "");
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  // Unique list of departments from employees for dropdown filter
  const departments = ["全部部门", ...Array.from(new Set(employees.map((e) => e.department)))];

  // Filtering
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.includes(searchQuery) ||
      emp.job_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "全部部门" || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const activeEmp = employees.find((e) => e.id === selectedEmpId) || filteredEmployees[0] || employees[0];

  const getRiskBadge = (level: "low" | "medium" | "high") => {
    if (level === "high") {
      return (
        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded font-bold text-[9px] flex items-center gap-0.5 shrink-0 select-none">
          <ShieldAlert size={9.5} className="text-rose-500" />
          <span>高风险</span>
        </span>
      );
    }
    if (level === "medium") {
      return (
        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded font-bold text-[9px] flex items-center gap-0.5 shrink-0 select-none">
          <AlertTriangle size={9.5} className="text-amber-500" />
          <span>中风险</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded font-bold text-[9px] flex items-center gap-0.5 shrink-0 select-none">
        <CheckCircle size={9.5} className="text-emerald-500" />
        <span>低风险</span>
      </span>
    );
  };

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* 1. Search and Filters Bar */}
      <div className={`bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 ${
        isFoldable ? "p-3" : "p-4"
      }`}>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial">
            <Search size={13} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索员工姓名或工号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-lg text-xs text-slate-700 outline-none transition-all w-full sm:w-48"
            />
          </div>

          {/* Department filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs text-slate-600">
            <Filter size={11} className="text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                const firstMatch = employees.find(
                  (emp) => e.target.value === "全部部门" || emp.department === e.target.value
                );
                if (firstMatch) setSelectedEmpId(firstMatch.id);
              }}
              className="bg-transparent font-medium border-none outline-none cursor-pointer pr-1 text-xs"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-[10px] text-slate-400 font-semibold">
          共筛选出 <strong className="text-slate-700">{filteredEmployees.length}</strong> 人
        </span>
      </div>

      {/* 2. Main Content Split View (Adjusted based on layout targets) */}
      {isFoldable ? (
        /* ==================== HUAWEI FOLDABLE INNER SCREEN VIEW (Top-Bottom Stack) ==================== */
        <div className="space-y-3">
          {/* Top: Compact horizontal employee list picker */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              名册快捷选择 (向右滑动切换)
            </span>
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">无对应的人员记录</div>
            ) : (
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {filteredEmployees.map((emp) => {
                  const isSelected = emp.id === selectedEmpId;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => setSelectedEmpId(emp.id)}
                      className={`flex-none w-36 p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "bg-orange-50 border-orange-400 text-slate-900 shadow-xs"
                          : "bg-slate-50/50 hover:bg-slate-50 border-slate-100 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                          isSelected ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-700"
                        }`}>
                          {emp.name.substring(0, 1)}
                        </div>
                        <div className="truncate flex-1">
                          <span className="text-[11px] font-bold block leading-tight truncate">{emp.name}</span>
                          <span className="text-[8px] text-slate-400 font-mono block mt-0.5">{emp.job_number}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100/60 mt-1.5 pt-1 text-[8px] text-slate-400">
                        <span className="truncate max-w-[50px]">{emp.department.replace("车间", "")}</span>
                        {getRiskBadge(emp.risk_level)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom: Natural height detail page */}
          {activeEmp && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
              {/* Profile Card Summary */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white shrink-0 text-sm">
                    {activeEmp.name.substring(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{activeEmp.name}</span>
                      <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-mono font-medium">
                        工号: {activeEmp.job_number}
                      </span>
                    </h3>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      {activeEmp.department} · {activeEmp.position}
                    </p>
                  </div>
                </div>
                {getRiskBadge(activeEmp.risk_level)}
              </div>

              {/* Natural height cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-center">
                  <span className="text-[8px] text-slate-400 block font-bold uppercase">出勤率</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 inline-block font-mono">{activeEmp.attendance_rate}%</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-center">
                  <span className="text-[8px] text-slate-400 block font-bold uppercase">日均工时</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 inline-block font-mono">{activeEmp.avg_hours}h</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-center">
                  <span className="text-[8px] text-slate-400 block font-bold uppercase">入职时间</span>
                  <span className="text-[10px] font-bold text-slate-700 mt-0.5 inline-block font-mono">{activeEmp.hire_date}</span>
                </div>
              </div>

              {/* 近7日考勤工时轨迹 */}
              <div className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg space-y-1.5">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                  近7日考勤工时轨迹
                </span>
                <div className="grid grid-cols-7 gap-1">
                  {Object.entries(activeEmp.daily_hours).map(([date, hours]) => {
                    const dayStr = date.split("-")[2];
                    const hasHours = hours > 0;
                    return (
                      <div
                        key={date}
                        className={`rounded py-1 text-center border text-[8px] ${
                          hasHours
                            ? hours > 9.5
                              ? "bg-rose-50 border-rose-200 text-rose-800 font-bold"
                              : "bg-emerald-50 border-emerald-100 text-emerald-800 font-bold"
                            : "bg-slate-100 border-slate-200 text-slate-400"
                        }`}
                      >
                        <span className="text-slate-400 block text-[7px] font-mono">{dayStr}日</span>
                        <span className="block mt-0.5 font-mono text-[9px]">{hasHours ? `${hours}h` : "休"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 核心打卡记录 */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  打卡流水明细
                </span>
                <div className="border border-slate-100 rounded-lg overflow-hidden bg-white text-[9px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[8px] font-bold">
                        <th className="p-2">日期</th>
                        <th className="p-2">上班打卡</th>
                        <th className="p-2">下班打卡</th>
                        <th className="p-2 text-right">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                      {activeEmp.punch_records.slice(0, 3).map((record, index) => (
                        <tr key={index}>
                          <td className="p-2 font-mono">{record.date}</td>
                          <td className="p-2 font-mono text-slate-600">{record.clock_in || "-"}</td>
                          <td className="p-2 font-mono text-slate-600">{record.clock_out || "-"}</td>
                          <td className="p-2 text-right">
                            <span className={`px-1 py-0.2 rounded text-[8px] font-bold ${
                              record.status === "正常" 
                                ? "bg-emerald-50 text-emerald-600" 
                                : "bg-rose-50 text-rose-600"
                            }`}>{record.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 流程申请与工时调整记录 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 申请单 */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    流程申请 (加班/请假/支援)
                  </span>
                  {activeEmp.applications.length === 0 ? (
                    <div className="text-[9px] text-slate-400 py-3 bg-slate-50 rounded-lg text-center border border-dashed border-slate-200">
                      无流程申请记录
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[110px] overflow-y-auto">
                      {activeEmp.applications.map((app) => (
                        <div key={app.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-[9px]">
                          <div>
                            <div className="font-bold text-slate-700 flex items-center gap-1.5">
                              <span className="px-1 py-0.2 bg-orange-100 text-orange-700 rounded text-[8px]">{app.type}</span>
                              <span>{app.hours} 小时</span>
                            </div>
                            <span className="text-[8px] text-slate-400 font-mono mt-0.5 block">{app.start} ~ {app.end.split(" ")[1] || app.end}</span>
                          </div>
                          <span className="font-bold text-emerald-600">{app.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 工时调整 */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    手工工时微调记录
                  </span>
                  {activeEmp.adjustments.length === 0 ? (
                    <div className="text-[9px] text-slate-400 py-3 bg-slate-50 rounded-lg text-center border border-dashed border-slate-200">
                      无工时调整记录
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[110px] overflow-y-auto">
                      {activeEmp.adjustments.map((adj, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[9px]">
                          <div className="flex justify-between items-center font-bold text-slate-700">
                            <span>工时调整: {adj.before_hours}h ➔ {adj.after_hours}h</span>
                            <span className="text-slate-400 text-[8px]">{adj.date}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400 mt-0.5 text-[8px]">
                            <span>原因: {adj.reason}</span>
                            <span>操作人: {adj.operator}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 合规诊断日志 */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  考勤异常及预警提示
                </span>
                {activeEmp.exception_logs.length === 0 ? (
                  <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-1.5 text-[9px] text-emerald-700 font-bold">
                    <CheckCircle size={11} className="text-emerald-500" />
                    <span>未检测到打卡及排班考勤异常记录。</span>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-0.5">
                    {activeEmp.exception_logs.map((log, idx) => (
                      <div key={idx} className="p-2 bg-rose-50/40 border border-rose-100/50 rounded-lg flex gap-2 text-[9px] text-rose-800">
                        <ShieldAlert size={11} className="text-rose-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center font-bold">
                            <span>{log.type}</span>
                            <span className="text-slate-400 font-mono text-[8px]">{log.date}</span>
                          </div>
                          <p className="text-slate-500 mt-0.5 font-medium leading-relaxed">{log.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ==================== ANDROID TABLET HORIZONTAL SCREEN VIEW (Split Column layout) ==================== */
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Left employee roster (Strict width limit: 31% to prevent stretching) */}
          <div className="w-full lg:w-[31%] shrink-0 bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col h-[650px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              在职员工名册 (点击查看穿透详情)
            </span>
            <div className="flex-1 overflow-y-auto touch-scroll space-y-1.5 pr-1 select-none">
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400">无对应的人员记录</div>
              ) : (
                filteredEmployees.map((emp) => {
                  const isSelected = emp.id === selectedEmpId;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => setSelectedEmpId(emp.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "bg-orange-50 border-orange-400 text-slate-900 shadow-xs font-bold"
                          : "bg-white hover:bg-slate-50/50 border-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          {emp.name.substring(0, 1)}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold flex items-center gap-1">
                            <span>{emp.name}</span>
                            <span className="text-[8px] font-mono text-slate-400 font-normal">
                              {emp.job_number}
                            </span>
                          </div>
                          <div className="text-[9px] text-slate-400 truncate mt-0.5">
                            {emp.department} · {emp.position}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1.5 pl-1.5">
                        {getRiskBadge(emp.risk_level)}
                        <span className="text-[8px] font-mono text-slate-400">
                          {emp.avg_hours}h/天
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Detailed Dashboard (Strictly 69% width, beautiful visual structure, natural content size) */}
          {activeEmp && (
            <div className="w-full lg:w-[69%] bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 min-h-[650px] overflow-y-auto touch-scroll">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white shrink-0 text-base shadow-xs">
                    {activeEmp.name.substring(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{activeEmp.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-medium">
                        工号: {activeEmp.job_number}
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      部门归属：<strong className="text-slate-600 font-semibold">{activeEmp.department}</strong> | 职位类型：<strong className="text-slate-600 font-semibold">{activeEmp.position}</strong>
                    </p>
                  </div>
                </div>
                {getRiskBadge(activeEmp.risk_level)}
              </div>

              {/* Three Column Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">实际出勤率</span>
                    <span className="text-sm font-bold text-slate-800 font-mono block mt-0.5">{activeEmp.attendance_rate}%</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <Award size={13} />
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">日人均工时</span>
                    <span className="text-sm font-bold text-slate-800 font-mono block mt-0.5">{activeEmp.avg_hours} 小时</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <Clock size={13} />
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">入职时间</span>
                    <span className="text-xs font-bold text-slate-800 font-mono block mt-1">{activeEmp.hire_date}</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Calendar size={13} />
                  </div>
                </div>
              </div>

              {/* 7日考勤工时轨迹 */}
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/20 space-y-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  近7日考勤工时轨迹 (日出勤审计明细)
                </span>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(activeEmp.daily_hours).map(([date, hours]) => {
                    const dayStr = date.split("-")[2];
                    const hasHours = hours > 0;
                    return (
                      <div
                        key={date}
                        className={`rounded-lg text-center border p-2 transition-all ${
                          hasHours
                            ? hours > 9.5
                              ? "bg-rose-50 border-rose-200 text-rose-800 font-bold shadow-xs"
                              : "bg-emerald-50 border-emerald-100 text-emerald-800 font-bold"
                            : "bg-slate-50 border-slate-100 text-slate-400"
                        }`}
                      >
                        <span className="text-[9px] text-slate-400 block font-mono">{dayStr}日</span>
                        <strong className="text-xs font-mono font-bold block mt-0.5">
                          {hasHours ? `${hours}h` : "休"}
                        </strong>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 打卡明细流水记录 */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  刷卡打卡明细流水
                </span>
                <div className="border border-slate-200/60 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                        <th className="p-2.5 pl-4">打卡日期</th>
                        <th className="p-2.5">上班打卡时间</th>
                        <th className="p-2.5">下班打卡时间</th>
                        <th className="p-2.5 text-right pr-4">核定考勤状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {activeEmp.punch_records.map((record, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/40">
                          <td className="p-2.5 pl-4 font-mono text-slate-900">{record.date}</td>
                          <td className="p-2.5 font-mono text-slate-600">{record.clock_in || "未刷卡"}</td>
                          <td className="p-2.5 font-mono text-slate-600">{record.clock_out || "未刷卡"}</td>
                          <td className="p-2.5 text-right pr-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                              record.status === "正常" 
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                : "bg-rose-50 text-rose-600 border border-rose-100"
                            }`}>{record.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Double panels for flow application and hour audit adjustments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flow Application */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    HR 线上审批流程 (加班 / 支援 / 请假单)
                  </span>
                  {activeEmp.applications.length === 0 ? (
                    <div className="text-xs text-slate-400 py-6 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200">
                      无对应流程审批记录。
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {activeEmp.applications.map((app) => (
                        <div key={app.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100/80 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-800 flex items-center gap-2">
                              <span className="px-1.5 py-0.2 bg-orange-100 text-orange-700 rounded text-[9px] font-bold">{app.type}</span>
                              <span>核定 {app.hours}h</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono block mt-1">{app.start} ~ {app.end}</span>
                          </div>
                          <span className="font-bold text-emerald-600 text-xs bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded">{app.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Audit Adjustment Logs */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    手工工时调整与确认记录
                  </span>
                  {activeEmp.adjustments.length === 0 ? (
                    <div className="text-xs text-slate-400 py-6 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200">
                      无手工工时二次调整记录。
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {activeEmp.adjustments.map((adj, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100/80 text-xs">
                          <div className="flex justify-between items-center font-bold text-slate-800">
                            <span>工时校正：{adj.before_hours}小时 ➔ {adj.after_hours}小时</span>
                            <span className="text-slate-400 text-[9px] font-mono font-normal">{adj.date}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-500 mt-1.5 text-[10px]">
                            <span className="truncate max-w-[200px]">调时原因: {adj.reason}</span>
                            <span className="font-mono bg-slate-100 text-slate-600 px-1.5 rounded text-[8px]">经办: {adj.operator}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Exception Logs Panel */}
              <div className="border-t border-slate-100 pt-3.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  异常出勤与考勤预警日志
                </span>
                {activeEmp.exception_logs.length === 0 ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-bold">
                    <CheckCircle size={13} className="text-emerald-500" />
                    <span>当前核算周期内未检测到出勤与打卡异常提示。</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {activeEmp.exception_logs.map((log, index) => (
                      <div
                        key={index}
                        className="p-3 bg-rose-50/40 rounded-xl border border-rose-100/60 flex items-start gap-3 text-xs text-rose-800"
                      >
                        <ShieldAlert size={13} className="shrink-0 mt-0.5 text-rose-500" />
                        <div className="flex-1">
                          <div className="font-bold flex justify-between items-center text-[11px]">
                            <span>{log.type}</span>
                            <span className="text-slate-400 font-mono font-normal">记录日期: {log.date}</span>
                          </div>
                          <p className="text-slate-500 mt-1 font-medium leading-relaxed text-[10px]">
                            {log.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
