"""HRMS Lite - FastAPI Backend."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, get_db
from models import Employee, Attendance
from routers import employees, attendance

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Lite API",
    description="HRMS Lite - Employee & Attendance Management",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])


@app.get("/")
def root():
    """Health check endpoint."""
    return {"message": "HRMS Lite API", "status": "running"}


@app.get("/api/health")
def health():
    """Health check for deployment."""
    return {"status": "ok"}
