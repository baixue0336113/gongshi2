import React, { useState } from "react";
import { RiskData, RiskDepartmentDetail } from "../types";
import { useDevice } from "../context/DeviceContext";
import { ShieldAlert, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2, Activity, Users } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface RiskControlSectionProps {
  data: RiskData;
}

export default function RiskControlSection({ data }: RiskControlSectionProps) {
  const [selectedDept, setSelectedDept] = useState("");
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  if (!data) return <div className="text-slate-400 p-6">暂无风险管理数据</div>;

  const {
    overview = { total_alerts: 0, high_risk_count: 0, medium_risk_count: 0, low_risk_count: 0 },
    worsening_top = [],
    improving_top = [],
    heatmap = [],
    department_details = {}
  } = data;

  const depts = Object.keys(department_details || {});
  const activeDept = depts.includes(selectedDept) ? selectedDept : (depts[0] || "");
  const currentDetail: RiskDepartmentDetail | undefined = department_details[activeDept];

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-6"}>
      
      {/* 1. Overview Tiles */}
      <div className={`grid grid-cols-2 md:grid-cols-4 ${isFoldable ? "gap-2.5" : "gap-4"}`}>
        <div className={`bg-white border border-slate-200 rounded-xl text-center shadow-xs ${isFoldable ? "p-2.5" : "p-4"}`}>
          <span className="text-xs text-slate-500 font-bold">系统总合规报警数</span>
          <h2 className={`${isFoldable ? "text-xl mt-0.5" : "text-2xl mt-1"} font-bold font-mono text-orange-600`}>{overview.total_alerts}</h2>
          <span className="text-[10px] text-slate-400 font-medium">规则交叉触发次数</span>
        </div>

        <div className={`bg-rose-50 border border-rose-100 rounded-xl text-center shadow-xs ${isFoldable ? "p-2.5" : "p-4"}`}>
          <span className="text-xs text-rose-800 font-bold">高风险红线事件</span>
          <h2 className={`${isFoldable ? "text-xl mt-0.5" : "text-2xl mt-1"} font-bold font-mono text-rose-600`}>{overview.high_risk_count}</h2>
          <span className="text-[10px] text-rose-500 font-medium">涉及超时疲劳红线</span>
        </div>

        <div className={`bg-amber-50 border border-amber-100 rounded-xl text-center shadow-xs ${isFoldable ? "p-2.5" : "p-4"}`}>
          <span className="text-xs text-amber-800 font-bold">中风险警报事件</span>
          <h2 className={`${isFoldable ? "text-xl mt-0.5" : "text-2xl mt-1"} font-bold font-mono text-amber-600`}>{overview.medium_risk_count}</h2>
          <span className="text-[10px] text-amber-500 font-medium">涉及漏打卡与异常</span>
        </div>

        <div className={`bg-slate-50 border border-slate-200 rounded-xl text-center shadow-xs ${isFoldable ? "p-2.5" : "p-4"}`}>
          <span className="text-xs text-slate-600 font-bold">低合规预警事件</span>
          <h2 className={`${isFoldable ? "text-xl mt-0.5" : "text-2xl mt-1"} font-bold font-mono text-slate-700`}>{overview.low_risk_count}</h2>
          <span className="text-[10px] text-slate-500 font-medium">涉及打卡微调与核对</span>
        </div>
      </div>

      {/* 2. Improving & Worsening TOP3 (Side-by-Side) */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isFoldable ? "gap-3" : "gap-6"}`}>
        {/* Worsening */}
        <div className={`bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3.5" : "p-5"}`}>
          <div className="flex items-center gap-1.5 text-rose-600 mb-2.5">
            <ArrowUpRight size={14} />
            <h4 className="text-xs font-bold text-slate-800">今日合规风险恶化 TOP</h4>
          </div>
          <div className="space-y-2">
            {worsening_top.map((item, idx) => (
              <div key={item.id} className="p-2 bg-rose-50 border border-rose-100 rounded-lg flex justify-between items-center text-xs hover:bg-rose-100/50 transition-colors">
                <div>
                  <span className="font-semibold text-slate-800 block">{item.department}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">恶化因子: {item.factor}</span>
                </div>
                <span className="text-rose-600 font-mono font-bold">+{item.change_rate}% 风险</span>
              </div>
            ))}
          </div>
        </div>

        {/* Improving */}
        <div className={`bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3.5" : "p-5"}`}>
          <div className="flex items-center gap-1.5 text-emerald-600 mb-2.5">
            <ArrowDownRight size={14} />
            <h4 className="text-xs font-bold text-slate-800">今日合规管理改善 TOP</h4>
          </div>
          <div className="space-y-2">
            {improving_top.map((item, idx) => (
              <div key={item.id} className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg flex justify-between items-center text-xs hover:bg-emerald-100/50 transition-colors">
                <div>
                  <span className="font-semibold text-slate-800 block">{item.department}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">改善因子: {item.factor}</span>
                </div>
                <span className="text-emerald-600 font-mono font-bold">-{item.change_rate}% 降级</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Heatmap visualization */}
      <div className={`bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3.5" : "p-5"}`}>
        <h4 className="text-xs font-bold text-slate-800 mb-3">全天车间规则违规频度矩阵热力图</h4>
        
        <div className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 ${isFoldable ? "gap-2.5" : "gap-3.5"}`}>
          {heatmap.map((pt, idx) => {
            return (
              <div 
                key={idx} 
                className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between transition-all cursor-pointer hover:border-orange-500 bg-slate-50/50 border-slate-100 hover:bg-white ${
                  isFoldable ? "h-[68px]" : "h-20"
                }`}
                onClick={() => department_details[pt.department] && setSelectedDept(pt.department)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-mono text-[9px]">{pt.date}</span>
                  <span className="font-mono text-[9px] text-slate-500">得分: {pt.score}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block truncate text-[11px]">{pt.department}</span>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full ${pt.score >= 80 ? "bg-rose-500" : pt.score >= 40 ? "bg-amber-500" : "bg-emerald-500"}`} 
                      style={{ width: `${pt.score}%` }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Selected department rules decomposition and 7-day trend (Action panel) */}
      <div className={`bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3.5" : "p-5"}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-orange-500" />
            <h4 className="text-xs font-bold text-slate-800">
              车间级风险深度透视：<span className="text-orange-600">【{activeDept}】</span>
            </h4>
          </div>

          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
            {Object.keys(department_details).map((deptName) => (
              <button
                key={deptName}
                onClick={() => setSelectedDept(deptName)}
                className={`px-2 py-0.5 text-xs rounded transition-all cursor-pointer ${
                  activeDept === deptName 
                    ? "bg-orange-500 text-slate-950 font-bold" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {deptName}
              </button>
            ))}
          </div>
        </div>

        {currentDetail ? (
          <div className={`grid grid-cols-1 lg:grid-cols-12 ${isFoldable ? "gap-4" : "gap-6"} items-stretch`}>
            
            {/* Rule Factors */}
            <div className={`lg:col-span-4 ${isFoldable ? "space-y-3" : "space-y-4"}`}>
              <span className="text-[11px] text-slate-500 font-bold block mb-1">① 核心规则因子得分扣分拆解</span>
              <div className="space-y-2">
                {currentDetail.factors?.map((f, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-700">{f.name}</span>
                      <span className={`font-mono text-[9px] px-1 py-0.5 rounded ${
                        f.level === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        指数: {f.score}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${f.level === "high" ? "bg-rose-500" : "bg-amber-500"}`} 
                        style={{ width: `${f.score}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-day trend */}
            <div className={`lg:col-span-5 bg-slate-50/50 border border-slate-100 rounded-xl ${isFoldable ? "p-3" : "p-4"}`}>
              <span className="text-[11px] text-slate-500 font-bold block mb-1.5">② 近7天工时负荷健康走势</span>
              <div className={isFoldable ? "h-[120px]" : "h-44"}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentDetail.trend_7_days} margin={{ left: -25, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                      labelStyle={{ color: "#475569", fontWeight: "bold" }}
                    />
                    <Line type="monotone" name="实际工时" dataKey="hours" stroke="#f97316" strokeWidth={2.5} dot={{ fill: "#f97316" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Staff list */}
            <div className="lg:col-span-3 space-y-2">
              <span className="text-[11px] text-slate-500 font-bold block mb-1.5">③ 重点异常工时提示员工</span>
              <div className="space-y-1.5">
                {currentDetail.staff?.map((s, idx) => (
                  <div key={idx} className="p-2 bg-slate-50/50 rounded-lg border border-slate-100 flex justify-between items-center text-xs hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="font-semibold text-slate-800 block">{s.name}</span>
                      <span className="text-[10px] text-slate-400 block">疲劳: {s.risk_score}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs">
            暂无此车间的合规深度审计信息
          </div>
        )}
      </div>

    </div>
  );
}
