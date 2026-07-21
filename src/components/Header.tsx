// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Cpu, BookOpen, ShieldAlert, Award, HelpCircle, Menu, X, 
  BookOpenCheck, Terminal, FileText, ChevronDown, Database, Calculator 
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({
    courses: false,
    labs: false,
    governance: false
  });
  const [progress, setProgress] = useState({ staff: false, management: false, board: false, infosec: false, engineering: false });

  // Load progress from localStorage
  useEffect(() => {
    const checkProgress = () => {
      const staffVal = localStorage.getItem("cu_ai_progress_staff") === "completed";
      const mgmtVal = localStorage.getItem("cu_ai_progress_management") === "completed";
      const boardVal = localStorage.getItem("cu_ai_progress_board") === "completed";
      const infosecVal = localStorage.getItem("cu_ai_progress_infosec") === "completed";
      const engineeringVal = localStorage.getItem("cu_ai_progress_engineering") === "completed";
      setProgress({ staff: staffVal, management: mgmtVal, board: boardVal, infosec: infosecVal, engineering: engineeringVal });
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

  const toggleMobileCategory = (key: string) => {
    setMobileExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Grouped Navigation Structure
  const coursesCategory = {
    name: "Courses",
    items: [
      { name: "Staff Path", href: "/learn/staff", icon: BookOpen, description: "Compliance & PII basics for branch staff" },
      { name: "Management Path", href: "/learn/management", icon: Award, description: "Underwriting automation & metrics" },
      { name: "Board Path", href: "/learn/board", icon: ShieldAlert, description: "Fiduciary oversight & regulatory policies" },
      { name: "InfoSec Path", href: "/learn/infosec", icon: ShieldAlert, description: "Defending against AI phishing & deepfakes" },
      { name: "Engineering Path", href: "/learn/engineering", icon: Terminal, description: "Secure RAG & prompt injections" }
    ]
  };

  const labsCategory = {
    name: "Interactive Labs",
    items: [
      { name: "Prompt Lab", href: "/playground", icon: Terminal, description: "System prompt instructions engineering" },
      { name: "RAG Visualizer", href: "/rag-sandbox", icon: Database, description: "Trace policy chunking and similarity" },
      { name: "Vector Plotter", href: "/embedding-visualizer", icon: Database, description: "Map query clusters on coordinate planes" },
      { name: "Tokenizer", href: "/tokenizer", icon: Calculator, description: "Color-highlight tokens and calculate cost" },
      { name: "Agent Sandbox", href: "/simulator", icon: Cpu, description: "Run step-by-step ReAct execution loops" }
    ]
  };

  const governanceCategory = {
    name: "Governance",
    items: [
      { name: "Risk Matrix", href: "/risk-matrix", icon: ShieldAlert, description: "Calculate operational and reputational risk" },
      { name: "Vendor Auditor", href: "/vendor-auditor", icon: FileText, description: "Diligence third-party SaaS contracts" },
      { name: "Bias Auditor", href: "/bias-auditor", icon: ShieldAlert, description: "Audit outputs for compliance risk anomalies" },
      { name: "Policy Builder", href: "/policy-builder", icon: FileText, description: "Generate custom AI policies & governance models" }
    ]
  };

  const isCategoryActive = (category: typeof coursesCategory) => {
    return category.items.some(item => pathname === item.href);
  };

  return (
    <header className="header-wrapper">
      <div className="container header-container">
        <Link href="/" className="logo">
          <Cpu className="gradient-text-indigo" style={{ width: 28, height: 28 }} />
          <span className="gradient-text" style={{ fontSize: "1.4rem", fontWeight: 800 }}>AI University</span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: "none" }} className="desktop-nav">
          <ul className="nav-links">
            
            {/* Home Link */}
            <li>
              <Link 
                href="/" 
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  position: "relative",
                  color: pathname === "/" ? "var(--text-primary)" : "var(--text-secondary)"
                }}
              >
                <Cpu style={{ width: 16, height: 16 }} />
                <span>Home</span>
              </Link>
            </li>

            {/* Courses Dropdown */}
            <li className="nav-category-container">
              <span 
                className={`nav-link nav-category-trigger ${isCategoryActive(coursesCategory) ? "active" : ""}`}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  color: isCategoryActive(coursesCategory) ? "var(--text-primary)" : "var(--text-secondary)" 
                }}
              >
                <span>Courses</span>
                <ChevronDown className="nav-chevron" style={{ width: 14, height: 14 }} />
              </span>
              <div className="nav-dropdown">
                {coursesCategory.items.map((item) => {
                  const Icon = item.icon;
                  const isSubActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} className="nav-dropdown-item">
                      <div className="nav-dropdown-item-icon" style={{ color: isSubActive ? "var(--primary)" : "inherit" }}>
                        <Icon style={{ width: 16, height: 16 }} />
                      </div>
                      <div className="nav-dropdown-item-content">
                        <span className="nav-dropdown-item-title" style={{ color: isSubActive ? "var(--primary)" : "inherit" }}>{item.name}</span>
                        <span className="nav-dropdown-item-desc">{item.description}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </li>

            {/* Interactive Labs Dropdown */}
            <li className="nav-category-container">
              <span 
                className={`nav-link nav-category-trigger ${isCategoryActive(labsCategory) ? "active" : ""}`}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  color: isCategoryActive(labsCategory) ? "var(--text-primary)" : "var(--text-secondary)" 
                }}
              >
                <span>Labs</span>
                <ChevronDown className="nav-chevron" style={{ width: 14, height: 14 }} />
              </span>
              <div className="nav-dropdown">
                {labsCategory.items.map((item) => {
                  const Icon = item.icon;
                  const isSubActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} className="nav-dropdown-item">
                      <div className="nav-dropdown-item-icon" style={{ color: isSubActive ? "var(--accent)" : "inherit" }}>
                        <Icon style={{ width: 16, height: 16 }} />
                      </div>
                      <div className="nav-dropdown-item-content">
                        <span className="nav-dropdown-item-title" style={{ color: isSubActive ? "var(--accent)" : "inherit" }}>{item.name}</span>
                        <span className="nav-dropdown-item-desc">{item.description}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </li>

            {/* Governance Dropdown */}
            <li className="nav-category-container">
              <span 
                className={`nav-link nav-category-trigger ${isCategoryActive(governanceCategory) ? "active" : ""}`}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  color: isCategoryActive(governanceCategory) ? "var(--text-primary)" : "var(--text-secondary)" 
                }}
              >
                <span>Governance</span>
                <ChevronDown className="nav-chevron" style={{ width: 14, height: 14 }} />
              </span>
              <div className="nav-dropdown">
                {governanceCategory.items.map((item) => {
                  const Icon = item.icon;
                  const isSubActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} className="nav-dropdown-item">
                      <div className="nav-dropdown-item-icon" style={{ color: isSubActive ? "var(--secondary)" : "inherit" }}>
                        <Icon style={{ width: 16, height: 16 }} />
                      </div>
                      <div className="nav-dropdown-item-content">
                        <span className="nav-dropdown-item-title" style={{ color: isSubActive ? "var(--secondary)" : "inherit" }}>{item.name}</span>
                        <span className="nav-dropdown-item-desc">{item.description}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </li>

            {/* Glossary Link */}
            <li>
              <Link 
                href="/glossary" 
                className={`nav-link ${pathname === "/glossary" ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  position: "relative",
                  color: pathname === "/glossary" ? "var(--text-primary)" : "var(--text-secondary)"
                }}
              >
                <HelpCircle style={{ width: 16, height: 16 }} />
                <span>Glossary</span>
              </Link>
            </li>

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
              Paths: <strong style={{ color: "var(--text-primary)" }}>{completedCount}/5</strong>
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
            background: "rgba(6, 8, 20, 0.98)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border-color)",
            padding: "14px 0",
            zIndex: 99,
          }}
        >
          <ul style={{ display: "flex", flexDirection: "column", gap: "4px", listStyle: "none" }}>
            
            {/* Mobile: Home */}
            <li>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="nav-link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "1.05rem",
                  padding: "12px 20px",
                  color: pathname === "/" ? "var(--text-primary)" : "var(--text-secondary)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.02)"
                }}
              >
                <Cpu style={{ width: 20, height: 20 }} />
                <span>Home Dashboard</span>
              </Link>
            </li>

            {/* Mobile Accordion: Courses */}
            <li>
              <div 
                className="mobile-accordion-header"
                onClick={() => toggleMobileCategory("courses")}
              >
                <span>Courses</span>
                <ChevronDown style={{ width: 16, height: 16, transform: mobileExpanded.courses ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              <div className={`mobile-accordion-content ${mobileExpanded.courses ? "expanded" : ""}`}>
                {coursesCategory.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="mobile-accordion-item"
                    >
                      <Icon style={{ width: 18, height: 18, color: "var(--primary)" }} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </li>

            {/* Mobile Accordion: Labs */}
            <li>
              <div 
                className="mobile-accordion-header"
                onClick={() => toggleMobileCategory("labs")}
              >
                <span>Interactive Labs</span>
                <ChevronDown style={{ width: 16, height: 16, transform: mobileExpanded.labs ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              <div className={`mobile-accordion-content ${mobileExpanded.labs ? "expanded" : ""}`}>
                {labsCategory.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="mobile-accordion-item"
                    >
                      <Icon style={{ width: 18, height: 18, color: "var(--accent)" }} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </li>

            {/* Mobile Accordion: Governance */}
            <li>
              <div 
                className="mobile-accordion-header"
                onClick={() => toggleMobileCategory("governance")}
              >
                <span>Governance & Risk</span>
                <ChevronDown style={{ width: 16, height: 16, transform: mobileExpanded.governance ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              <div className={`mobile-accordion-content ${mobileExpanded.governance ? "expanded" : ""}`}>
                {governanceCategory.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="mobile-accordion-item"
                    >
                      <Icon style={{ width: 18, height: 18, color: "var(--secondary)" }} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </li>

            {/* Mobile: Glossary */}
            <li>
              <Link
                href="/glossary"
                onClick={() => setIsOpen(false)}
                className="nav-link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "1.05rem",
                  padding: "12px 20px",
                  color: pathname === "/glossary" ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                <HelpCircle style={{ width: 20, height: 20 }} />
                <span>Glossary Reference</span>
              </Link>
            </li>

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
