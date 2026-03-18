import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Git Fight Club",
  description: "A Battle of Commits — Who is the strongest dev?",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
