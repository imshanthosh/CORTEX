# AquaShield AI Deployment Guide

This guide explains how to deploy the AquaShield AI application using Docker or manually on various platforms.

## 🐳 Deployment via Docker (Recommended)

The easiest way to deploy all three services is using Docker and Docker Compose.

### Prerequisites
- Docker and Docker Compose installed.
- Environment variables configured (see `.env` files in each directory).

### Local Production Test
1. From the root directory, run:
   ```bash
   docker-compose up --build
   ```
2. The application will be available at:
   - **Frontend**: http://localhost (Port 80)
   - **Backend**: http://localhost:5000
   - **Microservices**: http://localhost:8000

## ☁️ Cloud Deployment Options

### 1. Railway / Render (Easiest for Containers)
These platforms can automatically pick up the `docker-compose.yml` or individual Dockerfiles.
- Link your GitHub repository.
- Create three services: `frontend`, `backend`, and `microservices`.
- Set the `PYTHON_SERVICE_URL` environment variable for the backend to point to your deployed microservice URL.

### 2. Manual Deployment (PaaS)

#### Frontend (Static)
- Deploy the `frontend/dist` folder to **Vercel**, **Netlify**, or **Firebase Hosting**.
- Command: `npm run build`

#### Backend (Node.js)
- Deploy to **Railway**, **Render**, or **Heroku**.
- Ensure `PORT` and `PYTHON_SERVICE_URL` are set.

#### Microservices (Python)
- Deploy to **Railway**, **Render**, or **Google Cloud Run**.
- Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 🔐 Environment Variables

Ensure the following variables are set in your deployment environment:

### Backend
- `PORT`: 5000
- `PYTHON_SERVICE_URL`: URL of the Python microservice.
- `FIREBASE_PROJECT_ID`: (Your Project ID)
- (Any other variables from `backend/.env`)

### Microservices
- (Any variables from `microservices/.env`)

## 🌐 Networking
- In production, ensure the Frontend's `vite.config.js` or API calls are updated to point to the production Backend URL if not using a proxy.
- For Docker deployments, internal networking is handled by service names (e.g., `http://microservices:8000`).
