// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProgressTracker from "@/components/ProgressTracker";
import Certificate from "@/components/Certificate";
import { BookOpen, Award, ShieldAlert, Cpu, ChevronRight, Zap, Shield, Sparkles, Terminal, FileText, Database, Calculator } from "lucide-react";

export default function Home() {
  const [completed, setCompleted] = useState({ staff: false, management: false, board: false, infosec: false, engineering: false });

  useEffect(() => {
    const checkState = () => {
      const staffVal = localStorage.getItem("cu_ai_progress_staff") === "completed";
      const mgmtVal = localStorage.getItem("cu_ai_progress_management") === "completed";
      const boardVal = localStorage.getItem("cu_ai_progress_board") === "completed";
      const infosecVal = localStorage.getItem("cu_ai_progress_infosec") === "completed";
      const engineeringVal = localStorage.getItem("cu_ai_progress_engineering") === "completed";
      setCompleted({ staff: staffVal, management: mgmtVal, board: boardVal, infosec: infosecVal, engineering: engineeringVal });
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
      badgeClass: "badge-board",
      completed: completed.engineering,
    },
  ];

  return (
    <div className="section" style={{ paddingTop: "60px" }}>
      <div className="container">
        
        <Certificate />

        {/* Welcome Hero Section */}
        <div style={{ textAlign: "center", marginBottom: "60px" }} className="animate-fade-in-up">
          <div 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "8px", 
              padding: "6px 16px", 
              borderRadius: "var(--radius-full)",
              background: "rgba(99, 102, 241, 0.08)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
              color: "var(--primary)",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "20px"
            }}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            <span>Interactive CU Education Platform</span>
          </div>

          <h1 style={{ fontSize: "3rem", marginBottom: "16px" }}>
            Master <span className="gradient-text">Agentic AI</span> for Credit Unions
          </h1>
          
          <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", maxWidth: "750px", margin: "0 auto", lineHeight: 1.6 }}>
            Empower your team, manage compliance risks, and establish robust AI governance models. Tailored learning modules for Credit Union board directors, management, and operations staff.
          </p>
        </div>

        {/* Dashboard Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "32px", alignItems: "start", marginBottom: "60px" }} className="dashboard-grid">
          
          {/* Left Column: Learning Paths Portal */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h2 style={{ fontSize: "1.5rem", margin: 0 }} className="gradient-text-indigo">
              Select Learning Path
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {pathCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={card.id} 
                    className="card card-hover"
                    style={{ 
                      padding: "24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap"
                    }}
                  >
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flex: 1, minWidth: "260px" }}>
                      <div 
                        style={{ 
                          padding: "12px", 
                          borderRadius: "var(--radius-md)", 
                          background: "rgba(255,255,255,0.03)", 
                          border: "1px solid var(--border-color)",
                          color: "var(--primary)"
                        }}
                      >
                        <Icon style={{ width: 28, height: 28 }} />
                      </div>
                      
                      <div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                          <span className={`badge ${card.badgeClass}`}>
                            {card.id} path
                          </span>
                          {card.completed && (
                            <span className="badge badge-success" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                              Certified
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontSize: "1.2rem", margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                          {card.title}
                        </h3>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "8px" }}>
                          {card.subtitle}
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <Link href={card.href} className="btn btn-primary" style={{ padding: "10px 18px", fontSize: "0.85rem" }}>
                      <span>{card.completed ? "Review Material" : "Start Learning"}</span>
                      <ChevronRight style={{ width: 14, height: 14 }} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: User Progress Details */}
          <div>
            <ProgressTracker />
          </div>

        </div>

        {/* Interactive Activities Section */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "60px" }}>
          <h2 style={{ fontSize: "1.75rem", textAlign: "center", marginBottom: "8px" }} className="gradient-text-violet">
            Interactive Learning Labs
          </h2>
          <p style={{ color: "var(--text-secondary)", textAlign: "center", maxWidth: "600px", margin: "0 auto 40px auto" }}>
            Put concepts into practice. Test how safety guardrails scrub unmasked PII, and run mock underwriting risk reports.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="labs-grid">
            
            {/* Lab 1: Prompt Lab */}
            <div className="card card-hover" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div 
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--accent-glow)", 
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(6, 182, 212, 0.2)"
                }}
              >
                <Terminal style={{ width: 26, height: 26 }} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "6px" }}>Prompt Engineering Lab</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Draft instructions for a credit union MSR chatbot. Test your prompts against customer queries, prompt injection overrides, and privacy requirements.
                </p>
              </div>
              <div style={{ marginTop: "auto" }}>
                <Link href="/playground" className="btn btn-accent" style={{ padding: "10px 18px", fontSize: "0.85rem", width: "100%" }}>
                  <span>Launch Prompt Lab</span>
                  <Zap style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>

            {/* Lab 2: RAG Sandbox */}
            <div className="card card-hover" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div 
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--primary-glow)", 
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(99, 102, 241, 0.2)"
                }}
              >
                <Database style={{ width: 26, height: 26 }} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "6px" }}>Policy RAG Visualizer</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Trace RAG search loops step-by-step: document paragraph chunking, conceptual vector distance matching, context packing, and LLM text updates.
                </p>
              </div>
              <div style={{ marginTop: "auto" }}>
                <Link href="/rag-sandbox" className="btn btn-primary" style={{ padding: "10px 18px", fontSize: "0.85rem", width: "100%" }}>
                  <span>Launch RAG Sandbox</span>
                  <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>

            {/* Lab 3: Agent Sandbox */}
            <div className="card card-hover" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div 
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--accent-glow)", 
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(6, 182, 212, 0.2)"
                }}
              >
                <Cpu style={{ width: 26, height: 26 }} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "6px" }}>Agent Sandbox Simulator</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Simulate an agent&apos;s ReAct (Reasoning + Action) execution loop step-by-step. See how toggling PII scrubbers or Human-in-the-Loop gates prevents privacy leaks.
                </p>
              </div>
              <div style={{ marginTop: "auto" }}>
                <Link href="/simulator" className="btn btn-accent" style={{ padding: "10px 18px", fontSize: "0.85rem", width: "100%" }}>
                  <span>Launch Simulator Lab</span>
                  <Zap style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>

            {/* Lab 4: Risk Matrix */}
            <div className="card card-hover" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div 
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--primary-glow)", 
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(99, 102, 241, 0.2)"
                }}
              >
                <Shield style={{ width: 26, height: 26 }} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "6px" }}>Credit Union Risk Matrix</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Evaluate potential compliance, reputational, data safety, and model security risks of proposed AI agent deployments. Generates customized reports.
                </p>
              </div>
              <div style={{ marginTop: "auto" }}>
                <Link href="/risk-matrix" className="btn btn-primary" style={{ padding: "10px 18px", fontSize: "0.85rem", width: "100%" }}>
                  <span>Launch Risk Assessment</span>
                  <Shield style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>

            {/* Lab 5: Vendor Auditor */}
            {/* Lab 5: Vendor Auditor */}
            <div className="card card-hover" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div 
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--accent-glow)", 
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(6, 182, 212, 0.2)"
                }}
              >
                <FileText style={{ width: 26, height: 26 }} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "6px" }}>AI Vendor Risk Scorecard</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Audit third-party AI SaaS vendors under NCUA Letters and SOC 2 guidelines. Grade safety standards, compile contract gaps, and compile board briefing documents.
                </p>
              </div>
              <div style={{ marginTop: "auto" }}>
                <Link href="/vendor-auditor" className="btn btn-accent" style={{ padding: "10px 18px", fontSize: "0.85rem", width: "100%" }}>
                  <span>Launch Vendor Audit</span>
                  <Zap style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>

            {/* Lab 6: Vector Plotter */}
            <div className="card card-hover" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div 
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--primary-glow)", 
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(99, 102, 241, 0.2)"
                }}
              >
                <Database style={{ width: 26, height: 26 }} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "6px" }}>Vector Embedding Visualizer</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Understand vector space maps. Plot custom queries onto coordinate grids and observe how AI measures semantic similarity.
                </p>
              </div>
              <div style={{ marginTop: "auto" }}>
                <Link href="/embedding-visualizer" className="btn btn-primary" style={{ padding: "10px 18px", fontSize: "0.85rem", width: "100%" }}>
                  <span>Launch Vector Plotter</span>
                  <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>

            {/* Lab 7: Tokenizer */}
            <div className="card card-hover" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div 
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--accent-glow)", 
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(6, 182, 212, 0.2)"
                }}
              >
                <Calculator style={{ width: 26, height: 26 }} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "6px" }}>LLM Tokenizer & Price Grader</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Examine how LLMs read words in tokens. Highlight text boundaries and project query prices across OpenAI, Anthropic, and open-source models.
                </p>
              </div>
              <div style={{ marginTop: "auto" }}>
                <Link href="/tokenizer" className="btn btn-accent" style={{ padding: "10px 18px", fontSize: "0.85rem", width: "100%" }}>
                  <span>Launch Tokenizer</span>
                  <Zap style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>

            {/* Lab 8: Bias Auditor */}
            <div className="card card-hover" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div 
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--primary-glow)", 
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(99, 102, 241, 0.2)"
                }}
              >
                <ShieldAlert style={{ width: 26, height: 26 }} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "6px" }}>Bias & Hallucination Auditor</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Audit AI logs for Fair Lending (ECOA) redlining bias, deposit rate hallucinations, and privacy leaks. Compile formal remediation reports.
                </p>
              </div>
              <div style={{ marginTop: "auto" }}>
                <Link href="/bias-auditor" className="btn btn-primary" style={{ padding: "10px 18px", fontSize: "0.85rem", width: "100%" }}>
                  <span>Launch Bias Audit</span>
                  <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>

            {/* Lab 9: Policy Builder */}
            <div className="card card-hover" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div 
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--accent-glow)", 
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(6, 182, 212, 0.2)"
                }}
              >
                <FileText style={{ width: 26, height: 26 }} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "6px" }}>AI Policy & Governance Builder</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Draft custom AI policy and governance frameworks. Configure asset parameters, risk tiers, and compliance oversight to download in PDF/Markdown.
                </p>
              </div>
              <div style={{ marginTop: "auto" }}>
                <Link href="/policy-builder" className="btn btn-accent" style={{ padding: "10px 18px", fontSize: "0.85rem", width: "100%" }}>
                  <span>Launch Policy Builder</span>
                  <Zap style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
      <style jsx>{`
        @media (max-width: 990px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .labs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
