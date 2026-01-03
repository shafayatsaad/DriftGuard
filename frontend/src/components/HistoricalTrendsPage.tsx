import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Download, 
  Share2, 
  Filter, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Database,
  Layers,
  FileText
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceDot, Legend, ReferenceLine, BarChart, Bar
} from 'recharts';
import { COLORS } from '../constants';

// --- MOCK DATA GENERATION ---
const DAYS = 90;
const generateTrendData = () => {
  return Array.from({ length: DAYS }, (_, i) => {
    const day = i + 1;
    // Simulate gradual degradation
    const degradation = i > 45 ? (i - 45) * 0.2 : 0;
    const recovery = i > 80 ? (i - 80) * 0.5 : 0; // Simulate retraining at day 80
    
    return {
      day: `Day ${day}`,
      index: i,
      // Performance
      accuracy: Math.min(98, Math.max(75, 96 - degradation + recovery + (Math.random() - 0.5))),
      precision: Math.min(98, Math.max(70, 95 - degradation * 0.8 + recovery * 0.8 + (Math.random() - 0.5))),
      recall: Math.min(98, Math.max(65, 94 - degradation * 1.2 + recovery * 1.1 + (Math.random() - 0.5))),
      f1: Math.min(98, Math.max(70, 95 - degradation + recovery + (Math.random() - 0.5))),
      
      // Feature Drift (Stacked)
      income_psi: 0.05 + (i * 0.004) + (Math.random() * 0.02),
      age_psi: 0.02 + (i * 0.002) + (Math.random() * 0.01),
      score_psi: 0.03 + (i * 0.0015) + (Math.random() * 0.01),
      
      // Data Quality
      missing: 0.2 + (Math.random() * 0.3),
      mismatch: 0.05 + (Math.random() * 0.1),
      outrange: 0.5 + (i > 60 ? 1.5 : 0) + (Math.random() * 0.5), // Spike
      duplicates: 0.1 + (Math.random() * 0.05),
    };
  });
};

const DATA = generateTrendData();

// --- SUB-COMPONENTS ---

const StatCard: React.FC<{ label: string; value: string; sub?: string; icon: React.ReactNode }> = ({ label, value, sub, icon }) => (
  <div className="bg-[#1a1a2e] p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-all">
    <div className="flex justify-between items-start mb-2">
      <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{label}</div>
      <div className="text-[#0f4c75] opacity-80">{icon}</div>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    {sub && <div className="text-xs text-gray-500">{sub}</div>}
  </div>
);

