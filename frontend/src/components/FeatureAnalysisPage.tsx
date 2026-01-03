import React, { useEffect, useState } from 'react';
import { ChevronRight, RefreshCw, CheckCircle, Bell, Download, AlertTriangle, Loader2 } from 'lucide-react';
import DistributionChart from './DistributionChart';
import PsiTrendChart from './PsiTrendChart';

interface FeatureAnalysisPageProps {
  onBack: () => void;
  featureName: string;
}

const FeatureAnalysisPage: React.FC<FeatureAnalysisPageProps> = ({ onBack, featureName }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/feature-details/${featureName}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [featureName]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1a1a2e]">
        <Loader2 className="w-12 h-12 text-[#0f4c75] animate-spin" />
      </div>
    );
  }

  // Calculate change stats for the table
  const stats = [
    { metric: 'Mean', training: data.baseline_stats.mean.toFixed(0), production: data.production_stats.mean.toFixed(0), isBad: true },
    { metric: 'Median', training: data.baseline_stats.median.toFixed(0), production: data.production_stats.median.toFixed(0), isBad: true },
    { metric: 'Std Dev', training: data.baseline_stats.std.toFixed(0), production: data.production_stats.std.toFixed(0), isBad: true },
    { metric: 'Min', training: data.baseline_stats.min.toFixed(0), production: data.production_stats.min.toFixed(0), isBad: false },
    { metric: 'Max', training: data.baseline_stats.max.toFixed(0), production: data.production_stats.max.toFixed(0), isBad: true },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-6 animate-fadeIn">
      {/* Top Section */}
      <div className="mb-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
          <button onClick={onBack} className="hover:text-white transition-colors">Dashboard</button>
          <ChevronRight className="w-4 h-4" />
          <span>Feature Analysis</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white font-medium capitalize">{featureName}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white tracking-tight capitalize">{featureName}</h1>
            <span className="bg-[#0f4c75] text-xs font-semibold px-2 py-1 rounded text-white uppercase tracking-wider">Numerical</span>
            <span className={`text-white text-sm font-bold px-3 py-1 rounded-full flex items-center shadow-lg ${data.psi > 0.25 ? 'bg-[#e74c3c] shadow-red-900/20' : 'bg-[#f39c12]'}`}>
              PSI {data.psi.toFixed(2)}
            </span>
          </div>
          <div className="text-gray-400 text-sm mt-2 md:mt-0">
            Last updated: <span className="text-gray-300">Just now</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT SIDE (60%) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Distribution Chart Card */}
          <div className="bg-[#16213e] rounded-xl shadow-lg border border-gray-800 p-6">
            <h2 className="text-lg font-bold mb-6 text-gray-200">Distribution Comparison</h2>
            <DistributionChart data={data.chart_data} />
            
            {/* Stats Table */}
            <div className="mt-8 overflow-hidden rounded-lg border border-gray-800">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#0f1526] text-gray-400 uppercase text-xs font-medium">
                  <tr>
                    <th className="px-6 py-3">Metric</th>
                    <th className="px-6 py-3">Training</th>
                    <th className="px-6 py-3">Production</th>
                    <th className="px-6 py-3 text-right">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-[#1a1a2e]">
                  {stats.map((stat, idx) => {
                    const change = ((parseInt(stat.production) - parseInt(stat.training)) / parseInt(stat.training)) * 100;
                    return (
                      <tr key={idx} className="hover:bg-[#20203a] transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-300">{stat.metric}</td>
                        <td className="px-6 py-3 text-gray-400">{stat.training}</td>
                        <td className="px-6 py-3 text-gray-400">{stat.production}</td>
                        <td className={`px-6 py-3 text-right font-bold ${stat.isBad ? 'text-[#e74c3c]' : 'text-[#27ae60]'}`}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* PSI Trend Chart */}
          <div className="bg-[#16213e] rounded-xl shadow-lg border border-gray-800 p-6">
            <PsiTrendChart />
          </div>

        </div>

        {/* RIGHT SIDE (40%) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Drift Detection Details */}
          <div className="bg-[#16213e] rounded-xl shadow-lg border border-gray-800 p-6">
             <h2 className="text-lg font-bold mb-4 text-gray-200">Drift Detection Details</h2>
             <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Method</span>
                  <span className="text-white">Population Stability Index (PSI)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Threshold</span>
                  <span className="text-[#f39c12]">0.25</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Current Score</span>
                  <span className="text-[#e74c3c] font-bold">{data.psi.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Status</span>
                  <span className="text-[#e74c3c] font-bold flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1"/> {data.status}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Confidence</span>
                  <span className="text-[#27ae60]">98.7%</span>
                </div>
             </div>
          </div>

          {/* Impact Analysis */}
          <div className="bg-[#16213e] rounded-xl shadow-lg border border-gray-800 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-[#e74c3c] opacity-5 rounded-bl-full pointer-events-none"></div>
             <h2 className="text-lg font-bold mb-4 text-gray-200">Impact Analysis</h2>
             <div className="space-y-3">
                <div>
                  <div className="text-gray-400 text-xs uppercase mb-1">Predictions Affected</div>
                  <div className="text-xl font-bold text-white">~34% <span className="text-sm font-normal text-gray-500">of cases</span></div>
                </div>
                <div>
                   <div className="text-gray-400 text-xs uppercase mb-1">Performance Impact</div>
                   <div className="text-xl font-bold text-[#e74c3c]">-7.9% <span className="text-sm font-normal text-gray-500">accuracy</span></div>
                </div>
                <div className="pt-2 border-t border-gray-800 mt-2">
                   <div className="flex items-center space-x-2 text-[#e74c3c] font-semibold">
                      <AlertTriangle className="w-5 h-5"/>
                      <span>Recommendation: Immediate retraining required</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#16213e] rounded-xl shadow-lg border border-gray-800 p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-200">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center p-3 bg-[#0f4c75] hover:bg-[#165a8a] text-white rounded-lg transition-colors font-medium text-sm">
                <RefreshCw className="w-4 h-4 mr-2" /> Retrain
              </button>
              <button className="flex items-center justify-center p-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg transition-colors font-medium text-sm">
                <CheckCircle className="w-4 h-4 mr-2" /> Accept Drift
              </button>
              <button className="flex items-center justify-center p-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg transition-colors font-medium text-sm">
                <Bell className="w-4 h-4 mr-2" /> Alert Rule
              </button>
              <button className="flex items-center justify-center p-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg transition-colors font-medium text-sm">
                <Download className="w-4 h-4 mr-2" /> Export
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeatureAnalysisPage;
