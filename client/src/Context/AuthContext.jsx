import React, { createContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

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
          // Check if profile is complete based on user data
          setIsProfileComplete(userData.profileComplete || false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
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
    try {
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      setIsLoggedIn(true);
      setIsProfileComplete(userData.profileComplete || false);
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Failed to save login data');
    }
  };

  // Update user profile function
  const updateUserProfile = (updates) => {
    if (!user) {
      console.error('No user to update');
      return false;
    }
    
    try {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Update profile completeness if it's being set
      if (updates.hasOwnProperty('profileComplete')) {
        setIsProfileComplete(updates.profileComplete);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };

  // Register function (calls login after successful registration)
  const register = async (formData) => {
    try {
      const response = await fetch('/api/register', {
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
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      setToken(null);
      setUser(null);
      setIsLoggedIn(false);
      setIsProfileComplete(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

 

  // Context value
  const value = {
    user,
    token,
    isLoggedIn,
    isLoading,
    isProfileComplete,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for direct use if needed
export { AuthContext };