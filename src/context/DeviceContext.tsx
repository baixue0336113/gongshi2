import React, { createContext, useContext, useState } from "react";

export type DeviceMode = "foldable-inner" | "tablet" | "fullscreen";

interface DeviceContextType {
  mode: DeviceMode;
  setMode: (mode: DeviceMode) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<DeviceMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("xianyu_device_mode") as DeviceMode;
      if (saved === "foldable-inner" || saved === "tablet" || saved === "fullscreen") {
        return saved;
      }
    }
    return "tablet"; // Default to tablet
  });

  const setMode = (newMode: DeviceMode) => {
    setModeState(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("xianyu_device_mode", newMode);
    }
  };

  return (
    <DeviceContext.Provider value={{ mode, setMode }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) {
    // Safe fallback to prevent crashes if rendered outside a provider
    return {
      mode: "tablet" as DeviceMode,
      setMode: () => {}
    };
  }
  return context;
}
