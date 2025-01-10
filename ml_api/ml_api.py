from flask import Flask, request, jsonify
import pickle
import numpy as np
import warnings

app = Flask(__name__)

# Load the model and scaler
with open('refined_diabetes_model.pkl', 'rb') as file:
    data = pickle.load(file)
    model = data['model']
    scaler = data['scaler']

# Suppress warnings about feature names
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Receive input features from the request
        data = request.get_json(force=True)
        features = data['features']
        
        # Ensure features are in a 2D array format for the scaler
        features_array = np.array(features).reshape(1, -1)
        
        # Scale the features without relying on feature names
        scaled_features = scaler.transform(features_array)
        
        # Make a prediction using the model
        prediction = model.predict(scaled_features)
        
        # Send the prediction as a JSON response
        return jsonify({'prediction': int(prediction[0])})  # Ensure output is JSON serializable
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
