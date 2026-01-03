from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os
from drift_detection import detect_drift, load_data

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)

