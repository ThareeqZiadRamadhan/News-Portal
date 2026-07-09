"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ChevronRight, BarChart2, Mail, ArrowUpRight, Flame } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ALL_ARTICLES } from "../data/articles";

const marketData = [
  { name: "S&P 500", value: "7,024.18", change: "+1.32%", up: true },
  { name: "NASDAQ", value: "19,847.22", change: "+0.89%", up: true },
  { name: "DOW JONES", value: "43,812.65", change: "-0.14%", up: false },
  { name: "BTC/USD", value: "$107,443", change: "+3.21%", up: true },
  { name: "EUR/USD", value: "1.0832", change: "-0.07%", up: false },
  { name: "GOLD", value: "$2,741", change: "+0.43%", up: true },
];

const editions = [
  { name: "The Americas", flag: "🌎" },
  { name: "Europe", flag: "🇪🇺" },
  { name: "Asia Pacific", flag: "🌏" },
  { name: "Middle East", flag: "🌍" },
];

const trending = [
  { rank: 1, articleId: 7, category: "Politics", views: "124K", hot: true },
  { rank: 2, articleId: 12, category: "Technology", views: "98K", hot: true },
  { rank: 3, articleId: 10, category: "Science", views: "76K", hot: false },
  { rank: 4, articleId: 4, category: "Business", views: "61K", hot: false },
  { rank: 5, articleId: 11, category: "World", views: "54K", hot: false },
  { rank: 6, articleId: 5, category: "Science", views: "42K", hot: false },
  { rank: 7, articleId: 3, category: "Environment", views: "38K", hot: false },
];

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

