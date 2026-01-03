import React from 'react';
import { Shield, Bell, User, ChevronDown, Activity, LayoutDashboard, RefreshCw, TrendingUp } from 'lucide-react';
import { COLORS } from '../constants';

interface HeaderProps {
  onNavigate?: (view: any) => void;
  currentView?: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-[#16213e] shadow-md border-b border-gray-800 sticky top-0 z-50">
      
      {/* Left: Logo */}
      <div 
        className="flex items-center space-x-3 mb-4 md:mb-0 cursor-pointer"
        onClick={() => onNavigate && onNavigate('dashboard')}
      >
        <div className="p-2 bg-[#0f4c75] rounded-lg shadow-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">DriftGuard</span>
      </div>

      {/* Center: Controls & Nav */}
      <div className="flex items-center space-x-4">
        {/* Navigation Tabs (if onNavigate is present) */}
        {onNavigate && (
          <div className="flex bg-[#1a1a2e] rounded-lg p-1 border border-gray-700 mr-4 overflow-x-auto">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'dashboard' || currentView === 'feature-analysis' 
                ? 'bg-[#0f4c75] text-white shadow-sm' 
                : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3 h-3 mr-1.5" /> Dashboard
            </button>
            <button
              onClick={() => onNavigate('live')}
              className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'live' 
                ? 'bg-[#27ae60] text-white shadow-sm' 
                : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity className="w-3 h-3 mr-1.5" /> Live View
            </button>
            <button
              onClick={() => onNavigate('trends')}
              className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'trends' 
                ? 'bg-[#9b59b6] text-white shadow-sm' 
                : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3 h-3 mr-1.5" /> Analytics
            </button>
            <button
              onClick={() => onNavigate('alerts')}
              className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'alerts' 
                ? 'bg-[#3498db] text-white shadow-sm' 
                : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bell className="w-3 h-3 mr-1.5" /> Alerts
            </button>
            <button
              onClick={() => onNavigate('retraining')}
              className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'retraining' 
                ? 'bg-[#f39c12] text-[#1a1a2e] shadow-sm' 
                : 'text-gray-400 hover:text-white'
              }`}
            >
              <RefreshCw className="w-3 h-3 mr-1.5" /> Retrain
            </button>
          </div>
        )}

        {/* Model Selector */}
        <div className="relative group hidden lg:block">
          <button className="flex items-center space-x-2 bg-[#1a1a2e] border border-gray-700 hover:border-[#0f4c75] px-4 py-2 rounded-md transition-colors text-sm">
            <span className="text-[#ecf0f1]">Credit Scoring Model v2.3</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-6 mt-4 md:mt-0">
        <button 
          className="relative text-gray-400 hover:text-white transition-colors"
          onClick={() => onNavigate && onNavigate('alerts')}
        >
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e74c3c] text-[10px] font-bold text-white ring-2 ring-[#16213e]">
            3
          </span>
        </button>
        <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0f4c75] to-[#3282b8] flex items-center justify-center border border-gray-600">
            <User className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
