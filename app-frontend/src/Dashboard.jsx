import React from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <h1 className="h3 card-title mb-3">Welcome, {user.name}!</h1>
        <p className="card-text text-muted">
          You're logged in. Use the navigation bar above to find, create, or
          view your hangouts.
        </p>
        <Link to="/create" className="btn btn-primary">
          Create a New Hangout
        </Link>
      </div>
    </div>
  );
}