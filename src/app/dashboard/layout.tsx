"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Shield, 
  BarChart3, 
  Cpu, 
  Package,
  ChevronRight, 
  User,
  Building2,
  Rocket,
  LogOut,
  RocketIcon,
  Home,
  Users
} from "lucide-react";
import logo_black from "../../../public/logo-transparent.png";
import LivePage from "../live/page";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const tabs = [
    { name: "Summary", href: "/dashboard/summary", icon: Home },
    { name: "Inventory", href: "/dashboard/inventory", icon: Package },
    { name: "Cargo", href: "/dashboard/cargo", icon: BarChart3 },
    { name: "Missions", href: "/dashboard/missions", icon: RocketIcon },
    { name: "ISRU", href: "/dashboard/isru", icon: Cpu },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
  ];

  const isActiveTab = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed height and sticky */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 h-full
        bg-gradient-to-b from-gray-900 via-black to-gray-900
        border-r border-gray-800/50 
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:flex lg:flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/5 before:to-purple-500/5 before:opacity-50
      `}>
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-purple-500/10 opacity-30" />
        
        <div className="relative h-full flex flex-col p-6 overflow-y-auto">
          {/* Close button (mobile) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white lg:hidden
                     transition-colors duration-200 hover:bg-gray-800/50 rounded-lg z-10"
          >
            <X size={20} />
          </button>

          {/* Logo - Fixed at top */}
          <div className="mb-8 flex justify-start flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300" />
              <div className="relative bg-black p-3 rounded-lg">
                <Image 
                  src={logo_black} 
                  alt="Logo" 
                  width={100} 
                  height={50}
                  className="filter brightness-110" 
                />
              </div>
            </div>
          </div>

          {/* Dashboard Title - Fixed */}
          <div className="mb-8 flex-shrink-0">
            <h2 className="text-xl font-semibold text-white/90 tracking-wide">
              Dashboard
            </h2>
            <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent mt-2" />
          </div>

          {/* Navigation - Scrollable if needed */}
          <nav className="flex-1 space-y-1 min-h-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = isActiveTab(tab.href);
              
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl
                           transition-all duration-200 ease-in-out
                           hover:translate-x-1 hover:shadow-lg
                           border border-transparent
                           ${isActive 
                             ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10' 
                             : 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-700/50 hover:shadow-blue-500/10'
                           }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="relative">
                    <Icon 
                      size={18} 
                      className={`mr-3 transition-colors duration-200 
                        ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'}
                      `} 
                    />
                  </div>
                  <span className="flex-1 transition-colors duration-200">
                    {tab.name}
                  </span>
                  <ChevronRight 
                    size={14} 
                    className={`transition-all duration-200 transform
                      ${isActive 
                        ? 'opacity-100 translate-x-1 text-blue-400' 
                        : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-blue-400'
                      }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Bottom section - Fixed at bottom */}
          <div className="mt-auto pt-6 space-y-4 flex-shrink-0">
            {/* User Stats */}
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Dr. Sarah Chen</p>
                  <p className="text-xs text-gray-400 truncate">Mission Commander</p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400">Company</p>
                    <p className="text-white font-medium truncate">Mars Colonial</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400">Missions</p>
                    <p className="text-white font-medium">247</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl
                       text-gray-300 hover:text-red-400 hover:bg-red-500/10
                       transition-all duration-200 ease-in-out
                       border border-gray-800/50 hover:border-red-500/30
                       group"
            >
              <LogOut size={18} className="mr-3 transition-colors duration-200 group-hover:text-red-400" />
              <span className="flex-1 text-left transition-colors duration-200">
                Sign Out
              </span>
              <ChevronRight 
                size={14} 
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 
                         transform group-hover:translate-x-1 text-red-400" 
              />
            </button>
            
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          </div>
        </div>
      </aside>

      {/* Main content - Takes remaining space */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header - Fixed at top */}
        <header className="lg:hidden bg-black border-b border-gray-800 p-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-200 
                     hover:bg-gray-800/50 rounded-lg"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Main content area - Scrollable */}
        <main className="flex-1 bg-black p-4 lg:p-6 xl:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
            <LivePage />
          </div>
        </main>
      </div>
    </div>
  );
}