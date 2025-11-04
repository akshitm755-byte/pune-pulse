import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To redirect after success

export default function CreateHangout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    location: '',
    description: '',
    filter_profession: '',
    filter_area: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiData = {
      creatorId: user.userId,
      name: formData.name,
      time: new Date(formData.time).toISOString(), // Convert to standard time
      location: formData.location,
      description: formData.description,
      filters: {
        profession: formData.filter_profession || null,
        area: formData.filter_area || null,
        // You could add age filters here too!
      },
    };

    try {
      await axios.post('/api/hangouts/create', apiData);
      // Success! Redirect to the scheduled hangouts page
      navigate('/scheduled');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <h1 className="h3 card-title mb-3">Create a New Hangout</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Hangout Name</label>
            <input type="text" className="form-control" name="name" id="name" required onChange={handleFormChange} />
          </div>
          <div className="row g-2 mb-3">
            <div className="col-md">
              <label htmlFor="time" className="form-label">Date and Time</label>
              <input type="datetime-local" className="form-control" name="time" id="time" required onChange={handleFormChange} />
            </div>
            <div className="col-md">
              <label htmlFor="location" className="form-label">Location / Address</label>
              <input type="text" className="form-control" name="location" id="location" required onChange={handleFormChange} />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea className="form-control" name="description" id="description" rows="3" onChange={handleFormChange}></textarea>
          </div>
          
          <h5 className="h5 mt-4">Filters (Optional)</h5>
          <p className="text-muted small">Only show this to users who match:</p>
          <div className="row g-2 mb-3">
            <div className="col-md">
              <label htmlFor="filter_profession" className="form-label">Profession</label>
              <input type="text" className="form-control" name="filter_profession" id="filter_profession" onChange={handleFormChange} />
            </div>
            <div className="col-md">
              <label htmlFor="filter_area" className="form-label">Area</label>
              <input type="text" className="form-control" name="filter_area" id="filter_area" onChange={handleFormChange} />
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          
          <button type="submit" className="btn btn-primary btn-lg mt-3" disabled={loading}>
            {loading ? 'Creating...' : 'Create Hangout'}
          </button>
        </form>
      </div>
    </div>
  );
}