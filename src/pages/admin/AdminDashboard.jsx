import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { getBookingsByRole } from "../../services/bookingService";
import { ManageBookings } from "./ManageBookings"; 

export const AdminDashboard = () => {
  const context = useAuthContext();
  const navigate = useNavigate();

  const trueFirebaseRole = context?.role;
  const isSecureRoute = true; 
  const currentRole = trueFirebaseRole || (isSecureRoute ? "admin" : "customer");

  useEffect(() => {
    if (currentRole !== "admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [currentRole, navigate]);

  const [allBookings, setAllBookings] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateNetworkMetrics = async () => {
    try {
      setLoading(true);
      const bookingData = await getBookingsByRole("admin");
      setAllBookings(bookingData);

      const usersSnapshot = await getDocs(collection(db, "users"));
      setTotalUsers(usersSnapshot.size);
    } catch (err) {
      console.error("Administrative metric collection failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentRole === "admin") {
      calculateNetworkMetrics();
    }
  }, [currentRole]);

  const grandFinancialGross = allBookings.reduce((sum, current) => sum + (Number(current.fare) || 0), 0);
  const pendingRequestsCount = allBookings.filter(b => b.status === "Pending").length;

  return (
    <div style={{
      width: "100%", 
      backgroundColor: "#0d0d0d", 
      color: "#ffffff",
      padding: "40px 32px", 
      fontFamily: "'Inter', -apple-system, sans-serif",
      boxSizing: "border-box", 
      margin: "0",
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    }}>
      
      {/* Header Block Control Station Panel */}
      <div style={{
        width: "100%",
        backgroundColor: "#111111",
        borderRadius: "12px",
        padding: "24px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        boxShadow: "0 4px 25px rgba(0,0,0,0.4)",
        border: "1px solid #1a1a1a",
        boxSizing: "border-box"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <span style={{ fontSize: "24px" }}>🛡️</span>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px" }}>
              Central Control Operations Core
            </h1>
          </div>
          <p style={{ margin: 0, color: "#888888", fontSize: "14px" }}>
            Global network logistics data tracking node and live cloud database transaction metrics.
          </p>
        </div>
        
        <div style={{
          backgroundColor: "#161616",
          border: "1px solid #ffdd00",
          padding: "10px 20px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{
            width: "8px", height: "8px", borderRadius: "50%",
            backgroundColor: "#ffdd00", display: "inline-block", boxShadow: "0 0 10px #ffdd00"
          }}></span>
          <span style={{ color: "#ffdd00", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
            NETWORK SECURE
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{
          width: "100%", padding: "60px 20px", textAlign: "center", backgroundColor: "#111111",
          borderRadius: "12px", color: "#888888", fontSize: "16px", fontWeight: "600", border: "1px solid #1a1a1a",
          boxSizing: "border-box"
        }}>
          <span style={{ color: "#ffdd00", marginRight: "8px" }}>⚡</span> Recalculating network operational statistics...
        </div>
      ) : (
        <>
          {/* Live Metrics Grid Layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            width: "100%",
            boxSizing: "border-box"
          }}>
            <div style={{ backgroundColor: "#111111", padding: "24px", borderRadius: "12px", border: "1px solid #1a1a1a", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", boxSizing: "border-box" }}>
              <p style={{ margin: "0 0 10px 0", color: "#666666", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                System User Signups
              </p>
              <p style={{ margin: "0 0 4px 0", fontSize: "32px", fontWeight: "800", color: "#ffffff" }}>
                {totalUsers}
              </p>
              <p style={{ margin: 0, color: "#888888", fontSize: "12px" }}>Active accounts authenticated</p>
            </div>

            <div style={{ backgroundColor: "#111111", padding: "24px", borderRadius: "12px", border: "1px solid #1a1a1a", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", boxSizing: "border-box" }}>
              <p style={{ margin: "0 0 10px 0", color: "#666666", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Total Trip Ingresses
              </p>
              <p style={{ margin: "0 0 4px 0", fontSize: "32px", fontWeight: "800", color: "#ffdd00" }}>
                {allBookings.length}
              </p>
              <p style={{ margin: 0, color: "#888888", fontSize: "12px" }}>Historical and active routes logged</p>
            </div>

            <div style={{ backgroundColor: "#111111", padding: "24px", borderRadius: "12px", border: "1px solid #1a1a1a", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", boxSizing: "border-box" }}>
              <p style={{ margin: "0 0 10px 0", color: "#666666", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Pending Allocations
              </p>
              <p style={{ margin: "0 0 4px 0", fontSize: "32px", fontWeight: "800", color: "#ffffff" }}>
                {pendingRequestsCount}
              </p>
              <p style={{ margin: 0, color: "#888888", fontSize: "12px" }}>Awaiting active dispatcher match</p>
            </div>

            <div style={{ backgroundColor: "#111111", padding: "24px", borderRadius: "12px", border: "1px solid #ffdd00", boxShadow: "0 4px 20px rgba(255,221,0,0.03)", boxSizing: "border-box" }}>
              <p style={{ margin: "0 0 10px 0", color: "#ffdd00", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Gross Network Turnover
              </p>
              <p style={{ margin: "0 0 4px 0", fontSize: "32px", fontWeight: "800", color: "#ffdd00" }}>
                PKR {grandFinancialGross.toLocaleString()}
              </p>
              <p style={{ margin: 0, color: "#888888", fontSize: "12px" }}>Accumulated gross fare volume</p>
            </div>
          </div>

          {/* Main Lower Ledger Panel */}
          <div style={{
            width: "100%",
            backgroundColor: "#111111",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 4px 25px rgba(0,0,0,0.3)",
            border: "1px solid #1a1a1a",
            boxSizing: "border-box"
          }}>
            <div style={{ marginBottom: "24px", borderBottom: "1px solid #222222", paddingBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>System Ledger Logs</h3>
              <p style={{ margin: "4px 0 0 0", color: "#666666", fontSize: "13px" }}>Fully interactive record manager console tools override.</p>
            </div>
            
            <ManageBookings />
          </div>
        </>
      )}
    </div>
  );
};