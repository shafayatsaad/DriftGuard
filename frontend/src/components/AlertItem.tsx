import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Alert, AlertSeverity } from '../types';
import { COLORS } from '../constants';

interface AlertItemProps {
  alert: Alert;
  onAction?: () => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onAction }) => {
  const [expanded, setExpanded] = useState(false);

  const getIcon = () => {
    switch (alert.severity) {
      case AlertSeverity.CRITICAL:
        return <AlertCircle className="w-5 h-5 text-[#e74c3c]" />;
      case AlertSeverity.WARNING:
        return <AlertTriangle className="w-5 h-5 text-[#f39c12]" />;
      case AlertSeverity.INFO:
        return <Info className="w-5 h-5 text-[#3498db]" />;
    }
  };

  const getBorderColor = () => {
    switch (alert.severity) {
      case AlertSeverity.CRITICAL: return 'border-l-[#e74c3c]';
      case AlertSeverity.WARNING: return 'border-l-[#f39c12]';
      case AlertSeverity.INFO: return 'border-l-[#3498db]';
    }
  };

  return (
    <div className={`bg-[#1a1a2e] rounded-r-md border-l-4 ${getBorderColor()} p-3 mb-3 transition-all hover:bg-[#20203a]`}>
      <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">{getIcon()}</div>
          <div>
            <h4 className="text-sm font-semibold text-[#ecf0f1] leading-tight">{alert.message}</h4>
            <span className="text-xs text-gray-500 mt-1 block">{alert.timestamp}</span>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400 animate-fadeIn">
          <p>Additional details regarding this alert would appear here. Current value deviates significantly from the training baseline.</p>
          <div className="mt-2 flex space-x-2">
            {onAction && (
              <button 
                onClick={(e) => { e.stopPropagation(); onAction(); }}
                className="px-3 py-1 bg-[#0f4c75] text-white rounded hover:bg-[#165a8a] flex items-center transition-colors"
              >
                Investigate <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            )}
            <button className="px-3 py-1 border border-gray-600 rounded hover:border-gray-400 transition-colors">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertItem;