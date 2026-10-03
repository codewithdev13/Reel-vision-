import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReelVision AI - AI Reel & Short Video Analyzer",
  description: "AI-powered Instagram Reels, TikToks, and YouTube Shorts analyzer powered by Gemini 1.5 Pro with structured retention, virality, and quality metrics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-slate-900">{children}</body>
    </html>
  );
}
