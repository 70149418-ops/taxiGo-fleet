import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Unauthorized = () => {
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  return (
    <div style={{ 
      textAlign: "center", 
      margin: "120px auto 100px auto", 
      maxWidth: "520px", 
      color: "#111111", // Changed to dark slate to ensure high contrast across standard light backdrops
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: "40px 24px",
      boxSizing: "border-box"
    }}>
      {/* Structural Styles for the Pulse Lock Animation Backdrop */}
      <style>{`
        @keyframes subtlePulse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.06); opacity: 1; filter: drop-shadow(0 0 15px rgba(230, 198, 0, 0.4)); }
          100% { transform: scale(1); opacity: 0.9; }
        }
      `}</style>

      {/* Decorative Warning Element Icon Matrix */}
      <div style={{
        fontSize: "84px",
        lineHeight: "1",
        marginBottom: "24px",
        display: "inline-block",
        animation: "subtlePulse 3s infinite ease-in-out"
      }}>
        🔏
      </div>

      {/* Modern Status Error Code Sub-Header */}
      <h1 style={{ 
        fontSize: "22px", 
        margin: "0 0 12px 0", 
        color: "#ccaa00", // Shifted tone slightly for clean visibility parameters on light layouts
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: "2px"
      }}>
        403 // Access Denied
      </h1>

      {/* Primary Message Notice */}
      <h2 style={{ 
        fontSize: "28px", 
        margin: "0 0 16px 0", 
        fontWeight: "800", 
        letterSpacing: "-0.5px",
        color: "#111111" 
      }}>
        Restricted Security Area
      </h2>
      
      {/* Dynamic Descriptive Warning Block */}
      <p style={{ 
        color: "#555555", // Enforced premium depth contrast for tracking text readability
        marginBottom: "36px",
        fontSize: "15px",
        lineHeight: "1.6",
        fontWeight: "400" 
      }}>
        Your authorization token lacks the clearance tier parameters required to stream data nodes or decrypt files from this administrative section.
      </p>

      {/* Interactive Micro-Cued Core Navigation Button */}
      <Link 
        to="/dashboard" 
        onMouseEnter={() => setIsBtnHovered(true)}
        onMouseLeave={() => setIsBtnHovered(false)}
        style={{
          display: "inline-block",
          padding: "14px 28px", 
          background: isBtnHovered ? "#111111" : "#ffdd00", // Reverted hover matrix to seamlessly match login/register style conventions
          color: isBtnHovered ? "#ffdd00" : "#111111",
          textDecoration: "none", 
          borderRadius: "12px", 
          fontWeight: "800",
          fontSize: "14px",
          transition: "all 0.2s ease-in-out",
          boxShadow: isBtnHovered ? "0 6px 25px rgba(0,0,0,0.15)" : "0 6px 20px rgba(255, 221, 0, 0.3)"
        }}
      >
        Return to Dashboard ↗
      </Link>
    </div>
  );
};