import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBackHovered, setIsBackHovered] = useState(false);

  useEffect(() => {
    const fetchSingleTicket = async () => {
      try {
        const snapshot = await getDoc(doc(db, "bookings", id));
        if (snapshot.exists()) {
          setBooking(snapshot.data());
        }
      } catch (err) {
        console.error("Error reading single document ticket:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleTicket();
  }, [id]);

  // Premium Skeleton/Pulse Loader State UI
  if (loading) {
    return (
      <div style={{ 
        maxWidth: "650px", 
        margin: "60px auto", 
        padding: "40px", 
        textAlign: "center",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#666666"
      }}>
        <div className="pulse-loader" style={{
          width: "50px", height: "50px", border: "4px solid #f3f3f3", borderTop: "4px solid #111111", 
          borderRadius: "50%", margin: "0 auto 20px auto", animation: "spin 1s linear infinite"
        }} />
        <p style={{ fontWeight: "600", fontSize: "15px" }}>Querying target document UID parameters...</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Error/Missing Data State UI
  if (!booking) {
    return (
      <div style={{ 
        maxWidth: "650px", margin: "60px auto", padding: "40px", textAlign: "center",
        backgroundColor: "#ffffff", borderRadius: "20px", border: "1px solid #eaeaea",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>⚠️</span>
        <h3 style={{ margin: "0 0 10px 0", fontWeight: "800", color: "#111111" }}>Record Payload Missing</h3>
        <p style={{ color: "#666666", fontSize: "14px", marginBottom: "24px" }}>The requested ride transit token has expired or been purged from the ledger archives.</p>
        <button onClick={() => navigate("/dashboard")} style={{
          backgroundColor: "#111111", color: "#ffffff", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "700", cursor: "pointer"
        }}>Return to Terminal Control</button>
      </div>
    );
  }

  // Safety fallback evaluations for customer emails mapped in the document
  const activeEmailDisplay = booking.customerEmail || booking.passengerEmail || "student.uol@uol.edu.pk";

  // Dynamic semantic styles mapped to real-time firestore status metrics
  const getStatusColors = (status) => {
    const current = status || "Pending";
    if (current === "Pending") return { bg: "#fff3cd", text: "#b06000" };
    if (current === "Dispatched") return { bg: "#e8f0fe", text: "#1a73e8" };
    return { bg: "#e6f4ea", text: "#137333" };
  };

  const statusStyle = getStatusColors(booking.status);

  return (
    <div style={{ 
      maxWidth: "650px", 
      margin: "50px auto", 
      backgroundColor: "#ffffff", 
      borderRadius: "24px", 
      border: "1px solid #eaeaea",
      boxShadow: "0 20px 50px rgba(0,0,0,0.04)", 
      overflow: "hidden",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#111111",
      boxSizing: "border-box"
    }}>
      {/* Top Interactive Controls Ribbon */}
      <div style={{ padding: "24px 32px 0 32px" }}>
        <button 
          onClick={() => navigate("/dashboard")} 
          onMouseEnter={() => setIsBackHovered(true)}
          onMouseLeave={() => setIsBackHovered(false)}
          style={{ 
            background: isBackHovered ? "#111111" : "#fafafa", 
            color: isBackHovered ? "#ffdd00" : "#555555", 
            border: "1px solid #eaeaea", 
            padding: "10px 18px", 
            borderRadius: "12px", 
            cursor: "pointer", 
            fontSize: "13px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease-in-out"
          }}
        >
          ← Return to Dashboard
        </button>
      </div>

      {/* Ticket Passport Header Block */}
      <div style={{ 
        padding: "24px 32px", 
        borderBottom: "1px dashed #e0e0e0", 
        backgroundColor: "#ffffff",
        position: "relative" 
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px" }}>
              Ride Receipt Registry
            </h2>
            <div style={{ marginTop: "6px", fontSize: "12px", color: "#888888", fontWeight: "500" }}>
              TRANSACTION ID: <span style={{ color: "#111111", fontFamily: "monospace", fontSize: "13px", fontWeight: "700" }}>{id}</span>
            </div>
          </div>
          
          {/* Dynamic Floating Badging Indicator */}
          <span style={{ 
            padding: "8px 14px", 
            borderRadius: "20px", 
            fontSize: "11px", 
            fontWeight: "700", 
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            backgroundColor: statusStyle.bg, 
            color: statusStyle.text
          }}>
            ● {booking.status || "Pending"}
          </span>
        </div>

        {/* Decorative Ticket Punch Left/Right Aesthetic Indents */}
        <div style={{ position: "absolute", left: "-10px", bottom: "-10px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#fbfbfb", borderRight: "1px solid #eaeaea" }} />
        <div style={{ position: "absolute", right: "-10px", bottom: "-10px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#fbfbfb", borderLeft: "1px solid #eaeaea" }} />
      </div>

      {/* Primary Invoiced Metadata Parameters Matrix */}
      <div style={{ padding: "32px", backgroundColor: "#ffffff" }}>
        
        {/* Geolocation Transit Route Vector Node Block */}
        <div style={{ 
          backgroundColor: "#fafafa", 
          padding: "20px", 
          borderRadius: "16px", 
          border: "1px solid #f0f0f0",
          marginBottom: "28px" 
        }}>
          <div style={{ position: "relative", paddingLeft: "24px" }}>
            {/* Visual connector line between pinpoints */}
            <div style={{ position: "absolute", left: "6px", top: "20px", bottom: "20px", width: "2px", backgroundColor: "#e0e0e0" }} />
            
            <div style={{ marginBottom: "18px" }}>
              <div style={{ fontSize: "11px", color: "#888888", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pickup Location</div>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#111111", marginTop: "2px" }}>📍 {booking.pickup}</div>
            </div>
            
            <div>
              <div style={{ fontSize: "11px", color: "#888888", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Dropoff Destination</div>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#111111", marginTop: "2px" }}>🏁 {booking.destination}</div>
            </div>
          </div>
        </div>

        {/* Structured Data Ledger Metrics List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f5f5f5", paddingBottom: "12px" }}>
            <span style={{ fontSize: "14px", color: "#666666", fontWeight: "500" }}>Fleet Category Assigned</span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#111111" }}>🚗 {booking.carType}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f5f5f5", paddingBottom: "12px" }}>
            <span style={{ fontSize: "14px", color: "#666666", fontWeight: "500" }}>Transit Duration Estimate</span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#111111" }}>⏱️ {booking.estimatedTime || "Calculated at Dispatch"}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f5f5f5", paddingBottom: "12px" }}>
            <span style={{ fontSize: "14px", color: "#666666", fontWeight: "500" }}>Account Identity Profile</span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#555555", fontFamily: "monospace" }}>👤 {activeEmailDisplay}</span>
          </div>

          {/* Grand Highlighted Total Fare Panel */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            backgroundColor: "#fffde7", 
            padding: "18px 20px", 
            borderRadius: "14px", 
            border: "1px solid #fff59d",
            marginTop: "12px" 
          }}>
            <span style={{ fontSize: "14px", color: "#856404", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Calculated Bill Fare</span>
            <span style={{ fontSize: "20px", fontWeight: "900", color: "#111111" }}>PKR {booking.fare}</span>
          </div>

        </div>
      </div>

      {/* Decorative Security Watermark Footer */}
      <div style={{ 
        backgroundColor: "#111111", 
        padding: "16px 32px", 
        textAlign: "center", 
        fontSize: "12px", 
        color: "#666666", 
        fontWeight: "600" 
      }}>
        🔒 End of Token Record Ledger — taxiGo Secure Node Verification Verified
      </div>
    </div>
  );
};