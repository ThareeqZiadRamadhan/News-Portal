"use client";

import { useState, useEffect } from "react";
import { Twitter, Linkedin, Youtube, Instagram, Rss } from "lucide-react";
import { useApp } from "../context/AppContext";

const footerLinks = {
  "News": ["World", "Politics", "Business", "Technology", "Science", "Health", "Culture", "Sports"],
  "Opinion": ["Editorials", "Columnists", "Letters", "Guest Essays", "Debate"],
  "Company": ["About Us", "Careers", "Press", "Advertise", "Contact"],
  "Services": ["Newsletters", "Podcasts", "Apps", "Archives", "Syndication"],
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

export function Footer() {
  const { setActiveSection, openAuth, podcastPlaying, togglePodcast } = useApp();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  return (
    <footer style={{ background: "#0a0a0a", color: "#fff", marginTop: isMobile ? "40px" : "60px" }}>
      <div style={{
        maxWidth: "1440px", margin: "0 auto",
        padding: isMobile ? "36px 16px 32px" : isTablet ? "44px 24px 36px" : "52px 32px 40px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "240px 1fr",
          gap: isMobile ? "32px" : "60px",
          marginBottom: isMobile ? "32px" : "48px",
        }}>
          {/* Brand */}
          <div>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setActiveSection("World"); }}
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "3px", height: "28px", background: "#1a56db", borderRadius: "2px" }} />
                <span style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}>
                  The Chronicle
                </span>
              </div>
            </button>
            <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.7, marginBottom: "20px" }}>
              Independent journalism since 1881. Fearless reporting on the stories that shape our world.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[Twitter, Linkedin, Youtube, Instagram, Rss].map((Icon, i) => (
                <button
                  key={i}
                  style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    border: "1px solid #2a2a2a", background: "transparent",
                    color: "#666", display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer", transition: "all 0.15s",
                  }}
                  className="hover:border-[#1a56db] hover:text-[#6b9cf5]"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: isMobile ? "24px" : "32px",
          }}>
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "#fff", marginBottom: "14px",
                }}>
                  {section}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {links.map((link) => (
                    <li key={link}>
                      <button
                        onClick={() => {
                          const newsSection = ["World", "Politics", "Business", "Technology", "Science", "Culture", "Sports", "Opinion"].includes(link) ? link : null;
                          if (newsSection) setActiveSection(newsSection);
                          else if (link === "Newsletters") openAuth("subscribe");
                          else if (link === "Podcasts") togglePodcast();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        style={{
                          fontSize: "12px", color: "#555", cursor: "pointer",
                          background: "none", border: "none", padding: 0, transition: "color 0.15s",
                        }}
                        className="hover:text-white"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: "1px", background: "#1a1a1a", marginBottom: "24px" }} />

        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "center",
          justifyContent: "space-between",
          gap: isMobile ? "16px" : "0",
          textAlign: isMobile ? "center" : undefined,
        }}>
          <p style={{ fontSize: "11px", color: "#444" }}>
            © 2026 The Chronicle Media Group. All rights reserved.
          </p>
          <div style={{
            display: "flex",
            gap: isMobile ? "16px" : "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
            {["Privacy Policy", "Terms of Service", "Cookie Settings", "Accessibility"].map((item) => (
              <button
                key={item}
                style={{ fontSize: "11px", color: "#444", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                className="hover:text-white transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
