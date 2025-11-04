import { useState } from 'react'

function App() {
  // State to hold the user's data after they register
  const [user, setUser] = useState(null)
  
  // State for the form inputs
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    profession: '',
    hobbies: '',
    area: '',
    email: ''
  })

  // State for loading and error messages
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // This function updates the form state as the user types
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // This function is called when the user clicks "Register"
  const handleRegister = async (e) => {
    e.preventDefault() // Stop the browser from refreshing
    setLoading(true)
    setError(null)

    // Prepare the data for the API
    const apiData = {
      ...formData,
      age: parseInt(formData.age), // Convert age to a number
      hobbies: formData.hobbies.split(',').map(h => h.trim()) // Convert "a, b" to ["a", "b"]
    }

    try {
      // This is the API call!
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      })

      const result = await response.json()

      if (!response.ok) {
        // If the server returns an error, show it
        throw new Error(result.message || 'Failed to register')
      }

      // Success! Save the new user's data to state.
      setUser({
        ...apiData,
        userId: result.userId 
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // --- RENDER ---

  // If the user is registered, show the dashboard
  if (user) {
    return (
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h3 card-title mb-3">Welcome, {user.name}!</h1>
            <p className="card-text text-muted">You are now registered on Pune Pulse.</p>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item d-flex justify-content-between">
                <strong>User ID:</strong> <span>{user.userId}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <strong>Email:</strong> <span>{user.email}</span>
              </li>
            </ul>
            <p className="card-text"><em>(Now you could build the "Create Hangout" form!)</em></p>
            <button className="btn btn-outline-secondary" onClick={() => setUser(null)}>Log Out</button>
          </div>
        </div>
      </div>
    )
  }

  // If no user, show the registration form
  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h1 className="h2 text-center mb-1">Pune Pulse</h1>
          <p className="text-center text-muted mb-4">Find & create hangouts</p>
          
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" name="name" id="name" required onChange={handleFormChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" name="email" id="email" required onChange={handleFormChange} />
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md">
                <label htmlFor="age" className="form-label">Age</label>
                <input type="number" className="form-control" name="age" id="age" required onChange={handleFormChange} />
              </div>
              <div className="col-md">
                <label htmlFor="profession" className="form-label">Profession</label>
                <input type="text" className="form-control" name="profession" id="profession" required onChange={handleFormChange} />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="area" className="form-label">Area (e.g., Kothrud)</label>
              <input type="text" className="form-control" name="area" id="area" required onChange={handleFormChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="hobbies" className="form-label">Hobbies (comma-separated)</label>
              <input type="text" className="form-control" name="hobbies" id="hobbies" placeholder="e.g., coding, hiking" required onChange={handleFormChange} />
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <button type="submit" className="btn btn-primary w-100 btn-lg mt-3" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {' '}Registering...
                </>
              ) : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App