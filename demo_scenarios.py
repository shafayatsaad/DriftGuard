
import sys
import os
import os

# Add backend to path to import modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from drift_detection import detect_drift, load_data

def run_scenario_1():
    print("Running Scenario 1: Basic Drift Detection")
    print("-" * 50)
    
    training_path = os.path.join('data', 'training_data.csv')
    production_path = os.path.join('data', 'production_data.csv')
    
    print(f"Loading training data from {training_path}...")
    training_df = load_data(training_path)
    
    print(f"Loading production data from {production_path}...")
    production_df = load_data(production_path)
    
    if training_df is None or production_df is None:
        print("Failed to load data. Exiting.")
        return

    print("Detecting drift...")
    print("-" * 50)
    drift_report = detect_drift(training_df, production_df)
    
    print(f"{'Feature':<20} | {'PSI':<10} | {'Status':<10}")
    print("-" * 50)
    
    for feature, metrics in drift_report.items():
        psi = metrics['psi']
        status = metrics['status']
        print(f"{feature:<20} | {psi:<10.4f} | {status:<10}")

    print("-" * 50)
    print("Scenario 1 Complete.")

def run_scenario_2():
    print("\nRunning Scenario 2: Data Drift Injection")
    print("-" * 50)
    
    training_path = os.path.join('data', 'training_data.csv')
    production_path = os.path.join('data', 'production_data.csv')
    
    print(f"Loading training data from {training_path}...")
    training_df = load_data(training_path)
    
    print(f"Loading production data from {production_path}...")
    production_df = load_data(production_path)
    
    if training_df is None or production_df is None:
        print("Failed to load data. Exiting.")
        return

    # Inject drift patterns
    print("Modifying distribution for 'income' and 'debt_ratio'...")
    # Apply transformation to shift underlying distribution
    production_df['income'] = production_df['income'] * 1.5
    production_df['debt_ratio'] = production_df['debt_ratio'] * 1.4
    
    print(f"saving drifted data to {production_path}...")
    production_df.to_csv(production_path, index=False)

    print("Detecting drift...")
    print("-" * 50)
    drift_report = detect_drift(training_df, production_df)
    
    print(f"{'Feature':<20} | {'PSI':<10} | {'Status':<10}")
    print("-" * 50)
    
    for feature, metrics in drift_report.items():
        psi = metrics['psi']
        status = metrics['status']
        print(f"{feature:<20} | {psi:<10.4f} | {status:<10}")

    print("-" * 50)
    print("Scenario 2 Complete.")

def run_scenario_3_repair():
    print("\nRunning Scenario 3: Restore Baseline Distribution")
    print("-" * 50)
    
    training_path = os.path.join('data', 'training_data.csv')
    production_path = os.path.join('data', 'production_data.csv')
    
    print("Generating reference production data...")
    # Reload original training distribution and apply minor noise for variance
    training_df = load_data(training_path)
    
    if training_df is None:
        print("Failed to load training data to use as base.")
        return

    # Create production dataset from baseline
    import numpy as np
    production_df = training_df.copy()
    for col in ['income', 'debt_ratio', 'loan_amount']:
        if col in production_df.columns:
            production_df[col] = production_df[col] * np.random.uniform(0.98, 1.02, len(production_df))
    
    print(f"saving repaired data to {production_path}...")
    production_df.to_csv(production_path, index=False)

    print("Detecting drift on repaired data...")
    print("-" * 50)
    drift_report = detect_drift(training_df, production_df)
    
    print(f"{'Feature':<20} | {'PSI':<10} | {'Status':<10}")
    print("-" * 50)
    
    for feature, metrics in drift_report.items():
        psi = metrics['psi']
        status = metrics['status']
        print(f"{feature:<20} | {psi:<10.4f} | {status:<10}")

    print("-" * 50)
    print("Scenario 3 Complete.")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Run DriftGuard Demo Scenarios")
    parser.add_argument('--scenario', type=int, choices=[1, 2, 3], default=1, 
                        help="Scenario to run: 1 (Basic), 2 (Drift Injection), 3 (Restore Baseline)")
    
    args = parser.parse_args()
    
    if args.scenario == 1:
        run_scenario_1()
    elif args.scenario == 2:
        run_scenario_2()
    elif args.scenario == 3:
        run_scenario_3_repair()

