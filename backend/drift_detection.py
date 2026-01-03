import pandas as pd
import numpy as np
from scipy import stats

def load_data(filepath):
    """
    Load data from a CSV file.
    """
    try:
        df = pd.read_csv(filepath)
        return df
    except Exception as e:
        print(f"Error loading data from {filepath}: {e}")
        return None

def calculate_psi(expected_array, actual_array, buckets=10, bucket_type='bins'):
    """
    Calculate the Population Stability Index (PSI) for a single feature.
    
    Args:
        expected_array: Array-like, data from training/baseline.
        actual_array: Array-like, data from production/current.
        buckets: Number of buckets.
        bucket_type: 'bins' for equal-width, 'quantiles' for equal-frequency (on expected).
        
    Returns:
        float: PSI value.
    """
    def scale_range(input, min, max):
        input += -(np.min(input))
        input /= np.max(input) / (max - min)
        input += min
        return input

    breakpoints = np.arange(0, buckets + 1) / (buckets) * 100

    if bucket_type == 'bins':
        try:
            # Equal-width bins based on expected range
            min_val = min(np.min(expected_array), np.min(actual_array))
            max_val = max(np.max(expected_array), np.max(actual_array))
            if min_val == max_val:
                return 0.0
            bins = np.linspace(min_val, max_val, buckets + 1)
        except:
             return 0.0
    else:
        # Quantiles based on expected data
        try:
           bins = np.percentile(expected_array, breakpoints)
        except:
           return 0.0

    # Handle unique bins if low cardinality
    bins = np.unique(bins)
    if len(bins) < 2:
        return 0.0

    # Calculate frequency counts
    expected_percents = np.histogram(expected_array, bins)[0] / len(expected_array)
    actual_percents = np.histogram(actual_array, bins)[0] / len(actual_array)

    # Avoid division by zero and log of zero
    expected_percents = np.where(expected_percents == 0, 0.0001, expected_percents)
    actual_percents = np.where(actual_percents == 0, 0.0001, actual_percents)

    psi_values = (expected_percents - actual_percents) * np.log(expected_percents / actual_percents)
    psi = np.sum(psi_values)
    
    return float(psi)

def calculate_ks(expected_array, actual_array):
    """
    Calculate the Kolmogorov-Smirnov statistic for two samples.
    
    Args:
        expected_array: Array-like, data from training/baseline.
        actual_array: Array-like, data from production/current.
        
    Returns:
        float: KS statistic (maximum difference between CDFs).
    """
    try:
        ks_stat, _ = stats.ks_2samp(expected_array, actual_array)
        return float(ks_stat)
    except Exception as e:
        print(f"Error calculating KS: {e}")
        return 0.0

def calculate_kl(expected_array, actual_array, buckets=10, bucket_type='quantiles'):
    """
    Calculate the Kullback-Leibler Divergence for a single feature.
    
    Args:
        expected_array: Array-like, data from training/baseline.
        actual_array: Array-like, data from production/current.
        buckets: Number of buckets.
        bucket_type: 'bins' for equal-width, 'quantiles' for equal-frequency (on expected).
        
    Returns:
        float: KL Divergence value.
    """
    try:
        # Use same binning as PSI for consistency
        if bucket_type == 'bins':
            min_val = min(np.min(expected_array), np.min(actual_array))
            max_val = max(np.max(expected_array), np.max(actual_array))
            if min_val == max_val:
                return 0.0
            bins = np.linspace(min_val, max_val, buckets + 1)
        else:
            breakpoints = np.arange(0, buckets + 1) / (buckets) * 100
            bins = np.percentile(expected_array, breakpoints)

        bins = np.unique(bins)
        if len(bins) < 2:
            return 0.0

        # Calculate frequency counts
        expected_percents = np.histogram(expected_array, bins)[0] / len(expected_array)
        actual_percents = np.histogram(actual_array, bins)[0] / len(actual_array)

        # Avoid division by zero and log of zero
        expected_percents = np.where(expected_percents == 0, 0.0001, expected_percents)
        actual_percents = np.where(actual_percents == 0, 0.0001, actual_percents)

        # KL Divergence: sum(actual * log(actual / expected))
        kl_values = actual_percents * np.log(actual_percents / expected_percents)
        kl = np.sum(kl_values)
        
        return float(kl)
    except Exception as e:
        print(f"Error calculating KL: {e}")
        return 0.0

def detect_drift(training_df, production_df, categorical_features=None):
    """
    Detect drift for all columns in the dataframes.
    
    Args:
        training_df: DataFrame, baseline data.
        production_df: DataFrame, current data.
        categorical_features: List of categorical column names (optional).
    
    Returns:
        dict: feature_name -> {'psi': value, 'status': 'critical'|'warning'|'good'}
    """
    drift_report = {}
    
    # Identify numerical columns (simple heuristic)
    numerical_cols = training_df.select_dtypes(include=[np.number]).columns.tolist()
    
    for col in numerical_cols:
        if col not in production_df.columns:
            continue
            
        training_col = training_df[col].dropna().values
        production_col = production_df[col].dropna().values
        
        # Skip if empty
        if len(training_col) == 0 or len(production_col) == 0:
            continue

        psi = calculate_psi(training_col, production_col, buckets=10, bucket_type='quantiles')
        ks = calculate_ks(training_col, production_col)
        kl = calculate_kl(training_col, production_col, buckets=10, bucket_type='quantiles')
        
        status = 'good'
        if psi >= 0.2 or ks >= 0.1 or kl >= 0.5:  # Adjust thresholds as needed
            status = 'critical'
        elif psi >= 0.1 or ks >= 0.05 or kl >= 0.2:
            status = 'warning'
            
        drift_report[col] = {
            'psi': round(psi, 4),
            'ks': round(ks, 4),
            'kl': round(kl, 4),
            'status': status
        }
        
    return drift_report
