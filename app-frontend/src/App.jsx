import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Navbar from './Navbar'
import Register from './Register'
import Dashboard from './Dashboard'
import CreateHangout from './CreateHangout'
import EligibleHangouts from './EligibleHangouts'
import ScheduledHangouts from './ScheduledHangouts'

function App() {
  const { user } = useAuth();

  // If the user is NOT logged in, show the Register page
  if (!user) {
    return (
      <div className="container mt-5">
        <Register />
      </div>
    );
  }

  // If the user IS logged in, show the full app with Navbar
  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ maxWidth: '960px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateHangout />} />
          <Route path="/hangouts" element={<EligibleHangouts />} />
          <Route path="/scheduled" element={<ScheduledHangouts />} />
          
          {/* Any other path redirects to the dashboard */}
          <Route path="*" element={<Navigate to="/" />} /> 
        </Routes>
      </div>
    </>
  )
}

export default App