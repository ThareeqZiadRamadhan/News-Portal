"use client";

import { useEffect, useRef, useState } from "react";
import { X, Bell, Check } from "lucide-react";
import { useApp } from "../context/AppContext";

const categoryColors: Record<string, string> = {
  World: "#d4183d",
  Business: "#7c3aed",
  Technology: "#1a56db",
  Science: "#c2410c",
  Opinion: "#374151",
  Culture: "#b45309",
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") return window.matchMedia(query).matches;
    return false;
  });
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export function NotificationsPanel() {
  const { notificationsOpen, toggleNotifications, notifications, markAllNotificationsRead, openArticle, articles } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notificationsOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        toggleNotifications();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notificationsOpen, toggleNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      {notificationsOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 400,
          background: isMobile ? "rgba(0,0,0,0.3)" : "transparent",
        }} />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          top: isMobile ? 0 : "108px",
          right: isMobile ? 0 : "24px",
          bottom: isMobile ? 0 : undefined,
          left: isMobile ? 0 : undefined,
          zIndex: 500,
          background: "#fff",
          borderRadius: isMobile ? 0 : "4px",
          width: isMobile ? "100%" : "360px",
          maxHeight: isMobile ? "100vh" : undefined,
          boxShadow: isMobile ? "none" : "0 8px 32px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)",
          transform: notificationsOpen
            ? "translateY(0)"
            : isMobile ? "translateY(100%)" : "translateY(-8px)",
          opacity: notificationsOpen ? 1 : 0,
          pointerEvents: notificationsOpen ? "all" : "none",
          transition: "transform 0.2s ease, opacity 0.2s ease",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Bell size={15} style={{ color: "#333" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#111" }}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{
                background: "#d4183d", color: "#fff",
                fontSize: "10px", fontWeight: 700,
                padding: "2px 7px", borderRadius: "10px",
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                style={{
                  fontSize: "11px", color: "#1a56db", fontWeight: 600,
                  background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "4px",
                }}
                className="hover:opacity-70"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
            <button
              onClick={toggleNotifications}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", display: "flex" }}
              className="hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {notifications.map((n, i) => {
            const relatedArticle = articles.find((a) => a.category === n.category);
            return (
              <div
                key={n.id}
                onClick={() => {
                  if (relatedArticle) { openArticle(relatedArticle); toggleNotifications(); }
                }}
                style={{
                  padding: "14px 20px",
                  borderBottom: i < notifications.length - 1 ? "1px solid #f8f8f8" : "none",
                  background: n.read ? "#fff" : "#f8fbff",
                  cursor: "pointer",
                  display: "flex", gap: "12px", alignItems: "flex-start",
                  transition: "background 0.1s",
                }}
                className="hover:bg-blue-50"
              >
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  flexShrink: 0, marginTop: "5px",
                  background: n.read ? "transparent" : "#1a56db",
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                    <span style={{
                      fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em",
                      textTransform: "uppercase", color: categoryColors[n.category] || "#888",
                    }}>
                      {n.category}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", fontWeight: n.read ? 400 : 600, lineHeight: 1.45, color: "#111" }}>
                    {n.title}
                  </p>
                  <p style={{ fontSize: "10px", color: "#bbb", marginTop: "4px" }}>{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f0f0", textAlign: "center", flexShrink: 0 }}>
          <button
            style={{ fontSize: "12px", color: "#1a56db", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
            className="hover:underline"
          >
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}
