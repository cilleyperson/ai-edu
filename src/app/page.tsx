// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ProgressTracker from "@/components/ProgressTracker";
import Certificate from "@/components/Certificate";
import {
  BookOpen,
  Award,
  ShieldAlert,
  Cpu,
  ChevronRight,
  Zap,
  Sparkles,
  Terminal,
  FileText,
  Database,
  Calculator,
  Code2,
  BrainCircuit,
  Search,
  Eye,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  TrendingUp,
  Flame,
} from "lucide-react";

export default function Home() {
  const [completed, setCompleted] = useState({
    staff: false,
    management: false,
    board: false,
    infosec: false,
    engineering: false,
    risk: false,
    rag: false,
    vendor: false,
    embedding: false,
    tokenizer: false,
    bias: false,
    redteam: false,
    warroom: false,
    pipeline: false,
    agentStudio: false,
    xai: false,
    hitl: false,
  });

  const [activeCategory, setActiveCategory] = useState<"all" | "courses" | "labs" | "governance">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkState = () => {
      setCompleted({
        staff: localStorage.getItem("cu_ai_progress_staff") === "completed",
        management: localStorage.getItem("cu_ai_progress_management") === "completed",
        board: localStorage.getItem("cu_ai_progress_board") === "completed",
        infosec: localStorage.getItem("cu_ai_progress_infosec") === "completed",
        engineering: localStorage.getItem("cu_ai_progress_engineering") === "completed",
        risk: localStorage.getItem("cu_ai_risk_completed") === "true",
        rag: localStorage.getItem("cu_ai_rag_used") === "true",
        vendor: localStorage.getItem("cu_ai_vendor_audited") === "true",
        embedding: localStorage.getItem("cu_ai_progress_embeddings") === "completed",
        tokenizer: localStorage.getItem("cu_ai_progress_tokenizer") === "completed",
        bias: localStorage.getItem("cu_ai_progress_bias") === "completed",
        redteam: localStorage.getItem("cu_ai_redteam_lvl1") === "completed",
        warroom: localStorage.getItem("cu_ai_warroom_completed") === "completed",
        pipeline: localStorage.getItem("cu_ai_pipeline_completed") === "completed",
        agentStudio: localStorage.getItem("cu_ai_agent_studio_completed") === "completed",
        xai: localStorage.getItem("cu_ai_xai_completed") === "completed",
        hitl: localStorage.getItem("cu_ai_hitl_completed") === "completed",
      });
    };

    checkState();
    window.addEventListener("storage", checkState);
    window.addEventListener("progressUpdated", checkState);

    return () => {
      window.removeEventListener("storage", checkState);
      window.removeEventListener("progressUpdated", checkState);
    };
  }, []);

  const pathCards = [
    {
      id: "staff",
      title: "Staff Path",
      subtitle: "Frontline Operations & Safety",
      description: "Learn how to use AI assistant prompts safely, protect member PII, and understand GLBA data rules.",
      href: "/learn/staff",
      icon: BookOpen,
      category: "courses" as const,
      badgeClass: "badge-staff",
      completed: completed.staff,
    },
    {
      id: "management",
      title: "Management Path",
      subtitle: "System Design & Fair Lending",
      description: "Understand RAG data links, model inputs, explainability, compliance audits, and Human-in-the-Loop workflows.",
      href: "/learn/management",
      icon: Award,
      category: "courses" as const,
      badgeClass: "badge-mgmt",
      completed: completed.management,
    },
    {
      id: "board",
      title: "Board Path",
      subtitle: "Strategy & Governance",
      description: "Oversee algorithmic model risks, vendor due diligence, capital planning, and NCUA letter guidelines.",
      href: "/learn/board",
      icon: ShieldAlert,
      category: "courses" as const,
      badgeClass: "badge-board",
      completed: completed.board,
    },
    {
      id: "infosec",
      title: "InfoSec Path",
      subtitle: "AI Threat & Zero-Trust Defense",
      description: "Learn defense strategies against voice cloning (vishing), deepfake video meetings, and targeted AI phishing.",
      href: "/learn/infosec",
      icon: ShieldAlert,
      category: "courses" as const,
      badgeClass: "badge-danger",
      completed: completed.infosec,
    },
    {
      id: "engineering",
      title: "IT & Engineering Path",
      subtitle: "Building Safe AI Systems",
      description: "Learn about prompt injection defense, secure RAG pipelines, and safe API tool calling for agentic systems.",
      href: "/learn/engineering",
      icon: Terminal,
      category: "courses" as const,
      badgeClass: "badge-board",
      completed: completed.engineering,
    },
  ];

  const labCards = [
    {
      id: "agent-studio",
      title: "Agentic AI Studio",
      description: "Learn how to build autonomous AI agents. Write custom tool code and watch the ReAct loop in action.",
      href: "/agent-studio",
      icon: Code2,
      category: "labs" as const,
      badgeText: "Developer IDE",
      completed: completed.agentStudio,
    },
    {
      id: "redteam",
      title: "Red Team CTF",
      description: "Test prompt injection vulnerability techniques. Try to jailbreak system prompts in a safe sandbox.",
      href: "/redteam",
      icon: Zap,
      category: "labs" as const,
      badgeText: "Security Challenge",
      completed: completed.redteam,
    },
    {
      id: "warroom",
      title: "War Room Crisis Simulator",
      description: "Triage a simulated AI outage emergency in real-time. Coordinate responses under pressure.",
      href: "/warroom",
      icon: BrainCircuit,
      category: "labs" as const,
      badgeText: "Incident Response",
      completed: completed.warroom,
    },
    {
      id: "pipeline",
      title: "Architecture Pipeline Builder",
      description: "Build visual node-based AI workflows for Credit Union underwriting and member verification.",
      href: "/pipeline",
      icon: Cpu,
      category: "labs" as const,
      badgeText: "Visual Architect",
      completed: completed.pipeline,
    },
    {
      id: "xai",
      title: "Explainable AI (XAI) Lab",
      description: "Visualize feature importance (SHAP) for loan approval models to ensure transparent decisions.",
      href: "/xai-lab",
      icon: Eye,
      category: "labs" as const,
      badgeText: "Transparency Lab",
      completed: completed.xai,
    },
    {
      id: "hitl",
      title: "HITL Simulator",
      description: "Step into the compliance triage queue to review, approve, or correct AI-generated communications.",
      href: "/hitl-simulator",
      icon: SlidersHorizontal,
      category: "labs" as const,
      badgeText: "Triage Queue",
      completed: completed.hitl,
    },
    {
      id: "playground",
      title: "Prompt Engineering Lab",
      description: "Craft member service prompts and evaluate output safety against injection attempts.",
      href: "/playground",
      icon: Terminal,
      category: "labs" as const,
      badgeText: "Prompt Sandbox",
      completed: false,
    },
    {
      id: "rag",
      title: "Policy RAG Visualizer",
      description: "Trace chunking and vector match similarity scores across Credit Union compliance manuals.",
      href: "/rag-sandbox",
      icon: Database,
      category: "labs" as const,
      badgeText: "Vector Retrieval",
      completed: completed.rag,
    },
    {
      id: "embedding",
      title: "Vector Embedding Visualizer",
      description: "Map query clusters on a coordinate plane to visualize semantic similarity across loan products.",
      href: "/embedding-visualizer",
      icon: Database,
      category: "labs" as const,
      badgeText: "Vector Plane",
      completed: completed.embedding,
    },
    {
      id: "tokenizer",
      title: "LLM Tokenizer & Cost",
      description: "Inspect token boundaries and calculate raw API inference costs across GPT-4 and Claude.",
      href: "/tokenizer",
      icon: Calculator,
      category: "labs" as const,
      badgeText: "Cost Calculator",
      completed: completed.tokenizer,
    },
    {
      id: "simulator",
      title: "Agent Sandbox Simulator",
      description: "Run step-by-step ReAct loops with interactive PII scrubbing and human-in-the-loop gates.",
      href: "/simulator",
      icon: Cpu,
      category: "labs" as const,
      badgeText: "ReAct Loop",
      completed: false,
    },
  ];

  const governanceCards = [
    {
      id: "risk-matrix",
      title: "AI Risk Matrix Calculator",
      description: "Score operational, legal, and reputational risk across credit union AI deployment models.",
      href: "/risk-matrix",
      icon: ShieldAlert,
      category: "governance" as const,
      badgeText: "Risk Assessment",
      completed: completed.risk,
    },
    {
      id: "vendor",
      title: "Vendor AI Diligence Auditor",
      description: "Audit third-party vendor AI contracts for data privacy, model ownership, and SLA guarantees.",
      href: "/vendor-auditor",
      icon: FileText,
      category: "governance" as const,
      badgeText: "Diligence Tool",
      completed: completed.vendor,
    },
    {
      id: "bias",
      title: "Algorithmic Bias Auditor",
      description: "Audit automated underwriting outputs for ECOA compliance and disparate impact anomalies.",
      href: "/bias-auditor",
      icon: ShieldAlert,
      category: "governance" as const,
      badgeText: "ECOA Compliance",
      completed: completed.bias,
    },
    {
      id: "policy",
      title: "AI Policy Generator",
      description: "Generate customized AI Governance policies aligned with NCUA Letter 22-CU-05.",
      href: "/policy-builder",
      icon: FileText,
      category: "governance" as const,
      badgeText: "Policy Generator",
      completed: false,
    },
  ];

  // Dynamic Adaptive Learning Copilot Recommendation
  const copilotRecommendation = useMemo(() => {
    if (!completed.staff) return pathCards[0];
    if (!completed.management) return pathCards[1];
    if (!completed.board) return pathCards[2];
    if (!completed.infosec) return pathCards[3];
    if (!completed.engineering) return pathCards[4];
    if (!completed.agentStudio) return labCards[0];
    if (!completed.redteam) return labCards[1];
    if (!completed.xai) return labCards[4];
    if (!completed.hitl) return labCards[5];
    return labCards[2];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalMasteryScore = Math.min(100, Math.round((completedCount / 17) * 100));

  // Combine and filter all cards based on active tab and search query
  const allTools = useMemo(() => {
    const list = [
      ...pathCards.map((c) => ({ ...c, type: "Course" })),
      ...labCards.map((c) => ({ ...c, type: "Lab" })),
      ...governanceCards.map((c) => ({ ...c, type: "Governance" })),
    ];

    return list.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesQuery =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery, completed]);

  return (
    <div className="section" style={{ paddingTop: "40px" }}>
      <div className="container">
        <Certificate />

        {/* Status Layer: Executive KPI Summary Header Banner */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "36px",
          }}
          className="animate-fade-in-up"
        >
          <div className="metric-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="metric-label">Overall Mastery</span>
              <TrendingUp style={{ width: 18, height: 18, color: "var(--primary)" }} />
            </div>
            <p className="metric-value">{totalMasteryScore}%</p>
          </div>

          <div className="metric-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="metric-label">Unlocked Credentials</span>
              <CheckCircle2 style={{ width: 18, height: 18, color: "var(--success)" }} />
            </div>
            <p className="metric-value">{completedCount} / 17</p>
          </div>

          <div className="metric-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="metric-label">NCUA Compliance Status</span>
              <Flame style={{ width: 18, height: 18, color: "var(--warning)" }} />
            </div>
            <p className="metric-value" style={{ fontSize: "1.2rem", marginTop: "4px" }}>Audit Ready</p>
          </div>
        </div>

        {/* Context Layer: Adaptive AI Learning Copilot Recommendation Card */}
        <div className="card copilot-card" style={{ padding: "28px", marginBottom: "40px", borderRadius: "var(--radius-lg)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", flex: 1, minWidth: "280px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(99, 102, 241, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  border: "1px solid rgba(99, 102, 241, 0.4)",
                }}
              >
                <Compass style={{ width: 26, height: 26 }} />
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span className="badge badge-indigo">
                    Adaptive Learning Copilot
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Recommended Milestone</span>
                </div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "1.3rem", color: "var(--text-primary)" }}>
                  Next Target: {copilotRecommendation.title}
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: "600px" }}>
                  {copilotRecommendation.description}
                </p>
              </div>
            </div>

            <div>
              <Link href={copilotRecommendation.href} className="btn btn-primary" style={{ padding: "12px 22px", fontSize: "0.9rem" }}>
                <span>Resume Milestone</span>
                <ChevronRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "32px", alignItems: "start", marginBottom: "60px" }} className="dashboard-grid">
          {/* Left Column: Filterable Learning Tools */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Filter Tabs & Search Bar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <h2 style={{ fontSize: "1.5rem", margin: 0 }} className="gradient-text-indigo">
                  Learning Catalog & Tools
                </h2>

                {/* Filter Tabs */}
                <div style={{ display: "flex", gap: "6px", background: "rgba(255, 255, 255, 0.03)", padding: "4px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  {(["all", "courses", "labs", "governance"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        cursor: "pointer",
                        backgroundColor: activeCategory === cat ? "var(--primary)" : "transparent",
                        color: activeCategory === cat ? "#fff" : "var(--text-secondary)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {cat === "all" ? "All Tools" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time search filter */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "8px 14px",
                }}
              >
                <Search style={{ width: 16, height: 16, color: "var(--text-muted)", marginRight: "10px" }} />
                <input
                  type="text"
                  placeholder="Filter catalog tools by keyword... (e.g. 'RAG', 'Underwriting', 'ECOA')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            {/* Filtered Cards List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {allTools.length === 0 ? (
                <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                  <p style={{ margin: 0 }}>No tools found matching &quot;{searchQuery}&quot;. Try a different filter.</p>
                </div>
              ) : (
                allTools.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      className="card card-hover"
                      style={{
                        padding: "22px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flex: 1, minWidth: "260px" }}>
                        <div
                          style={{
                            padding: "12px",
                            borderRadius: "var(--radius-md)",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid var(--border-color)",
                            color: card.completed ? "var(--success)" : "var(--primary)",
                          }}
                        >
                          <Icon style={{ width: 26, height: 26 }} />
                        </div>

                        <div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                            <span className="badge badge-indigo" style={{ fontSize: "0.7rem" }}>
                              {card.type}
                            </span>
                            {card.completed && (
                              <span className="badge badge-success" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                                Verified
                              </span>
                            )}
                          </div>
                          <h3 style={{ fontSize: "1.15rem", margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                            {card.title}
                          </h3>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                            {card.description}
                          </p>
                        </div>
                      </div>

                      <Link href={card.href} className="btn btn-primary" style={{ padding: "10px 18px", fontSize: "0.85rem" }}>
                        <span>{card.completed ? "Review" : "Launch"}</span>
                        <ChevronRight style={{ width: 14, height: 14 }} />
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: User Progress Details */}
          <div>
            <ProgressTracker />
          </div>
        </div>
      </div>
    </div>
  );
}
