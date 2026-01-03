import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area
} from 'recharts';
import { PSI_TREND_DATA, COLORS } from '../constants';

const PsiTrendChart: React.FC = () => {
  return (
    <div className="w-full h-64 mt-2">
       <h3 className="text-sm font-semibold mb-4 text-[#ecf0f1] tracking-wide">
        PSI Score Over Time (30 days)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={PSI_TREND_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke={COLORS.textDim} 
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={6}
          />
          <YAxis 
            domain={[0, 0.5]} 
            stroke={COLORS.textDim} 
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: COLORS.card, borderColor: COLORS.accent, color: COLORS.text }}
            itemStyle={{ fontSize: 12 }}
            labelStyle={{ color: COLORS.textDim, marginBottom: 5 }}
          />
          
          {/* Thresholds */}
          <ReferenceLine y={0.1} stroke={COLORS.warning} strokeDasharray="3 3" label={{ position: 'right', value: 'Warning (0.1)', fill: COLORS.warning, fontSize: 10 }} />
          <ReferenceLine y={0.25} stroke={COLORS.critical} strokeDasharray="3 3" label={{ position: 'right', value: 'Critical (0.25)', fill: COLORS.critical, fontSize: 10 }} />

          <Line 
            type="monotone" 
            dataKey="psi" 
            stroke={COLORS.critical} 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PsiTrendChart;
