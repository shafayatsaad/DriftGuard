import React from 'react';
import { Shield, Bell, User, ChevronDown, Activity, LayoutDashboard, RefreshCw, TrendingUp } from 'lucide-react';
import { COLORS } from '../constants';

interface HeaderProps {
  onNavigate?: (view: any) => void;
  currentView?: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 glass-panel sticky top-0 z-50 mb-6">
      
      {/* Left: Logo */}
      <div 
        className="flex items-center space-x-3 mb-4 md:mb-0 cursor-pointer group"
        onClick={() => onNavigate && onNavigate('dashboard')}
      >
        <div className="p-2 bg-[#00f3ff]/10 rounded-lg border border-[#00f3ff]/30 shadow-[0_0_15px_rgba(0,243,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,243,255,0.5)] transition-all">
          <Shield className="w-6 h-6 text-[#00f3ff]" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white text-glow">DriftGuard</span>
      </div>

      {/* Center: Controls & Nav */}
      <div className="flex items-center space-x-4">
        {/* Navigation Tabs (if onNavigate is present) */}
        {onNavigate && (
          <div className="flex bg-black/20 rounded-lg p-1 border border-white/10 mr-4 overflow-x-auto backdrop-blur-sm">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'dashboard' || currentView === 'feature-analysis' 
                ? 'bg-[#00f3ff]/20 text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.2)] border border-[#00f3ff]/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-3 h-3 mr-1.5" /> Dashboard
            </button>
            <button
              onClick={() => onNavigate('live')}
              className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'live' 
                ? 'bg-[#27ae60]/20 text-[#27ae60] shadow-[0_0_10px_rgba(39,174,96,0.2)] border border-[#27ae60]/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-3 h-3 mr-1.5" /> Live View
            </button>
            <button
              onClick={() => onNavigate('trends')}
              className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'trends' 
                ? 'bg-[#bc13fe]/20 text-[#bc13fe] shadow-[0_0_10px_rgba(188,19,254,0.2)] border border-[#bc13fe]/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-3 h-3 mr-1.5" /> Analytics
            </button>
            <button
              onClick={() => onNavigate('alerts')}
              className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'alerts' 
                ? 'bg-[#3498db]/20 text-[#3498db] shadow-[0_0_10px_rgba(52,152,219,0.2)] border border-[#3498db]/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bell className="w-3 h-3 mr-1.5" /> Alerts
            </button>
            <button
              onClick={() => onNavigate('retraining')}
              className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'retraining' 
                ? 'bg-[#f39c12]/20 text-[#f39c12] shadow-[0_0_10px_rgba(243,156,18,0.2)] border border-[#f39c12]/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <RefreshCw className="w-3 h-3 mr-1.5" /> Retrain
            </button>
          </div>
        )}

      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-6 mt-4 md:mt-0">
        <button 
          className="relative text-gray-400 hover:text-white transition-colors"
          onClick={() => onNavigate && onNavigate('alerts')}
        >
          <Bell className="w-6 h-6 hover:text-[#00f3ff] transition-colors" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff2a6d] text-[10px] font-bold text-white shadow-[0_0_8px_#ff2a6d]">
            3
          </span>
        </button>
        <button 
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          onClick={() => onNavigate && onNavigate('profile')}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f3ff] to-[#bc13fe] flex items-center justify-center border border-white/20 shadow-[0_0_10px_rgba(188,19,254,0.4)]">
            <User className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </header>
  );
};
export default Header;
