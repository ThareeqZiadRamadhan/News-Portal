"use client";

import { AppProvider } from "./context/AppContext";
import { NewsPortal } from "./NewsPortal";

export default function Page() {
  return (
    <AppProvider>
      <NewsPortal />
    </AppProvider>
  );
}
