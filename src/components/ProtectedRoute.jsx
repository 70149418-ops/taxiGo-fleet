import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  // 🚀 FIXED: Destructured "currentUser" from context and aliased it as "user" to match your code hooks flawlessly
  const { currentUser: user, role, loading } = useAuthContext();

  // Displays a premium fallback loading state while Firebase validates session tokens
  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        backgroundColor: "#0d0d0d", // Match the dark dashboard background design
        color: "#ffffff",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: "border-box",
        padding: "20px"
      }}>
        {/* Modern Spinning Indicator Object */}
        <div style={{
          width: "48px",
          height: "48px",
          border: "4px solid #222222",
          borderTop: "4px solid #ffdd00",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px"
        }} />
        
        <p style={{ 
          margin: 0, 
          fontSize: "16px", 
          fontWeight: "700", 
          color: "#ffdd00",
          letterSpacing: "-0.3px"
        }}>
          🚖 Verifying taxiGo Security Credentials...
        </p>
        <p style={{ 
          margin: "6px 0 0 0", 
          fontSize: "13px", 
          color: "#888888",
          fontWeight: "400" 
        }}>
          Establishing secure connection to encrypted core network nodes
        </p>

        {/* Global style inject block to maintain spinner framework animations locally */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If the visitor is unauthenticated, redirect them directly back to the login screen
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If an active session exists but their role tier is unauthorized, route to fallback safety
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If credentials pass verification successfully, render the target dashboard view
  return children;
};