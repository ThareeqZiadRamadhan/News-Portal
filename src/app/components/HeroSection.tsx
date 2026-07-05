import { useState, useEffect } from "react";
import { Clock, Share2, Bookmark, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ALL_ARTICLES } from "../data/articles";

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

export function HeroSection() {
  const { openArticle, toggleBookmark, bookmarkedIds, openShare, setActiveSection } = useApp();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const heroArticle = ALL_ARTICLES[0];
  const secondaryArticles = [ALL_ARTICLES[1], ALL_ARTICLES[3]];

  return (
    <section style={{
      maxWidth: "1440px",
      margin: "0 auto",
      padding: isMobile ? "20px 16px 0" : isTablet ? "28px 24px 0" : "32px 32px 0",
    }}>
      {/* Section label */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: isMobile ? "16px" : "24px" }}>
        <div style={{ width: "3px", height: "18px", background: "#1a56db", borderRadius: "2px" }} />
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a56db" }}>
          Top Stories
        </span>
        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
        <button
          onClick={() => setActiveSection("World")}
          style={{
            fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", color: "#555",
            display: "flex", alignItems: "center", gap: "4px",
            background: "none", border: "none", cursor: "pointer",
          }}
          className="hover:text-[#1a56db] transition-colors"
        >
          See all <ArrowRight size={12} />
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 340px",
        gap: "2px",
      }}>
        {/* Hero article */}
        <div style={{ position: "relative", overflow: "hidden", cursor: "pointer" }} className="group">
          <div style={{
            position: "relative",
            height: isMobile ? "320px" : isTablet ? "420px" : "520px",
            overflow: "hidden",
          }}>
            <img
              src={heroArticle.image}
              alt={heroArticle.title}
              onClick={() => openArticle(heroArticle)}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
              className="group-hover:scale-105"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.05) 100%)" }} />

            {/* Breaking badge */}
            <div style={{
              position: "absolute", top: isMobile ? "14px" : "20px", left: isMobile ? "14px" : "20px",
              background: "#d4183d", color: "#fff",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "5px 10px", borderRadius: "2px",
            }}>
              ● Breaking News
            </div>

            {/* Action buttons */}
            <div style={{
              position: "absolute",
              top: isMobile ? "14px" : "20px",
              right: isMobile ? "14px" : "20px",
              display: "flex", gap: "8px",
            }}>
              <button
                onClick={(e) => { e.stopPropagation(); openShare(heroArticle); }}
                style={{
                  background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                  width: "34px", height: "34px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}
                className="hover:bg-white/30 transition-colors"
                title="Share"
              >
                <Share2 size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleBookmark(heroArticle.id); }}
                style={{
                  background: bookmarkedIds.has(heroArticle.id) ? "rgba(26,86,219,0.8)" : "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                  width: "34px", height: "34px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  transition: "background 0.2s",
                }}
                title={bookmarkedIds.has(heroArticle.id) ? "Unsave" : "Save"}
              >
                <Bookmark size={14} fill={bookmarkedIds.has(heroArticle.id) ? "#fff" : "none"} />
              </button>
            </div>

            {/* Content overlay */}
            <div
              onClick={() => openArticle(heroArticle)}
              style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                padding: isMobile ? "20px" : "28px",
              }}
            >
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b9cf5", marginBottom: isMobile ? "6px" : "10px" }}>
                {heroArticle.category}
              </p>
              <h1 style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: isMobile ? "20px" : isTablet ? "24px" : "28px",
                fontWeight: 700, lineHeight: 1.25,
                color: "#fff", marginBottom: "12px", letterSpacing: "-0.01em",
              }}>
                {heroArticle.title}
              </h1>
              {!isMobile && (
                <p style={{
                  fontSize: "14px", lineHeight: 1.6, color: "rgba(255,255,255,0.75)",
                  marginBottom: "16px",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                }}>
                  {heroArticle.excerpt}
                </p>
              )}
              <div style={{
                display: "flex", alignItems: "center", gap: isMobile ? "10px" : "16px",
                flexWrap: "wrap",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #1a56db, #0e3a8c)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", color: "#fff", fontWeight: 700,
                  }}>
                    {heroArticle.authorInitials}
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>{heroArticle.author}</p>
                    {!isMobile && (
                      <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)" }}>{heroArticle.authorRole}</p>
                    )}
                  </div>
                </div>
                <div style={{ height: "16px", width: "1px", background: "rgba(255,255,255,0.25)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.6)" }}>
                  <Clock size={12} />
                  <span style={{ fontSize: "11px" }}>{heroArticle.time}</span>
                </div>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{heroArticle.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary articles stack */}
        <div style={{
          display: isMobile ? "grid" : "flex",
          gridTemplateColumns: isMobile ? "1fr 1fr" : undefined,
          flexDirection: isMobile ? undefined : "column" as const,
          gap: "2px",
        }}>
          {secondaryArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => openArticle(article)}
              style={{
                position: "relative",
                height: isMobile ? "200px" : isTablet ? "220px" : "259px",
                overflow: "hidden",
                cursor: "pointer",
              }}
              className="group"
            >
              <img
                src={article.image}
                alt={article.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                className="group-hover:scale-105"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: isMobile ? "14px" : "18px",
              }}>
                <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b9cf5", marginBottom: "6px" }}>
                  {article.category}
                </p>
                <h3 style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: 700, lineHeight: 1.3, color: "#fff", marginBottom: "8px",
                  display: "-webkit-box", WebkitLineClamp: isMobile ? 2 : 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                }}>
                  {article.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.55)" }}>
                  <Clock size={10} />
                  <span style={{ fontSize: "10px" }}>{article.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
