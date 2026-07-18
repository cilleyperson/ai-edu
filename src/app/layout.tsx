import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Acuity AI | Agentic AI Education for Credit Unions",
  description: "Interactive online learning platform designed to teach Agentic AI concepts, safety, risk assessment, and governance to Credit Union staff, management, and boards.",
  keywords: "credit union, agentic ai, ai governance, ai risk matrix, artificial intelligence, credit union boards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        {/* Background glow effects */}
        <div className="bg-gradient-wrapper">
          <div className="bg-glow-1"></div>
          <div className="bg-glow-2"></div>
          <div className="bg-glow-3"></div>
        </div>

        {/* Global Navigation Header */}
        <Header />

        {/* Main Content Area */}
        <main style={{ minHeight: "calc(100vh - 80px)" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
