import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowRight, Activity } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (token: string, username: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("请输入用户名和密码");
      return;
    }

    setLoading(true);
    setError(null);
    setIsSandboxMode(false);

    if (username.trim() === "admin" && password.trim() === "admin123") {
      onLoginSuccess("demo_admin_token", "测试管理员");
      return;
    }

    try {
      const response = await fetch("/api/platform/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access_token || data.token || "mock_token_123456";
        onLoginSuccess(token, username);
      } else {
        const errData = await response.json().catch(() => ({}));
        const errorMsg = errData.message || errData.error || "登录失败，用户名或密码错误";
        setError(errorMsg);
      }
    } catch (err: any) {
      setError(err.message || "登录请求失败，请检查网络连接");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 flex font-sans">
      {/* Left: Aesthetic Brand Banner for Foldable & Tablet */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 border-r border-slate-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract futuristic background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />

        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-slate-950 text-lg shadow-lg shadow-orange-500/25">
            鲜
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 tracking-wider">鲜誉集团经营舱</h2>
            <p className="text-[10px] text-orange-400 font-mono tracking-widest uppercase">EXECUTIVE COCKPIT</p>
          </div>
        </div>

        <div className="z-10 my-auto py-8">
          <span className="text-[10px] px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 font-medium inline-block mb-4">
            V2 Purity Platform
          </span>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight leading-tight font-display">
            数据驱动经营<br />
            精细穿透管理
          </h1>
          <p className="text-slate-400 mt-4 text-sm leading-relaxed max-w-sm">
            集成工时、学生餐成本、职位效能、劳务派遣及风险管控等核心指标。为决策层提供秒级穿透的正式级经营报表与分析驾驶舱。
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
            <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block">经营效率</span>
              <span className="text-lg font-bold text-orange-400">94.2%</span>
            </div>
            <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block">实时活跃人天</span>
              <span className="text-lg font-bold text-orange-400">342 人</span>
            </div>
          </div>
        </div>

        <div className="z-10 flex items-center justify-between text-xs text-slate-500">
          <span>安全凭证受 SSL / SHA256 强加密保护</span>
          <span>© 鲜誉科技 2026</span>
        </div>
      </div>

      {/* Right: Modern glassmorphic login card */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-12 xl:px-20 relative bg-slate-950">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="md:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-slate-950 text-sm">
                鲜
              </div>
              <span className="text-sm font-bold text-slate-100">鲜誉经营舱</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 font-display">
              管理员登录
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              请输入您的 V2 纯净经营舱管理平台账号以开始审计
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                用户名 / 手机号
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="请输入您的安全账号"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500 rounded-xl text-sm text-slate-200 outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 block">
                  安全登录密码
                </label>
                <a href="#forgot" className="text-[10px] text-orange-400 hover:underline">
                  忘记密码？
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="请输入您的安全密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-800 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500 rounded-xl text-sm text-slate-200 outline-none transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="bg-rose-950/40 border border-rose-900/50 p-3 rounded-xl flex items-start gap-2.5 text-xs text-rose-300 animate-fadeIn">
                <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20"
            >
              {loading ? (
                <>
                  <Activity size={16} className="animate-spin text-slate-950" />
                  <span>正在建立安全连接...</span>
                </>
              ) : (
                <>
                  <span>登 录 经 营 舱</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Tips for first use */}
          <div className="mt-8 pt-6 border-t border-slate-900 text-center flex flex-col gap-2">
            <span className="text-[11px] text-slate-500">
              首次使用？请向集团 HR 数字化中心申请访问秘钥。
            </span>
            <span className="text-[10px] text-slate-600 font-mono">
              (演示环境可使用 admin / admin123 登录体验)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
