import React, { useEffect, useState } from "react";
import AlertItem from "./AlertItem";
import GaugeChart from "./GaugeChart";
import MetricCard from "./MetricCard";
import PerformanceChart from "./PerformanceChart";
import DriftingFeatureItem from "./DriftingFeatureItem";
import {
  ArrowRight,
  LayoutDashboard,
  Activity,
  AlertOctagon,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Alert, DriftFeature, Metric } from "../types";

interface DashboardProps {
  onNavigate: (
    view: "dashboard" | "feature-analysis" | "live" | "retraining",
    data?: any
  ) => void;
}

interface DashboardData {
  health_score: number;
  metrics: Metric[];
  alerts: Alert[];
  drift_summary: {
    score: number;
    drifting_count: number;
    total_count: number;
    recommendation: any;
  };
  top_features: DriftFeature[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/dashboard-data")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch dashboard data");
          return res.json();
        })
        .then((data) => {
          setData(data);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          console.error(err);
          setError("Could not load dashboard data. Ensure backend is running.");
          setLoading(false);
        });
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="w-12 h-12 text-[#00f3ff] animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)] text-[#ff2a6d]">
        <AlertOctagon className="w-6 h-6 mr-2" /> {error}
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-6 animate-fadeIn">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Alert Center (3/12 = 25%) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel rounded-xl p-6 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff2a6d] to-transparent opacity-50"></div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center text-white tracking-wide">
                <AlertOctagon className="w-5 h-5 mr-2 text-[#ff2a6d]" />
                <span className="text-glow">Alert Center</span>
              </h2>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-[#ff2a6d] animate-pulse shadow-[0_0_8px_#ff2a6d]"></div>
                <div className="w-2 h-2 rounded-full bg-[#f39c12]"></div>
                <div className="w-2 h-2 rounded-full bg-[#00f3ff]"></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {data.alerts.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-10">
                  No active alerts
                </div>
              ) : (
                data.alerts.map((alert) => (
                  <AlertItem
                    key={alert.id}
                    alert={alert}
                    onAction={
                      alert.message.toLowerCase().includes("income")
                        ? () => onNavigate("feature-analysis")
                        : undefined
                    }
                  />
                ))
              )}
            </div>

            <button className="w-full mt-4 py-2 text-sm font-medium text-[#00f3ff] bg-[#00f3ff]/5 hover:bg-[#00f3ff]/10 rounded-md transition-colors border border-[#00f3ff]/20 flex items-center justify-center hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]">
              View All Alerts <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: Metrics & Performance (6/12 = 50%) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Top Row: Gauge & Metric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Health Score Gauge (2/5 cols) */}
            <div className="md:col-span-2 glass-panel rounded-xl p-6 flex flex-col items-center justify-center relative min-h-[200px]">
              <div className="absolute top-4 left-4">
                <h3 className="text-sm font-semibold text-gray-400 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-[#bc13fe]" />
                  Health Score
                </h3>
              </div>
              <GaugeChart
                value={data.health_score}
                label={data.health_score < 70 ? "Drift Detected" : "Healthy"}
              />
            </div>

            {/* Key Metrics Grid (3/5 cols) */}
            <div className="md:col-span-3 grid grid-cols-2 gap-4">
              {data.metrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </div>

          {/* Bottom Row: Performance Chart */}
          <div className="glass-panel rounded-xl p-6 relative">
            <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
              <Activity className="w-24 h-24 text-[#00f3ff]" />
            </div>
            <PerformanceChart />
          </div>
        </div>

        {/* RIGHT COLUMN: Drift Summary (3/12 = 25%) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Drift Summary Card */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center text-white">
              <LayoutDashboard className="w-5 h-5 mr-2 text-[#00f3ff]" />
              <span className="text-glow">Drift Summary</span>
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-gray-400 text-sm">
                  Dataset Drift Score
                </span>
                <span
                  className={`font-bold px-2 py-1 rounded text-sm ${
                    data.drift_summary.score > 0.25
                      ? "text-[#ff2a6d] bg-[#ff2a6d]/10"
                      : "text-[#f39c12] bg-[#f39c12]/10"
                  }`}
                >
                  {data.drift_summary.score}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-gray-400 text-sm">Features Drifting</span>
                <span className="font-bold text-white">
                  {data.drift_summary.drifting_count} of{" "}
                  {data.drift_summary.total_count}
                  <span className="text-gray-500 text-xs font-normal ml-1">
                    (
                    {Math.round(
                      (data.drift_summary.drifting_count /
                        data.drift_summary.total_count) *
                        100
                    )}
                    %)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Top Drifting Features */}
          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-xs font-bold text-[#00f3ff] uppercase tracking-wider mb-5 border-b border-white/10 pb-2">
              Top Drifting Features
            </h3>
            <div className="space-y-4">
              {data.top_features.map((feature) => (
                <DriftingFeatureItem
                  key={feature.name}
                  feature={feature}
                  onClick={() => onNavigate("feature-analysis", feature.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
