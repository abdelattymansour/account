import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      setAuth({ user: JSON.parse(user), token });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Update state and localStorage
      setAuth({ user, token });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear state and localStorage
    setAuth({ user: null, token: '' });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Redirect to login
    navigate('/login');
  };

  const isAuthenticated = () => {
    return !!auth.token;
  };

  const isAdmin = () => {
    return auth.user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ auth, loading, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
