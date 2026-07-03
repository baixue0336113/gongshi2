import React, { useState } from "react";
import { SupportHoursData, SupportRecord } from "../types";
import { useDevice } from "../context/DeviceContext";
import { Clock, Users, Shield, ArrowRight, Filter, BarChart, Activity, DollarSign } from "lucide-react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

interface SupportSectionProps {
  data: SupportHoursData;
}

export default function SupportSection({ data }: SupportSectionProps) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  const [sourceFilter, setSourceFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<SupportRecord | null>(null);

  if (!data) return <div className="text-slate-500 p-6 text-xs font-semibold">暂无支援工时数据</div>;

  const { range, records = [], filters = { supportDepartments: [], outgoingDepartments: [] }, ranking = [], trend = [] } = data;

  // Filter records
  const filteredRecords = records.filter(rec => {
    const matchesSource = sourceFilter === "all" || rec.source_department === sourceFilter;
    const matchesTarget = targetFilter === "all" || rec.target_department === targetFilter;
    return matchesSource && matchesTarget;
  });

  const totalHours = filteredRecords.reduce((sum, r) => sum + r.support_hours, 0);
  const totalCostSaved = filteredRecords.reduce((sum, r) => sum + r.cost_saved, 0);

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* Date Range & Filter header */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase">核对口径日期范围:</span>
          <h3 className="text-xs font-bold text-slate-800 font-mono mt-0.5">{range}</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter size={12} className="text-orange-500" />
            <span className="text-[11px] font-medium">派出部门:</span>
            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 text-xs outline-none focus:border-orange-500"
            >
              <option value="all">全部</option>
              {filters.supportDepartments?.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter size={12} className="text-orange-500" />
            <span className="text-[11px] font-medium">受援部门:</span>
            <select 
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 text-xs outline-none focus:border-orange-500"
            >
              <option value="all">全部</option>
              {filters.outgoingDepartments?.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">过滤累计支援工时</span>
            <h2 className="text-base font-bold font-mono text-orange-600 mt-0.5">{totalHours} h</h2>
            <p className="text-[9px] text-slate-500">跨工段合理调配总时长</p>
          </div>
          <Clock className="text-orange-500/20" size={28} />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">结转人工成本</span>
            <h2 className="text-base font-bold font-mono text-emerald-600 mt-0.5">¥{totalCostSaved.toLocaleString()}</h2>
            <p className="text-[9px] text-slate-500">跨工段调配对应成本</p>
          </div>
          <DollarSign className="text-emerald-500/20" size={28} />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">出勤支援人次</span>
            <h2 className="text-base font-bold font-mono text-blue-600 mt-0.5">
              {filteredRecords.reduce((sum, r) => sum + r.people_count, 0)} 人天
            </h2>
            <p className="text-[9px] text-slate-500">完成双向调配登记总人次</p>
          </div>
          <Users className="text-blue-500/20" size={28} />
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Support hours trend (Left 7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Activity size={14} className="text-orange-500" />
              <h3 className="text-xs font-bold text-slate-800">每日支援工时流动轨迹</h3>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ left: -25, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
                <Line type="monotone" dataKey="hours" name="支援工时" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Support rank chart (Right 5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <BarChart size={14} className="text-orange-500" />
              <h3 className="text-xs font-bold text-slate-800">受援部门接收工时权重</h3>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={ranking} layout="vertical" margin={{ left: -10, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={9} />
                <YAxis type="category" dataKey="department_name" stroke="#94a3b8" fontSize={9} width={70} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
                <Bar dataKey="hours" name="累计工时" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={10} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Details list and table view */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        {/* Support Records Table */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <h4 className="text-xs font-bold text-slate-800 mb-3">确认支援调配记录明细</h4>
          
          <div className="overflow-x-auto matrix-scroll">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-2 px-1">日期</th>
                  <th className="py-2 px-1">派出部门 (支援源)</th>
                  <th className="py-2 px-1"></th>
                  <th className="py-2 px-1">受援部门 (受支援)</th>
                  <th className="py-2 px-1 text-right">工时</th>
                  <th className="py-2 px-1 text-right">人数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.map((rec) => (
                  <tr 
                    key={rec.id} 
                    onClick={() => setSelectedRecord(rec)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedRecord?.id === rec.id ? "bg-orange-50/50" : ""}`}
                  >
                    <td className="py-2.5 px-1 font-mono text-slate-500">{rec.date}</td>
                    <td className="py-2.5 px-1 font-bold text-slate-700">{rec.source_department}</td>
                    <td className="py-2.5 px-0 text-orange-500"><ArrowRight size={11} /></td>
                    <td className="py-2.5 px-1 font-bold text-slate-700">{rec.target_department}</td>
                    <td className="py-2.5 px-1 text-right text-orange-600 font-mono font-bold">{rec.support_hours}h</td>
                    <td className="py-2.5 px-1 text-right text-slate-500 font-mono">{rec.people_count}</td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      无对应筛选条件的支援工时记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected detail panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <h4 className="text-xs font-bold text-slate-800 mb-3">支援调配详情</h4>
          {selectedRecord ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100 text-[10px]">
                <div>
                  <span className="text-slate-400">流水编号</span>
                  <p className="font-mono font-bold text-slate-600">{selectedRecord.id}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">登记日期</span>
                  <p className="font-mono font-bold text-slate-600">{selectedRecord.date}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase">调配流向:</div>
                <div className="p-2.5 bg-slate-50/50 rounded-lg flex items-center justify-between border border-slate-100">
                  <div className="text-center flex-1">
                    <span className="text-[9px] text-slate-400 block">派出源部门</span>
                    <span className="font-bold text-slate-700 text-[11px] mt-0.5 block">{selectedRecord.source_department}</span>
                  </div>
                  <ArrowRight size={12} className="text-orange-500 mx-2 shrink-0" />
                  <div className="text-center flex-1">
                    <span className="text-[9px] text-slate-400 block">接收受援部门</span>
                    <span className="font-bold text-slate-700 text-[11px] mt-0.5 block">{selectedRecord.target_department}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                  <span className="text-[9px] text-slate-400 block">调配工时</span>
                  <span className="text-sm font-mono font-bold text-orange-600 block mt-0.5">{selectedRecord.support_hours} h</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                  <span className="text-[9px] text-slate-400 block">调配人数</span>
                  <span className="text-sm font-mono font-bold text-blue-600 block mt-0.5">{selectedRecord.people_count} 人</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <p className="text-[9px] text-slate-500 mt-1 leading-normal text-center">
                  该支援调配折算结转人工成本为 <strong>¥{selectedRecord.cost_saved}</strong> 元。
                </p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-slate-400 text-[11px]">
              请点击左侧列表的任意一行，查看该笔跨工段支援工时的详情说明
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
