import sys
import os
import json

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from drift_detection import detect_drift, load_data

def verify():
    training_path = os.path.join('data', 'training_data.csv')
    production_path = os.path.join('data', 'production_data.csv')
    
    print(f"Loading from {training_path} and {production_path}")
    t = load_data(training_path)
    p = load_data(production_path)
    
    if t is None or p is None:
        print("Failed to load data")
        return

    print("Training shape:", t.shape)
    print("Production shape:", p.shape)

    report = detect_drift(t, p)
    print("Drift Report:")
    print(json.dumps(report, indent=2))
    
    with open('drift_results.txt', 'w') as f:
        f.write(json.dumps(report, indent=2))

if __name__ == "__main__":
    verify()
