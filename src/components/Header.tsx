"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, BookOpen, ShieldAlert, Award, HelpCircle, Menu, X, BookOpenCheck, Terminal, FileText } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState({ staff: false, management: false, board: false });

  // Load progress from localStorage
  useEffect(() => {
    const checkProgress = () => {
      const staffVal = localStorage.getItem("cu_ai_progress_staff") === "completed";
      const mgmtVal = localStorage.getItem("cu_ai_progress_management") === "completed";
      const boardVal = localStorage.getItem("cu_ai_progress_board") === "completed";
      setProgress({ staff: staffVal, management: mgmtVal, board: boardVal });
    };

    checkProgress();
    
    // Set up an event listener to handle changes to localStorage from other pages
    window.addEventListener("storage", checkProgress);
    // Custom event listener for same-page state changes
    window.addEventListener("progressUpdated", checkProgress);
    
    return () => {
      window.removeEventListener("storage", checkProgress);
      window.removeEventListener("progressUpdated", checkProgress);
    };
  }, [pathname]);

  const completedCount = Object.values(progress).filter(Boolean).length;

  const navItems = [
    { name: "Home", href: "/", icon: Cpu },
    { name: "Staff Path", href: "/learn/staff", icon: BookOpen, badge: "staff" },
    { name: "Management Path", href: "/learn/management", icon: Award, badge: "mgmt" },
    { name: "Board Path", href: "/learn/board", icon: ShieldAlert, badge: "board" },
    { name: "Prompt Lab", href: "/playground", icon: Terminal },
    { name: "RAG Visualizer", href: "/rag-sandbox", icon: Cpu },
    { name: "Agent Sandbox", href: "/simulator", icon: Cpu },
    { name: "Risk Matrix", href: "/risk-matrix", icon: ShieldAlert },
    { name: "Vendor Auditor", href: "/vendor-auditor", icon: FileText },
    { name: "Glossary", href: "/glossary", icon: HelpCircle },
  ];

  return (
    <header className="header-wrapper">
      <div className="container header-container">
        <Link href="/" className="logo">
          <Cpu className="gradient-text-indigo" style={{ width: 28, height: 28 }} />
          <span className="gradient-text" style={{ fontSize: "1.4rem", fontWeight: 800 }}>Acuity AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: "none" }} className="desktop-nav">
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      position: "relative",
                      color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    }}
                  >
                    <Icon style={{ width: 16, height: 16 }} />
                    <span>{item.name}</span>
                    {isActive && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "-20px",
                          left: 0,
                          right: 0,
                          height: "2px",
                          background: "linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)",
                          borderRadius: "var(--radius-full)",
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Progress Tracker Widget */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            className="card"
            style={{
              padding: "6px 12px",
              borderRadius: "var(--radius-full)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.85rem",
              background: "rgba(255, 255, 255, 0.03)",
              borderColor: "var(--border-color)",
            }}
          >
            <BookOpenCheck style={{ width: 16, height: 16, color: "var(--success)" }} />
            <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
              Paths: <strong style={{ color: "var(--text-primary)" }}>{completedCount}/3</strong>
            </span>
          </div>

          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-primary)",
              display: "block",
            }}
            className="menu-button"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X style={{ width: 24, height: 24 }} /> : <Menu style={{ width: 24, height: 24 }} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div
          className="animate-fade-in-up"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(6, 8, 20, 0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border-color)",
            padding: "20px 24px",
            zIndex: 99,
          }}
        >
          <ul style={{ display: "flex", flexDirection: "column", gap: "16px", listStyle: "none" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="nav-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "1.05rem",
                      padding: "8px 0",
                      color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    }}
                  >
                    <Icon style={{ width: 20, height: 20, color: isActive ? "var(--primary)" : "var(--text-muted)" }} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Injecting CSS specifically for responsive display toggle since we don't have tailwind config file active */}
      <style jsx global>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: block !important;
          }
          .menu-button {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
