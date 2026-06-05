import pandas as pd
import glob
import os

files = glob.glob('*.csv')
with open('csv_summary.txt', 'w', encoding='utf-8') as f:
    for file in files:
        df = pd.read_csv(file)
        f.write(f"--- File: {file} ---\n")
        f.write(f"Shape: {df.shape}\n")
        f.write(f"Columns: {list(df.columns)}\n")
        f.write(f"Head:\n{df.head(2)}\n\n")
