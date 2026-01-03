import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Bell, 
  Mail, 
  Hash, 
  Link, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Check,
  X,
  Smartphone,
  Zap,
  Clock,
  Calendar
} from 'lucide-react';
import { COLORS } from '../constants';

interface AlertRule {
  id: number;
  name: string;
  status: 'active' | 'paused';
  severity: 'critical' | 'warning' | 'info';
  type: string;
  condition: string;
  currentValue: string;
  isTriggered: boolean;
  channels: string[];
  lastTriggered: string;
  note?: string;
}

const MOCK_RULES: AlertRule[] = [
  {
    id: 1,
    name: "Critical Performance Drop",
    status: 'active',
    severity: 'critical',
    type: 'Performance',
    condition: "Accuracy < 90%",
    currentValue: "87.3%",
    isTriggered: true,
    channels: ['Email', 'Slack', 'Webhook'],
    lastTriggered: "2 hours ago"
  },
  {
    id: 2,
    name: "High Data Drift",
    status: 'active',
    severity: 'warning',
    type: 'Drift',
    condition: "PSI > 0.25 on any feature",
    currentValue: "0.31 (income)",
    isTriggered: true,
    channels: ['Email', 'Slack'],
    lastTriggered: "5 hours ago"
  },
  {
    id: 3,
    name: "Prediction Distribution Shift",
    status: 'paused',
    severity: 'info',
    type: 'Drift',
    condition: "Denial rate change > 10%",
    currentValue: "+41.6% vs baseline",
    isTriggered: false, // Would trigger if active
    channels: ['Email'],
    lastTriggered: "3 days ago",
    note: "Paused during holiday season"
  }
];

const AlertConfigurationPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [rules, setRules] = useState<AlertRule[]>(MOCK_RULES);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    type: 'Model Performance',
    metric: 'Accuracy',
    operator: '<',
    threshold: '',
    window: '1h',
    severity: 'critical',
    channels: {
      email: true,
      slack: false,
      pagerduty: false,
      webhook: false,
      sms: false
    },
    frequency: 'immediate'
  });

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return COLORS.critical;
      case 'warning': return COLORS.warning;
      case 'info': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 animate-fadeIn">
      
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Alert Rules Configuration</h1>
          <p className="text-gray-400 text-sm">Configure when and how you want to be notified about model drift</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center bg-[#0f4c75] hover:bg-[#165a8a] text-white px-4 py-2 rounded-lg transition-colors shadow-lg font-medium"
          >
            <Plus className="w-5 h-5 mr-2" /> Create New Alert Rule
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT SIDEBAR (Filters) */}
        {!isCreating && (
          <div className="lg:w-[30%] space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search rules..." 
                className="w-full bg-[#16213e] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#0f4c75]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Groups */}
            <div className="bg-[#16213e] rounded-xl border border-gray-800 p-5 space-y-6">
              <div className="flex items-center text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">
                <Filter className="w-4 h-4 mr-2" /> Filters
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Status</label>
                <div className="space-y-2">
                  {['All', 'Active', 'Paused'].map(opt => (
                    <div 
                      key={opt} 
                      className={`flex items-center cursor-pointer p-2 rounded hover:bg-[#1a1a2e] transition-colors ${filterStatus === opt ? 'bg-[#1a1a2e] text-white' : 'text-gray-400'}`}
                      onClick={() => setFilterStatus(opt)}
                    >
                      <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${filterStatus === opt ? 'border-[#0f4c75]' : 'border-gray-600'}`}>
                        {filterStatus === opt && <div className="w-2 h-2 rounded-full bg-[#0f4c75]"></div>}
                      </div>
                      <span className="text-sm">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <label className="text-sm font-medium text-gray-300 mb-2 block">Severity</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Critical', 'Warning', 'Info'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setFilterSeverity(opt)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        filterSeverity === opt 
                        ? 'bg-[#0f4c75]/20 border-[#0f4c75] text-[#0f4c75]' 
                        : 'border-gray-700 text-gray-500 hover:border-gray-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

               <div className="border-t border-gray-800 pt-4">
                <label className="text-sm font-medium text-gray-300 mb-2 block">Type</label>
                <div className="space-y-2">
                   {['All', 'Performance', 'Drift', 'Data Quality'].map(opt => (
                    <div 
                      key={opt} 
                      className={`flex items-center cursor-pointer p-2 rounded hover:bg-[#1a1a2e] transition-colors ${filterType === opt ? 'bg-[#1a1a2e] text-white' : 'text-gray-400'}`}
                      onClick={() => setFilterType(opt)}
                    >
                      <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${filterType === opt ? 'border-[#0f4c75]' : 'border-gray-600'}`}>
                        {filterType === opt && <div className="w-2 h-2 rounded-full bg-[#0f4c75]"></div>}
                      </div>
                      <span className="text-sm">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT CONTENT (Rules List OR Create Form) */}
        <div className={isCreating ? 'w-full' : 'lg:w-[70%]'}>
          
          {isCreating ? (
            /* --- CREATE NEW RULE FORM --- */
            <div className="bg-[#16213e] rounded-xl border border-gray-800 p-8 shadow-lg animate-slideInRight">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center border-b border-gray-700 pb-4">
                <Plus className="w-5 h-5 mr-2 text-[#0f4c75]" /> Create New Alert Rule
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Column 1: Basics */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Rule Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Daily Drift Spike"
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-[#0f4c75]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <textarea 
                      placeholder="Describe the purpose of this alert..."
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg p-3 text-white h-24 focus:outline-none focus:border-[#0f4c75]"
                    />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2">Alert Type</label>
                     <select className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-[#0f4c75]">
                       <option>Model Performance</option>
                       <option>Data Drift</option>
                       <option>Prediction Drift</option>
                       <option>Data Quality</option>
                       <option>Custom Metric</option>
                     </select>
                  </div>

                  <div className="bg-[#1a1a2e] p-4 rounded-lg border border-gray-700">
                    <label className="block text-sm font-bold text-gray-300 mb-4 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-[#f39c12]" /> Condition Builder
                    </label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-xs text-gray-500 mb-1 block">Metric</span>
                        <select className="w-full bg-[#16213e] border border-gray-600 rounded p-2 text-sm text-white">
                           <option>Accuracy</option>
                           <option>PSI</option>
                           <option>Precision</option>
                           <option>Recall</option>
                           <option>F1-Score</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 mb-1 block">Operator</span>
                        <select className="w-full bg-[#16213e] border border-gray-600 rounded p-2 text-sm text-white">
                           <option>is less than (&lt;)</option>
                           <option>is greater than (&gt;)</option>
                           <option>equals (=)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500 mb-1 block">Threshold</span>
                        <input type="number" placeholder="0.90" className="w-full bg-[#16213e] border border-gray-600 rounded p-2 text-sm text-white" />
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 mb-1 block">Time Window</span>
                        <select className="w-full bg-[#16213e] border border-gray-600 rounded p-2 text-sm text-white">
                           <option>Real-time (Stream)</option>
                           <option>Last 1 hour</option>
                           <option>Last 6 hours</option>
                           <option>Last 24 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Configuration */}
                <div className="space-y-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Severity</label>
                    <div className="flex space-x-4">
                      {['critical', 'warning', 'info'].map((sev) => (
                        <label key={sev} className="flex items-center cursor-pointer">
                          <input type="radio" name="severity" className="hidden peer" defaultChecked={sev === 'critical'} />
                          <div className={`px-4 py-2 rounded-lg border border-gray-700 text-sm capitalize peer-checked:border-transparent peer-checked:text-white transition-all
                            ${sev === 'critical' ? 'peer-checked:bg-[#e74c3c]' : sev === 'warning' ? 'peer-checked:bg-[#f39c12]' : 'peer-checked:bg-[#3498db]'}
                          `}>
                             {sev}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2">Notification Channels</label>
                     <div className="space-y-3 bg-[#1a1a2e] p-4 rounded-lg border border-gray-700">
                        <label className="flex items-start space-x-3 cursor-pointer">
                           <input type="checkbox" className="mt-1" defaultChecked />
                           <div className="flex-1">
                             <div className="flex items-center text-sm font-medium text-gray-200">
                               <Mail className="w-4 h-4 mr-2" /> Email
                             </div>
                             <input type="text" defaultValue="ops@company.com" className="mt-2 w-full bg-[#16213e] border border-gray-600 rounded px-2 py-1 text-xs text-gray-300" />
                           </div>
                        </label>

                        <label className="flex items-start space-x-3 cursor-pointer">
                           <input type="checkbox" className="mt-1" defaultChecked />
                           <div className="flex-1">
                             <div className="flex items-center text-sm font-medium text-gray-200">
                               <Hash className="w-4 h-4 mr-2" /> Slack
                             </div>
                             <select className="mt-2 w-full bg-[#16213e] border border-gray-600 rounded px-2 py-1 text-xs text-gray-300">
                               <option>#ml-alerts</option>
                               <option>#engineering</option>
                               <option>#general</option>
                             </select>
                           </div>
                        </label>

                        <label className="flex items-start space-x-3 cursor-pointer">
                           <input type="checkbox" className="mt-1" />
                           <div className="flex items-center text-sm font-medium text-gray-400">
                             <Smartphone className="w-4 h-4 mr-2" /> PagerDuty
                           </div>
                        </label>

                        <label className="flex items-start space-x-3 cursor-pointer">
                           <input type="checkbox" className="mt-1" />
                           <div className="flex items-center text-sm font-medium text-gray-400">
                             <Link className="w-4 h-4 mr-2" /> Webhook
                           </div>
                        </label>
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Frequency</label>
                    <div className="grid grid-cols-3 gap-3">
                       <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#0f4c75] border border-[#0f4c75] text-white">
                         <Zap className="w-5 h-5 mb-1" />
                         <span className="text-xs">Immediate</span>
                       </button>
                       <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#1a1a2e] border border-gray-700 text-gray-400 hover:border-gray-500">
                         <Clock className="w-5 h-5 mb-1" />
                         <span className="text-xs">Throttled (1h)</span>
                       </button>
                       <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#1a1a2e] border border-gray-700 text-gray-400 hover:border-gray-500">
                         <Calendar className="w-5 h-5 mb-1" />
                         <span className="text-xs">Daily Digest</span>
                       </button>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4 pt-6 border-t border-gray-700">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-[#1a1a2e] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-2 rounded-lg bg-[#0f4c75] hover:bg-[#165a8a] text-white font-bold shadow-lg transition-colors flex items-center"
                >
                  <Check className="w-4 h-4 mr-2" /> Create Alert Rule
                </button>
              </div>

            </div>
          ) : (
            /* --- EXISTING RULES LIST --- */
            <div className="space-y-4">
              {rules.map(rule => (
                <div key={rule.id} className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-md hover:border-gray-600 transition-colors">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {/* Status Toggle */}
                      <button 
                         className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${rule.status === 'active' ? 'bg-[#27ae60]' : 'bg-gray-600'}`}
                         onClick={() => {
                           const updated = rules.map(r => r.id === rule.id ? {...r, status: r.status === 'active' ? 'paused' : 'active'} as AlertRule : r);
                           setRules(updated);
                         }}
                      >
                         <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${rule.status === 'active' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                      
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center">
                          {rule.name}
                          {rule.note && <span className="ml-3 text-xs font-normal text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded italic">{rule.note}</span>}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                           <span className="text-xs text-gray-500 uppercase tracking-wider">{rule.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                       <span className={`flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border
                          ${rule.severity === 'critical' ? 'bg-[#e74c3c]/10 text-[#e74c3c] border-[#e74c3c]/30' : 
                            rule.severity === 'warning' ? 'bg-[#f39c12]/10 text-[#f39c12] border-[#f39c12]/30' : 
                            'bg-[#3498db]/10 text-[#3498db] border-[#3498db]/30'}`
                       }>
                          {getSeverityIcon(rule.severity)}
                          <span className="ml-1">{rule.severity}</span>
                       </span>
                       <button className="text-gray-500 hover:text-white p-1"><Edit2 className="w-4 h-4" /></button>
                       <button className="text-gray-500 hover:text-[#e74c3c] p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="bg-[#1a1a2e] rounded-lg p-4 border border-gray-700/50 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <span className="text-xs text-gray-500 uppercase block mb-1">Condition</span>
                        <span className="text-sm font-medium text-gray-300">{rule.condition}</span>
                     </div>
                     <div>
                        <span className="text-xs text-gray-500 uppercase block mb-1">Current Value</span>
                        <span className={`text-sm font-bold flex items-center ${rule.isTriggered && rule.status === 'active' ? (rule.severity === 'critical' ? 'text-[#e74c3c]' : 'text-[#f39c12]') : 'text-gray-400'}`}>
                           {rule.currentValue}
                           {rule.isTriggered && rule.status === 'active' && <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 rounded uppercase">Triggered</span>}
                        </span>
                     </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                     <div className="flex items-center space-x-4">
                        <span className="flex items-center" title="Notification Channels">
                           <Bell className="w-3 h-3 mr-1" />
                           {rule.channels.join(', ')}
                           {rule.channels.includes('Email') && <span className="ml-1 text-gray-500">(ops@company.com)</span>}
                        </span>
                     </div>
                     <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Last triggered: {rule.lastTriggered}
                     </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AlertConfigurationPage;
