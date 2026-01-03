from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os
from drift_detection import detect_drift, load_data, calculate_psi
import numpy as np

app = Flask(__name__)
CORS(app)

# Configuration
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
TRAINING_DATA_PATH = os.path.join(DATA_DIR, 'training_data.csv')
PRODUCTION_DATA_PATH = os.path.join(DATA_DIR, 'production_data.csv')

@app.route('/api/drift', methods=['GET'])
def get_drift():
    training_df = load_data(TRAINING_DATA_PATH)
    production_df = load_data(PRODUCTION_DATA_PATH)
    
    if training_df is None or production_df is None:
        return jsonify({"error": "Failed to load data"}), 500
    
    drift_report = detect_drift(training_df, production_df)
    
    # Format result for frontend consumption
    results = []
    for feature, metrics in drift_report.items():
        results.append({
            "name": feature,
            "psi": metrics['psi'],
            "ks": metrics.get('ks', 0),
            "kl": metrics.get('kl', 0),
            "status": metrics['status']
        })
        
    return jsonify({
        "drift_summary": results,
        "meta": {
            "training_samples": len(training_df),
            "production_samples": len(production_df)
        }
    })
@app.route('/api/dashboard-data', methods=['GET'])
def get_dashboard_data():
    try:
        training_df = load_data(TRAINING_DATA_PATH)
        production_df = load_data(PRODUCTION_DATA_PATH)
        
        if training_df is None or production_df is None:
            return jsonify({"error": "Failed to load data (None returned)"}), 500
        
        drift_report = detect_drift(training_df, production_df)
        
        # Calculate drift metrics
        total_features = len(drift_report)
        drifting_features = sum(1 for m in drift_report.values() if m['status'] != 'good')
        drift_score = round(drifting_features / total_features, 2) if total_features > 0 else 0
        
        print(f"DEBUG: Total: {total_features}, Drifting: {drifting_features}, DriftScore: {drift_score}")
        print(f"DEBUG: Report: {drift_report}")

        # Health Score (inverse of drift score, simplified)
        health_score = int(100 - (drift_score * 100))
        
        # Top features (sorted by PSI desc)
        top_features = []
        for feature, metrics in drift_report.items():
            top_features.append({
                "name": feature,
                "psi": metrics['psi'],
                "ks": metrics.get('ks', 0),
                "kl": metrics.get('kl', 0),
                "status": metrics['status'],
                "drift_score": metrics['psi'] * 100
            })
        top_features = sorted(top_features, key=lambda x: x['psi'], reverse=True)[:5]

        # Alerts based on drift severity
        alerts = []
        if drifting_features > 0:
            count = 1
            for feature in top_features:
                if feature['status'] == 'Critical':
                    alerts.append({
                        "id": count,
                        "type": "critical",
                        "message": f"Critical drift detected in '{feature['name']}'",
                        "timestamp": "Just now"
                    })
                    count += 1
                elif feature['status'] == 'Warning':
                     alerts.append({
                        "id": count,
                        "type": "warning",
                        "message": f"Warning: '{feature['name']}' is showing signs of drift",
                        "timestamp": "Just now"
                    })
                     count += 1

        # Estimate Model Accuracy based on Drift Score
        # Assume base accuracy of 95%, penalized by drift severity
        model_accuracy = max(0.0, 95.0 - (drift_score * 50))
        
        # Calculate dynamic changes in metrics
        
        metrics = [
            {"label": "Total Predictions", "value": f"{len(production_df):,}", "change": 5.2, "status": "positive"},
            {"label": "Avg Data Drift", "value": str(drift_score), "change": drift_score * 10, "status": "negative" if drift_score > 0.1 else "positive"},
            {"label": "Model Accuracy", "value": f"{model_accuracy:.1f}%", "change": -1.2 if drift_score > 0.1 else 0.5, "status": "warning" if model_accuracy < 90 else "positive"}
        ]

        response_data = {
            "health_score": health_score,
            "metrics": metrics,
            "alerts": alerts,
            "drift_summary": {
                "score": drift_score,
                "drifting_count": drifting_features,
                "total_count": total_features,
                "recommendation": {
                    "action": "RETRAIN_URGENT" if drift_score > 0.2 else "MONITOR",
                    "estimated_time": "2 hours"
                }
            },
            "top_features": top_features
        }
        
        response = jsonify(response_data)
        response.headers.add('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0')
        return response
    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500


@app.route('/api/feature-details/<feature_name>', methods=['GET'])
def get_feature_details(feature_name):
    try:
        training_df = load_data(TRAINING_DATA_PATH)
        production_df = load_data(PRODUCTION_DATA_PATH)
        
        if training_df is None or production_df is None:
             return jsonify({"error": "Failed to load data"}), 500

        if feature_name not in training_df.columns or feature_name not in production_df.columns:
            return jsonify({"error": f"Feature '{feature_name}' not found"}), 404

        training_data = training_df[feature_name].dropna().values
        production_data = production_df[feature_name].dropna().values
        
        # Calculate PSI, Status
        psi = calculate_psi(training_data, production_data)
        status = 'good'
        if psi > 0.2: status = 'critical'
        elif psi > 0.1: status = 'warning'

        # Calculate Statistics
        def get_stats(data):
            return {
                "mean": float(np.mean(data)),
                "median": float(np.median(data)),
                "std": float(np.std(data)),
                "min": float(np.min(data)),
                "max": float(np.max(data))
            }
        
        baseline_stats = get_stats(training_data)
        production_stats = get_stats(production_data)
        
        # Calculate Histogram Data (Distribution)
        # Create common bins
        min_val = min(baseline_stats['min'], production_stats['min'])
        max_val = max(baseline_stats['max'], production_stats['max'])
        
        # Handle constant values case
        if min_val == max_val:
             bins = np.array([min_val - 1, max_val + 1])
        else:
             bins = np.linspace(min_val, max_val, 21) # 20 bins
        
        hist_baseline, _ = np.histogram(training_data, bins=bins, density=True)
        hist_production, _ = np.histogram(production_data, bins=bins, density=True)
        
        chart_data = []
        for i in range(len(bins)-1):
            bin_center = (bins[i] + bins[i+1]) / 2
            chart_data.append({
                "range": f"{bins[i]:.1f}-{bins[i+1]:.1f}", 
                "bin_center": float(bin_center),
                "baseline": float(hist_baseline[i]),
                "production": float(hist_production[i])
            })
            
        return jsonify({
            "feature_name": feature_name,
            "psi": round(psi, 4),
            "status": status,
            "baseline_stats": baseline_stats,
            "production_stats": production_stats,
            "chart_data": chart_data
        })

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500 

if __name__ == '__main__':
    app.run(debug=True, port=5000)

