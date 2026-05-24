import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Explicit extension prevents build compilation clipping across local environments
import { loginWithEmail, loginWithGoogle, resetPassword } from "../services/authService.js";
// Imports Firestore tools and configuration instance to check user role layout parameters
import { db } from "../firebase/config"; 
import { doc, getDoc } from "firebase/firestore";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamic state hooks manage hover interactivity cleanly across build environments
  const [loginHover, setLoginHover] = useState(false);
  const [googleHover, setGoogleHover] = useState(false);
  const [forgotHover, setForgotHover] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      // 1. Await credential handshake via Firebase Auth
      const result = await loginWithEmail(email, password);
      
      // 🚀 SAFE CHECK: Extract user object whether your service returns user directly or a userCredential object
      const user = result?.user ? result.user : result;

      if (!user || !user.uid) {
        throw new Error("Authentication failed. No user profile returned from server.");
      }

      // 2. Fresh Profile Role Matrix Lookup Check
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let assignedRole = "customer"; // Fallback default
      if (userDocSnap.exists()) {
        assignedRole = userDocSnap.data().role;
      }

      // 3. Dynamic Routing Execution Block
      if (assignedRole === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      // Clean up internal tags to give user clear diagnostic feedback
      const cleanError = err.message.replace("Firebase:", "").replace("auth/", "").replace(/-/g, " ").trim();
      setError(cleanError || "Invalid email or password. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuthClick = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      // 1. Await resolution from Google OAuth stream
      const result = await loginWithGoogle();
      
      // 🚀 SAFE CHECK: Extract user object dynamically
      const user = result?.user ? result.user : result;

      if (!user || !user.uid) {
        throw new Error("Google authentication failed. No user profile returned.");
      }

      // 2. Fresh Google Profile Role Matrix Lookup Check
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let assignedRole = "customer";
      if (userDocSnap.exists()) {
        assignedRole = userDocSnap.data().role;
      }
      
      // 3. Dynamic Routing Redirect
      if (assignedRole === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      const cleanError = err.message.replace("Firebase:", "").replace("auth/", "").replace(/-/g, " ").trim();
      setError(cleanError || "Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgottenPasswordReset = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Please input your registration email address to trigger reset link.");
      return;
    }
    try {
      await resetPassword(email);
      setMessage("Password recovery message sent! Verify your email mailbox.");
    } catch (err) {
      setError(err.message.replace("Firebase:", "").trim());
    }
  };

  // Shared geometric input frame styles to guarantee layout stability
  const inputStyle = (id) => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px", 
    border: focusedField === id ? "2px solid #ffdd00" : "1px solid #cccccc", 
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
            Welcome Back
          </h2>
          <p style={{ margin: 0, color: "#666666", fontSize: "14px", fontWeight: "400", lineHeight: "1.5" }}>
            Sign in to access your secure taxiGo dashboard
          </p>
        </div>

        {/* Dynamic Warning Notification Card */}
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

        {/* Dynamic Success Notification Card */}
        {message && (
          <div style={{
            background: "#e8f5e9",
            color: "#2e7d32",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "24px",
            fontWeight: "500",
            border: "1px solid #c8e6c9",
            lineHeight: "1.4"
          }}>
            ✅ {message}
          </div>
        )}

        {/* Credentials Form Box */}
        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#111111", fontSize: "14px", fontWeight: "600" }}>
              Email Address
            </label>
            <input 
              type="email" 
              required
              placeholder="name@example.com"
              value={email}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle("email")}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#111111", fontSize: "14px", fontWeight: "600" }}>
              Password
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

          <button 
            type="submit" 
            disabled={loading}
            onMouseEnter={() => setLoginHover(true)}
            onMouseLeave={() => setLoginHover(false)}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: loginHover ? "#e6c600" : "#111111", 
              color: loginHover ? "#111111" : "#ffdd00", 
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
            {loading ? "Authenticating credentials..." : "Login"}
          </button>
        </form>

        {/* Separator Line */}
        <div style={{ display: "flex", alignItems: "center", margin: "28px 0", color: "#aaaaaa" }}>
          <hr style={{ flex: 1, border: "none", height: "1px", backgroundColor: "#eaeaea" }} />
          <span style={{ padding: "0 12px", fontSize: "11px", textTransform: "uppercase", fontWeight: "700", letterSpacing: "1px", color: "#999999" }}>or</span>
          <hr style={{ flex: 1, border: "none", height: "1px", backgroundColor: "#eaeaea" }} />
        </div>

        {/* Google OAuth Access Button Option */}
        <button 
          onClick={handleGoogleAuthClick}
          disabled={loading}
          onMouseEnter={() => setGoogleHover(true)}
          onMouseLeave={() => setGoogleHover(false)}
          type="button"
          style={{
            width: "100%",
            padding: "14px 16px",
            backgroundColor: googleHover ? "#fafafa" : "#ffffff",
            color: "#111111",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            transition: "all 0.2s ease-in-out",
            marginBottom: "28px",
            boxShadow: googleHover ? "0 4px 12px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            opacity: loading ? 0.7 : 1
          }}
        >
          <img 
            src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/web-24dp/logo_googleg_color_24dp.png" 
            alt="Google Logo" 
            style={{ 
              width: "18px", 
              height: "18px", 
              display: "block",
              objectFit: "contain"
            }} 
            onError={(e) => {
              e.target.src = "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg";
            }}
          /> 
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Footer Link Navigation Bar */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          fontSize: "14px",
          borderTop: "1px solid #eaeaea",
          paddingTop: "24px"
        }}>
          <span 
            onClick={handleForgottenPasswordReset} 
            onMouseEnter={() => setForgotHover(true)}
            onMouseLeave={() => setForgotHover(false)}
            style={{ 
              color: forgotHover ? "#ffcc00" : "#0056b3", 
              cursor: "pointer", 
              textDecoration: forgotHover ? "underline" : "none",
              fontWeight: "600",
              transition: "color 0.2s ease"
            }}
          >
            Forgot Password?
          </span>
          
          <Link 
            to="/register" 
            style={{ 
              color: "#111111", 
              fontWeight: "700", 
              textDecoration: "none",
              borderBottom: "2px solid #ffdd00",
              paddingBottom: "2px",
              transition: "opacity 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.opacity = "0.8"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};