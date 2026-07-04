import React from "react";
import { useDevice } from "../context/DeviceContext";

export default function PositionCostSection({ data }: any) {
  return (
    <div className="p-8 text-center text-slate-400">
      <h2 className="text-xl font-bold text-slate-800 mb-2">职位成本分析</h2>
      <p>各职位人均成本排行、成本集中度分析</p>
      <p className="mt-4 text-xs">开发中...</p>
    </div>
  );
}
