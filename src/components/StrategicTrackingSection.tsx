import React from "react";
import { useDevice } from "../context/DeviceContext";

export default function StrategicTrackingSection({ data }: any) {
  return (
    <div className="p-8 text-center text-slate-400">
      <h2 className="text-xl font-bold text-slate-800 mb-2">管理追踪与干预</h2>
      <p>最近 14 天风险趋势、重点部门规则拆解</p>
      <p className="mt-4 text-xs">开发中...</p>
    </div>
  );
}
