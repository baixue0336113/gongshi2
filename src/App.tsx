import React, { useState, useEffect } from "react";
import DeviceShell from "./components/DeviceShell";
import LoginPage from "./components/LoginPage";
import DashboardLayout, { ActiveTab } from "./components/DashboardLayout";
import OverviewSection from "./components/OverviewSection";
import MatrixSection from "./components/MatrixSection";
import DepartmentSection from "./components/DepartmentSection";
import EmployeeSection from "./components/EmployeeSection";
import SupportSection from "./components/SupportSection";
import EfficiencySection from "./components/EfficiencySection";
import CostCenterSection from "./components/CostCenterSection";
import PositionCostSection from "./components/PositionCostSection";
import RiskControlSection from "./components/RiskControlSection";
import StrategicTrackingSection from "./components/StrategicTrackingSection";
import { DashboardResponse } from "./types";
import { getMockDashboardData } from "./mockData";
import { ShieldAlert, RefreshCw } from "lucide-react";

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("xianyu_token"));
  const [username, setUsername] = useState<string>(() => localStorage.getItem("xianyu_username") || "系统管理员");
  
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-02");
  const [availableDates, setAvailableDates] = useState<string[]>([
    "2026-07-02",
    "2026-07-01",
    "2026-06-30",
    "2026-06-15",
    "2026-06-01",
    "2026-05-15"
  ]);

  const [isDemo, setIsDemo] = useState<boolean>(import.meta.env.DEV); // Mock in dev, real API in prod
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isDateLoading, setIsDateLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle successful login
  const handleLoginSuccess = (newToken: string, user: string) => {
    localStorage.setItem("xianyu_token", newToken);
    localStorage.setItem("xianyu_username", user);
    setToken(newToken);
    setUsername(user);
    
    // Distinguish between demo login and production login
    if (newToken === "demo_admin_token" || newToken === "mock_token_123456") {
      setIsDemo(true);
    } else {
      setIsDemo(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("xianyu_token");
    localStorage.removeItem("xianyu_username");
    setToken(null);
    setActiveTab("overview");
  };

  // Synchronize dashboard audit metrics
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      setIsDateLoading(true);
      setApiError(null);

      if (isDemo) {
        // Use high-fidelity local simulation sandbox
        setTimeout(() => {
          const mockRes = getMockDashboardData(selectedDate);
          setDashboardData(mockRes);
          setAvailableDates(mockRes.meta.available_review_dates);
          setIsDateLoading(false);
        }, 400);
      } else {
        // Request the real backend production server via our secure express proxy
        try {
          const res = await fetch(`/api/plugins/hr/executive-dashboard?review_date=${selectedDate}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            setDashboardData(data);
            if (data.meta?.available_review_dates) {
              setAvailableDates(data.meta.available_review_dates);
            }
            setApiError(null);
          } else {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "无法加载线上真实接口数据，鉴权可能失效。");
          }
        } catch (err: any) {
          console.error("Failed to contact production API:", err.message);
          setApiError(`线上接口连接失败: ${err.message}`);
          // DO NOT fallback to mock data in production
        } finally {
          setIsDateLoading(false);
        }
      }
    };

    loadData();
  }, [token, selectedDate, isDemo]);

  // If not logged in, show the branding lock screen
  if (!token) {
    return (
      <DeviceShell>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </DeviceShell>
    );
  }

  // If logged in, render core cockpit within Device Shell
  return (
    <DeviceShell>
      {dashboardData ? (
        <DashboardLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availableDates={availableDates}
          username={username}
          onLogout={handleLogout}
          isDemo={isDemo}
          setIsDemo={setIsDemo}
          isDateLoading={isDateLoading}
        >
          {/* Render Active Dashboard Tab */}
          {activeTab === "overview" && (
            <OverviewSection 
              summary={dashboardData.summary} 
              trendData={dashboardData.trend_data} 
              kpiFormulas={dashboardData.meta?.kpi_formulas || {}} 
              departments={dashboardData.departments} 
              supportHours={dashboardData.support_hours}
              efficiency={dashboardData.efficiency_dashboard}
              cost={dashboardData.cost}
              risk={dashboardData.risk}
            />
          )}

          {activeTab === "work_matrix" && (
            <MatrixSection
              scope="work_matrix"
              initialData={dashboardData.work_hour_matrix}
              selectedDate={selectedDate}
            />
          )}

          {activeTab === "student_meal_cost" && (
            <MatrixSection
              scope="student_meal_cost"
              initialData={dashboardData.cost_matrix}
              selectedDate={selectedDate}
            />
          )}

          {activeTab === "total_cost_matrix" && (
            <MatrixSection
              scope="total_cost_matrix"
              initialData={dashboardData.total_cost_matrix}
              selectedDate={selectedDate}
            />
          )}

          {activeTab === "department" && (
            <DepartmentSection departments={dashboardData.departments} />
          )}

          {activeTab === "employee" && (
            <EmployeeSection employees={dashboardData.employees} />
          )}

          {activeTab === "support" && (
            <SupportSection data={dashboardData.support_hours} />
          )}

          {activeTab === "efficiency" && (
            <EfficiencySection data={dashboardData.efficiency_dashboard} />
          )}

          {activeTab === "cost_center" && (
            <CostCenterSection data={dashboardData.cost} />
          )}

          {activeTab === "position_cost" && (
            <PositionCostSection data={dashboardData.position_cost} />
          )}

          {activeTab === "risk" && (
            <RiskControlSection data={dashboardData.risk} />
          )}

          {activeTab === "strategic" && (
            <StrategicTrackingSection data={dashboardData.strategic} />
          )}

          {/* New Dynamic Monthly HR Modules */}
          {activeTab === "baimao" && (
            <MatrixSection
              scope="baimao"
              initialData={{ days: [], rows: [], summary: {} }}
              selectedDate={selectedDate}
              isDemo={isDemo}
              token={token}
            />
          )}

          {activeTab === "campus" && (
            <MatrixSection
              scope="campus"
              initialData={{ days: [], rows: [], summary: {} }}
              selectedDate={selectedDate}
              isDemo={isDemo}
              token={token}
            />
          )}

          {activeTab === "convenience" && (
            <MatrixSection
              scope="convenience"
              initialData={{ days: [], rows: [], summary: {} }}
              selectedDate={selectedDate}
              isDemo={isDemo}
              token={token}
            />
          )}

          {activeTab === "third_party" && (
            <MatrixSection
              scope="third_party"
              initialData={{ days: [], rows: [], summary: {} }}
              selectedDate={selectedDate}
              isDemo={isDemo}
              token={token}
            />
          )}
        </DashboardLayout>
      ) : apiError ? (
        <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-900/50 flex items-center justify-center text-rose-500 shadow-lg mb-4">
            <ShieldAlert size={24} />
          </div>
          <span className="text-sm text-slate-200 font-semibold mb-2">数据加载失败</span>
          <span className="text-xs text-slate-400 max-w-md break-words">{apiError}</span>
          <button 
            onClick={handleLogout}
            className="mt-6 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors"
          >
            返回登录
          </button>
        </div>
      ) : (
        <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-500 shadow-lg">
            <RefreshCw size={24} className="animate-spin" />
          </div>
          <span className="text-xs text-slate-400 mt-4 font-semibold tracking-wider font-display">
            正在载入纯净版数据舱...
          </span>
        </div>
      )}
    </DeviceShell>
  );
}
