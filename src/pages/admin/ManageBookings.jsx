import React, { useState, useEffect } from "react";
import { getBookingsByRole, updateTaxiBooking, cancelTaxiBooking } from "../../services/bookingService";

export const ManageBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const loadMasterLedger = async () => {
    try {
      setLoading(true);
      const ledgerData = await getBookingsByRole("admin");
      setAllBookings(ledgerData || []);
    } catch (err) {
      setFeedback(`❌ Access Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMasterLedger();
  }, []);

  const handleStatusTransition = async (id, currentStatus) => {
    let nextStatus = "Dispatched";
    if (currentStatus === "Dispatched") nextStatus = "Completed";

    try {
      await updateTaxiBooking(id, { status: nextStatus });
      setFeedback(`✅ Document node state promoted to: ${nextStatus}`);
      setTimeout(() => setFeedback(""), 4000);
      loadMasterLedger();
    } catch (err) {
      setFeedback(`❌ Modification rejected: ${err.message}`);
    }
  };

  const handleForceErase = async (id) => {
    if (!window.confirm("CRITICAL WARNING: Permanently delete this transaction record from Firestore?")) return;
    
    try {
      await cancelTaxiBooking(id);
      setFeedback("🗑️ Transaction ledger node successfully unlinked and purged.");
      setTimeout(() => setFeedback(""), 4000);
      loadMasterLedger();
    } catch (err) {
      setFeedback(`❌ Erasure failure: ${err.message}`);
    }
  };

  return (
    <div style={{ 
      background: "#111111", 
      padding: "32px", 
      borderRadius: "12px", 
      border: "1px solid #1a1a1a",
      boxShadow: "0 4px 25px rgba(0,0,0,0.4)", 
      color: "#ffffff",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      boxSizing: "border-box",
      width: "100%"
    }} className="manage-bookings-wrapper">
      
      {/* 📱 Mobile CSS Injection */}
      <style>{`
        @media (max-width: 768px) {
          .manage-bookings-wrapper {
            padding: 20px 16px !important;
          }
          .manage-bookings-wrapper h3 {
            font-size: 18px !important;
          }
          /* Convert standard table layout architecture to responsive card block blocks */
          .responsive-ledger-table, 
          .responsive-ledger-table thead, 
          .responsive-ledger-table tbody, 
          .responsive-ledger-table th, 
          .responsive-ledger-table td, 
          .responsive-ledger-table tr { 
            display: block !important; 
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .responsive-ledger-table thead {
            display: none !important; /* Hide desktop table row headers */
          }
          .responsive-ledger-table tr {
            background-color: #161616 !important;
            border: 1px solid #222222 !important;
            border-radius: 12px !important;
            padding: 16px !important;
            margin-bottom: 16px !important;
          }
          .responsive-ledger-table td {
            padding: 8px 0 !important;
            border: none !important;
            text-align: left !important;
          }
          /* Prepend clear data identifiers on mobile views */
          .responsive-ledger-table td:nth-of-type(3):before {
            content: "BILL FARE: ";
            color: #666666;
            font-size: 11px;
            font-weight: 700;
            display: inline-block;
            margin-right: 6px;
          }
          .responsive-ledger-table td:nth-of-type(4):before {
            content: "STATUS: ";
            color: #666666;
            font-size: 11px;
            font-weight: 700;
            display: inline-block;
            margin-right: 6px;
          }
          .responsive-ledger-table td:last-child {
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
            margin-top: 8px !important;
            padding-top: 14px !important;
            border-top: 1px solid #262626 !important;
          }
          .responsive-ledger-table td:last-child button {
            width: 100% !important;
            margin-right: 0 !important;
            text-align: center !important;
            padding: 12px !important;
          }
        }
      `}</style>

      {/* Structural Header Wrapper */}
      <div style={{ display: "block", marginBottom: "28px", borderBottom: "1px solid #222222", paddingBottom: "16px" }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: "20px",
          fontWeight: "800",
          letterSpacing: "-0.5px",
          color: "#ffffff"
        }}>
          🛡️ Master Network Fleet Logs
        </h3>
        <p style={{ margin: "4px 0 0 0", color: "#666666", fontSize: "13px" }}>
          Global live data cluster override matrix block with full operational CRUD authority.
        </p>
      </div>

      {/* Dynamic Dark Layout System Notifications Alert Card */}
      {feedback && (
        <div style={{ 
          padding: "14px 16px", 
          background: "#161616", 
          border: feedback.includes("❌") ? "1px solid #ffffff" : "1px solid #ffdd00", 
          borderRadius: "8px", 
          marginBottom: "24px", 
          fontSize: "13px",
          fontWeight: "600", 
          color: feedback.includes("❌") ? "#ffffff" : "#ffdd00",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}>
          {feedback}
        </div>
      )}

      {loading ? (
        /* Premium Interactive Dark Skeleton Loader Layer */
        <div style={{ padding: "10px 0" }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={{ 
              height: "70px", 
              backgroundColor: "#161616", 
              border: "1px solid #1a1a1a",
              borderRadius: "8px", 
              marginBottom: "12px",
              animation: "adminPulse 1.8s infinite ease-in-out" 
            }} />
          ))}
          <style>{`
            @keyframes adminPulse {
              0% { opacity: 0.4; background-color: #161616; }
              50% { opacity: 0.8; background-color: #222222; }
              100% { opacity: 0.4; background-color: #161616; }
            }
          `}</style>
        </div>
      ) : allBookings.length === 0 ? (
        <div style={{ textAlign: "center", color: "#666666", padding: "50px 20px", fontSize: "14px", fontWeight: "500" }}>
          <span style={{ fontSize: "36px", display: "block", marginBottom: "12px" }}>📡</span>
          No trips are currently active in the live network nodes.
        </div>
      ) : (
        /* Modernized Full-Bleed Dark Log Table Layout */
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table className="responsive-ledger-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #222222", color: "#666666" }}>
                <th style={{ padding: "14px 12px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Passenger Identity</th>
                <th style={{ padding: "14px 12px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Transit Instructions</th>
                <th style={{ padding: "14px 12px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Financial Bill</th>
                <th style={{ padding: "14px 12px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Lifecycle State</th>
                <th style={{ padding: "14px 12px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px", textAlign: "right" }}>Root Execution</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map((b) => (
                <tr 
                  key={b.id} 
                  style={{ 
                    borderBottom: "1px solid #1a1a1a",
                    backgroundColor: hoveredRow === b.id ? "#161616" : "transparent",
                    transition: "background-color 0.15s ease-in-out"
                  }}
                  onMouseEnter={() => setHoveredRow(b.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Passenger Identity Block */}
                  <td style={{ padding: "16px 12px" }}>
                    <div style={{ fontWeight: "700", color: "#ffffff", marginBottom: "2px", wordBreak: "break-all" }}>{b.customerEmail}</div>
                    <div style={{ color: "#666666", fontSize: "11px", fontFamily: "monospace", wordBreak: "break-all" }}>UID: {b.userId}</div>
                  </td>

                  {/* Geolocation & Routing Data */}
                  <td style={{ padding: "16px 12px" }}>
                    <div style={{ marginBottom: "2px", color: "#ffffff" }}>📍 <strong style={{ color: "#888888", fontWeight: "500" }}>Src:</strong> {b.pickup}</div>
                    <div style={{ marginBottom: "4px", color: "#ffffff" }}>🏁 <strong style={{ color: "#888888", fontWeight: "500" }}>Tgt:</strong> {b.destination}</div>
                    <span style={{ fontSize: "11px", color: "#ffdd00", background: "rgba(255,221,0,0.08)", padding: "2px 6px", borderRadius: "4px", fontWeight: "600", display: "inline-block" }}>
                      Tier: {b.carType}
                    </span>
                  </td>

                  {/* Pricing Matrix Node */}
                  <td style={{ padding: "16px 12px", fontWeight: "800", color: "#ffdd00", fontSize: "15px" }}>
                    PKR {Number(b.fare || 0).toLocaleString()}
                  </td>

                  {/* Status Indicator Badge Elements */}
                  <td style={{ padding: "16px 12px" }}>
                    <span style={{ 
                      padding: "5px 12px", 
                      borderRadius: "6px", 
                      fontSize: "11px", 
                      fontWeight: "800",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      background: "#161616",
                      border: b.status === "Completed" ? "1px solid #ffdd00" : b.status === "Dispatched" ? "1px solid #ffffff" : "1px solid #ffdd00",
                      color: b.status === "Completed" ? "#ffdd00" : b.status === "Dispatched" ? "#ffffff" : "#ffdd00",
                      display: "inline-block"
                    }}>
                      {b.status}
                    </span>
                  </td>

                  {/* Root Operational Control Access Grid */}
                  <td style={{ padding: "16px 12px", textAlign: "right", whiteSpace: "nowrap" }}>
                    {b.status !== "Completed" && (
                      <button 
                        onClick={() => handleStatusTransition(b.id, b.status)}
                        onMouseEnter={() => setHoveredBtn(`action-${b.id}`)}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{ 
                          background: hoveredBtn === `action-${b.id}` ? "#ffffff" : "#222222", 
                          color: hoveredBtn === `action-${b.id}` ? "#111111" : "#ffffff", 
                          border: "none", 
                          padding: "8px 14px", 
                          borderRadius: "6px", 
                          cursor: "pointer", 
                          marginRight: "8px", 
                          fontWeight: "700",
                          fontSize: "12px",
                          transition: "all 0.15s ease-in-out"
                        }}
                      >
                        {b.status === "Pending" ? "Dispatch Driver" : "End Ride"}
                      </button>
                    )}
                    <button 
                      onClick={() => handleForceErase(b.id)}
                      onMouseEnter={() => setHoveredBtn(`delete-${b.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{ 
                        background: hoveredBtn === `delete-${b.id}` ? "#ffdd00" : "transparent", 
                        color: hoveredBtn === `delete-${b.id}` ? "#111111" : "#ffffff", 
                        border: "1px solid #ffdd00", 
                        padding: "7px 14px", 
                        borderRadius: "6px", 
                        cursor: "pointer", 
                        fontWeight: "700",
                        fontSize: "12px",
                        transition: "all 0.15s ease-in-out"
                      }}
                    >
                      Delete Log
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};