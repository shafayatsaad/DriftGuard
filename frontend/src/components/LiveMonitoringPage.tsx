import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Database,
  Server,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { COLORS } from '../constants';

// --- Sub-components for Live Page ---

const SmallGauge: React.FC<{ name: string; value: number; color: string }> = ({ name, value, color }) => {
  // Simple SVG Gauge
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value * circumference); // Value 0-1

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-[#1a1a2e] rounded-lg border border-gray-800">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="transform -rotate-90 w-12 h-12">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="#2c3e50"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke={color}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-[10px] font-bold text-gray-300">{value.toFixed(2)}</span>
      </div>
      <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide truncate w-full text-center">{name}</span>
    </div>
  );
};

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const height = 40;
  const width = 120;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// --- Main Page Component ---

const LiveMonitoringPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(new Date());
  
  // Simulation States
  const [predictionsCount, setPredictionsCount] = useState(1247);
  const [predictionHistory, setPredictionHistory] = useState<number[]>(Array.from({ length: 20 }, () => Math.random() * 50 + 50));
  const [perfData, setPerfData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<{ id: number, time: string, msg: string, type: 'critical' | 'warning' | 'info' }[]>([
    { id: 1, time: '2m ago', msg: 'WARNING: PSI threshold exceeded for "income"', type: 'warning' },
    { id: 2, time: '5m ago', msg: 'INFO: Prediction rate increased 15%', type: 'info' },
    { id: 3, time: '8m ago', msg: 'CRITICAL: Accuracy dropped below 88%', type: 'critical' },
  ]);

  // Initial Data population for Line Chart
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `${i}:00`,
      accuracy: 85 + Math.random() * 5,
      latency: 40 + Math.random() * 10,
      throughput: 1000 + Math.random() * 500
    }));
    setPerfData(initialData);
  }, []);

  // Real-time Simulation Effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTime(new Date());

      // Update Predictions
      const newPred = Math.floor(Math.random() * 20);
      setPredictionsCount(prev => prev + newPred);
      setPredictionHistory(prev => [...prev.slice(1), 50 + Math.random() * 50]);

      // Update Performance Chart
      setPerfData(prev => {
        const last = prev[prev.length - 1];
        const newPoint = {
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          accuracy: Math.max(70, Math.min(100, last.accuracy + (Math.random() - 0.6) * 2)), // Slight downward trend
          latency: 40 + Math.random() * 10,
          throughput: 1000 + Math.random() * 500
        };
        return [...prev.slice(1), newPoint];
      });

      // Random Alerts
      if (Math.random() > 0.95) {
        const types: ('critical' | 'warning' | 'info')[] = ['critical', 'warning', 'info'];
        const msgs = ['High latency detected', 'Drift detected in "age"', 'Data schema mismatch warning', 'Model endpoint restarting'];
        const newAlert = {
          id: Date.now(),
          time: 'Just now',
          msg: msgs[Math.floor(Math.random() * msgs.length)],
          type: types[Math.floor(Math.random() * types.length)]
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 10));
      }

    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="max-w-[1600px] mx-auto p-6 animate-fadeIn">
      
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#16213e] p-4 rounded-xl border border-gray-800 shadow-lg mb-6">
        <div className="flex items-center space-x-6">
           <div className="flex items-center space-x-3">
             <div className="relative">
               <div className="w-3 h-3 bg-green-500 rounded-full"></div>
               <div className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
             </div>
             <h1 className="text-xl font-bold text-white tracking-wide">Live Monitoring</h1>
           </div>
           
           <div className="hidden md:block h-8 w-px bg-gray-700"></div>
           
           <div className="flex items-center space-x-2">
             <span className="text-gray-400 text-sm">Model:</span>
             <span className="text-white font-medium">Credit Scoring Model v2.3</span>
           </div>

           <div className="flex items-center space-x-2">
             <span className="text-gray-400 text-sm">Status:</span>
             <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-2 py-1 rounded border border-yellow-500/30">DEGRADED</span>
           </div>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
             <RefreshCw className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
             <span>Auto-refresh {isPlaying ? 'ON' : 'OFF'}</span>
          </div>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg transition-colors ${isPlaying ? 'bg-[#e74c3c]/20 text-[#e74c3c] hover:bg-[#e74c3c]/30' : 'bg-[#27ae60]/20 text-[#27ae60] hover:bg-[#27ae60]/30'}`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT FEED */}
      <div className="space-y-6">
        
        {/* ROW 1: Predictions & Drift & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. Current Predictions Card */}
          <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-semibold uppercase mb-4 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-400" /> Predictions / min
              </h3>
              <div className="flex items-end justify-between mb-4">
                <span className="text-5xl font-bold text-white tracking-tighter">{predictionsCount.toLocaleString()}</span>
                <div className="text-right">
                   <div className="text-[#e74c3c] font-bold flex items-center justify-end text-sm">
                     <TrendingUp className="w-4 h-4 mr-1" /> +8.2%
                   </div>
                   <span className="text-xs text-gray-500">vs baseline</span>
                </div>
              </div>
              <div className="h-12 mb-6">
                <Sparkline data={predictionHistory} color={COLORS.chartLines.accuracy} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
               <div>
                 <span className="text-xs text-gray-500 block mb-1">Approved</span>
                 <span className="text-xl font-bold text-[#27ae60]">856</span>
               </div>
               <div>
                 <span className="text-xs text-gray-500 block mb-1">Denied</span>
                 <span className="text-xl font-bold text-[#e74c3c]">391</span>
                 <span className="text-xs text-gray-500 ml-2">(31.3%)</span>
               </div>
            </div>
          </div>

          {/* 2. Drift Monitoring Grid */}
          <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg">
             <h3 className="text-gray-400 text-sm font-semibold uppercase mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-blue-400" /> Live Feature Drift
             </h3>
             <div className="grid grid-cols-3 gap-3">
               <SmallGauge name="income" value={0.45} color={COLORS.critical} />
               <SmallGauge name="age" value={0.28} color={COLORS.warning} />
               <SmallGauge name="credit" value={0.19} color={COLORS.warning} />
               <SmallGauge name="employ" value={0.22} color={COLORS.warning} />
               <SmallGauge name="debt" value={0.15} color={COLORS.success} />
               <SmallGauge name="loan" value={0.09} color={COLORS.success} />
               <SmallGauge name="accts" value={0.12} color={COLORS.success} />
               <SmallGauge name="inq" value={0.18} color={COLORS.warning} />
               <SmallGauge name="paymt" value={0.07} color={COLORS.success} />
             </div>
          </div>

          {/* 4. Recent Alerts Stream (Placed here for layout balance) */}
          <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg flex flex-col h-[400px]">
             <h3 className="text-gray-400 text-sm font-semibold uppercase mb-4 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-red-400" /> Live Alerts Feed
             </h3>
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-[#1a1a2e] p-3 rounded-lg border-l-2 flex items-start space-x-3 animate-slideInRight"
                       style={{ borderColor: alert.type === 'critical' ? COLORS.critical : alert.type === 'warning' ? COLORS.warning : COLORS.chartLines.accuracy }}>
                    <div className="mt-0.5">
                      {alert.type === 'critical' ? <AlertCircle className="w-4 h-4 text-[#e74c3c]" /> :
                       alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-[#f39c12]" /> :
                       <CheckCircle className="w-4 h-4 text-[#3498db]" />}
                    </div>
                    <div className="flex-1">
                       <p className="text-xs text-gray-500 mb-0.5">{alert.time}</p>
                       <p className="text-sm text-gray-200 leading-tight">{alert.msg}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* ROW 2: Performance Line Chart (Full Width) */}
        <div className="bg-[#16213e] rounded-xl border border-gray-800 p-6 shadow-lg">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h3 className="text-gray-400 text-sm font-semibold uppercase flex items-center">
                <Activity className="w-4 h-4 mr-2 text-purple-400" /> Real-time Performance (Last 6 Hours)
              </h3>
              <div className="flex space-x-6 mt-4 md:mt-0">
                 <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#e74c3c]"></span>
                    <span className="text-sm text-gray-300">Accuracy: <span className="font-bold text-white">{perfData[perfData.length-1]?.accuracy.toFixed(1)}%</span></span>
                 </div>
                 <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#3498db]"></span>
                    <span className="text-sm text-gray-300">Latency: <span className="font-bold text-white">{perfData[perfData.length-1]?.latency.toFixed(0)}ms</span></span>
                 </div>
                 <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#27ae60]"></span>
                    <span className="text-sm text-gray-300">Throughput: <span className="font-bold text-white">{(perfData[perfData.length-1]?.throughput / 1000).toFixed(1)}k</span></span>
                 </div>
              </div>
           </div>
           
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={perfData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" vertical={false} />
                 <XAxis dataKey="time" stroke={COLORS.textDim} tick={{fontSize: 10}} tickLine={false} axisLine={false} interval={4} />
                 <YAxis domain={[60, 100]} stroke={COLORS.textDim} tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                 <Tooltip 
                    contentStyle={{ backgroundColor: COLORS.card, borderColor: COLORS.accent, color: COLORS.text }}
                    labelStyle={{ color: COLORS.textDim }}
                 />
                 <Line type="monotone" dataKey="accuracy" stroke={COLORS.critical} strokeWidth={2} dot={false} isAnimationActive={false} />
                 <Line type="monotone" dataKey="latency" stroke={COLORS.chartLines.accuracy} strokeWidth={2} dot={false} isAnimationActive={false} />
                 <Line type="monotone" dataKey="throughput" stroke={COLORS.success} strokeWidth={2} dot={false} isAnimationActive={false} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* ROW 3: Data Quality */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[{l: 'Missing Values', v: '0.3%', s: 'good'}, {l: 'Type Mismatches', v: '0', s: 'good'}, {l: 'Out of Range', v: '1.2%', s: 'warning'}, {l: 'Duplicates', v: '0.1%', s: 'good'}].map((item, i) => (
             <div key={i} className="bg-[#16213e] rounded-lg border border-gray-800 p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 uppercase">{item.l}</div>
                  <div className="text-xl font-bold text-white">{item.v}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${item.s === 'good' ? 'bg-[#27ae60]' : 'bg-[#f39c12]'}`}></div>
             </div>
           ))}
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-8 border-t border-gray-800 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-6">
           <div className="flex items-center space-x-2">
             <Server className="w-3 h-3 text-[#27ae60]" />
             <span>API Status: <span className="text-[#27ae60]">Operational</span></span>
           </div>
           <div className="flex items-center space-x-2">
             <Database className="w-3 h-3 text-[#27ae60]" />
             <span>Database: <span className="text-[#27ae60]">Healthy</span></span>
           </div>
        </div>
        <div className="mt-2 md:mt-0">
          Last update: {time.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoringPage;
