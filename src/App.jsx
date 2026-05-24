import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Authentication & Core Public Routes
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Unauthorized } from "./pages/Unauthorized";

// Secure Dashboards and Chat Interfaces
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { UserDashboard } from "./pages/user/UserDashboard";
import { ChatRoom } from "./pages/user/ChatRoom";

// Dynamic Single Document View Parameter Page Import
import { BookingDetail } from "./pages/user/BookingDetail";

// Inner component wrapper to access useLocation safely
function LayoutWrapper() {
  const location = useLocation();
  
  // 🚀 FIX: Detects if the route is part of any dark themed interface component (Admin, Passenger Dashboard, Chat, or Booking Receipts)
  const isDarkPage = ["/admin", "/dashboard", "/chat", "/booking"].some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh", // Pushes the layout wrapper to fill the window space dynamically
      width: "100%",          
      boxSizing: "border-box",
      // 🚀 FIX: Changes global background canvas layout to #0d0d0d across all dashboards, permanently erasing the white gap above the footer
      backgroundColor: isDarkPage ? "#0d0d0d" : "#f4f6f9",
      overflowX: "hidden"     
    }}>
      {/* Dynamic Global Responsive Navigation Header */}
      <Navbar />
      
      {/* Main Interface Content Area */}
      <div className="container" style={{ 
        flex: "1 0 auto", // Dynamically stretches to force the footer to stay locked to the absolute screen bottom
        padding: isDarkPage ? "40px 24px" : "30px 20px", // Maintains perfect grid alignment without container bleeding
        maxWidth: isDarkPage ? "100%" : "1200px", // 🚀 FIX: Removes 1200px layout limits for both Admin and Passenger Dashboards
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <Routes>
          {/* Public Entry Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Customer Dashboard Routes */}
          <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <UserDashboard />
                </ProtectedRoute>
              } 
          />

          {/* Dynamic Parameter Route */}
          <Route 
            path="/booking/:id" 
            element={
              <ProtectedRoute allowedRoles={["customer", "admin"]}>
                <BookingDetail />
              </ProtectedRoute>
            } 
          />
          
          {/* Integrated Live Customer Support Chat System */}
          <Route 
              path="/chat" 
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <ChatRoom />
                </ProtectedRoute>
              } 
          />

          {/* Protected Administrator Core Routes */}
          <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
          />

          {/* Catch-all Routing Strategy */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>

      {/* Dynamic Global University Validation Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;