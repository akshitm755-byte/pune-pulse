import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios'; // We're using axios now

export default function Register() {
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    profession: '',
    hobbies: '',
    area: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiData = {
      ...formData,
      age: parseInt(formData.age),
      hobbies: formData.hobbies.split(',').map((h) => h.trim()),
    };

    try {
      // Using axios is a bit cleaner than fetch
      const response = await axios.post('/api/users/register', apiData);
      
      // On success, call the login() function from our AuthContext
      // This will save the user data and make the whole app log in
      login({
        ...apiData,
        userId: response.data.userId,
      });

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h1 className="h2 text-center mb-1">Pune Pulse</h1>
          <p className="text-center text-muted mb-4">Find & create hangouts</p>

          <form onSubmit={handleRegister}>
            {/* ... (The form is identical to the one you had) ... */}
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
              <div className="alert alert-danger" role="alert">{error}</div>
            )}
            
            <button type="submit" className="btn btn-primary w-100 btn-lg mt-3" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}