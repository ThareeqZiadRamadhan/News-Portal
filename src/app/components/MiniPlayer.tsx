import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Music } from "lucide-react";
import { useApp } from "../context/AppContext";

const EPISODES = [
  { title: "The Week That Changed Everything: Geneva and After", duration: "42:18", guest: "Alexandra Chen & Marcus Webb" },
  { title: "Inside the AI Revolution: What GPT-5 Really Means", duration: "38:54", guest: "Dr. Sarah Kim" },
  { title: "Markets at 7,000: Bubble or New Normal?", duration: "31:22", guest: "James Hartley" },
];

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

export function MiniPlayer() {
  const {
    podcastPlaying,
    podcastPaused,
    podcastProgress,
    podcastVolume,
    togglePodcast,
    setPodcastProgress,
    setPodcastVolume,
  } = useApp();

  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!podcastPlaying) return null;

  const episode = EPISODES[0];
  const isPlaying = podcastPlaying && !podcastPaused;
  const totalSecs = 42 * 60 + 18;
  const elapsed = Math.floor((podcastProgress / 100) * totalSecs);
  const remaining = totalSecs - elapsed;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 900,
        background: "#0a0a0a", color: "#fff",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
        borderTop: "1px solid #1a1a1a",
      }}
    >
      {/* Progress bar (clickable) */}
      <div
        style={{ height: "3px", background: "#222", cursor: "pointer", position: "relative" }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = ((e.clientX - rect.left) / rect.width) * 100;
          setPodcastProgress(Math.max(0, Math.min(100, pct)));
        }}
      >
        <div
          style={{
            height: "100%", background: "linear-gradient(90deg, #1a56db, #6b9cf5)",
            width: `${podcastProgress}%`, transition: "width 0.1s",
          }}
        />
        <div
          style={{
            position: "absolute", top: "50%", transform: "translate(-50%,-50%)",
            left: `${podcastProgress}%`,
            width: "10px", height: "10px", borderRadius: "50%",
            background: "#6b9cf5", boxShadow: "0 0 6px rgba(107,156,245,0.8)",
          }}
        />
      </div>

      {isMobile ? (
        /* Mobile layout: two rows */
        <div style={{ padding: "10px 16px" }}>
          {/* Row 1: Info + close */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "6px", flexShrink: 0,
              background: "linear-gradient(135deg, #1a56db, #0e3a8c)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Music size={14} style={{ color: "#fff" }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {episode.title}
              </p>
              <p style={{ fontSize: "10px", color: "#666" }}>{fmt(elapsed)} / {episode.duration}</p>
            </div>
            <button
              onClick={togglePodcast}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#555", padding: "4px", display: "flex",
              }}
              className="hover:text-white transition-colors"
              title="Close player"
            >
              <X size={18} />
            </button>
          </div>

          {/* Row 2: Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <button
              onClick={() => setPodcastProgress(Math.max(0, podcastProgress - 2))}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: "8px", display: "flex" }}
              className="hover:text-white transition-colors"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={togglePodcast}
              style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "#1a56db", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", transition: "opacity 0.15s",
                boxShadow: "0 0 12px rgba(26,86,219,0.4)",
              }}
              className="hover:opacity-85"
            >
              {isPlaying ? <Pause size={18} fill="#fff" /> : <Play size={18} fill="#fff" />}
            </button>

            <button
              onClick={() => setPodcastProgress(Math.min(100, podcastProgress + 2))}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: "8px", display: "flex" }}
              className="hover:text-white transition-colors"
            >
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* Desktop layout */
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "12px 32px", display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Icon */}
          <div style={{
            width: "44px", height: "44px", borderRadius: "6px", flexShrink: 0,
            background: "linear-gradient(135deg, #1a56db, #0e3a8c)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Music size={18} style={{ color: "#fff" }} />
          </div>

          {/* Info */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b9cf5", marginBottom: "2px" }}>
              The Chronicle Podcast
            </p>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {episode.title}
            </p>
            <p style={{ fontSize: "10px", color: "#666" }}>{episode.guest}</p>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setPodcastProgress(Math.max(0, podcastProgress - 2))}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: "8px", display: "flex" }}
              className="hover:text-white transition-colors"
              title="Skip back 30s"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={togglePodcast}
              style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "#1a56db", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", transition: "opacity 0.15s",
                boxShadow: "0 0 12px rgba(26,86,219,0.4)",
              }}
              className="hover:opacity-85"
            >
              {isPlaying ? <Pause size={18} fill="#fff" /> : <Play size={18} fill="#fff" />}
            </button>

            <button
              onClick={() => setPodcastProgress(Math.min(100, podcastProgress + 2))}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: "8px", display: "flex" }}
              className="hover:text-white transition-colors"
              title="Skip forward 30s"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Time */}
          <div style={{ display: "flex", gap: "4px", fontSize: "11px", color: "#666", flexShrink: 0, minWidth: "90px", justifyContent: "center" }}>
            <span style={{ color: "#aaa" }}>{fmt(elapsed)}</span>
            <span>/</span>
            <span>{episode.duration}</span>
          </div>

          {/* Volume */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <button
              onClick={() => setPodcastVolume(podcastVolume > 0 ? 0 : 80)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#888", display: "flex" }}
              className="hover:text-white transition-colors"
            >
              {podcastVolume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range" min={0} max={100} value={podcastVolume}
              onChange={(e) => setPodcastVolume(Number(e.target.value))}
              style={{ width: "80px", accentColor: "#1a56db", cursor: "pointer" }}
            />
          </div>

          {/* Close */}
          <button
            onClick={togglePodcast}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#555", padding: "4px", display: "flex",
            }}
            className="hover:text-white transition-colors"
            title="Close player"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
