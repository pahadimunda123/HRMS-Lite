import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import DepartmentPieChart from '../components/DepartmentPieChart'
import Input from '../components/Input'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import { getEmployees, createEmployee, deleteEmployee } from '../api/employees'
import styles from './Employees.module.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [form, setForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  })
  const [deleteId, setDeleteId] = useState(null)

  const fetchEmployees = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEmployees()
      setEmployees(data)
    } catch (err) {
      setError(err.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    const { employee_id, full_name, email, department } = form
    if (!employee_id.trim()) {
      setFormError('Employee ID is required')
      return
    }
    if (!full_name.trim()) {
      setFormError('Full name is required')
      return
    }
    if (!email.trim()) {
      setFormError('Email is required')
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      setFormError('Please enter a valid email address')
      return
    }
    if (!department.trim()) {
      setFormError('Department is required')
      return
    }
    setSubmitting(true)
    try {
      await createEmployee({
        employee_id: employee_id.trim(),
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        department: department.trim(),
      })
      setModalOpen(false)
      setForm({ employee_id: '', full_name: '', email: '', department: '' })
      fetchEmployees()
    } catch (err) {
      setFormError(err.message || 'Failed to add employee')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this employee? This will also remove their attendance records.')) return
    setDeleteId(id)
    try {
      await deleteEmployee(id)
      setEmployees((prev) => prev.filter((e) => e.id !== id))
      setDeleteId(null)
    } catch (err) {
      alert(err.message || 'Failed to delete employee')
      setDeleteId(null)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={fetchEmployees} />

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Employees</h1>
        <Button onClick={() => { setModalOpen(true); setFormError(null); }}>Add Employee</Button>
      </div>

      {employees.length > 0 && (
        <Card>
          <DepartmentPieChart employees={employees} />
        </Card>
      )}

      <Card>
        {employees.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No employees yet"
            description="Add your first employee to get started."
            action={<Button onClick={() => setModalOpen(true)}>Add Employee</Button>}
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.employee_id}</td>
                    <td>{emp.full_name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>
                      <Button
                        variant="danger"
                        disabled={deleteId === emp.id}
                        loading={deleteId === emp.id}
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {modalOpen && (
        <Modal title="Add Employee" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {formError && (
              <div className={styles.formError}>{formError}</div>
            )}
            <Input
              label="Employee ID"
              placeholder="e.g. EMP001"
              value={form.employee_id}
              onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
            />
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@company.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <Input
              label="Department"
              placeholder="e.g. Engineering"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            />
            <div className={styles.formActions}>
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                Add Employee
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
