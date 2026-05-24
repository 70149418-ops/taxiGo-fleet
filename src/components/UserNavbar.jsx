import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const UserNavbar = ({ user, getUserName, handleLogoutAction }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 850);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [logoutHover, setLogoutHover] = useState(false);
  const [hamburgerHover, setHamburgerHover] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobileBreak = window.innerWidth <= 850;
      setIsMobile(mobileBreak);
      if (!mobileBreak) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkStyle = (id, isSidebar = false) => ({
    color: hoveredLink === id ? "#ffdd00" : "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: isSidebar ? "16px" : "14px",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    padding: isSidebar ? "12px 16px" : "0",
    borderRadius: isSidebar ? "8px" : "0",
    backgroundColor: isSidebar && hoveredLink === id ? "#222222" : "transparent",
    width: isSidebar ? "100%" : "auto",
    boxSizing: "border-box",
    display: isSidebar ? "block" : "inline",
    fontFamily: "'Inter', sans-serif"
  });

  return (
    <>
      <nav style={{
        width: "100%", backgroundColor: "#111111", color: "#ffffff",
        padding: isMobile ? "16px 24px" : "16px 40px", boxSizing: "border-box",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid #222222", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        position: "relative", zIndex: 1000, fontFamily: "'Inter', sans-serif"
      }}>
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>🚖</span>
          <Link to="/dashboard" style={{ color: "#ffffff", textDecoration: "none", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" }}>
            taxiGo <span style={{ color: "#ffdd00", fontWeight: "800" }}>Secure Portal</span>
          </Link>
        </div>

        {/* Desktop Layout links */}
        {!isMobile ? (
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link to="/dashboard" style={linkStyle("dashboard")} onMouseEnter={() => setHoveredLink("dashboard")} onMouseLeave={() => setHoveredLink(null)}>Dashboard</Link>
            <Link to="/chat" style={linkStyle("chat")} onMouseEnter={() => setHoveredLink("chat")} onMouseLeave={() => setHoveredLink(null)}>Live Lounge Chat</Link>
            
            <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: "600", backgroundColor: "#222222", padding: "6px 14px", borderRadius: "20px", border: "1px solid #ffdd00" }}>
              👤 {getUserName()}
            </span>
            <button onClick={handleLogoutAction} onMouseEnter={() => setLogoutHover(true)} onMouseLeave={() => setLogoutHover(false)} style={{
              background: logoutHover ? "#ffffff" : "transparent", color: logoutHover ? "#111111" : "#ffffff",
              border: "2px solid #ffffff", padding: "8px 16px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer", transition: "all 0.2s ease-in-out"
            }}>Sign Out</button>
          </div>
        ) : (
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} onMouseEnter={() => setHamburgerHover(true)} onMouseLeave={() => setHamburgerHover(false)} style={{ background: "transparent", border: "none", color: hamburgerHover ? "#ffdd00" : "#ffffff", fontSize: "26px", cursor: "pointer" }}>
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        )}
      </nav>

      {/* Mobile Drawer */}
      <div style={{
        position: "fixed", top: 0, right: isMobileMenuOpen ? 0 : "-300px", width: "280px", height: "100vh", backgroundColor: "#111111", borderLeft: "1px solid #222222", zIndex: 999, transition: "right 0.3s ease-in-out", padding: "80px 20px 24px 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "12px"
      }}>
        <div style={{ borderBottom: "1px solid #222222", paddingBottom: "16px", marginBottom: "12px" }}>
          <p style={{ margin: "0 0 4px 0", color: "#666666", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Active Operator</p>
          <p style={{ margin: 0, color: "#ffdd00", fontSize: "15px", fontWeight: "700" }}>👤 {getUserName()}</p>
        </div>
        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={linkStyle("dashboard", true)} onMouseEnter={() => setHoveredLink("dashboard")} onMouseLeave={() => setHoveredLink(null)}>📊 Dashboard</Link>
        <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} style={linkStyle("chat", true)} onMouseEnter={() => setHoveredLink("chat")} onMouseLeave={() => setHoveredLink(null)}>💬 Live Lounge Chat</Link>
        <button onClick={handleLogoutAction} style={{ background: "#ffffff", color: "#111111", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: "pointer", marginTop: "auto" }}>Sign Out Terminal</button>
      </div>
      {isMobileMenuOpen && <div onClick={() => setIsMobileMenuOpen(false)} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", zIndex: 998 }} />}
    </>
  );
};