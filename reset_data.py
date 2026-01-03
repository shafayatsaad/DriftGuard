import pandas as pd
import numpy as np
import os

# Ensure data directory exists
os.makedirs('data', exist_ok=True)

# Generate synthetic data
np.random.seed(42)

def generate_data(n=1000):
    data = {
        'income': np.random.normal(50000, 15000, n),
        'debt_ratio': np.random.uniform(0.1, 0.6, n),
        'loan_amount': np.random.normal(15000, 5000, n),
        'credit_score': np.random.normal(700, 50, n),
        'defaults': np.random.choice([0, 1], n, p=[0.9, 0.1]),
        'age': np.random.randint(20, 70, n)
    }
    return pd.DataFrame(data)

print("Generating training data...")
training_df = generate_data(1000)
training_df.to_csv('data/training_data.csv', index=False)

print("Generating production data...")
production_df = generate_data(200)
# Add some drift
production_df['income'] = production_df['income'] * 1.2
production_df['debt_ratio'] = production_df['debt_ratio'] * 1.1

production_df.to_csv('data/production_data.csv', index=False)
print("Data generation complete.")
