import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Metric } from '../types';
import { COLORS } from '../constants';

const MetricCard: React.FC<{ metric: Metric }> = ({ metric }) => {
  const isNegative = metric.change < 0;
  
  return (
    <div className="bg-[#1a1a2e] p-4 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{metric.label}</p>
      <div className="flex items-baseline space-x-3">
        <span className="text-2xl font-bold text-white">{metric.value}</span>
        <div className={`flex items-center text-xs font-bold ${isNegative ? 'text-[#e74c3c]' : 'text-[#27ae60]'}`}>
          {isNegative ? <ArrowDown className="w-3 h-3 mr-0.5" /> : <ArrowUp className="w-3 h-3 mr-0.5" />}
          {Math.abs(metric.change)}%
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
