import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Explicit extension prevents build compilation clipping across local environments
import { registerWithEmail } from "../services/authService.js";
// 🚀 ADDED: Imports Firestore tools and configuration instance to initialize the customer record structure
import { db } from "../firebase/config"; 
import { doc, setDoc } from "firebase/firestore";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamic state hooks manage interactive animations and bypass browser styles
  const [btnHover, setBtnHover] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      // 1. Authenticate user creation handshake via Firebase Auth
      const result = await registerWithEmail(email, password, name);
      
      // Handle potential variation in object packing from your authService helper
      const user = result?.user ? result.user : result;

      if (!user || !user.uid) {
        throw new Error("Registration succeeded but no User ID object was returned.");
      }

      // 2. 🚀 CREATE USER DOCUMENT IN FIRESTORE WITH AUTOMATED CUSTOMER ROLE MATRIX
      // This step keeps standard signups separated completely from your administrative routes
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email.toLowerCase().trim(),
        role: "customer", // 🚖 Default entry status standardizes assignment rules
        createdAt: new Date() // Sets structural record tracking trace
      });

      // 3. Navigate successfully to passenger panel view
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Clean up internal Firebase error tags to keep UI clean for users
      const cleanError = err.message.replace("Firebase:", "").replace("auth/", "").replace(/-/g, " ").trim();
      setError(cleanError || "Registration failed. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  // Shared structural input styling to maintain flawless visual tracking alignment
  const inputStyle = (id) => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px", // Smooth modern radius corners matching the UI
    border: focusedField === id ? "2px solid #ffdd00" : "1px solid #cccccc", // Signature yellow theme focus glow
    backgroundColor: focusedField === id ? "#ffffff" : "#f9f9f9",
    fontSize: "15px",
    color: "#111111",
    boxSizing: "border-box",
    outline: "none",
    transition: "all 0.2s ease-in-out",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  });

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      width: "100%",
      boxSizing: "border-box",
      padding: "20px"
    }}>
      <div style={{
        background: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
        width: "100%",
        maxWidth: "460px",
        boxSizing: "border-box",
        border: "1px solid #eaeaea",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        {/* Branding & Presentation Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚖</div>
          <h2 style={{ margin: "0 0 6px 0", color: "#111111", fontSize: "26px", fontWeight: "800", letterSpacing: "-0.5px" }}>
            Join taxiGo Fleet
          </h2>
          <p style={{ margin: 0, color: "#666666", fontSize: "14px", fontWeight: "400", lineHeight: "1.5" }}>
            Sign up now and experience frictionless transit ticketing
          </p>
        </div>

        {/* Action Validation Alerts */}
        {error && (
          <div style={{
            background: "#ffeef0",
            color: "#dc3545",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "24px",
            fontWeight: "500",
            border: "1px solid #fecdd2",
            lineHeight: "1.4"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Registration Form Box */}
        <form onSubmit={handleFormSubmission}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#111111", fontSize: "14px", fontWeight: "600" }}>
              Full Name
            </label>
            <input 
              type="text" 
              required
              placeholder="John Doe"
              value={name}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle("name")}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#111111", fontSize: "14px", fontWeight: "600" }}>
              Email Address
            </label>
            <input 
              type="email" 
              required
              placeholder="john@example.com"
              value={email}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle("email")}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#111111", fontSize: "14px", fontWeight: "600" }}>
              Password (Min 6 Characters)
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle("password")}
            />
          </div>

          {/* FIXED HOVER ACTION: Formats dynamic inversion state seamlessly */}
          <button 
            type="submit" 
            disabled={loading}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: btnHover ? "#e6c600" : "#111111", 
              color: btnHover ? "#111111" : "#ffdd00", 
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            }}
          >
            {loading ? "Registering secure cloud profile..." : "Register"}
          </button>
        </form>

        {/* Footer Link Navigation Bar */}
        <div style={{ 
          textAlign: "center",
          fontSize: "14px",
          borderTop: "1px solid #eaeaea",
          paddingTop: "24px",
          marginTop: "24px",
          color: "#666666"
        }}>
          Already have a tracking account?{" "}
          <Link 
            to="/login" 
            style={{ 
              color: "#111111", 
              fontWeight: "700", 
              textDecoration: "none",
              borderBottom: "2px solid #ffdd00",
              paddingBottom: "2px",
              marginLeft: "4px",
              transition: "opacity 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.opacity = "0.8"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};