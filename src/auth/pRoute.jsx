import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthDetails'; // Update path as needed

export default function Protected({ children }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
