import { useEffect, useRef, useState } from "react";
import { X, Bookmark, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";

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

export function BookmarksPanel() {
  const { bookmarksOpen, toggleBookmarks, getBookmarkedArticles, openArticle, toggleBookmark } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);
  const saved = getBookmarkedArticles();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bookmarksOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        toggleBookmarks();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bookmarksOpen, toggleBookmarks]);

  return (
    <>
      {bookmarksOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 400,
          background: isMobile ? "rgba(0,0,0,0.3)" : "transparent",
        }} />
      )}

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
          transform: bookmarksOpen
            ? "translateY(0)"
            : isMobile ? "translateY(100%)" : "translateY(-8px)",
          opacity: bookmarksOpen ? 1 : 0,
          pointerEvents: bookmarksOpen ? "all" : "none",
          transition: "transform 0.2s ease, opacity 0.2s ease",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Bookmark size={15} style={{ color: "#333" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#111" }}>Saved Articles</span>
            <span style={{ fontSize: "11px", color: "#aaa" }}>({saved.length})</span>
          </div>
          <button
            onClick={toggleBookmarks}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", display: "flex" }}
            className="hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {saved.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <Bookmark size={32} style={{ color: "#e0e0e0", margin: "0 auto 12px" }} />
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "6px" }}>No saved articles yet</p>
              <p style={{ fontSize: "12px", color: "#aaa", lineHeight: 1.5 }}>
                Click the bookmark icon on any article to save it here.
              </p>
            </div>
          ) : (
            saved.map((article, i) => (
              <div
                key={article.id}
                style={{
                  display: "flex", gap: "12px", padding: "14px 20px",
                  borderBottom: i < saved.length - 1 ? "1px solid #f5f5f5" : "none",
                  alignItems: "flex-start",
                }}
                className="group"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  onClick={() => { openArticle(article); toggleBookmarks(); }}
                  style={{
                    width: "72px", height: "54px", objectFit: "cover",
                    borderRadius: "3px", flexShrink: 0, cursor: "pointer",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em",
                      textTransform: "uppercase", color: article.categoryColor, marginBottom: "4px",
                    }}
                  >
                    {article.category}
                  </p>
                  <p
                    onClick={() => { openArticle(article); toggleBookmarks(); }}
                    style={{
                      fontSize: "12px", fontWeight: 700, lineHeight: 1.4, color: "#111",
                      cursor: "pointer", fontFamily: "Georgia, serif",
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                    }}
                    className="hover:text-[#1a56db] transition-colors"
                  >
                    {article.title}
                  </p>
                  <p style={{ fontSize: "10px", color: "#bbb", marginTop: "4px" }}>{article.readTime}</p>
                </div>
                <button
                  onClick={() => toggleBookmark(article.id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#ddd", padding: "2px", flexShrink: 0,
                    display: "flex", alignItems: "center",
                  }}
                  className="hover:text-red-400 transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
