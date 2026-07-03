import React, { useState } from "react";
import { useDevice } from "../context/DeviceContext";
import {
  LayoutDashboard,
  Grid,
  Calculator,
  DollarSign,
  Users,
  Contact,
  RefreshCw,
  TrendingUp,
  PieChart,
  Briefcase,
  AlertTriangle,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Calendar,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  Award,
  Layers,
  Menu,
  X,
} from "lucide-react";

export type ActiveTab =
  | "overview"
  | "work_matrix"
  | "total_cost_matrix"
  | "student_meal_cost"
  | "department"
  | "employee"
  | "support"
  | "efficiency"
  | "cost_center"
  | "position_cost"
  | "risk"
  | "strategic"
  | "baimao"
  | "campus"
  | "convenience"
  | "third_party";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  availableDates: string[];
  username: string;
  onLogout: () => void;
  isDemo: boolean;
  setIsDemo: (demo: boolean) => void;
  isDateLoading: boolean;
}

export default function DashboardLayout({
  children,
  activeTab,
  setActiveTab,
  selectedDate,
  setSelectedDate,
  availableDates,
  username,
  onLogout,
  isDemo,
  setIsDemo,
  isDateLoading
}: DashboardLayoutProps) {
  const { mode } = useDevice();
  const isFoldable = mode === "foldable-inner";

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1200;
    }
    return true;
  });
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isSidebarCollapsed = collapsed || isFoldable;

  // Chapters & Navigation Definitions
  const menuItems = [
    { id: "overview", label: "1. 经营总览", icon: LayoutDashboard, category: "核心看板" },
    { id: "work_matrix", label: "2. 工时矩阵", icon: Grid, category: "核心看板" },
    { id: "total_cost_matrix", label: "3. 总成本矩阵", icon: Calculator, category: "核心看板" },
    { id: "student_meal_cost", label: "4. 学生餐成本", icon: DollarSign, category: "核心看板" },
    { id: "department", label: "5. 部门穿透", icon: Users, category: "穿透诊断" },
    { id: "employee", label: "6. 员工画像", icon: Contact, category: "穿透诊断" },
    { id: "support", label: "7. 支援工时", icon: RefreshCw, category: "专项分析" },
    { id: "efficiency", label: "8. 经营效率", icon: TrendingUp, category: "专项分析" },
    { id: "cost_center", label: "9. 成本中心", icon: PieChart, category: "专项分析" },
    { id: "position_cost", label: "10. 职位成本", icon: Briefcase, category: "专项分析" },
    { id: "risk", label: "11. 风险管控", icon: AlertTriangle, category: "安全驾驶" },
    { id: "strategic", label: "12. 管理追踪", icon: ClipboardList, category: "安全驾驶" },
    // NEW monthly HR matrices required by handoff
    { id: "baimao", label: "13. 白猫工时/成本", icon: Award, category: "月度核算" },
    { id: "campus", label: "14. 校园兼职成本", icon: GraduationCap, category: "月度核算" },
    { id: "convenience", label: "15. 方便菜肴工时", icon: Sparkles, category: "月度核算" },
    { id: "third_party", label: "16. 第三方工时/成本", icon: Layers, category: "月度核算" },
  ];

  const categories = ["核心看板", "穿透诊断", "专项分析", "安全驾驶", "月度核算"];

  return (
    <div className="w-full h-full flex bg-slate-50 font-sans text-slate-800 relative overflow-hidden">
      {/* 0. Mobile Drawer Overlay Backdrop & Panel */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
      
      <aside
        className={`fixed inset-y-0 left-0 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 border-r border-slate-800 w-64 z-50 shadow-2xl ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800 shrink-0 bg-slate-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-slate-950 shrink-0 shadow-md">
              鲜
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-100">鲜誉运营驾驶舱</span>
              <span className="text-[9px] font-mono tracking-widest text-orange-400">EXECUTIVE COCKPIT</span>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Drawer Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto touch-scroll py-4 px-2 space-y-4 select-none">
          {categories.map((cat) => {
            const itemsInCat = menuItems.filter((item) => item.category === cat);
            return (
              <div key={cat} className="space-y-1">
                <h4 className="text-[10px] font-bold text-slate-500 px-3 uppercase tracking-wider">
                  {cat}
                </h4>
                {itemsInCat.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as ActiveTab);
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left group cursor-pointer ${
                        isActive
                          ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/15"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      <Icon size={15} className={`shrink-0 ${isActive ? "text-slate-950 font-bold" : "text-slate-400 group-hover:text-slate-200"}`} />
                      <span className="truncate font-bold tracking-wide text-slate-300 group-hover:text-white">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-slate-800 p-3 shrink-0 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-[170px]">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                <User size={14} />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[11px] font-bold text-slate-200 truncate">{username}</span>
                <span className="text-[9px] text-slate-500">审计授权: VIP</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                onLogout();
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
              title="退出登录"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* 1. Collapsible Left Sidebar */}
      <aside
        className={`bg-slate-900 text-slate-100 flex flex-col transition-all duration-300 border-r border-slate-800 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        } shrink-0 z-20 h-full relative`}
      >
        {/* Logo Banner */}
        <div 
          onClick={() => {
            if (isSidebarCollapsed) {
              setIsDrawerOpen(true);
            }
          }}
          className={`flex items-center justify-between px-4 border-b border-slate-800 shrink-0 ${
            isFoldable ? "h-12" : "h-16"
          } ${isSidebarCollapsed ? "cursor-pointer hover:bg-slate-800/40 transition-colors" : ""}`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-slate-950 shrink-0 shadow-md">
              鲜
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-100 whitespace-nowrap">鲜誉运营驾驶舱</span>
                <span className="text-[9px] font-mono tracking-widest text-orange-400">EXECUTIVE COCKPIT</span>
              </div>
            )}
          </div>
          {!isFoldable && !isSidebarCollapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(!collapsed);
              }}
              className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ChevronLeft size={12} />
            </button>
          )}
          {!isFoldable && isSidebarCollapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(!collapsed);
              }}
              className="hidden"
            >
              <ChevronRight size={12} />
            </button>
          )}
        </div>

        {/* Scrollable Navigation Menu Grouped by Category */}
        <div className="flex-1 overflow-y-auto touch-scroll py-4 px-2 space-y-4 select-none">
          {categories.map((cat) => {
            const itemsInCat = menuItems.filter((item) => item.category === cat);
            return (
              <div key={cat} className="space-y-1">
                {!isSidebarCollapsed && (
                  <h4 className="text-[10px] font-bold text-slate-500 px-3 uppercase tracking-wider">
                    {cat}
                  </h4>
                )}
                {itemsInCat.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as ActiveTab)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left group ${
                        isActive
                          ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/15"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <Icon size={15} className={`shrink-0 ${isActive ? "text-slate-950 font-bold" : "text-slate-400 group-hover:text-slate-200"}`} />
                      {!isSidebarCollapsed && (
                        <span className="truncate font-bold tracking-wide">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer User Section */}
        <div className="border-t border-slate-800 p-3 shrink-0 bg-slate-950/40">
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 max-w-[140px]">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                  <User size={14} />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[11px] font-bold text-slate-200 truncate">{username}</span>
                  <span className="text-[9px] text-slate-500">审计授权: VIP</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
                title="退出登录"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="w-full flex justify-center py-2 text-slate-400 hover:text-rose-400"
              title="退出登录"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Right Main View Frame */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
        {/* Top Header Controls */}
        <header className={`bg-white border-b border-slate-100 flex items-center justify-between shrink-0 select-none ${
          isFoldable ? "h-12 px-3" : "h-16 px-6"
        }`}>
          {/* Section Breadcrumb */}
          <div className="flex items-center gap-2.5">
            {isSidebarCollapsed && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors mr-1 shrink-0 cursor-pointer"
                title="展开导航菜单"
              >
                <Menu size={15} />
              </button>
            )}
            <h3 className={`font-bold text-slate-900 font-display tracking-tight truncate ${
              isFoldable ? "text-xs max-w-[100px]" : "text-base"
            }`}>
              {menuItems.find((m) => m.id === activeTab)?.label.substring(3)}
            </h3>
            {!["work_matrix", "total_cost_matrix", "student_meal_cost", "baimao", "campus", "convenience", "third_party"].includes(activeTab) && (
              <>
                <span className="text-slate-300 text-xs font-light">|</span>
                {/* Interactive Selectable Audit Date Tool */}
                <div className="relative">
                  <button
                    onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                    className={`rounded-xl border text-[11px] font-medium flex items-center gap-1.5 transition-all bg-slate-50 border-slate-200 hover:border-slate-300 active:bg-slate-100 ${
                      isFoldable ? "px-2 py-1" : "px-3 py-1.5"
                    } ${isDateLoading ? "animate-pulse" : ""}`}
                  >
                    <Calendar size={12} className="text-orange-500 font-bold" />
                    {!isFoldable && <span className="text-slate-600">审计工时日期:</span>}
                    <span className="text-slate-900 font-bold font-mono">{selectedDate}</span>
                    <span className="text-[9px] text-slate-400">▼</span>
                  </button>

                  {dateDropdownOpen && (
                    <div className="absolute top-9 left-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 w-48 z-50 text-xs animate-fadeIn">
                      <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 tracking-wider uppercase border-b border-slate-100 mb-1">
                        选择可用工时
                      </div>
                      {availableDates.map((dateVal) => (
                        <button
                          key={dateVal}
                          onClick={() => {
                            setSelectedDate(dateVal);
                            setDateDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between font-mono ${
                            selectedDate === dateVal ? "text-orange-600 font-bold bg-orange-50/40" : "text-slate-600"
                          }`}
                        >
                          <span>{dateVal}</span>
                          {selectedDate === dateVal && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Area Control Center */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <button 
              onClick={() => {
                window.location.reload();
              }}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="刷新数据"
            >
              <RefreshCw size={13} className={isDateLoading ? "animate-spin text-orange-500" : ""} />
            </button>
          </div>
        </header>

        {/* Global Loading Overlay */}
        {isDateLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-50 animate-fadeIn">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg relative">
              <RefreshCw size={20} className="text-orange-500 animate-spin" />
            </div>
            <span className="text-xs text-slate-600 mt-3 font-semibold tracking-wide">
              正在同步审计数据，穿透计算中...
            </span>
          </div>
        )}

        {/* Content Viewport */}
        <div className={`flex-1 overflow-y-auto touch-scroll bg-slate-50 ${
          isFoldable ? "p-3 space-y-3" : "p-6 space-y-6"
        }`}>
          {children}
        </div>
      </main>
    </div>
  );
}
