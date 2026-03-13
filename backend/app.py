# Import libraries
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

# Create the Flask app
app = Flask(__name__)
CORS(app)  # This allows React (on a different port) to talk to Flask

# Load the saved model once when server starts
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

print("Model loaded successfully! ✓")

# Define the prediction route
@app.route("/predict", methods=["POST"])
def predict():

    # Get the JSON data sent from React
    data = request.get_json()

    # Extract all 8 input values (in the same order as your dataset columns)
    features = [
        float(data["study_hours"]),
        float(data["attendance"]),
        float(data["sleep_hours"]),
        float(data["assignment_score"]),
        float(data["previous_gpa"]),
        float(data["participation"]),
        float(data["consistency"]),
        float(data["distraction"])
    ]

    # Convert to numpy array (what scikit-learn expects)
    input_array = np.array([features])

    # Make prediction
    prediction = model.predict(input_array)[0]

    # Round to 1 decimal place and send back
    return jsonify({
        "predicted_marks": round(float(prediction), 1)
    })

# A simple test route to confirm Flask is running
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Student Marks Predictor API is running!"})

# Start the server
if __name__ == "__main__":
    app.run(debug=True, port=5000)