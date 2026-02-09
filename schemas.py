"""Pydantic schemas for request/response validation."""
from datetime import date
from pydantic import BaseModel, EmailStr, Field


class EmployeeBase(BaseModel):
    """Base employee schema."""
    employee_id: str = Field(..., min_length=1, max_length=50)
    full_name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)


class EmployeeCreate(EmployeeBase):
    """Schema for creating an employee."""
    pass


class EmployeeResponse(EmployeeBase):
    """Schema for employee response."""
    id: int

    class Config:
        from_attributes = True


class AttendanceBase(BaseModel):
    """Base attendance schema."""
    date: date
    status: str = Field(..., pattern="^(Present|Absent)$")


class AttendanceCreate(AttendanceBase):
    """Schema for creating attendance."""
    pass


class AttendanceResponse(AttendanceBase):
    """Schema for attendance response."""
    id: int
    employee_id: int

    class Config:
        from_attributes = True
