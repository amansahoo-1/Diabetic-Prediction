
# Diabetic Prediction Application

This repository contains a web application for predicting diabetes, combining both Node.js and Python servers to handle various functionalities.

## Prerequisites

Ensure you have the following installed:
- **Node.js** (with npm)
- **Python** (with pip)
- Virtual environment tools like `venv` (optional but recommended)

## Installation

### Step 1: Clone the Repository
```bash
git clone <repository_url>
cd <repository_directory>
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```

### Step 3: Install Python Dependencies
1. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate        # On macOS/Linux
   venv\Scripts\activate           # On Windows
   ```
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

---

## Running the Application

Since this application requires both Node.js and Python servers to run simultaneously, follow these steps:

### Step 1: Start the Node.js Server
```bash
npm run dev
```

The Node.js server will:
- Use `nodemon` to automatically restart on file changes.
- Listen on port `8080`.

### Step 2: Start the Python Server
1. Ensure your terminal has access to the virtual environment:
   ```bash
   source venv/bin/activate        # On macOS/Linux
   venv\Scripts\activate           # On Windows
   ```
2. Run the Python script:
   ```bash
   python ml_api/ml_api.py
   ```

The Python server will:
- Start a Flask development server.
- Listen on `http://127.0.0.1:5000`.

---

## Accessing the Application

Once both servers are running, you can access the application and its functionalities in your web browser.

---

## Development Tools and Configuration

### Node.js
- **Nodemon**: Automatically restarts the server on file changes.
- **TailwindCSS**: Configured for watching and compiling CSS files.

### Python
- **Flask**: Used to create the backend API for the machine learning model.

---

## Notes
- Ensure both servers are running simultaneously for full functionality.
- The Flask server is running in development mode. For production, consider using a WSGI server (e.g., Gunicorn).
- If you encounter any issues, ensure all dependencies are installed correctly and both servers are running on the specified ports.

---
