import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FeatureDriftChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100" style={{ height: '400px' }}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Feature Drift (PSI)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
          <XAxis type="number" domain={[0, 0.5]} />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="psi" fill="#3b82f6" radius={[0, 4, 4, 0]} name="PSI" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureDriftChart;
