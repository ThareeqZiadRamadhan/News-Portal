import { useState, useEffect } from "react";
import { Search, Menu, X, Bell, Bookmark, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";

const sections = ["World", "Politics", "Business", "Technology", "Science", "Culture", "Sports", "Opinion"];

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

export function Navbar() {
  const {
    searchOpen, setSearchOpen, searchQuery, setSearchQuery,
    activeSection, setActiveSection,
    openAuth, toggleNotifications, toggleBookmarks,
    notifications, bookmarkedIds, mobileMenuOpen, setMobileMenuOpen,
  } = useApp();

  const [moreOpen, setMoreOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const bookmarkCount = bookmarkedIds.size;
  const isMobile = useMediaQuery("(max-width: 768px)");

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const mainSections = sections.slice(0, 6);
  const moreSections = sections.slice(6);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Top bar — hidden on mobile */}
      {!isMobile && (
        <div className="border-b border-gray-100">
          <div style={{
            maxWidth: "1440px", margin: "0 auto",
            padding: isMobile ? "0 16px" : "0 32px",
            height: "36px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <p style={{ fontSize: "11px", color: "#888", letterSpacing: "0.02em" }}>{dateStr}</p>
            <div className="flex items-center gap-5">
              <button
                onClick={() => openAuth("subscribe")}
                style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1a56db" }}
                className="hover:opacity-70 transition-opacity"
              >
                Subscribe
              </button>
              <button
                onClick={() => openAuth("signin")}
                style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#111" }}
                className="hover:opacity-70 transition-opacity"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo row */}
      <div style={{
        maxWidth: "1440px", margin: "0 auto",
        padding: isMobile ? "10px 16px" : "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1 text-gray-700"
          style={{ marginRight: "8px" }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="flex-1 flex justify-center lg:justify-start">
          <button
            onClick={() => { setActiveSection("World"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex flex-col items-center lg:items-start"
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-8 bg-[#1a56db] rounded-sm" />
              <span style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: isMobile ? "24px" : "32px",
                fontWeight: 700, letterSpacing: "-0.03em", color: "#0a0a0a", lineHeight: 1,
              }}>
                The Chronicle
              </span>
            </div>
            {!isMobile && (
              <span style={{ fontSize: "9px", letterSpacing: "0.35em", color: "#888", textTransform: "uppercase", marginTop: "2px" }}>
                Established 1881 · Independent Journalism
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            style={{ color: searchOpen ? "#1a56db" : "#111" }}
            title="Search"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            style={{ color: "#111" }}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: "4px", right: "4px",
                width: "16px", height: "16px", borderRadius: "50%",
                background: "#d4183d", color: "#fff",
                fontSize: "9px", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Bookmarks */}
          <button
            onClick={toggleBookmarks}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            style={{ color: "#111" }}
            title="Saved articles"
          >
            <Bookmark size={18} />
            {bookmarkCount > 0 && (
              <span style={{
                position: "absolute", top: "4px", right: "4px",
                width: "16px", height: "16px", borderRadius: "50%",
                background: "#1a56db", color: "#fff",
                fontSize: "9px", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {bookmarkCount}
              </span>
            )}
          </button>

          <button
            onClick={() => openAuth("subscribe")}
            style={{
              background: "#0a0a0a", color: "#fff",
              fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase", padding: "8px 18px", borderRadius: "2px",
            }}
            className="hidden lg:block hover:bg-[#1a56db] transition-colors"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-gray-100 bg-white">
          <div style={{
            maxWidth: "1440px", margin: "0 auto",
            padding: isMobile ? "12px 16px" : "12px 32px",
          }}>
            <div className="relative max-w-2xl mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics, authors..."
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-sm outline-none focus:border-[#1a56db] transition-colors"
                style={{ fontSize: "14px", background: "#fafafa" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {searchQuery && (
              <p style={{ textAlign: "center", fontSize: "12px", color: "#888", marginTop: "8px" }}>
                Showing results for <strong>"{searchQuery}"</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu — full-screen slide-down */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 lg:hidden bg-white" style={{
          position: isMobile ? "fixed" : undefined,
          top: isMobile ? "60px" : undefined,
          left: 0, right: 0,
          bottom: isMobile ? 0 : undefined,
          zIndex: 45,
          overflowY: "auto",
          animation: "fadeInUp 0.2s ease-out",
        }}>
          <div style={{
            maxWidth: "1440px", margin: "0 auto",
            padding: isMobile ? "8px 16px 24px" : "8px 32px",
            display: "flex", flexDirection: "column",
          }}>
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => { setActiveSection(section); setMobileMenuOpen(false); }}
                style={{
                  fontSize: "15px", fontWeight: 600, textAlign: "left",
                  padding: "14px 0",
                  color: activeSection === section ? "#1a56db" : "#333",
                  background: "none", border: "none", cursor: "pointer",
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                {section}
              </button>
            ))}
            {/* Mobile sign-in buttons */}
            <div style={{
              marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px",
            }}>
              <button
                onClick={() => { openAuth("subscribe"); setMobileMenuOpen(false); }}
                style={{
                  background: "#1a56db", color: "#fff",
                  fontSize: "13px", fontWeight: 700,
                  padding: "14px", borderRadius: "3px",
                  border: "none", cursor: "pointer",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                }}
              >
                Subscribe Free
              </button>
              <button
                onClick={() => { openAuth("signin"); setMobileMenuOpen(false); }}
                style={{
                  background: "transparent", color: "#333",
                  fontSize: "13px", fontWeight: 600,
                  padding: "14px", borderRadius: "3px",
                  border: "1px solid #e0e0e0", cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nav sections */}
      <nav className="border-t border-gray-100 hidden lg:block">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex items-center overflow-x-auto">
            {mainSections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                style={{
                  fontSize: "12px", fontWeight: 600, letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: activeSection === section ? "#1a56db" : "#333",
                  padding: "12px 16px", whiteSpace: "nowrap",
                  borderBottom: activeSection === section ? "2px solid #1a56db" : "2px solid transparent",
                  transition: "all 0.15s", background: "none", border: "none",
                  cursor: "pointer",
                }}
                className="hover:text-[#1a56db]"
              >
                {section}
              </button>
            ))}

            {/* More dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  fontSize: "12px", fontWeight: 600, letterSpacing: "0.07em",
                  textTransform: "uppercase", color: "#555",
                  padding: "12px 16px", background: "none", border: "none",
                  cursor: "pointer", borderBottom: "2px solid transparent",
                }}
                className="hover:text-[#1a56db]"
              >
                More <ChevronDown size={12} style={{ transform: moreOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
              </button>
              {moreOpen && (
                <div style={{
                  position: "absolute", top: "100%", left: 0,
                  background: "#fff", border: "1px solid #f0f0f0",
                  borderRadius: "3px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  zIndex: 100, minWidth: "140px", overflow: "hidden",
                }}>
                  {moreSections.map((section) => (
                    <button
                      key={section}
                      onClick={() => { setActiveSection(section); setMoreOpen(false); }}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "10px 16px", fontSize: "12px", fontWeight: 600,
                        letterSpacing: "0.07em", textTransform: "uppercase",
                        color: activeSection === section ? "#1a56db" : "#333",
                        background: "none", border: "none", cursor: "pointer",
                        borderBottom: "1px solid #f8f8f8",
                      }}
                      className="hover:bg-blue-50 hover:text-[#1a56db]"
                    >
                      {section}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
