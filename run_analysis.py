import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import glob
import os
import json
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Apply beautiful seaborn style
sns.set_theme(style="darkgrid", context="talk")
plt.style.use("dark_background")

assets_dir = 'assets'
os.makedirs(assets_dir, exist_ok=True)

files = glob.glob('*.csv')
datasets = {}

for f in files:
    try:
        datasets[f] = pd.read_csv(f)
    except Exception as e:
        print(f"Error reading {f}: {e}")

findings = []

# Analysis 1: Total Dataset Sizes
counts = {k: len(v) for k, v in datasets.items()}
plt.figure(figsize=(10, 6))
sns.barplot(x=list(counts.keys()), y=list(counts.values()), palette="viridis")
plt.xticks(rotation=45)
plt.title("Number of Software Projects per Dataset")
plt.ylabel("Project Count")
plt.tight_layout()
plt.savefig(f"{assets_dir}/plot_project_counts.png", dpi=150)
plt.close()

# Identify common target variables (Effort)
def get_effort_col(df):
    for col in df.columns:
        if 'effort' in col.lower() or 'hours' in col.lower():
            return col
    return None

def get_size_col(df):
    for col in df.columns:
        if 'fp' in col.lower() or 'loc' in col.lower() or 'size' in col.lower():
            return col
    return None

# Analysis 2 & 3: Effort Distribution & Correlation
correlations = []
for name, df in datasets.items():
    ecol = get_effort_col(df)
    scol = get_size_col(df)
    
    if ecol and pd.api.types.is_numeric_dtype(df[ecol]):
        # Plot Effort Distribution for Albrecht as example
        if 'albrecht' in name.lower():
            plt.figure(figsize=(8, 5))
            sns.histplot(df[ecol], kde=True, color="cyan", bins=15)
            plt.title(f"Effort Distribution ({name})")
            plt.xlabel(ecol)
            plt.tight_layout()
            plt.savefig(f"{assets_dir}/plot_effort_dist.png", dpi=150)
            plt.close()
            
    if ecol and scol and pd.api.types.is_numeric_dtype(df[ecol]) and pd.api.types.is_numeric_dtype(df[scol]):
        # Correlation
        corr = df[ecol].corr(df[scol])
        correlations.append({'dataset': name.replace('.csv',''), 'correlation': corr})
        
        # Plot Size vs Effort for Albrecht
        if 'albrecht' in name.lower():
            plt.figure(figsize=(8, 5))
            sns.regplot(x=df[scol], y=df[ecol], color="magenta", scatter_kws={'alpha':0.6})
            plt.title(f"Software Size vs Effort ({name})")
            plt.xlabel(scol)
            plt.ylabel(ecol)
            plt.tight_layout()
            plt.savefig(f"{assets_dir}/plot_size_vs_effort.png", dpi=150)
            plt.close()

if correlations:
    corrs_df = pd.DataFrame(correlations).dropna()
    plt.figure(figsize=(10, 6))
    sns.barplot(data=corrs_df, x='dataset', y='correlation', palette="magma")
    plt.xticks(rotation=45)
    plt.title("Correlation between Project Size and Effort")
    plt.ylabel("Pearson Correlation")
    plt.tight_layout()
    plt.savefig(f"{assets_dir}/plot_correlations.png", dpi=150)
    plt.close()

# Predictive Modeling Demo (Random Forest on Albrecht)
if 'albrecht.csv' in datasets:
    df_alb = datasets['albrecht.csv']
    ecol = get_effort_col(df_alb)
    features = [c for c in df_alb.columns if pd.api.types.is_numeric_dtype(df_alb[c]) and c != ecol and c != 'id']
    if ecol and features:
        df_alb = df_alb.dropna(subset=features + [ecol])
        X = df_alb[features]
        y = df_alb[ecol]
        
        rf = RandomForestRegressor(n_estimators=100, random_state=42)
        rf.fit(X, y)
        y_pred = rf.predict(X)
        
        plt.figure(figsize=(8, 5))
        plt.scatter(y, y_pred, color='yellow', alpha=0.7)
        plt.plot([y.min(), y.max()], [y.min(), y.max()], color='white', linestyle='--')
        plt.title("Actual vs Predicted Effort (Random Forest)")
        plt.xlabel("Actual Effort")
        plt.ylabel("Predicted Effort")
        plt.tight_layout()
        plt.savefig(f"{assets_dir}/plot_rf_predictions.png", dpi=150)
        plt.close()
        
        # Feature Importance
        imp = pd.Series(rf.feature_importances_, index=features).sort_values(ascending=False)
        plt.figure(figsize=(8, 5))
        sns.barplot(x=imp.values, y=imp.index, palette="mako")
        plt.title("Feature Importance for Effort Prediction")
        plt.tight_layout()
        plt.savefig(f"{assets_dir}/plot_feature_importance.png", dpi=150)
        plt.close()

print("Analysis complete. Graphs generated in assets/.")
