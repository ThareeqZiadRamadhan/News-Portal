import { useState, useEffect } from "react";
import { X, Eye, EyeOff, CheckCircle } from "lucide-react";
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

export function AuthModal() {
  const { authModal, closeAuth, handleAuthSubmit, authSuccess } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!authModal) { setEmail(""); setPassword(""); setErrors({}); setLoading(false); }
  }, [authModal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeAuth(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAuth]);

  if (!authModal) return null;

  const isSubscribe = authModal === "subscribe";

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Please enter a valid email address.";
    if (!password || password.length < 6) e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      handleAuthSubmit(email, password);
      setLoading(false);
    }, 1200);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: isMobile ? "0" : "20px",
        overflowY: "auto",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) closeAuth(); }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: isMobile ? 0 : "4px",
          width: "100%",
          maxWidth: isMobile ? "100%" : "440px",
          minHeight: isMobile ? "100vh" : undefined,
          overflow: "hidden",
          boxShadow: isMobile ? "none" : "0 24px 64px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: isMobile ? "20px 16px 0" : "28px 32px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{ width: "3px", height: "20px", background: "#1a56db", borderRadius: "2px" }} />
              <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#0a0a0a" }}>
                The Chronicle
              </span>
            </div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>
              {isSubscribe ? "Start your free subscription" : "Welcome back"}
            </p>
            <p style={{ fontSize: "13px", color: "#888" }}>
              {isSubscribe ? "Join 2.4 million readers worldwide." : "Sign in to your Chronicle account."}
            </p>
          </div>
          <button
            onClick={closeAuth}
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

        <div style={{ padding: isMobile ? "20px 16px 24px" : "24px 32px 32px" }}>
          {authSuccess ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%",
                background: "#f0fdf4", margin: "0 auto 16px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <CheckCircle size={28} style={{ color: "#22c55e" }} />
              </div>
              <p style={{ fontSize: "17px", fontWeight: 700, color: "#111", marginBottom: "8px" }}>
                {isSubscribe ? "You're all set!" : "Welcome back!"}
              </p>
              <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>
                {isSubscribe
                  ? "Your subscription is active. Enjoy unlimited access."
                  : "You've been signed in successfully."}
              </p>
              <button
                onClick={closeAuth}
                style={{
                  background: "#1a56db", color: "#fff",
                  fontSize: "13px", fontWeight: 700, padding: "12px 28px",
                  borderRadius: "2px", border: "none", cursor: "pointer", width: "100%",
                }}
                className="hover:opacity-90 transition-opacity"
              >
                Continue Reading
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#333", display: "block", marginBottom: "6px", letterSpacing: "0.04em" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                    placeholder="you@example.com"
                    style={{
                      width: "100%", padding: "11px 14px",
                      border: errors.email ? "1px solid #ef4444" : "1px solid #e0e0e0",
                      borderRadius: "3px", fontSize: "14px", outline: "none",
                      transition: "border-color 0.15s", boxSizing: "border-box",
                    }}
                    className="focus:border-[#1a56db]"
                  />
                  {errors.email && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{errors.email}</p>}
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#333", display: "block", marginBottom: "6px", letterSpacing: "0.04em" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                      placeholder={isSubscribe ? "Create a password (6+ chars)" : "Enter your password"}
                      style={{
                        width: "100%", padding: "11px 40px 11px 14px",
                        border: errors.password ? "1px solid #ef4444" : "1px solid #e0e0e0",
                        borderRadius: "3px", fontSize: "14px", outline: "none",
                        transition: "border-color 0.15s", boxSizing: "border-box",
                      }}
                      className="focus:border-[#1a56db]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{
                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#aaa",
                        display: "flex", alignItems: "center",
                      }}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{errors.password}</p>}
                </div>

                {!isSubscribe && (
                  <div style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      style={{ fontSize: "12px", color: "#1a56db", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? "#93c5fd" : "#1a56db",
                    color: "#fff", fontSize: "13px", fontWeight: 700,
                    padding: "13px", borderRadius: "3px", border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.15s", marginTop: "4px",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  }}
                >
                  {loading && (
                    <span style={{
                      width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff", borderRadius: "50%",
                      display: "inline-block", animation: "auth-spin 0.7s linear infinite",
                    }} />
                  )}
                  {loading ? "Please wait..." : isSubscribe ? "Create Account" : "Sign In"}
                </button>
              </div>

              <p style={{ fontSize: "12px", color: "#999", textAlign: "center", marginTop: "20px" }}>
                {isSubscribe ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    // handled by parent context
                  }}
                  style={{ color: "#1a56db", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}
                >
                  {isSubscribe ? "Sign in" : "Subscribe free"}
                </button>
              </p>

              {isSubscribe && (
                <p style={{ fontSize: "10px", color: "#bbb", textAlign: "center", marginTop: "12px", lineHeight: 1.5 }}>
                  By subscribing you agree to our Terms of Service and Privacy Policy. Cancel anytime.
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      <style>{`@keyframes auth-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
