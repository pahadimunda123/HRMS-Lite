import { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import styles from './PieChart.module.css'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = [
  '#2563eb', '#16a34a', '#ea580c', '#7c3aed', '#0891b2',
  '#dc2626', '#ca8a04', '#db2777', '#059669', '#4f46e5',
]

export default function DepartmentPieChart({ employees }) {
  const chartData = useMemo(() => {
    const counts = {}
    employees.forEach((e) => {
      const d = e.department || 'Unassigned'
      counts[d] = (counts[d] || 0) + 1
    })
    const labels = Object.keys(counts).sort()
    const data = labels.map((l) => counts[l])
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: '#fff',
        borderWidth: 2,
      }],
    }
  }, [employees])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const pct = ((ctx.raw / total) * 100).toFixed(1)
            return `${ctx.label}: ${ctx.raw} (${pct}%)`
          },
        },
      },
    },
  }

  if (!employees.length) return null

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Employees by Department</h3>
      <div className={styles.chart}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}
