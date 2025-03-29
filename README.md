# Diabetic Prediction Application 🩸

![Project Banner](https://via.placeholder.com/1200x400?text=Diabetic+Prediction+App) <!-- Replace with actual banner image -->

A full-stack web application for diabetes prediction, combining Node.js for the frontend and Python/Flask for machine learning API.

## 🌟 Features

- **Machine Learning Model**: Predicts diabetes risk using patient data
- **User Management**: Signup, login, and profile system
- **Responsive UI**: Built with TailwindCSS and EJS templates
- **RESTful API**: Flask backend with JSON responses
- **Real-time Predictions**: Instant results from ML model

## 🛠 Tech Stack

**Frontend**:
- Node.js | Express.js | EJS
- TailwindCSS | PostCSS
- Nodemon (Development)

**Backend**:
- Python | Flask
- Scikit-learn (ML model)
- Gunicorn (Production)

**Database**:
- MongoDB (User data) <!-- Update if using different DB -->

## 🚀 Deployment

We recommend deploying this application using:

[![Render](https://img.shields.io/badge/Render-%46E3B7.svg?logo=render&logoColor=white)](https://render.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000.svg?logo=vercel&logoColor=white)](https://vercel.com)

**Frontend**: Hosted on Vercel  
**Backend API**: Hosted on Render  

## 🛆 Installation

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- npm (v8+)
- pip (v21+)

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/diabetic-prediction-app.git
   cd diabetic-prediction-app
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Set up Python environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   pip install -r requirements.txt
   ```

## 🏃 Running Locally

1. Start the Node.js server (frontend):
   ```bash
   npm run dev
   ```

2. Start the Flask API (in a separate terminal):
   ```bash
   source venv/bin/activate
   python ml_api/ml_api.py
   ```

3. Access the application at:
   - Frontend: `http://localhost:8080`
   - API: `http://localhost:5000`

## 🏗 Project Structure

```
diabetic-prediction-app/
├── ml_api/               # Python Flask API
│   ├── ml_api.py         # ML model and endpoints
├── models/               # Database models
├── public/               # Static assets
│   └── css/              # Tailwind styles
├── routes/               # Express routes
├── views/                # EJS templates
│   ├── includes/         # Partial templates
│   └── pages/            # Main pages
├── .gitignore
├── app.js                # Express app
├── package.json
├── README.md
├── requirements.txt      # Python dependencies
└── tailwind.config.js
```

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/predict` | POST | Get diabetes prediction |
| `/api/users` | POST | Create new user |
| `/api/auth` | POST | User authentication |

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - youremail@example.com

Project Link: [https://github.com/yourusername/diabetic-prediction-app](https://github.com/yourusername/diabetic-prediction-app)

