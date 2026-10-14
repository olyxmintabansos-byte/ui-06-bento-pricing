import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI-06 // Interactive Bento Grid Pricing Playground",
  description: "Tactile Pricing Matrix with Dynamic Tier Physics, Spotlight Hover Effects & Web Audio API Haptics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
