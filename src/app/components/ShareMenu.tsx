"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Twitter, Linkedin, Facebook, Mail, Link } from "lucide-react";
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

export function ShareMenu() {
  const { shareArticle, closeShare, copyShareLink } = useApp();
  const [copied, setCopied] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!shareArticle) setCopied(false);
  }, [shareArticle]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeShare(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeShare]);

  if (!shareArticle) return null;

  const url = `https://thechronicle.com/article/${shareArticle.id}`;
  const text = encodeURIComponent(shareArticle.title);
  const encodedUrl = encodeURIComponent(url);

  const handleCopy = () => {
    copyShareLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOptions = [
    {
      icon: Twitter,
      label: "Share on X",
      color: "#000",
      bg: "#f0f0f0",
      action: () => window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, "_blank"),
    },
    {
      icon: Linkedin,
      label: "Share on LinkedIn",
      color: "#0a66c2",
      bg: "#e8f0fb",
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank"),
    },
    {
      icon: Facebook,
      label: "Share on Facebook",
      color: "#1877f2",
      bg: "#e7f0fd",
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank"),
    },
    {
      icon: Mail,
      label: "Share via Email",
      color: "#555",
      bg: "#f5f5f5",
      action: () => {
        window.location.href = `mailto:?subject=${text}&body=I thought you'd find this interesting: ${url}`;
      },
    },
  ];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1200,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? "0" : "20px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) closeShare(); }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: isMobile ? "12px 12px 0 0" : "6px",
          width: "100%",
          maxWidth: isMobile ? "100%" : "400px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "24px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#111" }}>Share this article</p>
          <button
            onClick={closeShare}
            style={{
              width: "30px", height: "30px", borderRadius: "50%", background: "#f5f5f5",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
            className="hover:bg-gray-200 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Article preview */}
        <div style={{ margin: "16px 24px", display: "flex", gap: "12px", background: "#fafafa", padding: "12px", borderRadius: "4px", border: "1px solid #f0f0f0" }}>
          <img
            src={shareArticle.image}
            alt={shareArticle.title}
            style={{ width: "64px", height: "50px", objectFit: "cover", borderRadius: "3px", flexShrink: 0 }}
          />
          <div>
            <p
              style={{
                fontSize: "12px", fontWeight: 700, lineHeight: 1.4, color: "#111",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                fontFamily: "Georgia, serif",
              }}
            >
              {shareArticle.title}
            </p>
            <p style={{ fontSize: "10px", color: "#aaa", marginTop: "4px" }}>The Chronicle · {shareArticle.time}</p>
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {shareOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={opt.action}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "4px",
                background: opt.bg, border: "none", cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              className="hover:opacity-80"
            >
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}>
                <opt.icon size={15} style={{ color: opt.color }} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Copy link */}
        <div style={{ padding: "16px 24px 24px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 12px", background: "#f5f5f5", borderRadius: "3px",
              border: "1px solid #e5e5e5", overflow: "hidden",
            }}>
              <Link size={13} style={{ color: "#aaa", flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: "#777", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {url}
              </span>
            </div>
            <button
              onClick={handleCopy}
              style={{
                padding: "10px 16px", borderRadius: "3px", border: "none", cursor: "pointer",
                background: copied ? "#22c55e" : "#0a0a0a",
                color: "#fff", fontSize: "12px", fontWeight: 700,
                display: "flex", alignItems: "center", gap: "6px",
                transition: "background 0.2s", flexShrink: 0,
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
