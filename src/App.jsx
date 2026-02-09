import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </Layout>
  )
}

export default App
