import { auth, db, googleProvider } from "../firebase/config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail, 
  deleteUser 
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Helper function to safely provision a user profile record in Firestore
const saveUserProfileToDatabase = async (user, additionalInfo = {}) => {
  const userDocRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userDocRef);

  // Task 2: Ensure duplicate user records are not created
  if (!userSnapshot.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || additionalInfo.name || "taxiGo Fleet Member",
      role: additionalInfo.role || "customer", // Default signup role tier
      createdAt: serverTimestamp()
    });
  }
  return userDocRef;
};

// 1. Task 1: Email & Password Sign Up
export const registerWithEmail = async (email, password, name) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  // Provision as a standard customer default role tier
  await saveUserProfileToDatabase(response.user, { name, role: "customer" });
  return response.user;
};

// 2. Task 1: Email & Password Sign In
export const loginWithEmail = async (email, password) => {
  const response = await signInWithEmailAndPassword(auth, email, password);
  return response.user;
};

// 3. Task 1: Google Sign-In using GoogleAuthProvider
export const loginWithGoogle = async () => {
  const response = await signInWithPopup(auth, googleProvider);
  // Automatically provision user entry if logging in for the first time
  await saveUserProfileToDatabase(response.user, { role: "customer" });
  return response.user;
};

// 4. Task 1: Sign Out Functionality (FIXED: Renamed to match Navbar import hook)
export const logUserOut = () => {
  return signOut(auth);
};

// 5. Task 1: Reset Password Functionality
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// 6. Task 1: Delete Account Option
export const deleteCurrentUser = async () => {
  const user = auth.currentUser;
  if (user) {
    await deleteUser(user);
  }
};