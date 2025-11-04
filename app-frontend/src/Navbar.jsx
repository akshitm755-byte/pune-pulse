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
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
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
          <span className="navbar-text me-3">
            Welcome, {user.name}!
          </span>
          <button className="btn btn-outline-secondary" onClick={logout}>
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;