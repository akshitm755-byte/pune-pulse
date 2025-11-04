import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

export default function ScheduledHangouts() {
  const { user } = useAuth();
  const [scheduled, setScheduled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduled = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        // Call the schedule service to get *my* hangouts
        const response = await axios.get(`/api/schedule/scheduled/${user.userId}`);
        
        // This just gives us IDs. We need to fetch the *details*
        // In a real app, you'd have a /api/hangouts/details endpoint
        // For now, we'll just show the IDs
        
        // ---
        // NOTE: This part is simplified. The API only returns *IDs*
        // A full app would fetch details for each ID.
        // ---
        setScheduled(response.data);

      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };
    fetchScheduled();
  }, [user]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1 className="h3 mb-3">My Scheduled Hangouts</h1>
      {scheduled.length === 0 ? (
        <p>You haven't accepted any hangouts yet.</p>
      ) : (
        <div className="list-group shadow-sm">
          {scheduled.map((s) => (
            <div key={s.hangoutId} className="list-group-item">
              <h5 className="mb-1">Hangout ID: {s.hangoutId}</h5>
              <p className="mb-1 text-muted">You accepted this on {new Date(s.acceptedAt).toLocaleDateString()}</p>
              <small>(In a full app, you'd see the Hangout name and location here)</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}