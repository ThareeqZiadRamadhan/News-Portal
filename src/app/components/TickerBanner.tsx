"use client";

import { useEffect, useRef } from "react";

const tickers = [
  "BREAKING: Global leaders reach historic climate accord at Geneva summit",
  "Markets rally as Fed signals potential rate cut in Q3",
  "SpaceX launches first crewed mission to lunar orbit",
  "WHO declares end to regional health emergency in Southeast Asia",
  "Tech giants face new antitrust scrutiny from EU regulators",
  "Record heatwave sweeps across Southern Europe, states of emergency declared",
  "Nobel Peace Prize awarded to international disarmament coalition",
  "Major earthquake strikes Pacific Rim, tsunami warnings issued",
];

export function TickerBanner() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        background: "#0a0a0a",
        color: "#fff",
        height: "38px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Label */}
      <div
        style={{
          background: "#1a56db",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          whiteSpace: "nowrap",
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          ● Live
        </span>
      </div>

      {/* Scrolling text */}
      <div style={{ overflow: "hidden", flex: 1, position: "relative" }}>
        <div
          style={{
            display: "flex",
            animation: "ticker-scroll 60s linear infinite",
            whiteSpace: "nowrap",
          }}
        >
          {[...tickers, ...tickers].map((item, i) => (
            <span
              key={i}
              style={{ fontSize: "12px", letterSpacing: "0.02em", paddingRight: "60px", color: "#e0e0e0" }}
            >
              <span style={{ color: "#6b9cf5", marginRight: "10px" }}>◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
