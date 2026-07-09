"use client";

import { useEffect, useState } from "react";
import { X, Bookmark, Share2, Clock, Eye, ArrowLeft, Twitter, Linkedin, Facebook } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ALL_ARTICLES } from "../data/articles";

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

export function ArticleModal() {
  const { currentArticle, closeArticle, toggleBookmark, bookmarkedIds, openShare, openArticle } = useApp();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeArticle(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeArticle]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (currentArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [currentArticle]);

  if (!currentArticle) return null;

  const isBookmarked = bookmarkedIds.has(currentArticle.id);
  const related = ALL_ARTICLES.filter(
    (a) => a.id !== currentArticle.id && (a.category === currentArticle.category || a.section === currentArticle.section)
  ).slice(0, 3);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        overflowY: "auto",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) closeArticle(); }}
    >
      <div
        style={{
          background: "#fff", width: "100%",
          maxWidth: isMobile ? "100%" : "780px",
          minHeight: "100vh", margin: "0 auto",
          display: "flex", flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div
          style={{
            position: "sticky", top: 0, zIndex: 10,
            background: "#fff", borderBottom: "1px solid #f0f0f0",
            padding: isMobile ? "10px 16px" : "14px 24px",
            display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px",
          }}
        >
          <button
            onClick={closeArticle}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", color: "#555", fontWeight: 600,
              background: "none", border: "none", cursor: "pointer", padding: "4px 0",
            }}
            className="hover:text-[#1a56db] transition-colors"
          >
            <ArrowLeft size={16} /> {!isMobile && "Back"}
          </button>
          <div style={{ flex: 1 }} />
          {!isMobile && (
            <button
              onClick={() => toggleBookmark(currentArticle.id)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontWeight: 600,
                background: isBookmarked ? "#eff6ff" : "transparent",
                color: isBookmarked ? "#1a56db" : "#555",
                border: isBookmarked ? "1px solid #bfdbfe" : "1px solid #e5e7eb",
                padding: "6px 14px", borderRadius: "2px", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <Bookmark size={13} fill={isBookmarked ? "#1a56db" : "none"} />
              {isBookmarked ? "Saved" : "Save"}
            </button>
          )}
          {!isMobile && (
            <button
              onClick={() => openShare(currentArticle)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontWeight: 600,
                background: "transparent", color: "#555",
                border: "1px solid #e5e7eb",
                padding: "6px 14px", borderRadius: "2px", cursor: "pointer",
                transition: "all 0.15s",
              }}
              className="hover:border-[#1a56db] hover:text-[#1a56db]"
            >
              <Share2 size={13} /> Share
            </button>
          )}
          <button
            onClick={closeArticle}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "#f5f5f5", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#555",
            }}
            className="hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Hero image */}
        <div style={{
          position: "relative",
          height: isMobile ? "220px" : "380px",
          overflow: "hidden",
        }}>
          <img
            src={currentArticle.image}
            alt={currentArticle.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)" }} />
          <div
            style={{
              position: "absolute", bottom: isMobile ? "14px" : "20px", left: isMobile ? "16px" : "24px",
              background: currentArticle.categoryColor, color: "#fff",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "5px 11px", borderRadius: "2px",
            }}
          >
            {currentArticle.category}
          </div>
        </div>

        {/* Article body */}
        <div style={{ padding: isMobile ? "24px 16px 32px" : "36px 48px 48px" }}>
          {/* Meta */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            marginBottom: "16px", flexWrap: "wrap",
          }}>
            {currentArticle.tag && (
              <span
                style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "#d4183d",
                  background: "#fef2f2", padding: "3px 8px", borderRadius: "2px",
                }}
              >
                ● {currentArticle.tag}
              </span>
            )}
            <span style={{ fontSize: "11px", color: "#aaa" }}>·</span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#999" }}>
              <Clock size={11} />
              <span style={{ fontSize: "11px" }}>{currentArticle.time}</span>
            </div>
            <span style={{ fontSize: "11px", color: "#aaa" }}>·</span>
            <span style={{ fontSize: "11px", color: "#999" }}>{currentArticle.readTime}</span>
            <span style={{ fontSize: "11px", color: "#aaa" }}>·</span>
            <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "#bbb" }}>
              <Eye size={11} />
              <span style={{ fontSize: "11px" }}>{currentArticle.views}</span>
            </div>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: isMobile ? "22px" : "30px",
              fontWeight: 700, lineHeight: 1.3,
              color: "#0a0a0a", marginBottom: "16px", letterSpacing: "-0.02em",
            }}
          >
            {currentArticle.title}
          </h1>

          {/* Excerpt */}
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              lineHeight: 1.65, color: "#444",
              fontStyle: "italic", marginBottom: "24px",
              borderLeft: "3px solid #1a56db", paddingLeft: "16px",
            }}
          >
            {currentArticle.excerpt}
          </p>

          {/* Author */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "12px", marginBottom: "32px", paddingBottom: "24px",
            borderBottom: "1px solid #f0f0f0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${currentArticle.categoryColor}22, ${currentArticle.categoryColor}55)`,
                  border: `2px solid ${currentArticle.categoryColor}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 800, color: currentArticle.categoryColor,
                }}
              >
                {currentArticle.authorInitials}
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>{currentArticle.author}</p>
                <p style={{ fontSize: "11px", color: "#888" }}>{currentArticle.authorRole} · The Chronicle</p>
              </div>
            </div>
            <div style={{
              marginLeft: isMobile ? "0" : "auto",
              display: "flex", gap: "8px",
            }}>
              {[Twitter, Linkedin, Facebook].map((Icon, i) => (
                <button
                  key={i}
                  style={{
                    width: "30px", height: "30px", borderRadius: "50%",
                    border: "1px solid #e5e7eb", background: "transparent",
                    color: "#888", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  className="hover:border-[#1a56db] hover:text-[#1a56db]"
                >
                  <Icon size={13} />
                </button>
              ))}
            </div>
          </div>

          {/* Mobile action bar */}
          {isMobile && (
            <div style={{
              display: "flex", gap: "8px", marginBottom: "24px",
            }}>
              <button
                onClick={() => toggleBookmark(currentArticle.id)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  fontSize: "12px", fontWeight: 600,
                  padding: "10px", borderRadius: "3px", cursor: "pointer",
                  background: isBookmarked ? "#1a56db" : "transparent",
                  color: isBookmarked ? "#fff" : "#555",
                  border: isBookmarked ? "none" : "1px solid #e0e0e0",
                }}
              >
                <Bookmark size={14} fill={isBookmarked ? "#fff" : "none"} />
                {isBookmarked ? "Saved" : "Save"}
              </button>
              <button
                onClick={() => openShare(currentArticle)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  fontSize: "12px", fontWeight: 600,
                  padding: "10px", borderRadius: "3px", cursor: "pointer",
                  background: "#0a0a0a", color: "#fff", border: "none",
                }}
              >
                <Share2 size={14} /> Share
              </button>
            </div>
          )}

          {/* Body paragraphs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {currentArticle.content.map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: isMobile ? "15px" : "17px",
                  lineHeight: 1.8, color: "#1a1a1a",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "36px", paddingTop: "24px", borderTop: "1px solid #f0f0f0" }}>
            {[currentArticle.category, currentArticle.section, "Analysis", "In-depth"].map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em",
                  padding: "5px 12px", borderRadius: "2px",
                  background: "#f5f5f5", color: "#555", cursor: "pointer",
                }}
                className="hover:bg-blue-50 hover:text-[#1a56db] transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Share row */}
          <div
            style={{
              marginTop: "28px",
              padding: isMobile ? "16px" : "20px 24px",
              background: "#fafafa", borderRadius: "4px",
              border: "1px solid #f0f0f0",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
              gap: isMobile ? "12px" : "0",
            }}
          >
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>Found this article useful?</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => toggleBookmark(currentArticle.id)}
                style={{
                  fontSize: "12px", fontWeight: 600,
                  padding: "8px 16px", borderRadius: "2px", cursor: "pointer",
                  background: isBookmarked ? "#1a56db" : "transparent",
                  color: isBookmarked ? "#fff" : "#333",
                  border: isBookmarked ? "none" : "1px solid #ddd",
                  transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: "6px",
                  flex: isMobile ? 1 : undefined,
                  justifyContent: "center",
                }}
              >
                <Bookmark size={12} fill={isBookmarked ? "#fff" : "none"} />
                {isBookmarked ? "Saved" : "Save Article"}
              </button>
              <button
                onClick={() => openShare(currentArticle)}
                style={{
                  fontSize: "12px", fontWeight: 600,
                  padding: "8px 16px", borderRadius: "2px", cursor: "pointer",
                  background: "#0a0a0a", color: "#fff", border: "none",
                  display: "flex", alignItems: "center", gap: "6px",
                  transition: "opacity 0.15s",
                  flex: isMobile ? 1 : undefined,
                  justifyContent: "center",
                }}
                className="hover:opacity-80"
              >
                <Share2 size={12} /> Share
              </button>
            </div>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "3px", height: "16px", background: "#1a56db", borderRadius: "2px" }} />
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#333" }}>
                  Related Stories
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {related.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => openArticle(article)}
                    style={{
                      display: "flex", gap: isMobile ? "12px" : "16px",
                      padding: "16px 0",
                      borderBottom: "1px solid #f5f5f5", cursor: "pointer",
                    }}
                    className="group"
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      style={{
                        width: isMobile ? "72px" : "90px",
                        height: isMobile ? "56px" : "68px",
                        objectFit: "cover",
                        borderRadius: "3px", flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                          textTransform: "uppercase", color: article.categoryColor, marginBottom: "6px",
                        }}
                      >
                        {article.category}
                      </p>
                      <p
                        style={{
                          fontSize: isMobile ? "13px" : "14px",
                          fontWeight: 700, lineHeight: 1.4,
                          color: "#111", fontFamily: "Georgia, serif",
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                        }}
                        className="group-hover:text-[#1a56db] transition-colors"
                      >
                        {article.title}
                      </p>
                      <p style={{ fontSize: "11px", color: "#bbb", marginTop: "6px" }}>{article.time} · {article.readTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
