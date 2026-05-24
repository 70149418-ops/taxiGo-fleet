import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { getBookingsByRole, cancelTaxiBooking } from "../../services/bookingService";
import { BookingForm } from "./BookingForm"; 

export const UserDashboard = () => {
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const loadDataRecords = async () => {
    try {
      setLoading(true);
      const data = await getBookingsByRole(role);
      setBookings(data || []);
    } catch (err) {
      console.error("Error reading bookings ledger:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataRecords();
  }, [role]);

  const handleCancelClick = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking request?")) return;
    try {
      await cancelTaxiBooking(id);
      setActionMessage("🗑️ Ride request cancelled successfully.");
      setTimeout(() => setActionMessage(""), 5000);
      loadDataRecords(); 
    } catch (err) {
      setActionMessage(`❌ Cancel Error: ${err.message}`);
    }
  };

  return (
    <div style={{ 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundColor: "#0d0d0d", 
      color: "#ffffff",
      boxSizing: "border-box",
      padding: "40px 32px",
      minHeight: "100vh",
      width: "100%"
    }} className="dashboard-container-wrapper">
      
      {/* 🚀 Dynamic Responsive Styles & Media Overrides */}
      <style>{`
        html, body, #root, .container, [class*="layout"] {
          background-color: #0d0d0d !important;
          max-width: 100% !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }

        @keyframes darkPulse {
          0% { opacity: 0.4; background-color: #161616; }
          50% { opacity: 0.8; background-color: #222222; }
          100% { opacity: 0.4; background-color: #161616; }
        }

        /* Responsive Breakpoint for Tablets and Smartphones */
        @media (max-width: 768px) {
          .dashboard-container-wrapper {
            padding: 20px 16px !important;
          }
          
          .dashboard-header-block {
            padding: 24px 20px !important;
            marginBottom: 20px !important;
          }

          .dashboard-header-block h2 {
            font-size: 20px !important;
          }

          .dashboard-grid-matrix {
            gap: 20px !important;
          }

          .dashboard-ledger-card {
            padding: 20px 16px !important;
          }

          /* 🚀 Table to Adaptive Mobile Card Layout Transformation */
          .responsive-data-table, 
          .responsive-data-table thead, 
          .responsive-data-table tbody, 
          .responsive-data-table th, 
          .responsive-data-table td, 
          .responsive-data-table tr { 
            display: block; 
            width: 100%;
          }
          
          .responsive-data-table thead {
            display: none; /* Hide column headers on mobile */
          }
          
          .responsive-data-table tr {
            background-color: #161616 !important;
            border: 1px solid #222222 !important;
            border-radius: 12px;
            margin-bottom: 16px;
            padding: 16px;
            box-sizing: border-box;
          }

          .responsive-data-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0 !important;
            border-bottom: 1px solid #222222;
          }

          .responsive-data-table td:last-child {
            border-bottom: none;
            padding-top: 14px !important;
            justify-content: flex-end !important;
          }

          /* Inject Label Headers Before Values on Mobile viewports */
          .responsive-data-table td::before {
            content: attr(data-label);
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 700;
            color: #666666;
            letter-spacing: 0.5px;
          }

          /* Reset spacing alignments optimized for vertical card rows */
          .responsive-data-table td:first-child {
            flex-direction: column;
            align-items: flex-start;
          }
          .responsive-data-table td:first-child::before {
            margin-bottom: 6px;
          }
          .responsive-data-table td fieldset,
          .responsive-data-table td div {
            text-align: left;
          }
        }
      `}</style>

      {/* Top Welcome Header Panel */}
      <div className="dashboard-header-block" style={{ 
        background: "#111111", 
        color: "#ffffff", 
        padding: "32px", 
        borderRadius: "12px", 
        marginBottom: "32px",
        boxShadow: "0 4px 25px rgba(0,0,0,0.4)",
        border: "1px solid #1a1a1a"
      }}>
        <h2 style={{ margin: 0, fontSize: "26px", fontWeight: "800", letterSpacing: "-0.5px" }}>
          Passenger Console Dashboard
        </h2>
        <p style={{ color: "#ffdd00", margin: "6px 0 0 0", fontSize: "14px", fontWeight: "600" }}>
          🚖 Request real-time rides and manage active transit tickets
        </p>
      </div>

      {/* Dynamic System Action Notifications */}
      {actionMessage && (
        <div style={{ 
          padding: "16px 20px", 
          background: "#111111", 
          border: actionMessage.includes("❌") ? "1px solid #ffffff" : "1px solid #ffdd00", 
          borderRadius: "12px", 
          marginBottom: "32px", 
          fontWeight: "600",
          fontSize: "14px",
          color: actionMessage.includes("❌") ? "#ffffff" : "#ffdd00",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease"
        }}>
          {actionMessage}
        </div>
      )}

      {/* Main Grid Content Matrix Workspace */}
      <div className="dashboard-grid-matrix" style={{ 
        display: "flex", 
        flexWrap: "wrap",
        gap: "32px",
        width: "100%"
      }}>
        {/* Left Workspace Block: Creation Form Component */}
        <div style={{ 
          flex: "1 1 380px",
          boxSizing: "border-box",
          width: "100%"
        }}>
          <BookingForm onBookingSuccess={loadDataRecords} />
        </div>

        {/* Right Workspace Block: History Ledger Records Logs Table */}
        <div className="dashboard-ledger-card" style={{ 
          flex: "2 1 650px",
          background: "#111111", 
          padding: "32px", 
          borderRadius: "12px", 
          border: "1px solid #1a1a1a",
          boxShadow: "0 4px 25px rgba(0,0,0,0.3)",
          boxSizing: "border-box",
          width: "100%"
        }}>
          <div style={{ display: "block", marginBottom: "24px", borderBottom: "1px solid #222222", paddingBottom: "16px" }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: "18px",
              fontWeight: "700",
              color: "#ffffff"
            }}>
              My Active & Past Rides
            </h3>
            <p style={{ margin: "4px 0 0 0", color: "#666666", fontSize: "13px" }}>
              Live transit queue ledger synchronization block.
            </p>
          </div>
          
          {loading ? (
            /* Premium Interactive Dark Skeleton Loader Matrix */
            <div style={{ padding: "20px 0" }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ 
                  height: "64px", 
                  backgroundColor: "#161616", 
                  border: "1px solid #222222",
                  borderRadius: "8px", 
                  marginBottom: "12px",
                  animation: "darkPulse 1.8s infinite ease-in-out" 
                }} />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px", 
              color: "#888888",
              fontSize: "14px",
              fontWeight: "500" 
            }}>
              <span style={{ fontSize: "36px", display: "block", marginBottom: "16px" }}>📂</span>
              No bookings logged yet. Submit the left form to request your first taxiGo entry!
            </div>
          ) : (
            /* Responsive Adaptive Data Grid Layout */
            <div style={{ overflowX: "auto" }}>
              <table className="responsive-data-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #222222", color: "#666666" }}>
                    <th style={{ padding: "14px 12px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Route Parameters</th>
                    <th style={{ padding: "14px 12px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Fleet Class</th>
                    <th style={{ padding: "14px 12px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Est. Fare</th>
                    <th style={{ padding: "14px 12px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Status</th>
                    <th style={{ padding: "14px 12px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
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
                      {/* data-label provides the card identifier title string dynamically on smaller mobile Viewports */}
                      <td data-label="Route Parameters" style={{ padding: "16px 12px" }}>
                        <div style={{ fontWeight: "700", color: "#ffffff", marginBottom: "4px", fontSize: "14px" }}>
                          📍 {b.pickup}
                        </div>
                        <div style={{ color: "#888888", fontSize: "13px", fontWeight: "400" }}>
                          🏁 {b.destination}
                        </div>
                      </td>
                      
                      <td data-label="Fleet Class" style={{ padding: "16px 12px", color: "#cccccc", fontWeight: "600" }}>
                        {b.carType}
                      </td>
                      
                      <td data-label="Est. Fare" style={{ padding: "16px 12px", fontWeight: "800", color: "#ffdd00" }}>
                        PKR {Number(b.fare || 0).toLocaleString()}
                      </td>
                      
                      <td data-label="Status" style={{ padding: "16px 12px" }}>
                        <span style={{ 
                          padding: "6px 14px", 
                          borderRadius: "6px", 
                          fontSize: "11px", 
                          fontWeight: "800", 
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                          background: b.status === "Pending" ? "#222222" : "#161616", 
                          border: b.status === "Pending" ? "1px solid #ffdd00" : b.status === "Dispatched" ? "1px solid #ffffff" : "1px solid #ffdd00",
                          color: b.status === "Pending" ? "#ffdd00" : b.status === "Dispatched" ? "#ffffff" : "#ffdd00" 
                        }}>
                          {b.status}
                        </span>
                      </td>
                      
                      <td data-label="Actions" style={{ padding: "16px 12px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button 
                          onClick={() => navigate(`/booking/${b.id}`)} 
                          onMouseEnter={() => setHoveredBtn(`view-${b.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{ 
                            background: hoveredBtn === `view-${b.id}` ? "#ffffff" : "#222222", 
                            color: hoveredBtn === `view-${b.id}` ? "#111111" : "#ffffff", 
                            border: "none", 
                            padding: "8px 16px", 
                            borderRadius: "8px", 
                            marginRight: "8px", 
                            fontSize: "12px", 
                            cursor: "pointer", 
                            fontWeight: "700",
                            transition: "all 0.2s ease-in-out"
                          }}
                        >
                          Receipt ↗
                        </button>
                        
                        <button 
                          onClick={() => handleCancelClick(b.id)} 
                          onMouseEnter={() => setHoveredBtn(`cancel-${b.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{ 
                            background: hoveredBtn === `cancel-${b.id}` ? "#ffffff" : "transparent", 
                            color: hoveredBtn === `cancel-${b.id}` ? "#111111" : "#ffffff", 
                            border: "1px solid #ffffff", 
                            padding: "7px 16px", 
                            borderRadius: "8px", 
                            fontSize: "12px", 
                            cursor: "pointer", 
                            fontWeight: "700",
                            transition: "all 0.2s ease-in-out"
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};