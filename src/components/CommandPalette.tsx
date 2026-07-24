// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  Award,
  ShieldAlert,
  Terminal,
  Cpu,
  Database,
  Calculator,
  FileText,
  HelpCircle,
  X,
  Sparkles,
  Zap,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { glossaryTerms } from "@/data/glossaryTerms";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: "Courses" | "Interactive Labs" | "Governance" | "Glossary";
  href: string;
  icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
}

const SEARCH_ITEMS: CommandItem[] = [
  // Courses
  { id: "staff", title: "Staff Path", description: "Compliance & PII basics for branch staff", category: "Courses", href: "/learn/staff", icon: BookOpen },
  { id: "mgmt", title: "Management Path", description: "Underwriting automation & ROI metrics", category: "Courses", href: "/learn/management", icon: Award },
  { id: "board", title: "Board Path", description: "Fiduciary oversight & NCUA policies", category: "Courses", href: "/learn/board", icon: ShieldAlert },
  { id: "infosec", title: "InfoSec Path", description: "Defending against AI phishing & deepfakes", category: "Courses", href: "/learn/infosec", icon: ShieldAlert },
  { id: "eng", title: "Engineering Path", description: "Secure RAG & prompt injections", category: "Courses", href: "/learn/engineering", icon: Terminal },

  // Labs
  { id: "prompt", title: "Prompt Lab", description: "System prompt engineering sandbox", category: "Interactive Labs", href: "/playground", icon: Terminal },
  { id: "rag", title: "RAG Visualizer", description: "Trace policy chunking and similarity", category: "Interactive Labs", href: "/rag-sandbox", icon: Database },
  { id: "vector", title: "Vector Plotter", description: "Map query clusters on coordinate planes", category: "Interactive Labs", href: "/embedding-visualizer", icon: Database },
  { id: "tokenizer", title: "Tokenizer & Cost", description: "Color-highlight tokens and calculate cost", category: "Interactive Labs", href: "/tokenizer", icon: Calculator },
  { id: "agent", title: "Agent Sandbox", description: "Run step-by-step ReAct execution loops", category: "Interactive Labs", href: "/simulator", icon: Cpu },
  { id: "redteam", title: "Red Team CTF", description: "Jailbreak security challenge", category: "Interactive Labs", href: "/redteam", icon: Zap },
  { id: "warroom", title: "War Room Simulator", description: "Real-time AI outage crisis triage", category: "Interactive Labs", href: "/warroom", icon: ShieldAlert },
  { id: "pipeline", title: "Pipeline Builder", description: "Visual node-based architecture builder", category: "Interactive Labs", href: "/pipeline", icon: Cpu },
  { id: "studio", title: "Agent Studio", description: "Interactive Python code editor for AI agents", category: "Interactive Labs", href: "/agent-studio", icon: Terminal },
  { id: "xai", title: "XAI Lab", description: "Explainable AI feature importance visualizer", category: "Interactive Labs", href: "/xai-lab", icon: Eye },
  { id: "hitl", title: "HITL Simulator", description: "Human-in-the-loop compliance triage queue", category: "Interactive Labs", href: "/hitl-simulator", icon: SlidersHorizontal },

  // Governance
  { id: "risk", title: "Risk Matrix", description: "Calculate operational and reputational risk", category: "Governance", href: "/risk-matrix", icon: ShieldAlert },
  { id: "vendor", title: "Vendor Auditor", description: "Diligence third-party SaaS contracts", category: "Governance", href: "/vendor-auditor", icon: FileText },
  { id: "bias", title: "Bias Auditor", description: "Audit outputs for compliance risk anomalies", category: "Governance", href: "/bias-auditor", icon: ShieldAlert },
  { id: "policy", title: "Policy Builder", description: "Generate custom AI governance models", category: "Governance", href: "/policy-builder", icon: FileText },
];

// Append Glossary terms dynamically
glossaryTerms.slice(0, 15).forEach((t) => {
  SEARCH_ITEMS.push({
    id: `glossary_${t.id}`,
    title: t.term,
    description: t.definition.slice(0, 80) + "...",
    category: "Glossary",
    href: `/glossary#${t.id}`,
    icon: HelpCircle,
  });
});

export default function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filtered = SEARCH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        router.push(filtered[selectedIndex].href);
        onClose();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(6, 8, 20, 0.8)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10vh",
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "640px",
          maxHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--card-bg, #121526)",
          border: "1px solid var(--border-active, rgba(99, 102, 241, 0.4))",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Search style={{ width: 20, height: 20, color: "var(--primary)" }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, path, tool, or glossary term... (e.g. 'RAG', 'Red Team', 'Staff')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "1rem",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
              <Sparkles style={{ width: 24, height: 24, margin: "0 auto 8px auto", color: "var(--text-muted)" }} />
              <p style={{ margin: 0, fontSize: "0.9rem" }}>No matching tools or glossary terms found for &quot;{query}&quot;</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: isSelected ? "rgba(99, 102, 241, 0.15)" : "transparent",
                    border: `1px solid ${isSelected ? "rgba(99, 102, 241, 0.3)" : "transparent"}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isSelected ? "var(--primary)" : "var(--text-secondary)",
                    }}
                  >
                    <Icon style={{ width: 18, height: 18 }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                        {item.title}
                      </span>
                      <span
                        className="badge badge-indigo"
                        style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          <span>Use <strong>↑↓</strong> to navigate, <strong>↵</strong> to select, <strong>esc</strong> to close</span>
          <span>AI University Command Palette</span>
        </div>
      </div>
    </div>
  );
}