const HeatmapSquare: React.FC<{ value: number; index: number }> = ({ value, index }) => {
  // 0.2 is critical threshold for PSI
  let bg = 'bg-[#1a1a2e]'; // default
  let border = 'border-gray-800';
  
  if (value < 0.1) { bg = 'bg-[#27ae60]'; border = 'border-[#27ae60]'; } // Green
  else if (value < 0.2) { bg = 'bg-[#f39c12]'; border = 'border-[#f39c12]'; } // Yellow
  else { bg = 'bg-[#e74c3c]'; border = 'border-[#e74c3c]'; } // Red

  // Opacity based on intensity within bucket
  const opacity = 0.3 + (value * 1.5); 

  return (
    <div className="relative group w-full pt-[100%]"> {/* Aspect Ratio 1:1 */}
      <div 
        className={`absolute inset-0 rounded-sm border ${border} ${bg}`} 
        style={{ opacity: Math.min(opacity, 1) }}
      ></div>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-[#0f1526] text-white text-xs px-2 py-1 rounded border border-gray-700 hidden group-hover:block z-50">
        Day {index + 1}: PSI {value.toFixed(3)}
      </div>
    </div>
  );
};

const HistoricalTrendsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('Last 90 Days');
  const [isCompareMode, setIsCompareMode] = useState(false);

  // Calculating aggregate stats for the Heatmap
  const heatmapData = useMemo(() => DATA.map(d => d.income_psi), []);

  const handleDateRangeClick = () => {
    if (dateRange === 'Last 90 Days') setDateRange('Last 30 Days');
    else if (dateRange === 'Last 30 Days') setDateRange('Last 60 Days');
    else setDateRange('Last 90 Days');
  };

  const handleExport = () => {
    // Mock CSV export
    const headers = ['Day', 'Accuracy', 'Precision', 'Recall', 'Income_PSI', 'Age_PSI'];
    const rows = DATA.map(d => [d.day, d.accuracy, d.precision, d.recall, d.income_psi, d.age_psi].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'drift_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 animate-fadeIn">
      
      {/* --- TOP FILTERS BAR --- */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-[#16213e] p-4 rounded-xl border border-gray-800 shadow-lg mb-6 gap-4">
        <div className="flex items-center space-x-4 w-full md:w-auto overflow-x-auto">
          <div className="relative">
            <button 
              onClick={handleDateRangeClick}
              className="flex items-center space-x-2 bg-[#1a1a2e] border border-gray-700 hover:border-[#0f4c75] px-4 py-2 rounded-md text-sm text-gray-300 w-48 justify-between hover:text-white transition-colors"
            >
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {dateRange}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center space-x-2 bg-[#1a1a2e] border border-gray-700 hover:border-[#0f4c75] px-4 py-2 rounded-md text-sm text-gray-300 hover:text-white transition-colors">
              <span className="font-semibold text-white">Model:</span>
              <span>Credit Scoring Model v2.3</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
          <div className="relative hidden lg:block">
            <button 
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`flex items-center space-x-2 border px-4 py-2 rounded-md text-sm transition-colors ${isCompareMode ? 'bg-[#0f4c75] border-[#0f4c75] text-white' : 'bg-[#1a1a2e] border-gray-700 text-gray-300 hover:border-[#0f4c75]'}`}
            >
              <span>Compare: {isCompareMode ? 'Baseline (Active)' : 'Baseline'}</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-400 hover:text-white border border-gray-700 rounded-md hover:bg-[#1a1a2e]">
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 bg-[#0f4c75] hover:bg-[#165a8a] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* --- SECTION 1: MODEL PERFORMANCE TRENDS --- */}
        <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#3498db]" />
              Model Performance Trends (90 Days)
            </h2>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center"><span className="w-3 h-3 bg-[#27ae60] opacity-20 mr-2 rounded"></span> Healthy Zone</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-[#f39c12] opacity-20 mr-2 rounded"></span> Monitoring Zone</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-[#e74c3c] opacity-20 mr-2 rounded"></span> Critical Zone</div>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                {/* Background Zones */}
                <ReferenceArea y1={90} y2={100} fill="#27ae60" fillOpacity={0.05} />
                <ReferenceArea y1={80} y2={90} fill="#f39c12" fillOpacity={0.05} />
                <ReferenceArea y1={0} y2={80} fill="#e74c3c" fillOpacity={0.05} />
                
                <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" vertical={false} />
                <XAxis dataKey="day" stroke={COLORS.textDim} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={14} />
                <YAxis domain={[60, 100]} stroke={COLORS.textDim} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: COLORS.card, borderColor: COLORS.accent, color: COLORS.text }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                
                <Line type="monotone" dataKey="accuracy" stroke={COLORS.chartLines.accuracy} strokeWidth={2} dot={false} name="Accuracy" />
                <Line type="monotone" dataKey="precision" stroke={COLORS.chartLines.precision} strokeWidth={2} dot={false} name="Precision" />
                <Line type="monotone" dataKey="recall" stroke={COLORS.chartLines.recall} strokeWidth={2} dot={false} name="Recall" />
                
                {/* Annotations */}
                <ReferenceDot x="Day 1" y={96} r={5} fill={COLORS.success} stroke="#fff" />
                <ReferenceDot x="Day 45" y={94} r={5} fill={COLORS.warning} stroke="#fff" />
                <ReferenceDot x="Day 75" y={84} r={5} fill={COLORS.critical} stroke="#fff" />
                <ReferenceDot x="Day 80" y={86} r={5} fill={COLORS.success} stroke="#fff" />

              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- SECTION 2: DRIFT SCORE HEATMAP --- */}
          <div className="lg:col-span-1 bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg flex flex-col">
            <div className="mb-4">
               <h2 className="text-lg font-bold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-[#e74c3c]" />
                Drift Score Evolution
              </h2>
              <p className="text-xs text-gray-400 mt-1">Daily max PSI score intensity</p>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-10 gap-1.5">
                {heatmapData.map((val, idx) => (
                  <HeatmapSquare key={idx} value={val} index={idx} />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-500">
                <span>90 Days Ago</span>
                <span>Today</span>
              </div>
              <div className="flex items-center space-x-2 mt-2 justify-end">
                <span className="text-[10px] text-gray-500">Low</span>
                <div className="flex space-x-0.5">
                  <div className="w-2 h-2 bg-[#27ae60]"></div>
                  <div className="w-2 h-2 bg-[#f39c12]"></div>
                  <div className="w-2 h-2 bg-[#e74c3c]"></div>
                </div>
                <span className="text-[10px] text-gray-500">High</span>
              </div>
            </div>
          </div>

          {/* --- SECTION 3: FEATURE DRIFT OVER TIME --- */}
          <div className="lg:col-span-2 bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg">
             <h2 className="text-lg font-bold text-white flex items-center mb-6">
                <Layers className="w-5 h-5 mr-2 text-[#9b59b6]" />
                Feature Drift Contribution (Stacked)
              </h2>
             <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" vertical={false} />
                  <XAxis dataKey="day" stroke={COLORS.textDim} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={14} />
                  <YAxis stroke={COLORS.textDim} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: COLORS.card, borderColor: COLORS.accent, color: COLORS.text }}
                    itemStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Area type="monotone" dataKey="income_psi" stackId="1" stroke={COLORS.critical} fill={COLORS.critical} name="Income" />
                  <Area type="monotone" dataKey="age_psi" stackId="1" stroke={COLORS.warning} fill={COLORS.warning} name="Age" />
                  <Area type="monotone" dataKey="score_psi" stackId="1" stroke={COLORS.accent} fill={COLORS.accent} name="Credit Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- SECTION 4: PREDICTION DISTRIBUTION CHANGES --- */}
        <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg">
           <h2 className="text-lg font-bold text-white flex items-center mb-8">
              <Database className="w-5 h-5 mr-2 text-[#f39c12]" />
              Prediction Distribution Shift
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-12">
              
              {/* Training Data */}
              <div className="w-full md:w-1/3 text-center">
                 <h3 className="text-gray-400 text-sm font-semibold uppercase mb-4">Training Baseline</h3>
                 <div className="relative h-12 w-full bg-[#1a1a2e] rounded-full overflow-hidden flex border border-gray-700">
                    <div className="h-full bg-[#27ae60] flex items-center justify-center text-xs font-bold text-[#1a1a2e]" style={{ width: '78%' }}>
                      APPROVED 78%
                    </div>
                    <div className="h-full bg-[#e74c3c] flex items-center justify-center text-xs font-bold text-white" style={{ width: '22%' }}>
                      22%
                    </div>
                 </div>
                 <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                    <span>Approved</span>
                    <span>Denied</span>
                 </div>
              </div>

              {/* Arrow */}
              <div className="my-6 md:my-0 flex flex-col items-center">
                 <div className="bg-[#1a1a2e] p-2 rounded-full border border-gray-700">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                 </div>
                 <span className="text-[#e74c3c] font-bold text-sm mt-2">+9.3% Denial Rate</span>
              </div>

              {/* Production Data */}
              <div className="w-full md:w-1/3 text-center">
                 <h3 className="text-gray-400 text-sm font-semibold uppercase mb-4">Current Production (90d)</h3>
                 <div className="relative h-12 w-full bg-[#1a1a2e] rounded-full overflow-hidden flex border border-gray-700">
                    <div className="h-full bg-[#27ae60] flex items-center justify-center text-xs font-bold text-[#1a1a2e] opacity-80" style={{ width: '68.7%' }}>
                      68.7%
                    </div>
                    <div className="h-full bg-[#e74c3c] flex items-center justify-center text-xs font-bold text-white" style={{ width: '31.3%' }}>
                      DENIED 31.3%
                    </div>
                 </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                    <span>Approved</span>
                    <span>Denied</span>
                 </div>
              </div>

            </div>
        </div>

        {/* --- SECTION 5: ALERT HISTORY TIMELINE --- */}
        <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg overflow-x-auto">
          <h2 className="text-lg font-bold text-white flex items-center mb-6">
            <AlertTriangle className="w-5 h-5 mr-2 text-[#ecf0f1]" />
            Alert History Timeline
          </h2>
          <div className="relative h-24 min-w-[800px] flex items-center">
            {/* Base Line */}
            <div className="absolute left-0 right-0 h-1 bg-gray-700 rounded top-1/2 transform -translate-y-1/2"></div>
            
            {/* Markers */}
            <div className="absolute left-[5%] top-1/2 transform -translate-y-1/2 -mt-4 flex flex-col items-center group cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-[#27ae60] border-2 border-[#16213e] hover:scale-125 transition-transform"></div>
              <div className="mt-2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 whitespace-nowrap bg-[#1a1a2e] px-2 py-1 rounded border border-gray-700">Deployment</div>
            </div>

            <div className="absolute left-[35%] top-1/2 transform -translate-y-1/2 -mt-4 flex flex-col items-center group cursor-pointer">
               <div className="w-4 h-4 rounded-full bg-[#3498db] border-2 border-[#16213e] hover:scale-125 transition-transform"></div>
               <div className="mt-2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 whitespace-nowrap bg-[#1a1a2e] px-2 py-1 rounded border border-gray-700">Schema Update</div>
            </div>

            <div className="absolute left-[50%] top-1/2 transform -translate-y-1/2 -mt-4 flex flex-col items-center group cursor-pointer">
               <div className="w-4 h-4 rounded-full bg-[#f39c12] border-2 border-[#16213e] hover:scale-125 transition-transform"></div>
               <div className="mt-2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 whitespace-nowrap bg-[#1a1a2e] px-2 py-1 rounded border border-gray-700">Drift Warning (Age)</div>
            </div>

             <div className="absolute left-[75%] top-1/2 transform -translate-y-1/2 -mt-4 flex flex-col items-center group cursor-pointer">
               <div className="w-6 h-6 rounded-full bg-[#e74c3c] border-2 border-[#16213e] hover:scale-125 transition-transform animate-pulse"></div>
               <div className="mt-2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 whitespace-nowrap bg-[#1a1a2e] px-2 py-1 rounded border border-gray-700 z-10">
                 CRITICAL: Accuracy Drop
               </div>
            </div>

            {/* Time Labels */}
            <div className="absolute left-0 bottom-0 text-xs text-gray-500">90 Days Ago</div>
            <div className="absolute right-0 bottom-0 text-xs text-gray-500">Today</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* --- SECTION 6: MODEL LIFECYCLE STATS --- */}
           <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard icon={<Database className="w-5 h-5"/>} label="Total Predictions" value="2.8M" sub="Avg 31k/day" />
              <StatCard icon={<Clock className="w-5 h-5"/>} label="Uptime" value="99.8%" sub="Last 90 days" />
              <StatCard icon={<CheckCircle className="w-5 h-5"/>} label="Retraining Events" value="3" sub="Last: 10 days ago" />
              <StatCard icon={<AlertTriangle className="w-5 h-5"/>} label="Critical Alerts" value="12" sub="Avg resolution: 4.2h" />
              <StatCard icon={<Activity className="w-5 h-5"/>} label="Avg Latency" value="45ms" sub="Min: 32ms / Max: 120ms" />
              <StatCard icon={<Layers className="w-5 h-5"/>} label="Features Monitored" value="23" sub="2 deprecated" />
           </div>

           {/* --- SECTION 7: DATA QUALITY TRENDS --- */}
           <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Data Quality Trends</h2>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { k: 'missing', l: 'Missing Values', c: COLORS.chartLines.accuracy },
                   { k: 'outrange', l: 'Out of Range', c: COLORS.warning },
                   { k: 'mismatch', l: 'Type Mismatch', c: COLORS.accent },
                   { k: 'duplicates', l: 'Duplicates', c: COLORS.chartLines.recall }
                 ].map((m, i) => (
                   <div key={i} className="bg-[#1a1a2e] p-3 rounded border border-gray-700">
                      <div className="text-[10px] text-gray-400 mb-1">{m.l}</div>
                      <div className="h-10 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={DATA}>
                            <Line type="monotone" dataKey={m.k} stroke={m.c} strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

        </div>

        {/* --- BOTTOM INSIGHTS PANEL --- */}
        <div className="bg-gradient-to-r from-[#0f4c75]/20 to-[#16213e] rounded-xl border border-[#0f4c75]/30 p-6 shadow-lg">
           <h2 className="text-xl font-bold text-white mb-4 flex items-center">
             <FileText className="w-5 h-5 mr-2 text-[#3498db]" />
             Key Insights
           </h2>
           <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start space-x-2 text-gray-300">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#e74c3c]"></div>
                <span>Model performance has declined <strong className="text-white">7.9%</strong> over the last 90 days, primarily driven by recall degradation.</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-300">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f39c12]"></div>
                <span>Drift acceleration was detected starting <strong className="text-white">Feb 5th</strong>, correlating with the new marketing campaign launch.</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-300">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#e74c3c]"></div>
                <span><strong className="text-white">Income</strong> feature shows the strongest drift (PSI 0.45), suggesting a shift in applicant demographics.</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-300">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#27ae60]"></div>
                <span>Retraining is recommended within 48 hours. Estimated performance recovery: <strong className="text-white">+6.2% accuracy</strong>.</span>
              </li>
           </ul>
        </div>

      </div>
    </div>
  );
};

export default HistoricalTrendsPage;
