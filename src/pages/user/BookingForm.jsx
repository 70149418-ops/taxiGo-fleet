import React, { useState } from "react";
import { createTaxiBooking } from "../../services/bookingService";

export const BookingForm = ({ onBookingSuccess }) => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [carType, setCarType] = useState("Standard Eco");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  // Tracks which input field has focus for clean yellow glowing borders
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickup.trim() || !destination.trim()) return;

    try {
      setIsSubmitting(true);
      setStatusMessage("🔄 Dispatching encryption token to cloud nodes...");
      
      const calculatedFare = Math.floor(Math.random() * (1500 - 350 + 1)) + 350; 
      
      await createTaxiBooking({
        pickup: pickup.trim(),
        destination: destination.trim(),
        carType,
        fare: calculatedFare,
        estimatedTime: `${Math.floor(Math.random() * (45 - 10 + 1)) + 10} mins`
      });

      setPickup("");
      setDestination("");
      setStatusMessage("✅ Ride Request Successfully Streamed to Live Ledger!");
      
      // Auto-clear message notification container after 5 seconds
      setTimeout(() => setStatusMessage(""), 5000);

      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      setStatusMessage(`❌ Database operational failure: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Re-styled inputs for deep dark consistency without white flashes on focus
  const inputStyle = (fieldName) => ({
    width: "100%", 
    padding: "14px 16px", 
    boxSizing: "border-box", 
    border: focusedField === fieldName ? "1px solid #ffdd00" : "1px solid #222222", 
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#ffffff",
    backgroundColor: focusedField === fieldName ? "#161616" : "#0d0d0d",
    outline: "none",
    transition: "all 0.2s ease-in-out",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    boxShadow: focusedField === fieldName ? "0 0 0 4px rgba(255, 221, 0, 0.15)" : "none"
  });

  const labelStyle = {
    display: "block", 
    marginBottom: "8px", 
    fontWeight: "700",
    fontSize: "12px",
    color: "#888888",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  return (
    <div style={{ 
      background: "#111111", 
      padding: "32px", 
      borderRadius: "12px", 
      border: "1px solid #1a1a1a",
      boxShadow: "0 4px 25px rgba(0,0,0,0.3)", 
      color: "#ffffff",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      boxSizing: "border-box"
    }} className="responsive-form-card">
      
      {/* 📱 Mobile CSS Injection */}
      <style>{`
        @media (max-width: 480px) {
          .responsive-form-card {
            padding: 20px !important;
            border-radius: 12px !important;
          }
          .responsive-form-card h3 {
            font-size: 16px !important;
            margin-bottom: 20px !important;
          }
        }
      `}</style>

      <h3 style={{ 
        marginTop: 0, 
        fontSize: "18px",
        fontWeight: "800",
        letterSpacing: "-0.5px",
        borderBottom: "2px solid #ffdd00", 
        paddingBottom: "10px", 
        marginBottom: "24px",
        display: "inline-block",
        color: "#ffffff"
      }}>
        🚖 Dispatch New taxiGo Ride
      </h3>

      {/* Re-styled Dark Status Notifications Banner */}
      {statusMessage && (
        <div style={{ 
          padding: "14px 16px", 
          background: "#161616", 
          border: statusMessage.includes("❌") ? "1px solid #ffffff" : "1px solid #ffdd00",
          borderRadius: "12px", 
          marginBottom: "20px", 
          fontSize: "13px", 
          fontWeight: "600",
          color: statusMessage.includes("❌") ? "#ffffff" : "#ffdd00",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}>
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Pickup Input Field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Current Pickup Location</label>
          <input 
            type="text" 
            placeholder="e.g. University of Lahore (Main Gate)" 
            value={pickup} 
            onChange={(e) => setPickup(e.target.value)} 
            onFocus={() => setFocusedField("pickup")}
            onBlur={() => setFocusedField(null)}
            required 
            disabled={isSubmitting}
            style={inputStyle("pickup")} 
          />
        </div>

        {/* Destination Input Field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Target Destination</label>
          <input 
            type="text" 
            placeholder="e.g. Allama Iqbal International Airport" 
            value={destination} 
            onChange={(e) => setDestination(e.target.value)} 
            onFocus={() => setFocusedField("destination")}
            onBlur={() => setFocusedField(null)}
            required 
            disabled={isSubmitting}
            style={inputStyle("destination")} 
          />
        </div>

        {/* Vehicle Selection Dropdown Wrapper */}
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>Select Vehicle Fleet Tier</label>
          <div style={{ position: "relative" }}>
            <select 
              value={carType} 
              onChange={(e) => setCarType(e.target.value)} 
              onFocus={() => setFocusedField("carType")}
              onBlur={() => setFocusedField(null)}
              disabled={isSubmitting}
              style={{
                ...inputStyle("carType"),
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                cursor: "pointer",
                paddingRight: "40px"
              }}
            >
              <option value="Standard Eco" style={{ background: "#111111", color: "#ffffff" }}>Standard Eco (🚖 Suzuki Alto / WagonR)</option>
              <option value="Executive Sedan" style={{ background: "#111111", color: "#ffffff" }}>Executive Sedan (🚘 Honda Civic / Corolla)</option>
              <option value="TaxiGo Mini Box" style={{ background: "#111111", color: "#ffffff" }}>TaxiGo Mini Box (🚗 Rickshaw / Bike Fleet)</option>
            </select>
            
            {/* Custom Arrow Indicator Element */}
            <div style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#888888",
              fontSize: "12px",
              fontWeight: "bold"
            }}>▼</div>
          </div>
        </div>

        {/* Submission Execution Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          onMouseEnter={() => setIsBtnHovered(true)}
          onMouseLeave={() => setIsBtnHovered(false)}
          style={{ 
            width: "100%", 
            padding: "16px", 
            background: isBtnHovered ? "#ffffff" : "#ffdd00", 
            color: "#111111", 
            border: "none", 
            borderRadius: "12px", 
            fontWeight: "800", 
            fontSize: "14px",
            cursor: "pointer", 
            transition: "all 0.2s ease-in-out",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            boxShadow: isBtnHovered ? "0 6px 20px rgba(255,255,255,0.15)" : "0 6px 20px rgba(255,221,0,0.15)",
            opacity: isSubmitting ? 0.8 : 1
          }}
        >
          {isSubmitting ? "Streaming to Nodes..." : "Confirm Secure Booking ↗"}
        </button>
      </form>
    </div>
  );
};