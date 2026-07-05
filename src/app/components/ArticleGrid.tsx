import { useState, useEffect } from "react";
import { Clock, ArrowRight, Eye, Bookmark } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Article } from "../data/articles";

const CATEGORIES = ["All", "World", "Politics", "Business", "Technology", "Science", "Environment", "Culture"];

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

function ArticleCard({ article, isMobile }: { article: Article; isMobile: boolean }) {
  const { openArticle, toggleBookmark, bookmarkedIds, openShare, setActiveCategory } = useApp();
  const isBookmarked = bookmarkedIds.has(article.id);

  return (
    <div
      style={{
        background: "#fff", borderRadius: "4px", overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        cursor: "pointer",
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      className="group hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
    >
      {/* Image */}
      <div style={{
        position: "relative",
        height: isMobile ? "auto" : "200px",
        width: isMobile ? "120px" : "auto",
        minHeight: isMobile ? "120px" : undefined,
        overflow: "hidden",
        flexShrink: 0,
      }}>
        <img
          src={article.image}
          alt={article.title}
          onClick={() => openArticle(article)}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
          className="group-hover:scale-105"
        />
        {/* Category pill */}
        {!isMobile && (
          <button
            onClick={(e) => { e.stopPropagation(); setActiveCategory(article.category); }}
            style={{
              position: "absolute", top: "12px", left: "12px",
              background: article.categoryColor, color: "#fff",
              fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "4px 9px", borderRadius: "2px",
              border: "none", cursor: "pointer",
            }}
            className="hover:opacity-80 transition-opacity"
          >
            {article.category}
          </button>
        )}

        {!isMobile && article.tag && (
          <div style={{
            position: "absolute", top: "12px", right: "44px",
            background: "rgba(255,255,255,0.92)", color: "#333",
            fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", padding: "4px 9px", borderRadius: "2px",
          }}>
            {article.tag}
          </div>
        )}

        {/* Bookmark button on card */}
        {!isMobile && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
            style={{
              position: "absolute", top: "10px", right: "10px",
              background: isBookmarked ? "#1a56db" : "rgba(255,255,255,0.85)",
              color: isBookmarked ? "#fff" : "#555",
              width: "28px", height: "28px", borderRadius: "50%",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s", backdropFilter: "blur(4px)",
            }}
            title={isBookmarked ? "Remove bookmark" : "Save article"}
          >
            <Bookmark size={12} fill={isBookmarked ? "#fff" : "none"} />
          </button>
        )}
      </div>

      {/* Content */}
      <div
        onClick={() => openArticle(article)}
        style={{
          padding: isMobile ? "14px" : "20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Mobile category pill inline */}
        {isMobile && (
          <span style={{
            fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: article.categoryColor,
            marginBottom: "6px",
          }}>
            {article.category}
          </span>
        )}
        <h3
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: isMobile ? "14px" : "16px", fontWeight: 700, lineHeight: 1.4,
            color: "#0a0a0a", marginBottom: isMobile ? "6px" : "10px",
            display: "-webkit-box", WebkitLineClamp: isMobile ? 2 : 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
          }}
          className="group-hover:text-[#1a56db] transition-colors"
        >
          {article.title}
        </h3>
        {!isMobile && (
          <p style={{
            fontSize: "13px", lineHeight: 1.65, color: "#555", marginBottom: "16px",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", flex: 1,
          }}>
            {article.excerpt}
          </p>
        )}

        {/* Footer */}
        <div style={{
          borderTop: isMobile ? "none" : "1px solid #f0f0f0",
          paddingTop: isMobile ? "0" : "14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: isMobile ? "auto" : undefined,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {!isMobile && (
              <div style={{
                width: "26px", height: "26px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${article.categoryColor}33, ${article.categoryColor}66)`,
                border: `1px solid ${article.categoryColor}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "9px", color: article.categoryColor, fontWeight: 800,
              }}>
                {article.authorInitials}
              </div>
            )}
            <div>
              {!isMobile && <p style={{ fontSize: "11px", fontWeight: 600, color: "#222" }}>{article.author}</p>}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "#999" }}>
                  <Clock size={9} />
                  <span style={{ fontSize: "10px" }}>{article.time}</span>
                </div>
                <span style={{ color: "#ddd", fontSize: "10px" }}>·</span>
                <span style={{ fontSize: "10px", color: "#999" }}>{article.readTime}</span>
              </div>
            </div>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "#bbb" }}>
              <Eye size={11} />
              <span style={{ fontSize: "10px", color: "#bbb" }}>{article.views}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ArticleGrid() {
  const { activeCategory, setActiveCategory, getFilteredArticles, displayedCount, loadMore, searchQuery } = useApp();
  const allFiltered = getFilteredArticles();
  const visible = allFiltered.slice(0, displayedCount);
  const hasMore = allFiltered.length > displayedCount;

  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  return (
    <div>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: isMobile ? "16px" : "24px" }}>
        <div style={{ width: "3px", height: "18px", background: "#0a0a0a", borderRadius: "2px" }} />
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0a0a0a" }}>
          {searchQuery ? `Search: "${searchQuery}"` : "Latest Stories"}
        </span>
        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
        <span style={{ fontSize: "11px", color: "#aaa" }}>{allFiltered.length} stories</span>
      </div>

      {/* Category filters — scrollable on mobile */}
      {!searchQuery && (
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: isMobile ? "16px" : "24px",
          overflowX: isMobile ? "auto" : undefined,
          WebkitOverflowScrolling: "touch" as const,
          scrollbarWidth: "none" as const,
          msOverflowStyle: "none" as const,
          paddingBottom: isMobile ? "4px" : undefined,
          flexWrap: isMobile ? "nowrap" : "wrap",
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em",
                padding: "6px 14px", borderRadius: "2px",
                border: activeCategory === cat ? "none" : "1px solid #e0e0e0",
                background: activeCategory === cat ? "#0a0a0a" : "transparent",
                color: activeCategory === cat ? "#fff" : "#555",
                cursor: "pointer", transition: "all 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              className={activeCategory !== cat ? "hover:border-[#1a56db] hover:text-[#1a56db]" : ""}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {visible.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "#555", marginBottom: "8px" }}>No articles found</p>
          <p style={{ fontSize: "13px", color: "#aaa" }}>Try a different search term or category.</p>
        </div>
      ) : (
        <div style={{
          display: isMobile ? "flex" : "grid",
          flexDirection: isMobile ? "column" : undefined,
          gridTemplateColumns: isMobile ? undefined : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: isMobile ? "12px" : "20px",
        }}>
          {visible.map((article) => (
            <ArticleCard key={article.id} article={article} isMobile={isMobile} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: isMobile ? "24px" : "36px" }}>
          <button
            onClick={loadMore}
            style={{
              border: "1px solid #ddd", color: "#333", fontSize: "12px",
              fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "12px 32px", borderRadius: "2px", cursor: "pointer",
              transition: "all 0.2s", background: "#fff",
              width: isMobile ? "100%" : "auto",
            }}
            className="hover:border-[#1a56db] hover:text-[#1a56db] hover:bg-blue-50"
          >
            Load More Stories ({allFiltered.length - displayedCount} remaining)
          </button>
        </div>
      )}

      {/* Hide scrollbar on mobile category filters */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
