import React, { createContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          setIsLoggedIn(true);
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Login function
  const login = (accessToken, userData) => {
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
    setIsLoggedIn(true);
  };

  // Register function (calls login after successful registration)
  //depends on servercode
  const register = async (formData) => {
    try {
      const response = await fetch('/api/register', {//depends on servercode
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        login(data.access_token, data.user);
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  // Context value
  const value = {
    user,
    token,
    isLoggedIn,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for direct use if needed
export { AuthContext };