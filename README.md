# HRMS Lite

## Submission Details

| Item | Link / Description |
|------|--------------------|
| **Live Application URL** | _Add your deployed frontend URL here (e.g. Vercel/Netlify)_ |
| **GitHub Repository** | https://github.com/pahadimunda123/HRMS-Lite |

---

## Project Overview

A web-based HRMS Lite application for managing employee records and daily attendance. Designed as a simple, professional internal HR tool. Features include employee CRUD, attendance tracking with date and status (Present/Absent), pie charts for department distribution and attendance summary, RESTful APIs with validation, and a clean responsive UI.

## Features

### Employee Management
- **Add Employee** – Employee ID, Full Name, Email, Department
- **View All Employees** – List with table view
- **Delete Employee** – Removes employee and associated attendance records

### Attendance Management
- **Mark Attendance** – Date and Status (Present / Absent) per employee
- **View Attendance** – Filter by employee, view records by date

### Technical Highlights
- RESTful APIs with proper HTTP status codes
- Server-side validation (required fields, email format, duplicate handling)
- Database persistence (SQLite locally, PostgreSQL in production)
- Clean UI with loading, empty, and error states
- Responsive, professional layout

## Tech Stack Used

| Layer   | Technology               |
|---------|--------------------------|
| Frontend| React 18, Vite, Chart.js |
| Backend | FastAPI (Python)         |
| Database| SQLite / PostgreSQL      |
| Styling | CSS Modules             |

## Project Structure

```
hrms-lite/
├── frontend/          # React application
│   ├── src/
│   │   ├── api/       # API client
│   │   ├── components/# Reusable UI components
│   │   └── pages/     # Employees, Attendance
│   └── package.json
├── backend/           # FastAPI application
│   ├── routers/      # API routes
│   ├── models.py     # SQLAlchemy models
│   └── main.py
└── README.md
```

## Steps to Run the Project Locally

### Prerequisites
- Node.js 18+
- Python 3.10+

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python run.py
```

API runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` with API proxy to backend.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/employees/ | Create employee |
| GET    | /api/employees/ | List employees |
| GET    | /api/employees/{id} | Get employee |
| DELETE | /api/employees/{id} | Delete employee |
| POST   | /api/attendance/{employee_id} | Mark attendance |
| GET    | /api/attendance/{employee_id} | Get attendance records |

## Deployment

### Backend (Render / Railway)

1. Create a new Web Service
2. Connect your GitHub repo
3. Set:
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** (leave empty if repo root contains backend folder)
4. Add PostgreSQL database (Render free tier) and set `DATABASE_URL`
5. Deploy

### Frontend (Vercel / Netlify)

1. Create a new project and connect your GitHub repo
2. Set:
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy

## Assumptions and Limitations

- **Single admin user** – No authentication or roles
- **Scope** – Leave management, payroll, and advanced HR features are out of scope
- **Database** – SQLite used locally; switch to PostgreSQL for production on Render
- **CORS** – API allows all origins; restrict to frontend domain in production

## License

MIT
