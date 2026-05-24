import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listens for active token changes from Firebase Auth securely
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true); // 🚀 FIX: Lock loading status immediately when a user token changes
      
      if (user) {
        setCurrentUser(user);
        try {
          // Fetch the user's role document from the Firestore "users" collection
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setRole(userDocSnap.data().role || "customer");
          } else {
            setRole("customer"); // Standard customer fallback if document doesn't exist yet
          }
        } catch (error) {
          console.error("Error loading user profile role context:", error);
          setRole("customer"); // Safe structural error fallback
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      
      setLoading(false); // 🚀 FIX: Only unlock loading AFTER the database profile call resolves completely
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);