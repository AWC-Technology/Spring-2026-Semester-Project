import { useState } from "react";
import * as svgPathsModule from "../../imports/svg-hie2h677dz";
const imgLogo = null;
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";

const svgPaths = (svgPathsModule as any).default || svgPathsModule;

interface SidebarProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Sidebar({ user, onLogout, currentView, onNavigate, isDarkMode, onToggleDarkMode }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: svgPaths.p2fdc1580 },
    { id: "courses", label: "Courses", icon: svgPaths.p2b252d80 },
    { id: "professors", label: "Professors", icon: svgPaths.p39b46a00 },
    { id: "settings", label: "Settings", icon: svgPaths.p2e787500 },
  ];

  return (
    <div
      className={`bg-[#7a5093] flex flex-col justify-between transition-all duration-300 shadow-lg h-screen sticky top-0 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex flex-col gap-12 p-6">
        {/* Logo and Brand */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-4 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 relative shrink-0">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">CC</span>
              </div>
            </div>
            {!isCollapsed && (
              <span className="text-white font-semibold text-xl">CourseCompass</span>
            )}
          </button>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-white hover:bg-[#8a60a3] p-1 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Collapsed Toggle */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-white hover:bg-[#8a60a3] p-2 rounded transition-colors mx-auto"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Navigation Items */}
        <div className="flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-2 py-3 rounded transition-colors ${
                currentView === item.id
                  ? "bg-[#8a60a3]"
                  : "hover:bg-[#8a60a3]/50"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 28 28"
                >
                  <path d={item.icon} fill="white" />
                </svg>
              </div>
              {!isCollapsed && (
                <span className="text-white text-base whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-6 p-6">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => onToggleDarkMode()}
          className={`flex items-center gap-3 px-2 py-3 rounded transition-all hover:bg-[#8a60a3]/50 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 flex items-center justify-center">
                {isDarkMode ? (
                  <Moon className="w-6 h-6 text-white" />
                ) : (
                  <Sun className="w-6 h-6 text-white" />
                )}
              </div>
              <span className="text-white text-base">Dark Mode</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 flex items-center justify-center">
              {isDarkMode ? (
                <Moon className="w-6 h-6 text-white" />
              ) : (
                <Sun className="w-6 h-6 text-white" />
              )}
            </div>
          )}
          {!isCollapsed && (
            <div
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                isDarkMode ? "bg-white/30" : "bg-white/20"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all duration-300 ${
                  isDarkMode
                    ? "left-[26px] bg-white"
                    : "left-0.5 bg-white/80"
                }`}
              />
            </div>
          )}
        </button>

        {/* Logout Button */}
        {user && (
          <button
            onClick={onLogout}
            className={`flex items-center gap-3 px-2 py-3 rounded bg-[#320e3b] hover:bg-[#4a1555] transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 29 28"
              >
                <path d={svgPaths.p27647300} fill="white" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="text-white text-base font-semibold whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}