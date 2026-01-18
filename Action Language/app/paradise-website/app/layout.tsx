import type { Metadata } from "next";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "Paradise - Universal Accessibility Through ActionLanguage",
  description: "Learn how Paradise uses CRUD operations on ActionLanguage to enable deterministic accessibility analysis across all UI languages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
