import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  // Local hover state tracking for clean, interactive navigation links
  const [hoveredLink, setHoveredLink] = useState(null);

  const footerLinkStyle = (id) => ({
    color: hoveredLink === id ? "#ffdd00" : "#aaaaaa",
    textDecoration: "none",
    fontSize: "14px",
    transition: "all 0.2s ease-in-out",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  });

  return (
    <footer style={{
      backgroundColor: "#111111",
      color: "#ffffff",
      padding: "40px 40px 20px 40px",
      marginTop: "80px",
      borderTop: "3px solid #ffdd00",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Upper Footer Container: Grid/Flex Link Structures */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "30px",
        marginBottom: "30px",
        maxWidth: "1200px",
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        {/* Column 1: Branding and Core Concept info */}
        <div style={{ flex: "1 1 250px", minWidth: "220px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ fontSize: "22px" }}>🚖</span>
            <span style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.5px" }}>
              taxiGo <span style={{ color: "#ffdd00" }}>Fleet</span>
            </span>
          </div>
          <p style={{ color: "#888888", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
            Frictionless cloud transit dispatching and secure automated dispatch environments built for modern platform architectures.
          </p>
        </div>

        {/* Column 2: App Navigation Links */}
        <div style={{ flex: "1 1 150px", minWidth: "120px" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0", color: "#ffffff" }}>
            Platform
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <Link to="/dashboard" style={footerLinkStyle("foot-dash")} onMouseEnter={() => setHoveredLink("foot-dash")} onMouseLeave={() => setHoveredLink(null)}>
                Dashboard Portal
              </Link>
            </li>
            <li>
              <Link to="/chat" style={footerLinkStyle("foot-chat")} onMouseEnter={() => setHoveredLink("foot-chat")} onMouseLeave={() => setHoveredLink(null)}>
                Live Fleet Chat
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal & Security Items */}
        <div style={{ flex: "1 1 150px", minWidth: "120px" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0", color: "#ffffff" }}>
            Security
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <Link to="/login" style={footerLinkStyle("foot-login")} onMouseEnter={() => setHoveredLink("foot-login")} onMouseLeave={() => setHoveredLink(null)}>
                Operator Login
              </Link>
            </li>
            <li>
              <Link to="/register" style={footerLinkStyle("foot-reg")} onMouseEnter={() => setHoveredLink("foot-reg")} onMouseLeave={() => setHoveredLink(null)}>
                Registration Node
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Lower Footer Container: System Meta-details & Copyright lines */}
      <div style={{
        borderTop: "1px solid #222222",
        paddingTop: "20px",
        textAlign: "center",
        maxWidth: "1200px",
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        <p style={{ margin: "0 0 6px 0", fontSize: "13px", color: "#aaaaaa", fontWeight: "400" }}>
          © {new Date().getFullYear()} <strong style={{ color: "#ffffff" }}>taxiGo Systems</strong>. All rights reserved globally.
        </p>
      </div>
    </footer>
  );
};