export function Sidebar() {
  const {
    openArticle, newsletterSubmitted, submitNewsletter,
    activeEdition, setActiveEdition, openMarket,
  } = useApp();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email.");
      return;
    }
    setEmailError("");
    submitNewsletter(email);
  };

  // When stacked on tablet, use a 2-column grid for sidebar sections
  if (isTablet) {
    return (
      <aside>
        {/* Stacked sidebar title on mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "3px", height: "18px", background: "#0a0a0a", borderRadius: "2px" }} />
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0a0a0a" }}>
            Discover More
          </span>
          <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "24px",
        }}>
          {/* Column 1: Trending */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <TrendingUp size={14} style={{ color: "#d4183d" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0a0a0a" }}>
                Trending Now
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {trending.slice(0, 5).map((item, i) => {
                const article = ALL_ARTICLES.find((a) => a.id === item.articleId);
                if (!article) return null;
                return (
                  <button
                    key={item.rank}
                    onClick={() => openArticle(article)}
                    style={{
                      display: "flex", gap: "12px",
                      padding: "12px 0",
                      borderBottom: i < 4 ? "1px solid #f0f0f0" : "none",
                      cursor: "pointer", background: "none", border: "none",
                      textAlign: "left", width: "100%",
                    }}
                    className="group"
                  >
                    <div style={{
                      fontSize: "20px", fontWeight: 800,
                      color: i < 2 ? "#e8edf8" : "#f5f5f5",
                      lineHeight: 1, minWidth: "28px",
                      fontFamily: "Georgia, serif", letterSpacing: "-0.03em",
                    }}>
                      {String(item.rank).padStart(2, "0")}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a56db" }}>
                          {item.category}
                        </span>
                        {item.hot && (
                          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                            <Flame size={9} style={{ color: "#d4183d" }} />
                            <span style={{ fontSize: "9px", color: "#d4183d", fontWeight: 700 }}>Hot</span>
                          </div>
                        )}
                      </div>
                      <p style={{
                        fontSize: "12px", fontWeight: 600, lineHeight: 1.4, color: "#1a1a1a",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                        fontFamily: "Georgia, serif",
                      }}
                        className="group-hover:text-[#1a56db] transition-colors"
                      >
                        {article.title}
                      </p>
                      <p style={{ fontSize: "10px", color: "#bbb", marginTop: "4px" }}>{item.views} views</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Market + Newsletter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Market Data */}
            <div style={{ background: "#0a0a0a", borderRadius: "4px", padding: "20px", color: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <BarChart2 size={14} style={{ color: "#6b9cf5" }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Markets</span>
                </div>
                <span style={{ fontSize: "9px", color: "#555", letterSpacing: "0.06em" }}>Live · 15min delay</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {marketData.slice(0, 4).map((m, i) => (
                  <div key={m.name} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: i < 3 ? "1px solid #1e1e1e" : "none",
                  }}>
                    <span style={{ fontSize: "11px", color: "#888", letterSpacing: "0.05em" }}>{m.name}</span>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>{m.value}</p>
                      <p style={{ fontSize: "10px", fontWeight: 600, color: m.up ? "#22c55e" : "#ef4444" }}>{m.change}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={openMarket}
                style={{
                  marginTop: "14px", width: "100%", padding: "9px",
                  border: "1px solid #333", borderRadius: "2px",
                  color: "#aaa", fontSize: "10px", fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "6px", background: "transparent",
                }}
                className="hover:border-[#1a56db] hover:text-[#6b9cf5] transition-colors"
              >
                Full Market Data <ArrowUpRight size={11} />
              </button>
            </div>

            {/* Newsletter */}
            <div style={{
              background: "linear-gradient(135deg, #1a56db 0%, #0e3a8c 100%)",
              borderRadius: "4px", padding: "24px 20px", color: "#fff",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <Mail size={16} style={{ color: "#93bbff" }} />
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#93bbff" }}>
                    Newsletter
                  </span>
                </div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "17px", fontWeight: 700, lineHeight: 1.3, color: "#fff", marginBottom: "8px" }}>
                  The Daily Briefing
                </h3>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: "16px" }}>
                  Essential news and analysis delivered to your inbox every morning.
                </p>
                {newsletterSubmitted ? (
                  <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "3px", padding: "16px", textAlign: "center" }}>
                    <p style={{ fontSize: "22px", marginBottom: "6px" }}>✓</p>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>You're subscribed!</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
                      Check your inbox for a confirmation email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletter}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                      placeholder="Enter your email"
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: "2px",
                        border: emailError ? "1px solid #fca5a5" : "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.12)", color: "#fff",
                        fontSize: "12px", marginBottom: emailError ? "4px" : "10px",
                        outline: "none", boxSizing: "border-box",
                      }}
                    />
                    {emailError && (
                      <p style={{ fontSize: "10px", color: "#fca5a5", marginBottom: "8px" }}>{emailError}</p>
                    )}
                    <button
                      type="submit"
                      style={{
                        width: "100%", padding: "11px", background: "#fff", color: "#1a56db",
                        fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                        textTransform: "uppercase", borderRadius: "2px", cursor: "pointer",
                        border: "none", transition: "opacity 0.15s",
                      }}
                      className="hover:opacity-90"
                    >
                      Subscribe Free
                    </button>
                    <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: "10px" }}>
                      No spam. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* World Editions — always full width */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0a0a0a" }}>
              World Editions
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "8px" }}>
            {editions.map((ed) => (
              <button
                key={ed.name}
                onClick={() => setActiveEdition(ed.name)}
                style={{
                  padding: "10px 12px", borderRadius: "3px", cursor: "pointer",
                  textAlign: "left", display: "flex", alignItems: "center", gap: "8px",
                  transition: "all 0.15s",
                  background: activeEdition === ed.name ? "#eff6ff" : "#fafafa",
                  border: activeEdition === ed.name ? "1px solid #bfdbfe" : "1px solid #e8e8e8",
                }}
                className={activeEdition !== ed.name ? "hover:border-[#1a56db] hover:bg-blue-50" : ""}
              >
                <span style={{ fontSize: "16px" }}>{ed.flag}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: activeEdition === ed.name ? "#1a56db" : "#333" }}>
                  {ed.name}
                </span>
              </button>
            ))}
          </div>
          {activeEdition && (
            <p style={{ fontSize: "11px", color: "#888", marginTop: "10px", textAlign: "center" }}>
              Showing edition: <strong style={{ color: "#333" }}>{activeEdition}</strong>
            </p>
          )}
        </div>
      </aside>
    );
  }

  // Desktop layout — original single-column sidebar
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Trending Now */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <TrendingUp size={14} style={{ color: "#d4183d" }} />
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0a0a0a" }}>
            Trending Now
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {trending.map((item, i) => {
            const article = ALL_ARTICLES.find((a) => a.id === item.articleId);
            if (!article) return null;
            return (
              <button
                key={item.rank}
                onClick={() => openArticle(article)}
                style={{
                  display: "flex", gap: "12px",
                  padding: "12px 0",
                  borderBottom: i < trending.length - 1 ? "1px solid #f0f0f0" : "none",
                  cursor: "pointer", background: "none", border: "none",
                  textAlign: "left", width: "100%",
                }}
                className="group"
              >
                <div style={{
                  fontSize: "20px", fontWeight: 800,
                  color: i < 2 ? "#e8edf8" : "#f5f5f5",
                  lineHeight: 1, minWidth: "28px",
                  fontFamily: "Georgia, serif", letterSpacing: "-0.03em",
                }}>
                  {String(item.rank).padStart(2, "0")}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a56db" }}>
                      {item.category}
                    </span>
                    {item.hot && (
                      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                        <Flame size={9} style={{ color: "#d4183d" }} />
                        <span style={{ fontSize: "9px", color: "#d4183d", fontWeight: 700 }}>Hot</span>
                      </div>
                    )}
                  </div>
                  <p style={{
                    fontSize: "12px", fontWeight: 600, lineHeight: 1.4, color: "#1a1a1a",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                    fontFamily: "Georgia, serif",
                  }}
                    className="group-hover:text-[#1a56db] transition-colors"
                  >
                    {article.title}
                  </p>
                  <p style={{ fontSize: "10px", color: "#bbb", marginTop: "4px" }}>{item.views} views</p>
                </div>

                <ChevronRight
                  size={14} style={{ color: "#ccc", flexShrink: 0, alignSelf: "center" }}
                  className="group-hover:text-[#1a56db] group-hover:translate-x-0.5 transition-all"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Market Data */}
      <div style={{ background: "#0a0a0a", borderRadius: "4px", padding: "20px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <BarChart2 size={14} style={{ color: "#6b9cf5" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Markets</span>
          </div>
          <span style={{ fontSize: "9px", color: "#555", letterSpacing: "0.06em" }}>Live · 15min delay</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {marketData.map((m, i) => (
            <div
              key={m.name}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: i < marketData.length - 1 ? "1px solid #1e1e1e" : "none",
              }}
            >
              <span style={{ fontSize: "11px", color: "#888", letterSpacing: "0.05em" }}>{m.name}</span>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>{m.value}</p>
                <p style={{ fontSize: "10px", fontWeight: 600, color: m.up ? "#22c55e" : "#ef4444" }}>{m.change}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={openMarket}
          style={{
            marginTop: "14px", width: "100%", padding: "9px",
            border: "1px solid #333", borderRadius: "2px",
            color: "#aaa", fontSize: "10px", fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "6px", background: "transparent",
          }}
          className="hover:border-[#1a56db] hover:text-[#6b9cf5] transition-colors"
        >
          Full Market Data <ArrowUpRight size={11} />
        </button>
      </div>

      {/* Newsletter */}
      <div style={{
        background: "linear-gradient(135deg, #1a56db 0%, #0e3a8c 100%)",
        borderRadius: "4px", padding: "24px 20px", color: "#fff",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: "-30px", left: "-10px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Mail size={16} style={{ color: "#93bbff" }} />
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#93bbff" }}>
              Newsletter
            </span>
          </div>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: "17px", fontWeight: 700, lineHeight: 1.3, color: "#fff", marginBottom: "8px" }}>
            The Daily Briefing
          </h3>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: "16px" }}>
            Essential news and analysis delivered to your inbox every morning.
          </p>

          {newsletterSubmitted ? (
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "3px", padding: "16px", textAlign: "center" }}>
              <p style={{ fontSize: "22px", marginBottom: "6px" }}>✓</p>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>You're subscribed!</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
                Check your inbox for a confirmation email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleNewsletter}>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                placeholder="Enter your email"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "2px",
                  border: emailError ? "1px solid #fca5a5" : "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.12)", color: "#fff",
                  fontSize: "12px", marginBottom: emailError ? "4px" : "10px",
                  outline: "none", boxSizing: "border-box",
                }}
              />
              {emailError && (
                <p style={{ fontSize: "10px", color: "#fca5a5", marginBottom: "8px" }}>{emailError}</p>
              )}
              <button
                type="submit"
                style={{
                  width: "100%", padding: "11px", background: "#fff", color: "#1a56db",
                  fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", borderRadius: "2px", cursor: "pointer",
                  border: "none", transition: "opacity 0.15s",
                }}
                className="hover:opacity-90"
              >
                Subscribe Free
              </button>
              <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: "10px" }}>
                No spam. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* World Editions */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0a0a0a" }}>
            World Editions
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {editions.map((ed) => (
            <button
              key={ed.name}
              onClick={() => setActiveEdition(ed.name)}
              style={{
                padding: "10px 12px", borderRadius: "3px", cursor: "pointer",
                textAlign: "left", display: "flex", alignItems: "center", gap: "8px",
                transition: "all 0.15s",
                background: activeEdition === ed.name ? "#eff6ff" : "#fafafa",
                border: activeEdition === ed.name ? "1px solid #bfdbfe" : "1px solid #e8e8e8",
              }}
              className={activeEdition !== ed.name ? "hover:border-[#1a56db] hover:bg-blue-50" : ""}
            >
              <span style={{ fontSize: "16px" }}>{ed.flag}</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: activeEdition === ed.name ? "#1a56db" : "#333" }}>
                {ed.name}
              </span>
            </button>
          ))}
        </div>
        {activeEdition && (
          <p style={{ fontSize: "11px", color: "#888", marginTop: "10px", textAlign: "center" }}>
            Showing edition: <strong style={{ color: "#333" }}>{activeEdition}</strong>
          </p>
        )}
      </div>
    </aside>
  );
}
