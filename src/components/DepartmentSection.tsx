import React, { useState } from "react";
import { DepartmentItem } from "../types";
import { useDevice } from "../context/DeviceContext";
import { Users, User, ShieldAlert, CheckCircle, TrendingUp, ChevronRight, Clock, AlertTriangle } from "lucide-react";

interface DepartmentSectionProps {
  departments: DepartmentItem[];
}

export default function DepartmentSection({ departments }: DepartmentSectionProps) {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.department_id || "");
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  const activeDept = departments.find((d) => d.department_id === selectedDeptId) || departments[0];

  // Helper to render mini trend charts
  const renderTrendSvg = (trend: number[]) => {
    if (!trend || trend.length < 2) return null;
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const spread = max - min === 0 ? 1 : max - min;
    const width = 180;
    const height = isFoldable ? 25 : 45;

    const points = trend.map((val, idx) => {
      const x = (idx / (trend.length - 1)) * width;
      const y = height - ((val - min) / spread) * height + 3;
      return `${x},${y}`;
    });

    return (
      <svg className={`w-full ${isFoldable ? "h-6" : "h-12"}`} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path
          d={`M 0,${height} L ${points.join(" L ")} L ${width},${height} Z`}
          fill="url(#trendGrad)"
        />
        <path
          d={`M ${points.join(" L ")}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {trend.map((val, idx) => {
          const x = (idx / (trend.length - 1)) * width;
          const y = height - ((val - min) / spread) * height + 3;
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="2"
              className="fill-emerald-500 stroke-white stroke-[1.5]"
            />
          );
        })}
      </svg>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "danger":
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold">
            🚨 危险过载
          </span>
        );
      case "warning":
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold">
            ⚠️ 异常核预
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
            ✓ 运行正常
          </span>
        );
    }
  };

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-6"}>
      
      {/* 1. Upper Split View: List & Detail */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 items-start ${isFoldable ? "gap-3" : "gap-6"}`}>
        
        {/* Left List Column */}
        <div className={`bg-white border border-slate-200 rounded-xl p-4 lg:col-span-5 flex flex-col shadow-xs ${
          isFoldable ? "h-[250px]" : "h-[340px]"
        }`}>
          <h4 className="text-xs font-bold text-slate-800 mb-3">
            生产组织及班组穿透清单
          </h4>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {departments.map((dept) => {
              const isSelected = dept.department_id === selectedDeptId;
              return (
                <button
                  key={dept.department_id}
                  onClick={() => setSelectedDeptId(dept.department_id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all border text-left cursor-pointer ${
                    isSelected
                      ? "bg-slate-50 text-slate-900 border-orange-500 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      <Users size={13} />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate text-slate-800">{dept.department_name}</div>
                      <div className="text-[10px] text-slate-500">
                        今日在岗: <strong className={isSelected ? "text-orange-600" : "text-slate-700"}>{dept.headcount}</strong> 人
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getStatusBadge(dept.rule_status)}
                    <ChevronRight size={12} className={isSelected ? "text-slate-600" : "text-slate-400"} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail Panel */}
        {activeDept && (
          <div className={`bg-white border border-slate-200 rounded-xl lg:col-span-7 flex flex-col justify-between shadow-xs ${
            isFoldable ? "p-3 h-[250px]" : "p-5 h-[340px]"
          }`}>
            {/* Header section */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 rounded-full bg-orange-500" />
                  <h3 className="text-xs font-bold text-slate-800">
                    {activeDept.department_name} · 经营档案
                  </h3>
                </div>
                {getStatusBadge(activeDept.rule_status)}
              </div>

              {/* Detail Metrics Board */}
              <div className={`grid grid-cols-2 md:grid-cols-4 ${isFoldable ? "gap-2 mt-2" : "gap-4 mt-4"}`}>
                <div className={`bg-slate-50 rounded-lg border border-slate-100 text-center ${isFoldable ? "p-1.5" : "p-2.5"}`}>
                  <span className="text-[10px] text-slate-500 block font-semibold">车间班长</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                    <User size={12} className="text-slate-400" />
                    {activeDept.manager}
                  </span>
                </div>
                <div className={`bg-slate-50 rounded-lg border border-slate-100 text-center ${isFoldable ? "p-1.5" : "p-2.5"}`}>
                  <span className="text-[10px] text-slate-500 block font-semibold">日总工时</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5 font-mono">
                    <Clock size={12} className="text-slate-400" />
                    {activeDept.total_hours}h
                  </span>
                </div>
                <div className={`bg-slate-50 rounded-lg border border-slate-100 text-center ${isFoldable ? "p-1.5" : "p-2.5"}`}>
                  <span className="text-[10px] text-slate-500 block font-semibold">人均工时</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5 font-mono">
                    <Clock size={12} className="text-slate-400" />
                    {activeDept.avg_hours}h
                  </span>
                </div>
                <div className={`bg-slate-50 rounded-lg border border-slate-100 text-center ${isFoldable ? "p-1.5" : "p-2.5"}`}>
                  <span className="text-[10px] text-slate-500 block font-semibold">溢出加班</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5 font-mono">
                    <TrendingUp size={12} className="text-rose-500" />
                    <span className="text-rose-600 font-bold">{activeDept.overtime_hours}h</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Section: Trend Chart */}
            <div className={`bg-slate-50 border border-slate-100 rounded-lg ${isFoldable ? "p-1.5 my-1" : "p-3 my-2"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-500 block">
                  近4周日均累计工时走势 (周趋势诊断)
                </span>
                {!isFoldable && <span className="text-[9px] text-slate-400 font-medium">数据区间: 历史30天</span>}
              </div>
              <div className="w-full">
                {renderTrendSvg([75, 82, 79, 88])}
              </div>
            </div>

            {/* Bottom Warning Alert Footer */}
            <div className={`rounded-lg flex items-start gap-2 border ${
              isFoldable ? "p-1.5 text-[9px] leading-tight" : "p-3 text-[11px]"
            } ${
              activeDept.rule_status === "danger"
                ? "bg-rose-50 text-rose-800 border-rose-100"
                : activeDept.rule_status === "warning"
                ? "bg-amber-50 text-amber-800 border-amber-100"
                : "bg-emerald-50 text-emerald-800 border-emerald-100"
            }`}>
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              <span>
                {activeDept.rule_status === "danger"
                  ? `本组加班溢出严重（达 ${activeDept.overtime_hours} 小时）。请合理安排轮班，防范合规风险。`
                  : activeDept.rule_status === "warning"
                  ? "工时稍显偏高，部分外包员工有疲劳现象，需关注排班合理性。"
                  : "排班配置符合出餐，各项劳工指标皆在警戒线内。"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Lower Horizontal Comparison Matrix STRETCHING 100% WIDTH */}
      <div className={`bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3 space-y-3" : "p-5 space-y-4"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-5 rounded-full bg-orange-500" />
            <h3 className="text-xs font-bold text-slate-800">
              横向组织效能对比审计矩阵
            </h3>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold">
            横向无损铺满
          </span>
        </div>

        <div className="overflow-x-auto matrix-scroll rounded-lg border border-slate-100">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">车间 / 部门</th>
                <th className="px-4 py-3">总工时 (h)</th>
                <th className="px-4 py-3">在岗人数</th>
                <th className="px-4 py-3">人均工时 (h)</th>
                <th className="px-4 py-3">加班工时</th>
                <th className="px-4 py-3">异常人天 (天)</th>
                <th className="px-4 py-3 text-right">合规状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {departments.map((dept) => (
                <tr
                  key={dept.department_id}
                  className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                    selectedDeptId === dept.department_id ? "bg-slate-50 font-semibold" : ""
                  }`}
                  onClick={() => setSelectedDeptId(dept.department_id)}
                >
                  <td className="px-4 py-3.5 text-slate-800 font-semibold">{dept.department_name}</td>
                  <td className="px-4 py-3.5 font-mono">{dept.total_hours}</td>
                  <td className="px-4 py-3.5 font-mono">{dept.headcount}人</td>
                  <td className="px-4 py-3.5 font-mono">{dept.avg_hours}</td>
                  <td className="px-4 py-3.5 font-mono text-rose-600 font-bold">{dept.overtime_hours}h</td>
                  <td className="px-4 py-3.5 font-mono text-amber-600 font-bold">{Math.round(dept.overtime_hours / 40) || 1}</td>
                  <td className="px-4 py-3.5 text-right">{getStatusBadge(dept.rule_status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
