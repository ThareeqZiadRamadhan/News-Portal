import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Article, ALL_ARTICLES, OPINION_PIECES } from "../data/articles";

export type AuthModalType = "signin" | "subscribe" | null;

interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
  category: string;
}

interface AppState {
  articles: Article[];
  activeCategory: string;
  activeSection: string;
  bookmarkedIds: Set<number>;
  searchQuery: string;
  searchOpen: boolean;
  currentArticle: Article | null;
  authModal: AuthModalType;
  notificationsOpen: boolean;
  bookmarksOpen: boolean;
  podcastPlaying: boolean;
  podcastPaused: boolean;
  podcastProgress: number;
  podcastVolume: number;
  displayedCount: number;
  newsletterSubmitted: boolean;
  activeEdition: string;
  shareArticle: Article | null;
  marketOpen: boolean;
  mobileMenuOpen: boolean;
  notifications: Notification[];
  authSuccess: boolean;
  authEmail: string;
}

interface AppActions {
  openArticle: (article: Article) => void;
  closeArticle: () => void;
  toggleBookmark: (id: number) => void;
  setActiveCategory: (cat: string) => void;
  setActiveSection: (section: string) => void;
  setSearchQuery: (q: string) => void;
  setSearchOpen: (open: boolean) => void;
  openAuth: (type: "signin" | "subscribe") => void;
  closeAuth: () => void;
  handleAuthSubmit: (email: string, password: string) => void;
  toggleNotifications: () => void;
  toggleBookmarks: () => void;
  markAllNotificationsRead: () => void;
  togglePodcast: () => void;
  setPodcastPaused: (paused: boolean) => void;
  setPodcastProgress: (progress: number) => void;
  setPodcastVolume: (volume: number) => void;
  loadMore: () => void;
  submitNewsletter: (email: string) => void;
  setActiveEdition: (edition: string) => void;
  openShare: (article: Article) => void;
  closeShare: () => void;
  copyShareLink: () => void;
  openMarket: () => void;
  closeMarket: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  getFilteredArticles: () => Article[];
  getBookmarkedArticles: () => Article[];
}

