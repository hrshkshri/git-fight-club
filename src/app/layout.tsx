import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://git-fight-club.vercel.app/"),
  title: {
    default: "Git Fight Club - The Ultimate GitHub Battle",
    template: "%s | Git Fight Club"
  },
  description: "A Battle of Commits — Who is the strongest dev? Compare your GitHub stats, battle your friends, and see who reigns supreme on the leaderboard.",
  keywords: [
    "GitHub",
    "developer battle",
    "git fight club",
    "commit stats",
    "coding game",
    "GitHub stats",
    "open source",
    "developer tools"
  ],
  authors: [{ name: "hrshkshri", url: "https://github.com/hrshkshri" }],
  creator: "hrshkshri",
  publisher: "hrshkshri",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Git Fight Club - The Ultimate GitHub Battle",
    description: "A Battle of Commits — Who is the strongest dev? Compare your GitHub stats and battle your friends.",
    url: "https://git-fight-club.vercel.app",
    siteName: "Git Fight Club",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Git Fight Club",
    description: "A Battle of Commits — Who is the strongest dev?",
    creator: "@hrshkshri",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
