// ✅ FIXED: Added 'React' to the import
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

  // --- NEW LOGIC: Get Token from Backend on Login ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // ✅ IF USER IS LOGGED IN
      if (currentUser) {
        const userInfo = { email: currentUser.email };
        
        // Ask Backend for a Token
        fetch('http://localhost:5000/jwt', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                // Save Token to Local Storage
                localStorage.setItem('access-token', data.token);
                setLoading(false);
            }
        })
        .catch(err => {
            console.error("Token fetch failed", err);
            setLoading(false);
        });
      } 
      // ❌ IF USER IS LOGGED OUT
      else {
        localStorage.removeItem('access-token');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut, googleSignIn }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(AuthContext);
}