import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import AttendancePieChart from '../components/AttendancePieChart'
import { getEmployees } from '../api/employees'
import { getAttendance, getAttendanceSummary, markAttendance } from '../api/attendance'
import styles from './Attendance.module.css'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Attendance() {
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), status: 'Present' })
  const [chartDate, setChartDate] = useState(new Date().toISOString().slice(0, 10))
  const [attendanceSummary, setAttendanceSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  const fetchEmployees = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEmployees()
      setEmployees(data)
      if (data.length > 0 && !selectedEmployee) {
        setSelectedEmployee(data[0])
      }
    } catch (err) {
      setError(err.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async () => {
    if (!selectedEmployee) return
    setAttendanceLoading(true)
    try {
      const data = await getAttendance(selectedEmployee.id)
      setAttendance(data)
    } catch (err) {
      setAttendance([])
    } finally {
      setAttendanceLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    if (selectedEmployee) fetchAttendance()
    else setAttendance([])
  }, [selectedEmployee])

  const fetchAttendanceSummary = async (date) => {
    setSummaryLoading(true)
    try {
      const data = await getAttendanceSummary(date)
      setAttendanceSummary(data)
    } catch {
      setAttendanceSummary({ date, present: 0, absent: 0 })
    } finally {
      setSummaryLoading(false)
    }
  }

  useEffect(() => {
    if (employees.length > 0) fetchAttendanceSummary(chartDate)
    else setAttendanceSummary(null)
  }, [chartDate, employees.length])

  const handleMarkAttendance = () => {
    setModalOpen(true)
    setForm({ date: new Date().toISOString().slice(0, 10), status: 'Present' })
    setFormError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedEmployee) return
    setFormError(null)
    setSubmitting(true)
    try {
      await markAttendance(selectedEmployee.id, {
        date: form.date,
        status: form.status,
      })
      setModalOpen(false)
      fetchAttendance()
      fetchAttendanceSummary(chartDate)
    } catch (err) {
      setFormError(err.message || 'Failed to mark attendance')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={fetchEmployees} />

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Attendance</h1>
      </div>

      {employees.length === 0 ? (
        <Card>
          <EmptyState
            icon="📋"
            title="No employees yet"
            description="Add employees first, then you can track their attendance."
          />
        </Card>
      ) : (
        <>
          <Card>
            <div className={styles.chartHeader}>
              <label>Summary for date:</label>
              <input
                type="date"
                value={chartDate}
                onChange={(e) => setChartDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            {summaryLoading ? (
              <LoadingSpinner />
            ) : (
              <AttendancePieChart
                summary={attendanceSummary}
                dateLabel={chartDate ? new Date(chartDate + 'T12:00:00').toLocaleDateString('en-IN', { dateStyle: 'medium' }) : ''}
              />
            )}
          </Card>

          <Card>
            <div className={styles.controls}>
              <div className={styles.selectWrap}>
                <label htmlFor="emp-select">Select Employee</label>
                <select
                  id="emp-select"
                  value={selectedEmployee?.id ?? ''}
                  onChange={(e) => {
                    const id = Number(e.target.value)
                    setSelectedEmployee(employees.find((emp) => emp.id === id) || null)
                  }}
                  className={styles.select}
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_id})
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleMarkAttendance}>Mark Attendance</Button>
            </div>
          </Card>

          <Card title={`Attendance Records - ${selectedEmployee?.full_name ?? ''}`}>
            {attendanceLoading ? (
              <LoadingSpinner />
            ) : attendance.length === 0 ? (
              <EmptyState
                icon="📅"
                title="No attendance records"
                description="Mark attendance for this employee to see records here."
                action={<Button onClick={handleMarkAttendance}>Mark Attendance</Button>}
              />
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((rec) => (
                      <tr key={rec.id}>
                        <td>{formatDate(rec.date)}</td>
                        <td>
                          <span className={rec.status === 'Present' ? styles.present : styles.absent}>
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {modalOpen && selectedEmployee && (
        <Modal title="Mark Attendance" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.empLabel}>Employee: {selectedEmployee.full_name}</p>
            {formError && <div className={styles.formError}>{formError}</div>}
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            <div className={styles.selectWrap}>
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className={styles.select}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <div className={styles.formActions}>
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                Save
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
