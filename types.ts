export enum AlertSeverity {
  CRITICAL = "critical",
  WARNING = "warning",
  INFO = "info",
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
}

export interface Metric {
  label: string;
  value: number;
  change: number; // percentage change (negative is drop)
}

export interface DriftFeature {
  name: string;
  psi: number;
  ks: number;
  kl: number;
  status: "critical" | "warning" | "good";
}

export interface PerformanceDataPoint {
  date: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}
