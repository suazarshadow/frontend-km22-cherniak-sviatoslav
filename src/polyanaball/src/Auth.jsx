import React, { createContext, useState, useEffect, useContext } from 'react';

const Auth = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
 
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Auth.Provider value={{ user, login, logout }}>
      {children}
    </Auth.Provider>
  );
};

export function getCurrentUser() {
  const data = localStorage.getItem("user");
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}
export const useAuth = () => useContext(Auth);