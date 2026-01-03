import { AlertSeverity, Alert, DriftFeature, Metric, PerformanceDataPoint } from './types';

// Palette from requirements
export const COLORS = {
  background: '#1a1a2e',
  card: '#16213e',
  accent: '#0f4c75',
  critical: '#e74c3c',
  warning: '#f39c12',
  success: '#27ae60',
  text: '#ecf0f1',
  textDim: '#aeb6bf',
  chartLines: {
    accuracy: '#3498db',
    precision: '#9b59b6',
    recall: '#2ecc71',
  }
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    severity: AlertSeverity.CRITICAL,
    message: 'Performance dropped 15%',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    severity: AlertSeverity.WARNING,
    message: 'PSI > 0.25 on "income" feature',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    severity: AlertSeverity.INFO,
    message: 'Minor drift in "age" distribution',
    timestamp: '1 day ago',
  },
];

export const MOCK_METRICS: Metric[] = [
  { label: 'Accuracy', value: 87.3, change: -8.2 },
  { label: 'Precision', value: 91.2, change: -3.1 },
  { label: 'Recall', value: 84.5, change: -12.4 },
  { label: 'F1-Score', value: 87.7, change: -7.8 },
];

export const TOP_DRIFTING_FEATURES: DriftFeature[] = [
  { name: 'income', psi: 0.45, status: 'critical' },
  { name: 'age', psi: 0.28, status: 'warning' },
  { name: 'employment_length', psi: 0.22, status: 'warning' },
  { name: 'credit_score', psi: 0.19, status: 'warning' },
  { name: 'debt_ratio', psi: 0.15, status: 'good' },
];

// Generate 30 days of data with a downward trend at the end
export const PERFORMANCE_DATA: PerformanceDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  let baseAccuracy = 95;
  let basePrecision = 94;
  let baseRecall = 96;
  
  // Drift starts around day 20
  if (i > 20) {
    const decay = (i - 20) * 1.5;
    baseAccuracy -= decay;
    basePrecision -= decay * 0.5;
    baseRecall -= decay * 2.0;
  }

  // Add some noise
  return {
    date: `Day ${day}`,
    accuracy: Number((baseAccuracy + (Math.random() - 0.5)).toFixed(1)),
    precision: Number((basePrecision + (Math.random() - 0.5)).toFixed(1)),
    recall: Number((baseRecall + (Math.random() - 0.5)).toFixed(1)),
    f1: 0 // calculated loosely in UI or ignored
  };
});

// --- Feature Analysis Data ---

export const DISTRIBUTION_DATA = [
  { bin: '0-20k', training: 5, production: 12 },
  { bin: '20k-40k', training: 10, production: 25 },
  { bin: '40k-60k', training: 20, production: 30 }, // Peak for prod
  { bin: '60k-80k', training: 30, production: 15 }, // Peak for training
  { bin: '80k-100k', training: 15, production: 10 },
  { bin: '100k-120k', training: 10, production: 5 },
  { bin: '120k-140k', training: 5, production: 2 },
  { bin: '140k+', training: 5, production: 1 },
];

export const FEATURE_STATS = [
  { metric: 'Mean', training: '$65,432', production: '$52,118', change: '-20.3%', isBad: true },
  { metric: 'Median', training: '$58,000', production: '$47,500', change: '-18.1%', isBad: true },
  { metric: 'Std Dev', training: '$23,456', production: '$19,234', change: '-18.0%', isBad: true },
  { metric: 'Min', training: '$12,000', production: '$15,000', change: '+25.0%', isBad: false },
  { metric: 'Max', training: '$185,000', production: '$158,000', change: '-14.6%', isBad: true },
];

export const PSI_TREND_DATA = Array.from({ length: 30 }, (_, i) => {
  // exponential growth from 0.08 to 0.45
  const day = i + 1;
  const base = 0.08;
  const growth = 0.45 - 0.08;
  // fast growth in last few days
  const factor = Math.pow((i / 29), 3);
  const val = base + (growth * factor);
  return { date: `Day ${day}`, psi: Number(val.toFixed(2)) };
});