const AppContext = createContext<(AppState & AppActions) | null>(null);

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: "Breaking: Geneva Climate Accord signed by 140 nations", time: "2 min ago", read: false, category: "World" },
  { id: 2, title: "Markets: S&P 500 crosses 7,000 for the first time", time: "45 min ago", read: false, category: "Business" },
  { id: 3, title: "Science: CERN announces major particle discovery", time: "2 hours ago", read: false, category: "Science" },
  { id: 4, title: "Tech: IBM achieves fault-tolerant quantum computing", time: "5 hours ago", read: true, category: "Technology" },
  { id: 5, title: "Opinion: New essay by Robert Calloway on AI governance", time: "Yesterday", read: true, category: "Opinion" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategoryState] = useState("All");
  const [activeSection, setActiveSectionState] = useState("World");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQueryState] = useState("");
  const [searchOpen, setSearchOpenState] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [authModal, setAuthModal] = useState<AuthModalType>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [podcastPlaying, setPodcastPlayingState] = useState(false);
  const [podcastPaused, setPodcastPausedState] = useState(false);
  const [podcastProgress, setPodcastProgressState] = useState(0);
  const [podcastVolume, setPodcastVolumeState] = useState(80);
  const [displayedCount, setDisplayedCount] = useState(6);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [activeEdition, setActiveEditionState] = useState("The Americas");
  const [shareArticle, setShareArticle] = useState<Article | null>(null);
  const [marketOpen, setMarketOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpenState] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authEmail, setAuthEmailState] = useState("");

  // Advance podcast progress
  useEffect(() => {
    if (!podcastPlaying || podcastPaused) return;
    const interval = setInterval(() => {
      setPodcastProgressState((p) => {
        if (p >= 100) { setPodcastPlayingState(false); return 0; }
        return p + 0.05;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [podcastPlaying, podcastPaused]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = currentArticle || authModal || shareArticle || marketOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [currentArticle, authModal, shareArticle, marketOpen]);

  const openArticle = useCallback((article: Article) => {
    setCurrentArticle(article);
    setNotificationsOpen(false);
    setBookmarksOpen(false);
    setShareArticle(null);
  }, []);

  const closeArticle = useCallback(() => setCurrentArticle(null), []);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const setActiveCategory = useCallback((cat: string) => {
    setActiveCategoryState(cat);
    setDisplayedCount(6);
  }, []);

  const setActiveSection = useCallback((section: string) => {
    setActiveSectionState(section);
    setActiveCategoryState("All");
    setDisplayedCount(6);
    setSearchQueryState("");
  }, []);

  const setSearchQuery = useCallback((q: string) => setSearchQueryState(q), []);
  const setSearchOpen = useCallback((open: boolean) => {
    setSearchOpenState(open);
    if (!open) setSearchQueryState("");
  }, []);

  const openAuth = useCallback((type: "signin" | "subscribe") => {
    setAuthModal(type);
    setAuthSuccess(false);
  }, []);
  const closeAuth = useCallback(() => { setAuthModal(null); setAuthSuccess(false); }, []);

  const handleAuthSubmit = useCallback((email: string, _password: string) => {
    setAuthEmailState(email);
    setAuthSuccess(true);
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotificationsOpen((p) => !p);
    setBookmarksOpen(false);
  }, []);

  const toggleBookmarks = useCallback(() => {
    setBookmarksOpen((p) => !p);
    setNotificationsOpen(false);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const togglePodcast = useCallback(() => {
    if (!podcastPlaying) {
      setPodcastPlayingState(true);
      setPodcastPausedState(false);
    } else {
      setPodcastPausedState((p) => !p);
    }
  }, [podcastPlaying]);

  const setPodcastPaused = useCallback((paused: boolean) => setPodcastPausedState(paused), []);
  const setPodcastProgress = useCallback((p: number) => setPodcastProgressState(p), []);
  const setPodcastVolume = useCallback((v: number) => setPodcastVolumeState(v), []);

  const loadMore = useCallback(() => setDisplayedCount((p) => p + 6), []);

  const submitNewsletter = useCallback((_email: string) => setNewsletterSubmitted(true), []);

  const setActiveEdition = useCallback((edition: string) => setActiveEditionState(edition), []);

  const openShare = useCallback((article: Article) => setShareArticle(article), []);
  const closeShare = useCallback(() => setShareArticle(null), []);
  const copyShareLink = useCallback(() => {
    if (shareArticle) {
      navigator.clipboard.writeText(`https://thechronicle.com/article/${shareArticle.id}`).catch(() => {});
    }
  }, [shareArticle]);

  const openMarket = useCallback(() => setMarketOpen(true), []);
  const closeMarket = useCallback(() => setMarketOpen(false), []);
  const setMobileMenuOpen = useCallback((open: boolean) => setMobileMenuOpenState(open), []);

  const getFilteredArticles = useCallback((): Article[] => {
    let result = [...ALL_ARTICLES];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    } else if (activeCategory !== "All") {
      result = result.filter((a) => a.category === activeCategory);
    } else if (activeSection !== "World" && activeSection !== "") {
      const sectionMap: Record<string, string[]> = {
        Politics: ["Politics"],
        Business: ["Business"],
        Technology: ["Technology"],
        Science: ["Science", "Environment"],
        Culture: ["Culture"],
        Sports: [],
        Opinion: ["Opinion"],
      };
      const cats = sectionMap[activeSection];
      if (cats && cats.length > 0) {
        result = result.filter((a) => cats.includes(a.category) || cats.includes(a.section));
      }
    }
    return result;
  }, [searchQuery, activeCategory, activeSection]);

  const getBookmarkedArticles = useCallback((): Article[] => {
    return [...ALL_ARTICLES, ...OPINION_PIECES].filter((a) => bookmarkedIds.has(a.id));
  }, [bookmarkedIds]);

  const value: AppState & AppActions = {
    articles: ALL_ARTICLES,
    activeCategory,
    activeSection,
    bookmarkedIds,
    searchQuery,
    searchOpen,
    currentArticle,
    authModal,
    notificationsOpen,
    bookmarksOpen,
    podcastPlaying,
    podcastPaused,
    podcastProgress,
    podcastVolume,
    displayedCount,
    newsletterSubmitted,
    activeEdition,
    shareArticle,
    marketOpen,
    mobileMenuOpen,
    notifications,
    authSuccess,
    authEmail,
    openArticle,
    closeArticle,
    toggleBookmark,
    setActiveCategory,
    setActiveSection,
    setSearchQuery,
    setSearchOpen,
    openAuth,
    closeAuth,
    handleAuthSubmit,
    toggleNotifications,
    toggleBookmarks,
    markAllNotificationsRead,
    togglePodcast,
    setPodcastPaused,
    setPodcastProgress,
    setPodcastVolume,
    loadMore,
    submitNewsletter,
    setActiveEdition,
    openShare,
    closeShare,
    copyShareLink,
    openMarket,
    closeMarket,
    setMobileMenuOpen,
    getFilteredArticles,
    getBookmarkedArticles,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
