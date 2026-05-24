import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../../firebase/config";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs } from "firebase/firestore";

export const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userDirectory, setUserDirectory] = useState([]);
  const [activeChatId, setActiveChatId] = useState("global_operations_lounge");
  
  // Mobile-View Screen State Control
  const [isMobileChatActive, setIsMobileChatActive] = useState(false);

  // Micro-interactive component visual hook selectors
  const [hoveredChannel, setHoveredChannel] = useState(null);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const scrollTrackerRef = useRef();

  // Helper function to extract user handle names safely
  const formatName = (profile) => {
    if (!profile) return "User Profile";
    if (profile.name) return profile.name;
    if (profile.email) {
      return profile.email.split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
    }
    return "User Profile";
  };

  // Download platform active direct messaging nodes directory mapping
  useEffect(() => {
    const downloadSystemUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const currentUid = auth.currentUser?.uid;
        const activeProfiles = usersSnapshot.docs
          .map(doc => doc.data())
          .filter(profile => profile && profile.uid && profile.uid !== currentUid);
        setUserDirectory(activeProfiles);
      } catch (err) {
        console.error("Directory reading issue:", err);
      }
    };
    downloadSystemUsers();
  }, []);

  // Sync real-time messaging collections node streams
  useEffect(() => {
    console.log(`[ChatRoom Engine] Connecting stream for Room ID: ${activeChatId}`);
    
    const messageStreamQuery = query(
      collection(db, "chats", activeChatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const closeLiveConnection = onSnapshot(messageStreamQuery, (querySnapshot) => {
      const incoming = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(incoming);
    }, (error) => {
      console.error("Live listener pipeline blocked by Firestore rules or network drop:", error);
    });

    return () => closeLiveConnection();
  }, [activeChatId]);

  // Smooth operational tracking positioning scroll lock adjustments
  useEffect(() => {
    scrollTrackerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const dispatchChatMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 🚀 CRITICAL FIX: Ensure user context is present before attempting write payload
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("Write aborted: User is not logged in or Firebase auth context dropped.");
      return;
    }

    try {
      const currentSenderName = currentUser.displayName || currentUser.email?.split("@")[0] || "User";
      
      await addDoc(collection(db, "chats", activeChatId, "messages"), {
        text: input.trim(),
        senderId: currentUser.uid,
        senderName: currentSenderName.replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        timestamp: serverTimestamp() // Triggers real-time stream listener update instantly upon generation
      });

      setInput("");
    } catch (err) {
      console.error("Message delivery failed directly at Firestore collection writing junction:", err);
    }
  };

  // 🚀 CRITICAL REPAIR: Unifies structural dynamic Room ID generation safely
  const handleChannelSwitch = (targetChannel) => {
    if (targetChannel === "global_operations_lounge") {
      setActiveChatId("global_operations_lounge");
    } else {
      const currentUid = auth.currentUser?.uid;
      if (!currentUid) {
        console.warn("Cannot initialize secure private channel: Current User Auth state is null.");
        return;
      }
      // Generate clean, deterministic sorted unique room IDs consistently
      const generatedRoomId = [currentUid, targetChannel].sort().join("___");
      setActiveChatId(generatedRoomId);
    }
    setIsMobileChatActive(true); // Transitions viewport window smoothly for smartphones
  };

  return (
    <div className="chatroom-main-wrapper" style={{ 
      display: "flex", 
      height: "650px", 
      backgroundColor: "#ffffff", 
      borderRadius: "20px", 
      border: "1px solid #eaeaea",
      boxShadow: "0 12px 40px rgba(0,0,0,0.03)", 
      overflow: "hidden", 
      color: "#111111",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      width: "100%",
      boxSizing: "border-box"
    }}>
      
      {/* 1. Left Channel Sidebar Navigation Stack Container */}
      <div 
        className={`chat-sidebar-panel ${isMobileChatActive ? "mobile-hidden" : "mobile-visible"}`}
        style={{ 
          width: "32%", 
          backgroundColor: "#fafafa", 
          borderRight: "1px solid #eaeaea", 
          padding: "24px 16px", 
          display: "flex", 
          flexDirection: "column",
          boxSizing: "border-box"
        }}
      >
        <h3 style={{ 
          marginTop: 0, 
          fontSize: "18px", 
          fontWeight: "800", 
          color: "#111111", 
          letterSpacing: "-0.5px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "20px"
        }}>
          <span>🚖</span> taxiGo ChatBox
        </h3>

        {/* Global Dispatch Broadcast Channel Node Wrapper */}
        <div 
          onClick={() => handleChannelSwitch("global_operations_lounge")}
          onMouseEnter={() => setHoveredChannel("global")}
          onMouseLeave={() => setHoveredChannel(null)}
          style={{ 
            padding: "14px 16px", 
            borderRadius: "12px", 
            background: activeChatId === "global_operations_lounge" ? "#111111" : (hoveredChannel === "global" ? "#eeeeee" : "transparent"), 
            color: activeChatId === "global_operations_lounge" ? "#ffdd00" : "#111111",
            fontWeight: "700", 
            fontSize: "14px",
            cursor: "pointer", 
            marginBottom: "24px",
            transition: "all 0.2s ease-in-out",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: activeChatId === "global_operations_lounge" ? "0 4px 12px rgba(0,0,0,0.1)" : "none"
          }}
        >
          <span>📢</span> Public Operational Feed
        </div>
        
        <h4 style={{ 
          margin: "0 0 12px 6px", 
          color: "#888888", 
          fontSize: "11px", 
          fontWeight: "700", 
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          Active Dispatch Drivers & Members
        </h4>

        {/* Dynamic Directory Array Scroller Mapping */}
        <div style={{ 
          flexGrow: 1, 
          overflowY: "auto",
          paddingRight: "4px"
        }} className="custom-chat-scrollbar">
          {userDirectory.map((u) => {
            if (!u || !u.uid) return null;
            const isSelected = activeChatId.includes(u.uid);
            const userInitials = formatName(u).substring(0, 2).toUpperCase();
            return (
              <div 
                key={u.uid}
                onClick={() => handleChannelSwitch(u.uid)} // Passes the unique target ID into our engine clean
                onMouseEnter={() => setHoveredChannel(u.uid)}
                onMouseLeave={() => setHoveredChannel(null)}
                style={{ 
                  padding: "12px", 
                  borderRadius: "12px", 
                  background: isSelected ? "#fff9e6" : (hoveredChannel === u.uid ? "#f0f0f0" : "transparent"), 
                  borderLeft: isSelected ? "4px solid #ffdd00" : "4px solid transparent", 
                  cursor: "pointer", 
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Simulated Avatar Identity Pill Badge Block */}
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: isSelected ? "#ffdd00" : "#e0e0e0",
                  color: isSelected ? "#111111" : "#555555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "700",
                  flexShrink: 0
                }}>
                  {userInitials}
                </div>

                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontWeight: "700", fontSize: "14px", color: "#111111", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {formatName(u)}
                  </div>
                  <div style={{ fontSize: "11px", color: isSelected ? "#856404" : "#777777", fontWeight: "500", marginTop: "2px" }}>
                    💼 Class: <span style={{ textTransform: "capitalize" }}>{u.role || "member"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Right Interactive Workspace Console Dialogue System Pane */}
      <div 
        className={`chat-workspace-console ${isMobileChatActive ? "mobile-visible" : "mobile-hidden"}`}
        style={{ 
          width: "68%", 
          display: "flex", 
          flexDirection: "column", 
          backgroundColor: "#ffffff",
          boxSizing: "border-box"
        }}
      >
        
        {/* Workspace Sub-Header Top Node */}
        <div style={{ 
          padding: "18px 24px", 
          backgroundColor: "#ffffff", 
          borderBottom: "1px solid #eaeaea", 
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#00c853", flexShrink: 0 }}></div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#666666", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
              Operational Node: {" "}
              <span style={{ color: "#111111", fontWeight: "800" }}>
                {activeChatId === "global_operations_lounge" ? "🌐 Global Broadcast" : "🔒 Secure Direct Line"}
              </span>
            </div>
          </div>
          
          {/* Mobile Navigation Trigger link */}
          <button 
            className="mobile-back-button"
            onClick={() => setIsMobileChatActive(false)}
            style={{
              display: "none",
              padding: "6px 12px",
              background: "#111111",
              color: "#ffdd00",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            ← Directory
          </button>
        </div>

        {/* 3. Live Log View Messages Array Container */}
        <div style={{ 
          flexGrow: 1, 
          padding: "24px", 
          overflowY: "auto", 
          backgroundColor: "#fcfcfc",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxSizing: "border-box"
        }} className="custom-chat-scrollbar">
          {messages.map((m) => {
            const isMe = m.senderId === auth.currentUser?.uid;
            return (
              <div 
                key={m.id} 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: isMe ? "flex-end" : "flex-start",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                {/* Metadata Tracking Tag String */}
                <span style={{ 
                  fontSize: "11px", 
                  color: "#999999", 
                  fontWeight: "600",
                  marginBottom: "4px",
                  marginRight: isMe ? "4px" : "0",
                  marginLeft: isMe ? "0" : "4px"
                }}>
                  {m.senderName || "System Profile"}
                </span>

                {/* Micro Dialogue Speech Bubble Component Mapping */}
                <div style={{ 
                  backgroundColor: isMe ? "#ffdd00" : "#ffffff", 
                  color: "#111111", 
                  padding: "12px 18px", 
                  borderRadius: isMe ? "18px 18px 2px 18px" : "18px 18px 18px 2px", 
                  maxWidth: "80%", 
                  fontSize: "14px",
                  fontWeight: "500",
                  lineHeight: "1.5",
                  boxShadow: isMe ? "0 4px 12px rgba(255,221,0,0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
                  border: isMe ? "1px solid transparent" : "1px solid #eaeaea",
                  wordBreak: "break-word"
                }}>
                  {m.text}
                </div>
              </div>
            );
          })}
          <div ref={scrollTrackerRef} />
        </div>

        {/* 4. Text Action Input Form Dispatch Control Footer Block */}
        <form 
          onSubmit={dispatchChatMessage} 
          style={{ 
            padding: "20px 24px", 
            borderTop: "1px solid #eaeaea", 
            display: "flex", 
            backgroundColor: "#ffffff",
            alignItems: "center",
            gap: "12px",
            boxSizing: "border-box"
          }}
        >
          <input 
            type="text" 
            placeholder="Write an operational broadcast message..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            style={{ 
              flexGrow: 1, 
              padding: "14px 18px", 
              border: "1px solid #e0e0e0", 
              borderRadius: "12px", 
              outline: "none",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor: "#fafafa",
              transition: "all 0.2s ease",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              width: "100%",
              boxSizing: "border-box"
            }} 
            onFocus={(e) => {
              e.target.style.border = "1px solid #111111";
              e.target.style.backgroundColor = "#ffffff";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid #e0e0e0";
              e.target.style.backgroundColor = "#fafafa";
            }}
          />
          <button 
            type="submit" 
            onMouseEnter={() => setIsSubmitHovered(true)}
            onMouseLeave={() => setIsSubmitHovered(false)}
            style={{ 
              padding: "14px 24px", 
              backgroundColor: isSubmitHovered ? "#ffdd00" : "#111111", 
              color: isSubmitHovered ? "#111111" : "#ffdd00", 
              border: "none", 
              borderRadius: "12px", 
              fontWeight: "700", 
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              boxShadow: isSubmitHovered ? "0 4px 14px rgba(255,221,0,0.3)" : "none",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              whiteSpace: "nowrap"
            }}
          >
            Send ↗
          </button>
        </form>
      </div>

      {/* Global CSS Injector Rule Sub-Engine Block for Mobile Responsiveness & Scrollers */}
      <style>{`
        .custom-chat-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-chat-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 10px;
        }
        .custom-chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cccccc;
        }

        @media (max-width: 768px) {
          .chatroom-main-wrapper {
            height: 80vh !important;
            border-radius: 12px !important;
          }
          .mobile-hidden {
            display: none !important;
          }
          .mobile-visible {
            display: flex !important;
            width: 100% !important;
          }
          .mobile-back-button {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};