<div align="center">

# 🛡️ DriftGuard

**Autonomous Model Drift Detection & MLOps Recovery System**

[ 🇬🇧 English ](README.md) | [ 🇯🇵 日本語 ](README_ja.md)

<br />

[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

  <p>
    <b>DriftGuard</b> is an enterprise-grade MLOps dashboard designed to monitor, detect, and remediate machine learning model degradation in production. It replaces opaque model failure with <b>quantifiable health metrics</b> and <b>automated retraining strategies</b>.
  </p>

[Report Bug](https://github.com/shafayatsaad/driftguard/issues) · [Request Feature](https://github.com/shafayatsaad/driftguard/issues)

</div>

---

## 💡 Project Concept

In production environments, ML models don't fail with an error stack trace; they fail silently as data distributions shift (Data Drift) or relationships change (Concept Drift).

**DriftGuard** solves this by providing a continuous monitoring layer that:
1.  **Quantifies Drift**: Uses statistical methods like Population Stability Index (PSI) to measure distribution shifts.
2.  **Visualizes Impact**: Correlates drift scores with estimated accuracy drops.
3.  **Prescribes Action**: Automates the cost-benefit analysis of retraining models versus letting them run.

### Core MLOps Principles

-   **Observability First**: Dashboard-centric view of model health ($ Health Score).
-   **Statistical Rigor**: Reliance on proven metrics (PSI, KL Divergence) rather than simple distinct counts.
-   **Actionable Insights**: Recommendations are linked to business value (Revenue at Risk vs. Retraining Cost).

---

## 🚀 Key Features

### 📊 Live Drift Monitoring
-   **Real-time Health Score**: A composite metric (0-100) derived from drift severity across all features.
-   **Dynamic Metrics**: Tracks "Total Predictions", "Average Drift Score", and "Estimated Accuracy" live.
-   **Feature-Level Diagnostics**: Identifies exactly *which* features (e.g., `Income`, `Age`, `Debt Ratio`) are causing the model to degrade.

### 🧠 Intelligent Retraining Recommendations
-   **Cost-Benefit Engine**: Automatically calculates whether it is profitable to retrain the model based on current revenue loss vs. compute costs.
-   **Automated Scheduling**: One-click scheduling for retraining jobs when thresholds are breached.

### ⚡ Forecasting & Trends
-   **Historical Analysis**: View drift trends over 30/60/90 days to identify slow-burning degradation.
-   **Interactive Reports**: Export comprehensive drift reports (`.csv`, `.pdf`) for compliance and auditing.

### 🔔 Smart Alerting
-   **Configurable Rules**: Set conditional alerts (e.g., "If Income PSI > 0.2 for 6 hours").
-   **Multi-Channel Notification**: Integration logic for Slack, Email, and PagerDuty (simulated).

---

## 💻 Code Spotlight

DriftGuard uses **Population Stability Index (PSI)** to detect distributional shifts. Here is a snippet of the detection logic from the backend:

```python
# backend/drift_detection.py

def calculate_psi(expected, actual, buckets=10):
    """
    Calculates Population Stability Index (PSI) to measure data drift.
    PSI < 0.1: No significant drift
    PSI < 0.2: Moderate drift
    PSI >= 0.2: Significant drift
    """
    def scale_range(input, min, max):
        input += (1e-6)  # Avoid division by zero
        interp = np.interp(input, (min, max), (0, 1))
        return interp

    breakpoints = np.arange(0, buckets + 1) / (buckets) * 100
    # ... logic to calculate proportions ...
    
    psi_value = np.sum((actual_prop - expected_prop) * np.log(actual_prop / expected_prop))
    return psi_value
```

---

## 🏗️ Demo Scenarios

The project includes a robust simulation engine `demo_scenarios.py` to demonstrate various production states:

| Scenario | Description | Effect |
| :--- | :--- | :--- |
| **1. Baseline (Healthy)** | Normal distribution matching training data. | Health Score: ~98/100 |
| **2. Sudden Drift (Attack)** | Simulates a sudden shift in high-importance features. | Health Score: ~45/100 |
| **3. Gradual Decay** | Slowly introduces noise over time. | Health Score: ~80/100 |

Run a scenario using:
```bash
python demo_scenarios.py --scenario 2
```

---

## 📁 Project Structure

```bash
DriftGuard/
├── backend/            # Flask API & ML Logic
│   ├── app.py          # Main application entry point
│   ├── drift_detection.py # Core math for PSI/Drift
│   ├── data_generator.py # Synthetic data generation
│   └── service.py      # Business logic layer
├── frontend/           # React Dashboard
│   ├── src/
│   │   ├── components/ # Dashboard, Trends, Alerts, etc.
│   │   ├── App.tsx     # Main routing & layout
│   │   └── types.ts    # TypeScript definitions
│   └── tailwind.config.js
├── data/               # Local CSV storage for demo
└── demo_scenarios.py   # CLI tool for drift simulation
```

---

## 🏁 Getting Started

### Prerequisites
-   Python 3.9+
-   Node.js 16+

### 1. Backend Setup

```bash
cd backend
# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies (ensure pandas, numpy, flask are installed)
pip install flask flask-cors pandas numpy

# Run the API
python app.py
```
*Server runs on `http://localhost:5000`*

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Development Server
npm run dev
```
*Dashboard runs on `http://localhost:5173`*

---

## 🤝 Contributing

Contributions to improve drift detection algorithms or add new visualization widgets are welcome.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewMetric`)
3.  Commit your Changes (`git commit -m 'Add KL Divergence metric'`)
4.  Push to the Branch (`git push origin feature/NewMetric`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Maintainer

[Shafayat Saad](https://github.com/shafayatsaad) - MLOps Engineer

<div align="center">
  Generated by DriftGuard AI.
</div>
