import urllib.request
import json
import time

# Wait for server to start
time.sleep(3)

try:
    with urllib.request.urlopen('http://127.0.0.1:5000/api/dashboard-data') as response:
        data = json.loads(response.read().decode())
        
        print("-" * 30)
        print(f"Health Score: {data['health_score']}")
        print("-" * 30)
        
        metrics = {m['label']: m['value'] for m in data['metrics']}
        print(f"Model Accuracy: {metrics['Model Accuracy']}")
        print(f"Total Predictions: {metrics['Total Predictions']}")
        
        if data['health_score'] < 100:
            print("PASS: Health Score dropped.")
        else:
            print("FAIL: Health Score did not drop.")
            
        if "94.2%" not in metrics['Model Accuracy']:
             print("PASS: Accuracy changed.")
        else:
             print("FAIL: Accuracy is static.")

except Exception as e:
    print(f"Error: {e}")
