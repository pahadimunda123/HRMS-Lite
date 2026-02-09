"""Attendance API."""
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

from database import get_db
from models import Attendance, Employee
from schemas import AttendanceCreate, AttendanceResponse

router = APIRouter()


@router.get("/summary")
def get_attendance_summary(
    target_date: date = Query(..., alias="date"),
    db: Session = Depends(get_db),
):
    """Get present/absent counts for a given date."""
    present = db.query(func.count(Attendance.id)).filter(
        Attendance.date == target_date,
        Attendance.status == "Present",
    ).scalar()
    absent = db.query(func.count(Attendance.id)).filter(
        Attendance.date == target_date,
        Attendance.status == "Absent",
    ).scalar()
    return {"date": str(target_date), "present": present or 0, "absent": absent or 0}


@router.post("/{employee_id}", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(
    employee_id: int,
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
):
    """Mark attendance for an employee."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )
    db_attendance = Attendance(
        employee_id=employee_id,
        date=attendance.date,
        status=attendance.status,
    )
    try:
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance for this date has already been recorded.",
        )


@router.get("/{employee_id}", response_model=list[AttendanceResponse])
def get_employee_attendance(
    employee_id: int,
    db: Session = Depends(get_db),
    from_date: date | None = Query(None, alias="from"),
    to_date: date | None = Query(None, alias="to"),
):
    """Get attendance records for an employee."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )
    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    if from_date:
        query = query.filter(Attendance.date >= from_date)
    if to_date:
        query = query.filter(Attendance.date <= to_date)
    return query.order_by(Attendance.date.desc()).all()
