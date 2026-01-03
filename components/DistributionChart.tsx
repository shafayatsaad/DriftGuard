import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { COLORS } from '../constants';

interface DistributionChartProps {
  data?: any[];
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="w-full h-80 flex items-center justify-center text-gray-500">No distribution data available</div>;
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" vertical={false} />
          <XAxis 
            dataKey="bin" 
            stroke={COLORS.textDim} 
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke={COLORS.textDim} 
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{ value: '% Samples', angle: -90, position: 'insideLeft', fill: COLORS.textDim, fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: '#ffffff10' }}
            contentStyle={{ backgroundColor: COLORS.card, borderColor: COLORS.accent, color: COLORS.text }}
            itemStyle={{ fontSize: 12 }}
            labelStyle={{ color: COLORS.textDim, marginBottom: 5 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          
          <Bar 
            dataKey="training" 
            name="Training Distribution" 
            fill={COLORS.chartLines.accuracy} 
            fillOpacity={0.6}
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="production" 
            name="Production Distribution" 
            fill={COLORS.critical} 
            fillOpacity={0.6}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionChart;
