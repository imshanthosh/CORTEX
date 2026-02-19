# AquaShield AI — Predict • Protect • Include

National-level water risk intelligence platform integrating three AI-powered products under a unified dashboard.

## 🏗 Architecture

```
aquashield-ai/
├── frontend/           # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/      # Landing, Login, Dashboard, AEGIS, Marine, Cascade, Alerts, Reports
│   │   ├── components/ # Sidebar, ProtectedRoute
│   │   ├── contexts/   # AuthContext (Firebase)
│   │   └── firebase.js # Firebase config
│   └── .env            # Firebase credentials (fill in)
│
├── backend/            # Node.js + Express API Gateway
│   ├── server.js       # Main server
│   ├── routes/         # aegis, marine, cascade, aquahear, user
│   └── .env            # Backend config
│
└── microservices/      # Python FastAPI AI Services
    ├── main.py         # FastAPI app
    ├── services/       # aegis, marine, cascade, aquahear
    └── requirements.txt
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Firebase project (for authentication)

### 1. Python Microservices (Port 8000)

```bash
cd microservices
pip install -r requirements.txt
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Node.js Backend (Port 5000)

```bash
cd backend
npm install   # already done if you cloned fresh
node server.js
```

### 3. React Frontend (Port 5173)

```bash
cd frontend
npm install   # already done if you cloned fresh
npm run dev
```

Open **http://localhost:5173** in your browser.

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Sign-in methods:
   - Email/Password
   - Google
4. Go to **Project Settings** → General → Your apps → Add web app
5. Copy the config values into `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

## 📦 Products

### AEGIS — Urban Water Fragility Intelligence
- LSTM-based fragility prediction (ported from existing model)
- Scenario modes: Normal, Flood, Power Failure, High Demand Crisis
- Graph-based tanker routing optimization
- Zone-level risk cards, Leaflet map with markers + polylines
- Early warning system + AI recommendations

### Marine Oil Spill Detection
- Simulated AIS fleet with 8 vessels
- Anomaly detection: speed drops, course deviations, unexpected stops
- Oil spill probability analysis for distressed vessels
- Authority alert panel with action suggestions

### AquaCascade — Contamination Propagation
- Map-click source location selection
- Physics-based plume spread simulation
- Time slider for temporal progression
- Infrastructure risk assessment
- Population exposure estimation

### AquaHear — Accessibility Voice Alerts
- Available platform-wide
- Languages: English, Hindi, Tamil, Telugu
- Alert types: Stable, Warning, High Risk
- gTTS-based audio generation

## 🔐 Security

- Firebase Authentication for all protected routes
- Environment variables for all secrets
- CORS configured on all services
- API gateway pattern (frontend → Node → Python)

## 🌐 Deployment Notes

### Frontend
```bash
cd frontend && npm run build
# Deploy dist/ to Vercel, Netlify, or Firebase Hosting
```

### Backend
```bash
# Deploy to Render, Railway, or AWS EC2
# Set PYTHON_SERVICE_URL env var to your Python service URL
```

### Python Microservices
```bash
# Deploy to Render, Railway, or AWS EC2
# Ensure port 8000 is accessible from the Node backend
```

### Docker (recommended for production)
Create Dockerfiles for each service and use docker-compose:
- Frontend: nginx serving the Vite build
- Backend: Node.js container
- Microservices: Python container

## 📋 API Endpoints

| Endpoint | Method | Service | Description |
|----------|--------|---------|-------------|
| `/api/aegis/analyze` | POST | AEGIS | Run fragility analysis |
| `/api/aegis/sample-data` | GET | AEGIS | Generate sample CSV data |
| `/api/marine/analyze` | POST | Marine | Scan vessels for anomalies |
| `/api/marine/vessels` | GET | Marine | Get vessel positions |
| `/api/cascade/simulate` | POST | Cascade | Run contamination simulation |
| `/api/aquahear/generate` | POST | AquaHear | Generate voice alert |
| `/api/user/history` | GET/POST | User | Fetch/save analysis history |
