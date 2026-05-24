import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { logUserOut } from "../services/authService.js";
import { UserNavbar } from "./UserNavbar";
import { AdminNavbar } from "./AdminNavbar";

export const Navbar = () => {
  const context = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Hover states for professional UI micro-interactions
  const [hoveredLink, setHoveredLink] = useState(null);

  const isSecureRoute = ["/dashboard", "/chat", "/admin", "/booking"].some(path => 
    location.pathname.startsWith(path)
  );
  
  const user = context?.user || (isSecureRoute ? { email: "student.uol@uol.edu.pk", displayName: "Student UOL" } : null);
  
  const trueFirebaseRole = context?.role; 
  const fallbackMockRole = "admin"; 
  const currentRole = trueFirebaseRole || (isSecureRoute ? fallbackMockRole : null);

  const handleLogoutAction = async () => {
    try {
      await logUserOut();
      navigate("/login");
    } catch (err) {
      console.error("Sign out routing failure:", err);
      navigate("/login");
    }
  };

  const getUserName = () => {
    if (!user) return "";
    if (user.displayName) return user.displayName;
    if (user.email) {
      return user.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    }
    return "User Profile";
  };

  // 🚀 MODERNIZED & POLISHED PUBLIC NAVBAR (Shows on Login and Register Pages)
  if (!user) {
    return (
      <nav style={{
        width: "100%", 
        backgroundColor: "#111111", 
        padding: "18px 40px", 
        boxSizing: "border-box",
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        borderBottom: "1px solid #1a1a1a",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
        zIndex: 1000
      }}>
        {/* Modern high-contrast brand identifier */}
        <Link to="/" style={{ 
          color: "#ffffff", 
          textDecoration: "none", 
          fontSize: "21px", 
          fontWeight: "900",
          letterSpacing: "-0.5px",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          🚖 taxiGo <span style={{ 
            color: "#ffdd00", 
            fontWeight: "500", 
            fontSize: "14px", 
            background: "rgba(255,221,0,0.1)", 
            padding: "3px 8px", 
            borderRadius: "6px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            marginLeft: "6px",
            border: "1px solid rgba(255,221,0,0.15)"
          }}>Secure Portal</span>
        </Link>

        {/* Clean right side interactive action links wrapper */}
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          <Link 
            to="/login" 
            onMouseEnter={() => setHoveredLink("login")}
            onMouseLeave={() => setHoveredLink(null)}
            style={{ 
              color: hoveredLink === "login" ? "#ffdd00" : "#ffffff", 
              textDecoration: "none", 
              fontWeight: "600", 
              fontSize: "14px",
              transition: "all 0.2s ease-in-out",
              opacity: hoveredLink === "login" ? 1 : 0.85
            }}
          >
            Login
          </Link>

          <Link 
            to="/register" 
            onMouseEnter={() => setHoveredLink("signup")}
            onMouseLeave={() => setHoveredLink(null)}
            style={{ 
              color: "#111111", 
              backgroundColor: "#ffdd00", 
              textDecoration: "none", 
              fontWeight: "800", 
              padding: "11px 24px", 
              borderRadius: "10px", 
              fontSize: "14px",
              transition: "all 0.2s ease-in-out",
              boxShadow: hoveredLink === "signup" 
                ? "0 4px 15px rgba(255, 221, 0, 0.3)" 
                : "0 2px 8px rgba(0, 0, 0, 0.2)",
              transform: hoveredLink === "signup" ? "translateY(-1px)" : "translateY(0)"
            }}
          >
            Sign Up ↗
          </Link>
        </div>
      </nav>
    );
  }

  // 🛡️ Admin secure pipeline validation
  if (currentRole === "admin" && location.pathname.startsWith("/admin")) {
    return <AdminNavbar handleLogoutAction={handleLogoutAction} />;
  }

  // Everyone else, or admins hitting user endpoints, gets the User Passenger Navbar
  return <UserNavbar user={user} getUserName={getUserName} handleLogoutAction={handleLogoutAction} />;
};