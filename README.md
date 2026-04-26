# Truck Trip Planner

A production-ready full-stack application that helps truck drivers plan their trips by calculating optimal routes, adhering to strict Hours of Service (HOS) rules, and visually generating Electronic Logging Device (ELD) daily logs.

## Tech Stack
-   **Backend:** Python 3.10+, Django, Django REST Framework
-   **Frontend:** React (Vite), Tailwind CSS, React-Leaflet
-   **APIs:** Open Source Routing Machine (OSRM) and Nominatim (OpenStreetMap)

## Project Overview

The application features:
1.  **Map Route Generation:** Input current, pickup, and dropoff locations to receive a structured route on the map.
2.  **HOS Simulation Engine:** A complete algorithm executing the 11-hour driving limit, 14-hour on-duty window, 30-minute break requirement, and 70-hour/8-day cycles.
3.  **ELD Daily Log Visualizer:** A stunning CSS-grid and SVG-based rendering of the classic 24-hour logbook graph.

## Setup Steps

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate # On Windows
   ```
3. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers requests
   ```
4. Run migrations and start server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Deployment Instructions

### Deploying the Backend (Render/Railway)
1.  Add a `requirements.txt` (`pip freeze > requirements.txt`).
2.  Create a `Procfile` mapping `web: gunicorn backend.wsgi`.
3.  Deploy to Render by connecting the repository, pointing to the `backend` folder, and setting the start command perfectly. Set `CORS_ALLOW_ALL_ORIGINS = True` (or configure specific domains) as environment variables if using a production `.env`.

### Deploying the Frontend (Vercel)
1.  Go to Vercel and import your repository.
2.  Set the Framework Preset to Vite.
3.  Update the Root Directory to `frontend`.
4.  In the Build Command, ensure it runs `npm run build`.
5.  Set `VITE_API_URL` to your live backend endpoint in Vercel settings and update `App.jsx` to rely on that Env Variable instead of localhost. Create the deployment and get the live link.
