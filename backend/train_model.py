# Step 1 - Import libraries
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import pickle
import numpy as np

# Step 2 - Load the dataset
df = pd.read_csv("studentdataset.csv")

print("Dataset loaded successfully!")
print("Shape:", df.shape)
print("\nFirst 3 rows:")
print(df.head(3))

# Step 3 - Separate features (X) and target (y)
X = df.drop("Final_Marks", axis=1)   # All columns EXCEPT Final_Marks
y = df["Final_Marks"]                 # Only the Final_Marks column

# Step 4 - Split into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("\nTraining samples:", len(X_train))
print("Testing samples: ", len(X_test))

# Step 5 - Create and train the model
model = LinearRegression()
model.fit(X_train, y_train)

print("\nModel trained successfully!")

# Step 6 - Evaluate the model
y_pred = model.predict(X_test)

mse  = mean_squared_error(y_test, y_pred)
mae  = mean_absolute_error(y_test, y_pred)
r2   = r2_score(y_test, y_pred)

print("\n--- Model Performance ---")
print(f"Mean Absolute Error  (MAE) : {mae:.2f}")
print(f"Mean Squared Error   (MSE) : {mse:.2f}")
print(f"R² Score             (R²)  : {r2:.4f}")

# Step 7 - Save the trained model to a file
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("\nModel saved as model.pkl ✓")