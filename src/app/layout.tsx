import type { Metadata } from "next";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "Modern News Portal Design",
  description:
    "Stay informed with a sleek news portal featuring breaking news, trending topics, and a clean, modern layout designed for an engaging reading experience.",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
