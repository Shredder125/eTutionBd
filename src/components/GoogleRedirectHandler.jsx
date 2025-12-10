// src/components/GoogleRedirectHandler.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/AuthContext';

const GoogleRedirectHandler = ({ children }) => {
  const navigate = useNavigate();
  const { getGoogleRedirectResult } = useUserAuth();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // ✅ Check if user is returning from Google redirect
        const result = await getGoogleRedirectResult();
        
        if (result && result.user) {
          const user = result.user;
          
          // Save user to MongoDB
          const userInfo = {
            name: user.displayName,
            email: user.email,
            role: "student",
            photoURL: user.photoURL || "https://placehold.co/100"
          };

          const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(userInfo)
          });

          if (response.ok) {
            // Navigate after successful save
            navigate('/dashboard', { replace: true });
          }
        }
      } catch (error) {
        console.error('Google redirect error:', error);
        // Don't navigate on error, just log it
      }
    };

    handleRedirect();
  }, [getGoogleRedirectResult, navigate]);

  // ✅ Return children so the rest of the app renders
  return children;
};

export default GoogleRedirectHandler;