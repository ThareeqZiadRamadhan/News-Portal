import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { TickerBanner } from "./components/TickerBanner";
import { HeroSection } from "./components/HeroSection";
import { ArticleGrid } from "./components/ArticleGrid";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { ArticleModal } from "./components/ArticleModal";
import { AuthModal } from "./components/AuthModal";
import { ShareMenu } from "./components/ShareMenu";
import { MiniPlayer } from "./components/MiniPlayer";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { BookmarksPanel } from "./components/BookmarksPanel";
import { MarketModal } from "./components/MarketModal";
import { OPINION_PIECES } from "./data/articles";
import { useEffect, useState } from "react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

function NewsPortal() {
  const { openArticle, toggleBookmark, bookmarkedIds, openShare, togglePodcast } = useApp();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Overlays */}
      <NotificationsPanel />
      <BookmarksPanel />
      <ArticleModal />
      <AuthModal />
      <ShareMenu />
      <MarketModal />

      {/* Sticky nav */}
      <Navbar />

      {/* Live ticker */}
      <TickerBanner />

      {/* Hero */}
      <HeroSection />

      {/* Main content + sidebar */}
      <main style={{
        maxWidth: "1440px",
        margin: "0 auto",
        padding: isMobile ? "20px 16px" : isTablet ? "28px 24px" : "36px 32px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr" : "1fr 320px",
          gap: isTablet ? "32px" : "40px",
          alignItems: "start",
        }}>
          <ArticleGrid />
          <Sidebar />
        </div>

        {/* Opinion section */}
        <section style={{ marginTop: isMobile ? "40px" : "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: isMobile ? "20px" : "28px" }}>
            <div style={{ width: "3px", height: "18px", background: "#1a56db", borderRadius: "2px" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a56db" }}>
              Opinion & Analysis
            </span>
            <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: "1px",
            background: "#e8e8e8",
          }}>
            {OPINION_PIECES.map((piece) => (
              <div
                key={piece.id}
                onClick={() => openArticle(piece)}
                style={{
                  background: "#fff",
                  padding: isMobile ? "20px" : "28px",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                className="group hover:bg-[#fafbff]"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #1a56db22, #1a56db44)",
                    border: "1px solid #1a56db22",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: 800, color: "#1a56db", flexShrink: 0,
                  }}>
                    {piece.authorInitials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#111" }}>{piece.author}</p>
                    <p style={{ fontSize: "10px", color: "#888", letterSpacing: "0.04em" }}>{piece.authorRole}</p>
                  </div>
                  {/* Bookmark opinion */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(piece.id); }}
                    style={{
                      marginLeft: "auto", background: "none", border: "none", cursor: "pointer",
                      color: bookmarkedIds.has(piece.id) ? "#1a56db" : "#ddd", padding: "4px",
                    }}
                    title="Save article"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarkedIds.has(piece.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </button>
                </div>

                <div style={{ width: "32px", height: "2px", background: "#1a56db", borderRadius: "2px", marginBottom: "14px" }} />

                <h3 style={{
                  fontFamily: "Georgia, serif", fontSize: isMobile ? "15px" : "17px", fontWeight: 700,
                  lineHeight: 1.4, color: "#0a0a0a", marginBottom: "12px", letterSpacing: "-0.01em",
                }}
                  className="group-hover:text-[#1a56db] transition-colors"
                >
                  {piece.title}
                </h3>
                <p style={{ fontSize: "13px", lineHeight: 1.65, color: "#555", marginBottom: "16px" }}>
                  {piece.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "10px", color: "#bbb", letterSpacing: "0.04em" }}>{piece.time} · {piece.readTime}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); openShare(piece); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ddd", padding: "4px" }}
                    className="hover:text-[#1a56db] transition-colors"
                    title="Share"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Podcast banner */}
        <section style={{
          marginTop: isMobile ? "36px" : "52px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
          borderRadius: "4px",
          padding: isMobile ? "24px 20px" : "36px 40px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: isMobile ? "20px" : "32px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", right: "120px", top: "50%", transform: "translateY(-50%)",
            width: "200px", height: "200px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(26,86,219,0.15) 0%, transparent 70%)",
          }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%", background: "#d4183d",
                animation: "pulse-dot 1.5s ease-in-out infinite",
              }} />
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b9cf5" }}>
                The Chronicle Podcast
              </span>
            </div>
            <h3 style={{
              fontFamily: "Georgia, serif",
              fontSize: isMobile ? "18px" : "22px",
              fontWeight: 700,
              color: "#fff", marginBottom: "8px", letterSpacing: "-0.02em",
            }}>
              The Week That Changed Everything: Geneva and After
            </h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", maxWidth: "500px" }}>
              Our senior correspondents break down the climate accord's fine print and what it means for global politics.
            </p>
          </div>
          <div style={{
            display: "flex",
            gap: "12px",
            flexShrink: 0,
            width: isMobile ? "100%" : "auto",
            flexDirection: isMobile ? "column" : "row",
          }}>
            <button
              onClick={togglePodcast}
              style={{
                padding: "12px 28px", background: "#1a56db", color: "#fff",
                fontSize: "12px", fontWeight: 700, letterSpacing: "0.07em",
                textTransform: "uppercase", borderRadius: "2px", border: "none", cursor: "pointer",
                transition: "opacity 0.15s",
                width: isMobile ? "100%" : "auto",
              }}
              className="hover:opacity-85"
            >
              ▶ Listen Now
            </button>
            <button
              style={{
                padding: "12px 24px", background: "transparent", color: "#aaa",
                fontSize: "12px", fontWeight: 600, letterSpacing: "0.07em",
                textTransform: "uppercase", borderRadius: "2px",
                border: "1px solid #333", cursor: "pointer", transition: "all 0.15s",
                width: isMobile ? "100%" : "auto",
              }}
              className="hover:border-[#555] hover:text-white"
            >
              All Episodes
            </button>
          </div>

          <style>{`
            @keyframes pulse-dot {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.4; transform: scale(0.8); }
            }
          `}</style>
        </section>
      </main>

      <Footer />

      {/* Podcast mini player — fixed at bottom */}
      <MiniPlayer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NewsPortal />
    </AppProvider>
  );
}
