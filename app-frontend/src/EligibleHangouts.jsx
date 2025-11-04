import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

export default function EligibleHangouts() {
  const { user } = useAuth();
  const [hangouts, setHangouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accepted, setAccepted] = useState({}); // To track accepted hangouts

  useEffect(() => {
    const fetchHangouts = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        // 1. Call the filter service
        const response = await axios.get(`/api/filter/eligible/${user.userId}`);
        setHangouts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };
    fetchHangouts();
  }, [user]); // Re-run if the user changes

  const handleAccept = async (hangoutId) => {
    try {
      // 2. Call the schedule service
      await axios.post('/api/schedule/accept', {
        userId: user.userId,
        hangoutId: hangoutId,
      });
      // Mark as accepted to disable the button
      setAccepted((prev) => ({ ...prev, [hangoutId]: true }));
    } catch (err) {
      alert('Failed to accept hangout. Please try again.');
    }
  };

  if (loading) return <div className="text-center">Loading hangouts...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1 className="h3 mb-3">Eligible Hangouts</h1>
      {hangouts.length === 0 ? (
        <p>No hangouts available for you right now. Check back later!</p>
      ) : (
        <div className="list-group shadow-sm">
          {hangouts.map((h) => (
            <div key={h.hangoutId} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{h.name}</h5>
                <p className="mb-1 text-muted">{h.description}</p>
                <small><strong>Where:</strong> {h.location}</small><br/>
                <small><strong>When:</strong> {new Date(h.time).toLocaleString()}</small>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handleAccept(h.hangoutId)}
                disabled={accepted[h.hangoutId]}
              >
                {accepted[h.hangoutId] ? 'Accepted' : 'Accept'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}