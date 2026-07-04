import React from "react";
import { useDevice } from "../context/DeviceContext";

export default function CostCenterSection({ data }: any) {
  return (
    <div className="p-8 text-center text-slate-400">
      <h2 className="text-xl font-bold text-slate-800 mb-2">成本中心分析</h2>
      <p>成本结构：正常工时、派遣、兼职、清洗、兜底小时工详细构成</p>
      <p className="mt-4 text-xs">开发中...</p>
    </div>
  );
}
