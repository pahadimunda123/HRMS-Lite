"""Employee CRUD API."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import get_db
from models import Employee
from schemas import EmployeeCreate, EmployeeResponse

router = APIRouter()


@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """Add a new employee."""
    db_employee = Employee(
        employee_id=employee.employee_id.strip(),
        full_name=employee.full_name.strip(),
        email=employee.email.strip().lower(),
        department=employee.department.strip(),
    )
    try:
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee
    except IntegrityError as e:
        db.rollback()
        err_msg = str(e.orig) if hasattr(e, "orig") else str(e)
        err_lower = err_msg.lower()
        if "email" in err_lower or "unique" in err_lower:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An employee with this email or Employee ID already exists.",
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Duplicate employee record.",
        )


@router.get("/", response_model=list[EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    """Get all employees."""
    return db.query(Employee).order_by(Employee.full_name).all()


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    """Get employee by ID."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )
    return employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    """Delete an employee and their attendance records."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )
    db.delete(employee)
    db.commit()
    return None
