import React from "react";
import { useDevice } from "../context/DeviceContext";

export default function RiskControlSection({ data }: any) {
  return (
    <div className="p-8 text-center text-slate-400">
      <h2 className="text-xl font-bold text-slate-800 mb-2">风险管理预警</h2>
      <p>规则风险热力图、今日风险恶化 TOP3、近 7 天工时走势</p>
      <p className="mt-4 text-xs">开发中...</p>
    </div>
  );
}
