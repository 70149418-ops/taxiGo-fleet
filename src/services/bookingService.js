import { db, auth } from "../firebase/config";
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";

// CREATE: Book a new taxi ride (Authenticated users only)
export const createTaxiBooking = async (bookingDetails) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Access Denied: Unauthenticated");

  return await addDoc(collection(db, "bookings"), {
    ...bookingDetails,
    userId: currentUser.uid,
    customerEmail: currentUser.email,
    status: "Pending", // Default status for new bookings
    createdAt: serverTimestamp()
  });
};

// READ: Fetch bookings depending on your system role tier (Role Separation)
export const getBookingsByRole = async (userRole) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Access Denied: Unauthenticated");

  let bookingsCollectionRef = collection(db, "bookings");
  let finalQuery;

  // Admin manages all records; standard customers only view their own
  if (userRole === "admin") {
    finalQuery = bookingsCollectionRef; // Admins get full collection download access
  } else {
    finalQuery = query(bookingsCollectionRef, where("userId", "==", currentUser.uid));
  }

  const querySnapshot = await getDocs(finalQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// UPDATE: Modify taxi booking parameters (e.g., changing status or location)
export const updateTaxiBooking = async (bookingId, updatedFields) => {
  const currentSession = auth.currentUser;
  if (!currentSession) throw new Error("Access Denied: Unauthenticated");

  const documentRef = doc(db, "bookings", bookingId);
  await updateDoc(documentRef, updatedFields);
};

// DELETE: Cancel/Remove a booking transaction document
export const cancelTaxiBooking = async (bookingId) => {
  const currentSession = auth.currentUser;
  if (!currentSession) throw new Error("Access Denied: Unauthenticated");

  const documentRef = doc(db, "bookings", bookingId);
  await deleteDoc(documentRef);
};