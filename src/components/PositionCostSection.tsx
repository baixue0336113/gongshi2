import React, { useState } from "react";
import { PositionCostData } from "../types";
import { useDevice } from "../context/DeviceContext";
import { Award, Briefcase, DollarSign, Filter, Search, Calendar, ChevronDown, Percent } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface PositionCostSectionProps {
  data: PositionCostData;
}

export default function PositionCostSection({ data }: PositionCostSectionProps) {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
  const [deptFilter, setDeptFilter] = useState("all");
  const [searchName, setSearchName] = useState("");
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  if (!data) return <div className="text-slate-400 p-6">暂无职位成本数据</div>;

  const {
    kpis = [],
    analysisRows = [],
    costRanking = [],
    concentration = [],
    concentrationTop5Ratio = 0,
    records = []
  } = data;

  // Filter department list derived from analysisRows
  const departments = ["all", ...Array.from(new Set(analysisRows.map(r => r.department)))];

  const filteredAnalysis = analysisRows.filter(row => {
    return deptFilter === "all" || row.department === deptFilter;
  });

  const filteredRecords = records.filter(rec => {
    const matchesSearch = !searchName.trim() || rec.name.toLowerCase().includes(searchName.trim().toLowerCase()) || rec.position.toLowerCase().includes(searchName.trim().toLowerCase());
    return matchesSearch;
  });

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-6"}>
      
      {/* 1. Header with Period Switcher */}
      <div className={`bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs ${
        isFoldable ? "p-3" : "p-4"
      }`}>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-orange-500" />
          <span className="text-xs text-slate-500">核对统计期间:</span>
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
            {(["month", "quarter", "year"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2 py-0.5 text-xs rounded transition-all cursor-pointer ${
                  period === p 
                    ? "bg-orange-500 text-slate-950 font-bold" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {p === "month" ? "本月" : p === "quarter" ? "本季度" : "本年度"}
              </button>
            ))}
          </div>
        </div>

        {/* Dept filter */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Filter size={13} className="text-orange-500" />
          <span>归属车间:</span>
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 rounded-lg px-2 py-0.5 text-xs focus:outline-none focus:border-orange-500"
          >
            <option value="all">全部部门</option>
            {departments.filter(d => d !== "all").map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. KPIs row */}
      <div className={`grid grid-cols-1 md:grid-cols-3 ${isFoldable ? "gap-3" : "gap-5"}`}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs ${
            isFoldable ? "p-3.5" : "p-5"
          }`}>
            <div>
              <span className="text-[11px] text-slate-500 font-bold block">{kpi.label}</span>
              <span className={`${isFoldable ? "text-xl mt-0.5" : "text-2xl mt-1"} font-bold font-mono text-slate-900 block`}>{kpi.value}</span>
              <p className="text-[10px] text-emerald-600 font-mono mt-0.5">环比增长 {kpi.compare}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 shadow-xs shrink-0">
              {idx === 0 ? <DollarSign size={18} /> : idx === 1 ? <Briefcase size={18} /> : <Percent size={18} />}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Top ranking positions and Concentration */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 ${isFoldable ? "gap-3" : "gap-6"}`}>
        
        {/* Cost ranking (Left 7 cols) */}
        <div className={`lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3.5" : "p-5"}`}>
          <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Briefcase size={14} className="text-orange-500" />
            <span>职位人力成本支出 TOP 排行榜</span>
          </h3>

          <div className={isFoldable ? "h-[160px]" : "h-56"}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costRanking} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="position" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  labelStyle={{ color: "#475569", fontWeight: "bold" }}
                />
                <Bar dataKey="cost" name="成本支出 (元)" fill="#f97316" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost concentration (Right 5 cols) */}
        <div className={`lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between ${
          isFoldable ? "p-3.5" : "p-5"
        }`}>
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-800">核心职位成本集中度</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded shrink-0">
                前五比: {concentrationTop5Ratio}%
              </span>
            </div>

            <div className="space-y-2.5">
              {concentration.map((item, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-600 font-semibold truncate max-w-[120px]">{item.name}</span>
                    <span className="text-slate-500 font-mono text-[11px]">¥{item.value?.toLocaleString()} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Cross Analysis Table */}
      <div className={`bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3.5" : "p-5"}`}>
        <h4 className="text-xs font-bold text-slate-800 mb-3">职位-车间人力成本核心交叉分析表</h4>
        <div className="overflow-x-auto matrix-scroll rounded-lg border border-slate-100">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2 px-2.5">核算职位</th>
                <th className="py-2 px-2.5">归属车间</th>
                <th className="py-2 px-2.5 text-right">编制人数</th>
                <th className="py-2 px-2.5 text-right">人均成本 / 月 (元)</th>
                <th className="py-2 px-2.5 text-right">支出总额 (元)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnalysis.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 px-2.5 font-semibold text-slate-800">{row.position}</td>
                  <td className="py-2.5 px-2.5 text-slate-600">{row.department}</td>
                  <td className="py-2.5 px-2.5 text-right text-slate-600 font-mono">{row.headcount}人</td>
                  <td className="py-2.5 px-2.5 text-right text-slate-500 font-mono">¥{row.avg_cost?.toLocaleString()}</td>
                  <td className="py-2.5 px-2.5 text-right text-orange-600 font-mono font-bold">¥{row.total_cost?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Employee breakdown searching */}
      <div className={`bg-white border border-slate-200 rounded-xl shadow-xs ${isFoldable ? "p-3.5" : "p-5"}`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3">
          <h4 className="text-xs font-bold text-slate-800">职位名下具体员工资费成本稽查明细</h4>
          <div className="relative w-full sm:w-64 shrink-0">
            <span className="absolute left-3 top-2 text-slate-400">
              <Search size={14} />
            </span>
            <input 
              type="text"
              placeholder="姓名或职位关键字..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 pl-9 pr-4 py-1.5 rounded-lg text-xs w-full focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto matrix-scroll rounded-lg border border-slate-100">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2 px-2.5">姓名</th>
                <th className="py-2 px-2.5">担任核算职位</th>
                <th className="py-2 px-2.5 text-right">协议底薪 (元)</th>
                <th className="py-2 px-2.5 text-right">岗贴/公摊 (元)</th>
                <th className="py-2 px-2.5 text-right">月核算人工成本 (元)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 px-2.5 font-semibold text-slate-800">{rec.name}</td>
                  <td className="py-2.5 px-2.5 text-slate-600">{rec.position}</td>
                  <td className="py-2.5 px-2.5 text-right text-slate-500 font-mono">¥{rec.salary?.toLocaleString()}</td>
                  <td className="py-2.5 px-2.5 text-right text-slate-500 font-mono">¥{rec.allowance?.toLocaleString()}</td>
                  <td className="py-2.5 px-2.5 text-right text-emerald-600 font-mono font-bold">¥{rec.cost?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
