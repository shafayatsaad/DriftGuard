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
  Legend
} from 'recharts';
import { PERFORMANCE_DATA, COLORS } from '../constants';

const PerformanceChart: React.FC = () => {
  return (
    <div className="w-full h-64 mt-4">
      <h3 className="text-sm font-semibold mb-4 text-[#ecf0f1] tracking-wide">
        Performance Over Time (30 Days)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={PERFORMANCE_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke={COLORS.textDim} 
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={5}
          />
          <YAxis 
            domain={[60, 100]} 
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
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke={COLORS.chartLines.accuracy} 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="precision" 
            stroke={COLORS.chartLines.precision} 
            strokeWidth={2} 
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="recall" 
            stroke={COLORS.chartLines.recall} 
            strokeWidth={2} 
            dot={false}
          />

          {/* Drift Detected Marker */}
          <ReferenceLine x="Day 22" stroke={COLORS.critical} strokeDasharray="3 3">
            <text 
              x={0} y={-10} // Offset relative to the line 
              dy={0} 
              fill={COLORS.critical} 
              fontSize={10} 
              textAnchor="middle"
              className="font-bold"
            >
             Drift Detected
            </text>
          </ReferenceLine>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
