import { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import styles from './PieChart.module.css'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function AttendancePieChart({ summary, dateLabel }) {
  const chartData = useMemo(() => {
    const present = summary?.present ?? 0
    const absent = summary?.absent ?? 0
    const total = present + absent
    if (total === 0) return null
    return {
      labels: ['Present', 'Absent'],
      datasets: [{
        data: [present, absent],
        backgroundColor: ['#16a34a', '#dc2626'],
        borderColor: '#fff',
        borderWidth: 2,
      }],
    }
  }, [summary])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : 0
            return `${ctx.label}: ${ctx.raw} (${pct}%)`
          },
        },
      },
    },
  }), [])

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Attendance - {dateLabel}</h3>
      <div className={styles.chart}>
        {chartData ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className={styles.empty}>No attendance recorded for this date.</div>
        )}
      </div>
    </div>
  )
}
