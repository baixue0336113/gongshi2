import React from "react";
import { Monitor, Tablet, RefreshCw, Layers, Smartphone, Info } from "lucide-react";
import { useDevice, DeviceMode } from "../context/DeviceContext";

interface DeviceShellProps {
  children: React.ReactNode;
}

export default function DeviceShell({ children }: DeviceShellProps) {
  const { mode, setMode } = useDevice();

  // Define viewport parameters for different CSS Logical Viewports
  const getDimensions = () => {
    switch (mode) {
      case "foldable-inner":
        return {
          width: "805px",
          height: "738px",
          name: "折叠屏展开态 (2416 x 2216)",
          physical: "物理 2416 x 2216, DPR=3.0",
          isFoldable: true,
          viewport: "805 x 738",
          dpr: "3.0"
        };
      case "tablet":
        return {
          width: "1248px",
          height: "832px",
          name: "商用大平板端 (3120 x 2080)",
          physical: "物理 3120 x 2080, DPR=2.5",
          isFoldable: false,
          viewport: "1248 x 832",
          dpr: "2.5"
        };
      default:
        return {
          width: "100%",
          height: "100vh",
          name: "自适应免容器全屏",
          physical: "本地浏览器窗口全尺寸自适应",
          isFoldable: false,
          viewport: "100% x 100%",
          dpr: "自适应"
        };
    }
  };

  const current = getDimensions();

  return (
    <div data-device={mode} className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Device Selector Toolbelt */}
      <header className="bg-slate-950 border-b border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3.5 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-slate-950 text-xs">
            鲜
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>鲜誉经营舱 Android APK 仿真驾驶端</span>
              <span className="px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded text-[9px] font-bold">DPR 模拟</span>
            </h1>
            <p className="text-[10px] text-slate-400">适配目标：平板端 (3120x2080) / 折叠屏展开态 (2416x2216) 核心双尺寸收敛</p>
          </div>
        </div>

        {/* CSS Viewport Selector Group */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-[9px] text-slate-500 px-2.5 font-bold uppercase tracking-wider">选择适配尺寸:</span>
            
            <button
              onClick={() => setMode("foldable-inner")}
              className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1.5 ${
                mode === "foldable-inner"
                  ? "bg-orange-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone size={11} />
              <span>折叠屏展开态 (2416x2216 / CSS 805x738)</span>
            </button>

            <button
              onClick={() => setMode("tablet")}
              className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1.5 ${
                mode === "tablet"
                  ? "bg-orange-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Tablet size={11} />
              <span>平板端 (3120x2080 / CSS 1248x832)</span>
            </button>
          </div>

          {/* Free adaptation */}
          <button
            onClick={() => setMode("fullscreen")}
            className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-1.5 ${
              mode === "fullscreen"
                ? "bg-orange-500 text-slate-950 border-orange-400"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            <Monitor size={11} />
            <span>免容器全屏</span>
          </button>
        </div>
      </header>

      {/* Simulated Display Specs Info Strip */}
      <div className="bg-orange-500/10 border-b border-orange-500/20 px-5 py-2 flex items-center justify-between text-[11px] text-orange-400 font-medium">
        <div className="flex items-center gap-2">
          <Info size={12} className="shrink-0" />
          <span>
            <strong>目标设备：</strong>
            <span className="text-white">{current.name}</span>
            <span className="mx-2 text-slate-600">|</span>
            <strong>物理分辨率：</strong>
            <span className="text-white font-mono">{current.physical}</span>
            <span className="mx-2 text-slate-600">|</span>
            <strong>CSS 逻辑视口（DPR折算）：</strong>
            <span className="text-white font-mono font-bold bg-slate-800/80 px-1.5 py-0.5 rounded text-[10px]">{current.viewport}</span>
          </span>
        </div>
        <div className="hidden md:block text-[10px] text-slate-400 font-mono">
          DPR 缩放比例: <span className="text-white font-bold">{current.dpr}</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-950 overflow-auto">
        {mode === "fullscreen" ? (
          <div data-device={mode} className="w-full h-full bg-slate-50 text-slate-900 overflow-hidden relative">
            {children}
          </div>
        ) : (
          /* Premium Physical Frame Simulation with exact scaling */
          <div
            style={{ width: current.width, height: current.height }}
            className="bg-slate-900 rounded-[30px] border-[10px] border-slate-800 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden relative transition-all duration-300 ease-in-out select-none"
          >
            {/* Camera Hole Notch */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-slate-950 z-50 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-900/40" />
            </div>

            {/* Android System Status Bar */}
            <div className="h-6 bg-slate-950 px-5 flex items-center justify-between text-[10px] font-medium tracking-tight text-slate-400 select-none border-b border-slate-900 z-40">
              <div className="flex items-center gap-1.5">
                <span>09:41</span>
                <span className="text-[8px] px-1 bg-slate-800 text-slate-300 rounded font-semibold">5G</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono text-[8px]">XIANYU OS 2.1</span>
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                <span className="text-slate-400">📶 Wi-Fi 6</span>
                <span className="text-slate-400">🔋 100%</span>
              </div>
            </div>

            {/* Simulated Android App View */}
            <div data-device={mode} className="flex-1 bg-slate-50 text-slate-900 overflow-hidden relative select-text">
              {children}
            </div>

            {/* Android Navigation Pill / Bottom Handle */}
            <div className="h-3 bg-slate-950 flex items-center justify-center z-40">
              <div className="w-24 h-0.5 rounded-full bg-slate-800" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
