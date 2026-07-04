import React, { useState } from "react";
import { EmployeeItem } from "../types";
import { useDevice } from "../context/DeviceContext";
import { 
  Search, Filter, ShieldAlert, CheckCircle, AlertTriangle, 
  Calendar, Award, Clock, User, FileText, Clock3, TrendingUp, 
  ArrowRightLeft, ChevronRight, ClipboardList, Activity, MapPin, CheckSquare, List
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";

interface EmployeeSectionProps {
  employees: EmployeeItem[];
}

export default function EmployeeSection({ employees }: EmployeeSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("全部部门");
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || "");
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  const departments = ["全部部门", ...Array.from(new Set(employees.map((e) => e.department)))];

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

  const trendData = activeEmp ? Object.entries(activeEmp.daily_hours).map(([date, hours]) => {
    return {
      date: date.substring(5), // MM-DD
      hours: hours,
      abnormal: hours > 11 || hours < 8 ? true : false,
      fill: hours > 11 ? "#ef4444" : hours < 8 && hours > 0 ? "#f59e0b" : "#10b981"
    };
  }).slice(-7) : [];

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      <div className={`bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 ${isFoldable ? "p-3" : "p-4"}`}>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={13} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索员工姓名或工号..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-lg text-xs text-slate-700 outline-none transition-all w-full sm:w-48" />
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs text-slate-600">
            <Filter size={11} className="text-slate-400" />
            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="bg-transparent border-none font-medium text-slate-700 outline-none cursor-pointer pr-1 text-xs">
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          共查询到 {filteredEmployees.length} 名员工
        </div>
      </div>

      <div className={`flex flex-col lg:flex-row gap-4 h-full`}>
        <div className={`lg:w-[280px] shrink-0 flex flex-col gap-3 ${isFoldable ? "h-[300px]" : "h-[75vh]"}`}>
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex-1 flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-slate-800 mb-3 px-1 flex items-center gap-1.5">
              <User size={14} className="text-orange-500" /> 员工列表
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredEmployees.map((emp) => {
                const isSelected = emp.id === selectedEmpId;
                return (
                  <button key={emp.id} onClick={() => setSelectedEmpId(emp.id)} className={`w-full text-left p-2.5 rounded-xl border transition-all ${isSelected ? "bg-orange-50/50 border-orange-500/30 shadow-sm" : "bg-white border-slate-100 hover:border-slate-300"}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isSelected ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                        {emp.name.substring(0, 1)}
                      </div>
                      <div className="truncate flex-1">
                        <span className={`text-[11px] font-bold block leading-tight truncate ${isSelected ? "text-orange-700" : "text-slate-800"}`}>{emp.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{emp.job_number}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeEmp ? (
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col min-h-0 overflow-y-auto">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 rounded-t-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white text-2xl shadow-sm border-2 border-white">
                  {activeEmp.name.substring(0, 1)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {activeEmp.name}
                    {getRiskBadge(activeEmp.risk_level)}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono"><User size={12}/> {activeEmp.job_number}</span>
                    <span className="flex items-center gap-1"><MapPin size={12}/> {activeEmp.department}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 mb-1 font-bold">考勤属性</div>
                <div className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                  {activeEmp.name.includes("王") ? "小时工" : activeEmp.name.includes("赵") ? "第三方派遣" : "自有员工"}
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column */}
              <div className="space-y-5">
                {/* 2. 工时核定 */}
                <div>
                  <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-3 border-orange-500 pl-2">工时核定 (当月)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[9px] text-slate-500">最终核定 (total_hours)</div>
                      <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">{activeEmp.total_hours}h</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[9px] text-slate-500">正班工时 (regular)</div>
                      <div className="text-sm font-bold text-emerald-600 font-mono mt-0.5">{(activeEmp.total_hours - activeEmp.overtime_hours).toFixed(1)}h</div>
                    </div>
                    <div className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                      <div className="text-[9px] text-rose-600">加班工时 (overtime)</div>
                      <div className="text-sm font-bold text-rose-600 font-mono mt-0.5">{activeEmp.overtime_hours}h</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[9px] text-slate-500">月薪资估算</div>
                      <div className="text-sm font-bold text-slate-700 font-mono mt-0.5">¥{activeEmp.salary.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* 3. 打卡记录 & 4. 时间段 */}
                <div>
                  <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-3 border-orange-500 pl-2">最新打卡流水及工时段</h3>
                  {activeEmp.punch_records && activeEmp.punch_records.length > 0 ? (
                    <>
                      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden text-[10px]">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-slate-500">
                            <tr>
                              <th className="px-3 py-2 font-bold">打卡时间</th>
                              <th className="px-3 py-2 font-bold">地点/设备</th>
                              <th className="px-3 py-2 font-bold">状态</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {activeEmp.punch_records.map((r, i) => (
                              <tr key={i}>
                                <td className="px-3 py-2 font-mono font-bold text-slate-700">{r.time}</td>
                                <td className="px-3 py-2 text-slate-600">{r.location}</td>
                                <td className="px-3 py-2">
                                  <span className="text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">有效</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 flex gap-1 h-8 rounded-lg overflow-hidden text-[9px] font-bold text-white text-center shadow-xs">
                        <div className="bg-emerald-500 flex-1 flex items-center justify-center">正班 8h</div>
                        <div className="bg-rose-500 w-[30%] flex items-center justify-center">加班 3h</div>
                      </div>
                      <div className="flex justify-between text-[8px] text-slate-400 font-mono mt-1 px-1">
                        <span>打卡开始 (上工)</span>
                        <span>打卡结束 (下工)</span>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg text-[10px]">
                      暂无打卡流水记录
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* 7. 近期工时趋势 */}
                <div>
                  <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-3 border-orange-500 pl-2">最近7天工时趋势</h3>
                  {trendData.length > 0 ? (
                    <div className="h-32 bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                          <XAxis dataKey="date" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: 10, borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={30}>
                            {trendData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg text-[10px]">
                      暂无历史工时数据
                    </div>
                  )}
                </div>

                {/* 5. 流程申请 */}
                <div>
                  <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-3 border-orange-500 pl-2">本月异常与流程记录</h3>
                  <div className="space-y-2">
                    {activeEmp.applications.length > 0 || activeEmp.adjustments.length > 0 ? (
                      <>
                        {activeEmp.applications.map((app, i) => (
                          <div key={i} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${app.type === '加班' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                                {app.type === '加班' ? <Clock3 size={12}/> : <Calendar size={12}/>}
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-slate-800">{app.type}申请 ({app.hours}h)</div>
                                <div className="text-[9px] text-slate-400 font-mono mt-0.5">{app.start} ~ {app.end}</div>
                              </div>
                            </div>
                            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">
                              {app.status}
                            </span>
                          </div>
                        ))}
                        {activeEmp.adjustments.map((adj, i) => (
                          <div key={`adj-${i}`} className="flex items-center justify-between bg-amber-50/30 border border-amber-200/50 rounded-lg p-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                <ArrowRightLeft size={12}/>
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-slate-800">系统考勤调整</div>
                                <div className="text-[9px] text-slate-500 mt-0.5">{adj.before_hours}h ➔ {adj.after_hours}h ({adj.reason})</div>
                              </div>
                            </div>
                            <span className="text-[8px] text-amber-600 font-bold">{adj.operator}</span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg text-[10px]">
                        暂无相关流程记录
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center text-slate-400">
            请选择员工查看详情
          </div>
        )}
      </div>
    </div>
  );
}
