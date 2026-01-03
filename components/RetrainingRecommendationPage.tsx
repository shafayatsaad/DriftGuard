import React from 'react';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckSquare, 
  TrendingUp, 
  Database, 
  Cpu, 
  Briefcase,
  Play,
  FileText,
  X,
  AlertOctagon
} from 'lucide-react';
import { COLORS } from '../constants';

interface RetrainingPageProps {
  onBack: () => void;
}

const RetrainingRecommendationPage: React.FC<RetrainingPageProps> = ({ onBack }) => {
  return (
    <div className="max-w-[1600px] mx-auto p-6 animate-fadeIn">
      
      {/* HEADER / HERO SECTION */}
      <div className="mb-8">
        <button 
          onClick={onBack} 
          className="flex items-center text-sm text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </button>

        <div className="bg-gradient-to-r from-[#16213e] to-[#1a1a2e] rounded-xl border border-[#f39c12]/30 p-8 shadow-lg relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f39c12] opacity-5 rounded-bl-full pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start justify-between relative z-10">
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-[#f39c12]/20 rounded-2xl border border-[#f39c12]/40 shadow-[0_0_15px_rgba(243,156,18,0.2)]">
                <AlertTriangle className="w-12 h-12 text-[#f39c12]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                  Model Retraining Recommended
                </h1>
                <p className="text-gray-300 text-lg max-w-2xl">
                  Your model performance has degraded significantly due to recent shifts in feature distributions. Immediate action is advised to prevent revenue loss.
                </p>
              </div>
            </div>

            <div className="mt-6 md:mt-0 flex flex-col items-center">
              <div className="bg-[#f39c12] text-[#1a1a2e] text-3xl font-bold px-6 py-2 rounded-lg shadow-lg flex items-center">
                <AlertOctagon className="w-6 h-6 mr-2" />
                8.5/10
              </div>
              <span className="text-[#f39c12] font-bold mt-2 tracking-widest text-sm uppercase">Urgent Priority</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. WHY RETRAIN CARD */}
        <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#3498db]" />
            Why Retrain?
          </h2>

          {/* Lifecycle Timeline */}
          <div className="mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -translate-y-1/2 z-0"></div>
            <div className="flex justify-between relative z-10">
              {/* Point 1 */}
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-[#27ae60] rounded-full ring-4 ring-[#16213e]"></div>
                <div className="mt-2 text-center">
                  <div className="text-xs text-gray-400">Jan 1</div>
                  <div className="text-xs font-bold text-[#27ae60]">Deployed</div>
                </div>
              </div>
              {/* Point 2 */}
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-[#27ae60] rounded-full ring-4 ring-[#16213e]"></div>
                <div className="mt-2 text-center">
                  <div className="text-xs text-gray-400">Jan 15</div>
                  <div className="text-xs font-bold text-[#27ae60]">Peaked</div>
                </div>
              </div>
              {/* Point 3 */}
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-[#f39c12] rounded-full ring-4 ring-[#16213e]"></div>
                <div className="mt-2 text-center">
                  <div className="text-xs text-gray-400">Feb 5</div>
                  <div className="text-xs font-bold text-[#f39c12]">Drift Start</div>
                </div>
              </div>
              {/* Point 4 */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-[#e74c3c] rounded-full ring-4 ring-[#16213e] shadow-[0_0_10px_#e74c3c]"></div>
                <div className="mt-2 text-center">
                  <div className="text-xs text-gray-400">Feb 20</div>
                  <div className="text-xs font-bold text-[#e74c3c]">CRITICAL</div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Table */}
          <div className="overflow-hidden rounded-lg border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-[#0f1526] text-gray-400 font-medium">
                <tr>
                  <th className="px-4 py-3 text-left">Metric</th>
                  <th className="px-4 py-3 text-left">At Deploy</th>
                  <th className="px-4 py-3 text-left">Current</th>
                  <th className="px-4 py-3 text-right">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-[#1a1a2e]">
                <tr className="hover:bg-[#20203a]">
                  <td className="px-4 py-3 font-medium text-gray-300">Accuracy</td>
                  <td className="px-4 py-3 text-gray-400">95.2%</td>
                  <td className="px-4 py-3 text-white">87.3%</td>
                  <td className="px-4 py-3 text-right text-[#e74c3c] font-bold">-7.9%</td>
                </tr>
                <tr className="hover:bg-[#20203a]">
                  <td className="px-4 py-3 font-medium text-gray-300">Data Drift (PSI)</td>
                  <td className="px-4 py-3 text-gray-400">0.02</td>
                  <td className="px-4 py-3 text-white">0.31</td>
                  <td className="px-4 py-3 text-right text-[#e74c3c] font-bold">+1450%</td>
                </tr>
                <tr className="hover:bg-[#20203a]">
                  <td className="px-4 py-3 font-medium text-gray-300">Denial Rate</td>
                  <td className="px-4 py-3 text-gray-400">22.1%</td>
                  <td className="px-4 py-3 text-white">31.3%</td>
                  <td className="px-4 py-3 text-right text-[#e74c3c] font-bold">+41.6%</td>
                </tr>
                <tr className="hover:bg-[#20203a]">
                  <td className="px-4 py-3 font-medium text-gray-300">Appeal Win Rate</td>
                  <td className="px-4 py-3 text-gray-400">12%</td>
                  <td className="px-4 py-3 text-white">34%</td>
                  <td className="px-4 py-3 text-right text-[#e74c3c] font-bold">+183%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. COST BENEFIT ANALYSIS */}
        <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-[#27ae60]" />
            Cost-Benefit Analysis
          </h2>

          <div className="flex-1 grid grid-cols-2 gap-4">
            {/* Cost of Retraining */}
            <div className="bg-[#1a1a2e] rounded-lg p-4 border border-blue-900/30">
              <h3 className="text-[#3498db] font-bold mb-4 text-sm uppercase tracking-wider border-b border-blue-900/30 pb-2">
                Cost of Retraining
              </h3>
              <ul className="space-y-3 text-sm text-gray-400 mb-6">
                <li className="flex items-center"><Cpu className="w-4 h-4 mr-2 text-gray-500"/> Compute: 6-8 hours</li>
                <li className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-gray-500"/> Engineer: 4 hours</li>
                <li className="flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-500"/> Downtime: 15 mins</li>
              </ul>
              <div className="text-2xl font-bold text-white">~$850</div>
              <div className="text-xs text-gray-500">One-time cost</div>
            </div>

            {/* Cost of NOT Retraining */}
            <div className="bg-[#e74c3c]/5 rounded-lg p-4 border border-[#e74c3c]/20">
              <h3 className="text-[#e74c3c] font-bold mb-4 text-sm uppercase tracking-wider border-b border-[#e74c3c]/20 pb-2">
                Cost of NOT Retraining
              </h3>
              <ul className="space-y-3 text-sm text-gray-400 mb-6">
                <li className="flex items-center text-[#e74c3c]"><DollarSign className="w-4 h-4 mr-2"/> Revenue: -$12k/day</li>
                <li className="flex items-center text-gray-300">Customer complaints ↑</li>
                <li className="flex items-center text-gray-300">Regulatory risk: High</li>
              </ul>
              <div className="text-2xl font-bold text-[#e74c3c]">~$84,000</div>
              <div className="text-xs text-[#e74c3c]/70">Per week (Estimated)</div>
            </div>
          </div>
        </div>

        {/* 3. RECOMMENDED STRATEGY */}
        <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Database className="w-5 h-5 mr-2 text-[#9b59b6]" />
            Recommended Training Strategy
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Data Window</h3>
              <div className="bg-[#1a1a2e] p-3 rounded border border-gray-700 text-sm text-gray-400 space-y-1">
                <p>• Use last <strong>90 days</strong> of production data</p>
                <p>• Include <strong>45,892</strong> new labeled samples</p>
                <p className="text-[#e74c3c]">• Remove oldest 15% of training data (Drifted)</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Feature Engineering Updates</h3>
              <div className="bg-[#1a1a2e] p-3 rounded border border-gray-700 text-sm text-gray-400 space-y-1">
                <p>• <span className="text-[#27ae60] font-bold">+</span> 3 new derived features suggested (velocity)</p>
                <p>• <span className="text-[#e74c3c] font-bold">-</span> 2 features should be removed (low importance)</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Hyperparameters</h3>
              <div className="bg-[#1a1a2e] p-3 rounded border border-gray-700 text-sm text-gray-400 space-y-1">
                 <p>• Increase regularization (L2) <span className="text-xs text-gray-500 italic">- Overfitting detected</span></p>
                 <p>• Adjust class weights <span className="text-xs text-gray-500 italic">- Class imbalance shifted to 1:8</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. TIMELINE & ACTIONS */}
        <div className="space-y-6">
          {/* Timeline Card */}
          <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#ecf0f1]" />
              Retraining Timeline
            </h2>
            <div className="space-y-4">
               {[
                 { label: 'Data collection & validation', time: '2 hours', done: false },
                 { label: 'Feature engineering pipeline', time: '2 hours', done: false },
                 { label: 'Model training (GPU)', time: '4 hours', done: false },
                 { label: 'Validation & offline testing', time: '1 hour', done: false },
                 { label: 'A/B test deployment (Canary)', time: '1 week', done: false },
                 { label: 'Full production rollout', time: 'Pending results', done: false },
               ].map((step, idx) => (
                 <div key={idx} className="flex items-center">
                   <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${step.done ? 'bg-[#27ae60] border-[#27ae60]' : 'border-gray-600'}`}>
                      {step.done && <CheckSquare className="w-3 h-3 text-white" />}
                   </div>
                   <div className="flex-1">
                      <span className="text-sm text-gray-300">{step.label}</span>
                   </div>
                   <div className="text-xs text-gray-500 font-mono">{step.time}</div>
                 </div>
               ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg">
             <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
             <div className="flex flex-col space-y-3">
               <button className="w-full py-3 bg-[#f39c12] hover:bg-[#e67e22] text-[#1a1a2e] font-bold rounded-lg shadow-lg flex items-center justify-center transition-all">
                 <Play className="w-5 h-5 mr-2" /> Start Automated Retraining
               </button>
               <div className="grid grid-cols-2 gap-3">
                 <button className="py-3 bg-[#0f4c75] hover:bg-[#165a8a] text-white font-medium rounded-lg flex items-center justify-center transition-colors">
                    <Calendar className="w-4 h-4 mr-2" /> Schedule
                 </button>
                 <button className="py-3 border border-gray-600 hover:border-gray-400 text-gray-300 font-medium rounded-lg flex items-center justify-center transition-colors">
                    <FileText className="w-4 h-4 mr-2" /> Report
                 </button>
               </div>
               <button className="w-full py-2 text-gray-500 hover:text-gray-300 text-sm flex items-center justify-center mt-2">
                 <X className="w-4 h-4 mr-1" /> Dismiss Recommendation
               </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RetrainingRecommendationPage;
