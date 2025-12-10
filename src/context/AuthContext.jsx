// src/context/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react"; 

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null); // ✅ NEW: Store MongoDB user data

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  function logOut() {
    return signOut(auth);
  }

  // --- LOGIC: Get Token from Backend on Login & Fetch User Profile ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // IF USER IS LOGGED IN
      if (currentUser) {
        const userInfo = { email: currentUser.email };
        
        // 1. Get JWT Token
        fetch(`${import.meta.env.VITE_API_URL}/jwt`, { 
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(userInfo)
        })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem('access-token', data.token);
            
            // 2. ✅ NEW: Fetch user profile from MongoDB with token
            return fetch(`${import.meta.env.VITE_API_URL}/users/${currentUser.email}`, {
              headers: { authorization: `Bearer ${data.token}` }
            });
          }
          throw new Error('No token received');
        })
        .then(res => res.json())
        .then(dbUser => {
          // ✅ Store MongoDB user data (includes photoURL, displayName, role, etc)
          setUserProfile(dbUser);
          
          // Update Firebase profile if MongoDB has better data
          if (dbUser?.photoURL && !currentUser.photoURL) {
            console.log('Using photoURL from MongoDB:', dbUser.photoURL);
          }
        })
        .catch(err => {
          console.error("Profile fetch failed", err);
        })
        .finally(() => {
          setLoading(false); 
        });
      } 
      // IF USER IS LOGGED OUT
      else {
        localStorage.removeItem('access-token');
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, signUp, logIn, logOut, googleSignIn, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(AuthContext);
}