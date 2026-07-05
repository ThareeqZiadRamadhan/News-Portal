import { useEffect, useState } from "react";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useApp } from "../context/AppContext";

const generateData = (base: number, up: boolean) =>
  Array.from({ length: 30 }, (_, i) => ({
    day: `Jul ${i + 1}`,
    value: +(base + (up ? 1 : -1) * Math.random() * base * 0.015 * i + (Math.random() - 0.5) * base * 0.02).toFixed(2),
  }));

const markets = [
  { name: "S&P 500", symbol: "SPX", value: "7,024.18", change: "+92.34", pct: "+1.32%", up: true, data: generateData(6900, true) },
  { name: "NASDAQ", symbol: "NDX", value: "19,847.22", change: "+175.21", pct: "+0.89%", up: true, data: generateData(19600, true) },
  { name: "DOW JONES", symbol: "DJIA", value: "43,812.65", change: "-61.43", pct: "-0.14%", up: false, data: generateData(43900, false) },
  { name: "Bitcoin", symbol: "BTC/USD", value: "$107,443", change: "+3,342", pct: "+3.21%", up: true, data: generateData(103000, true) },
  { name: "EUR/USD", symbol: "EURUSD", value: "1.0832", change: "-0.0008", pct: "-0.07%", up: false, data: generateData(1.09, false) },
  { name: "Gold", symbol: "XAU/USD", value: "$2,741", change: "+11.80", pct: "+0.43%", up: true, data: generateData(2700, true) },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", padding: "8px 12px", borderRadius: "4px", fontSize: "12px" }}>
      <p style={{ color: "#888", marginBottom: "2px" }}>{label}</p>
      <p style={{ fontWeight: 700 }}>{payload[0].value.toLocaleString()}</p>
    </div>
  );
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

export function MarketModal() {
  const { marketOpen, closeMarket } = useApp();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMarket(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMarket]);

  // Lock body scroll
  useEffect(() => {
    if (marketOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [marketOpen]);

  if (!marketOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: isMobile ? "0" : "20px",
        overflowY: "auto",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) closeMarket(); }}
    >
      <div
        style={{
          background: "#0d0d0d",
          borderRadius: isMobile ? 0 : "6px",
          width: "100%",
          maxWidth: isMobile ? "100%" : "900px",
          minHeight: isMobile ? "100vh" : undefined,
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          border: isMobile ? "none" : "1px solid #1a1a1a",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: isMobile ? "18px 16px" : "24px 28px",
          borderBottom: "1px solid #1a1a1a",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b9cf5", marginBottom: "4px" }}>
              Live Markets · 15-min delay
            </p>
            <p style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: 700, color: "#fff" }}>Market Overview</p>
          </div>
          <button
            onClick={closeMarket}
            style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "#1a1a1a", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#888",
            }}
            className="hover:bg-[#2a2a2a] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Market grid */}
        <div style={{
          padding: isMobile ? "16px" : "24px 28px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: isMobile ? "12px" : "16px",
        }}>
          {markets.map((m) => (
            <div
              key={m.name}
              style={{
                background: "#111", borderRadius: "4px",
                padding: isMobile ? "14px 16px" : "18px 20px",
                border: "1px solid #1e1e1e",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <p style={{ fontSize: "10px", color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>{m.symbol}</p>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#888" }}>{m.name}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: 700, color: "#fff" }}>{m.value}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                    {m.up ? <TrendingUp size={12} style={{ color: "#22c55e" }} /> : <TrendingDown size={12} style={{ color: "#ef4444" }} />}
                    <span style={{ fontSize: "12px", fontWeight: 600, color: m.up ? "#22c55e" : "#ef4444" }}>{m.pct}</span>
                  </div>
                </div>
              </div>

              {/* Mini chart */}
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={m.data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={m.up ? "#22c55e" : "#ef4444"}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <span style={{ fontSize: "10px", color: "#444" }}>30-day</span>
                <span style={{ fontSize: "10px", color: m.up ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                  {m.up ? "+" : ""}{m.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Large chart */}
        <div style={{ padding: isMobile ? "0 16px 16px" : "0 28px 28px" }}>
          <div style={{
            background: "#111", borderRadius: "4px",
            padding: isMobile ? "16px" : "20px",
            border: "1px solid #1e1e1e",
          }}>
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              gap: isMobile ? "12px" : "0",
            }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>S&P 500 — 30 Day Performance</p>
              <div style={{
                display: "flex", gap: "6px",
                overflowX: isMobile ? "auto" : undefined,
              }}>
                {["1D", "1W", "1M", "3M", "1Y"].map((period, i) => (
                  <button
                    key={period}
                    style={{
                      fontSize: "11px", fontWeight: 600,
                      padding: "4px 10px", borderRadius: "2px",
                      background: i === 2 ? "#1a56db" : "transparent",
                      color: i === 2 ? "#fff" : "#555",
                      border: i === 2 ? "none" : "1px solid #222",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={isMobile ? 140 : 180}>
              <LineChart data={markets[0].data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#444" }} tickLine={false} axisLine={false} interval={isMobile ? 6 : 4} />
                <YAxis tick={{ fontSize: 10, fill: "#444" }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#1a56db" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
