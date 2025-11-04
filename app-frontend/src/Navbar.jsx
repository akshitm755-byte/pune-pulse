import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Pune Pulse
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" // Added for accessibility
          aria-expanded="false" // Added for accessibility
          aria-label="Toggle navigation" // Added for accessibility
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav"> {/* Removed me-auto */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/hangouts">
                Eligible Hangouts
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/scheduled">
                My Hangouts
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/create">
                Create Hangout
              </NavLink>
            </li>
          </ul>
          {user && ( // Only show if user is logged in (good practice)
            <div className="d-flex align-items-center ms-auto"> {/* Added ms-auto here */}
              <span className="navbar-text me-3">
                Welcome, {user.name}!
              </span>
              <button className="btn btn-outline-secondary" onClick={logout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;