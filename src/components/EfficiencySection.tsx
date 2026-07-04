import React, { useState } from "react";
import { useDevice } from "../context/DeviceContext";
import { TrendingUp, Users, DollarSign, Activity, BarChart2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

export default function EfficiencySection({ data }: any) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  // Mock specific data
  const trendData = [
    { date: "06-20", gross: 3200, costRate: 15 },
    { date: "06-21", gross: 3350, costRate: 14.8 },
    { date: "06-22", gross: 3100, costRate: 15.2 },
    { date: "06-23", gross: 3600, costRate: 14.5 },
    { date: "06-24", gross: 3800, costRate: 14.2 },
    { date: "06-25", gross: 4100, costRate: 13.8 },
    { date: "06-26", gross: 4250, costRate: 13.5 },
  ];

  const businessRank = [
    { name: "学生餐烹饪组", margin: 45.2 },
    { name: "方便菜酱包调配", margin: 42.1 },
    { name: "面食面点烘焙", margin: 38.5 },
    { name: "冷链配送车队", margin: 31.0 },
    { name: "初加工车间", margin: 28.5 },
  ];

  return (
    <div className={isFoldable ? "space-y-3" : "space-y-4"}>
      {/* KBIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "综合人均毛利", value: "¥4,250", change: "+4.5%", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "支撑时效系数", value: "1.14h", change: "-2.1%", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "标准工时达成率", value: "95.2%", change: "+1.8%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "薪资毛利效率", value: "7.2x", change: "+0.5x", icon: BarChart2, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((kbi, i) => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{kbi.label}</div>
              <div className="text-base font-bold text-slate-800 font-mono">{kbi.value}</div>
              <div className={`text-[9px] font-bold mt-1 ${kbi.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {kbi.change} 同比
              </div>
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kbi.bg} ${kbi.color}`}>
              <kbi.icon size={14} />
            </div>
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-1 ${isFoldable ? "gap-3" : "lg:grid-cols-2 gap-4"}`}>
        {/* Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-2 border-orange-500 pl-1.5">近30天人均毛利与成本率趋势</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis yAxisId="left" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Area yAxisId="left" type="monotone" dataKey="gross" name="人均毛利" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                <Area yAxisId="right" type="step" dataKey="costRate" name="支撑成本率(%)" stroke="#f59e0b" fill="none" strokeWidth={2} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col">
          <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-2 border-orange-500 pl-1.5">业务部门薪资毛利效率排名</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={businessRank} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Bar dataKey="margin" name="效率指数" radius={[0, 4, 4, 0]} barSize={12}>
                  {businessRank.map((_, i) => <Cell key={`cell-${i}`} fill={i < 2 ? '#f97316' : '#3b82f6'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Support Dept Heatmap */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className="text-[11px] font-bold text-slate-800 mb-3 flex items-center gap-1.5 border-l-2 border-orange-500 pl-1.5">支持部门支撑负荷与时效对比</h3>
        <div className="overflow-x-auto text-[10px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="p-2 font-bold">职能/支持部门</th>
                <th className="p-2 font-bold">支撑总工时</th>
                <th className="p-2 font-bold">关联业务营收</th>
                <th className="p-2 font-bold">支撑效率指数</th>
                <th className="p-2 font-bold">负荷状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-2 font-bold text-slate-700">品质检验中心</td>
                <td className="p-2 font-mono">1,240h</td>
                <td className="p-2 font-mono text-emerald-600">¥125万</td>
                <td className="p-2 font-mono font-bold text-orange-600">0.99h/百元</td>
                <td className="p-2"><span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-100">适中</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-2 font-bold text-slate-700">设备维保部</td>
                <td className="p-2 font-mono">850h</td>
                <td className="p-2 font-mono text-emerald-600">¥85万</td>
                <td className="p-2 font-mono font-bold text-rose-600">1.0h/百元</td>
                <td className="p-2"><span className="bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">过载</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
