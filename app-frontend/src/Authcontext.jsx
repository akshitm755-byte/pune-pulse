import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // This will be our "login" function
  const login = (userData) => {
    setUser(userData);
  };

  // This will be our "logout" function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// This is a helper "hook" to easily get the user data
export const useAuth = () => {
  return useContext(AuthContext);
};