"""SQLAlchemy models for Employee and Attendance."""
from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from database import Base


class Employee(Base):
    """Employee model."""
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(String(200), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    department = Column(String(100), nullable=False)

    attendance_records = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")


class Attendance(Base):
    """Attendance record model."""
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False)  # Present / Absent

    employee = relationship("Employee", back_populates="attendance_records")

    __table_args__ = (UniqueConstraint("employee_id", "date", name="uq_employee_date"),)
