"use client";

import React, { useEffect, useState } from "react";
import { Award, BookOpen, ShieldAlert, Sparkles, CheckCircle2, Terminal, Cpu, FileText, Database, Calculator } from "lucide-react";

interface PathProgress {
  staff: boolean;
  management: boolean;
  board: boolean;
  infosec: boolean;
  engineering: boolean;
  staffScore: number;
  managementScore: number;
  boardScore: number;
  infosecScore: number;
  engineeringScore: number;
  riskMatrixUsed: boolean;
  playgroundScore: number;
  ragUsed: boolean;
  vendorAudited: boolean;
  embeddingUsed: boolean;
  tokenizerUsed: boolean;
  biasAudited: boolean;
}

export default function ProgressTracker() {
  const [progress, setProgress] = useState<PathProgress>({
    staff: false,
    management: false,
    board: false,
    infosec: false,
    engineering: false,
    staffScore: 0,
    managementScore: 0,
    boardScore: 0,
    infosecScore: 0,
    engineeringScore: 0,
    riskMatrixUsed: false,
    playgroundScore: 0,
    ragUsed: false,
    vendorAudited: false,
    embeddingUsed: false,
    tokenizerUsed: false,
    biasAudited: false,
  });

  useEffect(() => {
    const loadProgress = () => {
      const staffVal = localStorage.getItem("cu_ai_progress_staff") === "completed";
      const mgmtVal = localStorage.getItem("cu_ai_progress_management") === "completed";
      const boardVal = localStorage.getItem("cu_ai_progress_board") === "completed";
      const infosecVal = localStorage.getItem("cu_ai_progress_infosec") === "completed";
      const engineeringVal = localStorage.getItem("cu_ai_progress_engineering") === "completed";
      
      const staffScoreVal = parseInt(localStorage.getItem("cu_ai_score_staff") || "0", 10);
      const mgmtScoreVal = parseInt(localStorage.getItem("cu_ai_score_management") || "0", 10);
      const boardScoreVal = parseInt(localStorage.getItem("cu_ai_score_board") || "0", 10);
      const infosecScoreVal = parseInt(localStorage.getItem("cu_ai_score_infosec") || "0", 10);
      const engineeringScoreVal = parseInt(localStorage.getItem("cu_ai_score_engineering") || "0", 10);
      
      const riskMatrixVal = localStorage.getItem("cu_ai_risk_completed") === "true";
      const playgroundScoreVal = parseInt(localStorage.getItem("cu_ai_score_playground") || "0", 10);
      const ragVal = localStorage.getItem("cu_ai_rag_used") === "true";
      const vendorVal = localStorage.getItem("cu_ai_vendor_audited") === "true";
      const embeddingVal = localStorage.getItem("cu_ai_progress_embeddings") === "completed";
      const tokenizerVal = localStorage.getItem("cu_ai_progress_tokenizer") === "completed";
      const biasVal = localStorage.getItem("cu_ai_progress_bias") === "completed";

      setProgress({
        staff: staffVal,
        management: mgmtVal,
        board: boardVal,
        infosec: infosecVal,
        engineering: engineeringVal,
        staffScore: staffScoreVal,
        managementScore: mgmtScoreVal,
        boardScore: boardScoreVal,
        infosecScore: infosecScoreVal,
        engineeringScore: engineeringScoreVal,
        riskMatrixUsed: riskMatrixVal,
        playgroundScore: playgroundScoreVal,
        ragUsed: ragVal,
        vendorAudited: vendorVal,
        embeddingUsed: embeddingVal,
        tokenizerUsed: tokenizerVal,
        biasAudited: biasVal,
      });
    };

    loadProgress();
    window.addEventListener("storage", loadProgress);
    window.addEventListener("progressUpdated", loadProgress);

    return () => {
      window.removeEventListener("storage", loadProgress);
      window.removeEventListener("progressUpdated", loadProgress);
    };
  }, []);

  const completedPaths = [progress.staff, progress.management, progress.board, progress.infosec, progress.engineering].filter(Boolean).length;
  const completionPercentage = Math.round((completedPaths / 5) * 100);

  // Badge list logic
  const badges = [
    {
      id: "curious",
      title: "First Steps",
      description: "Began learning Credit Union Agentic AI",
      unlocked: progress.staff || progress.management || progress.board || progress.infosec || progress.engineering || progress.playgroundScore > 0 || progress.ragUsed || progress.vendorAudited || progress.embeddingUsed || progress.tokenizerUsed || progress.biasAudited,
      icon: Sparkles,
      color: "#06b6d4",
    },
    {
      id: "staff_badge",
      title: "AI Specialist",
      description: "Completed Credit Union Staff Path",
      unlocked: progress.staff,
      icon: BookOpen,
      color: "#10b981",
    },
    {
      id: "mgmt_badge",
      title: "Strategic Architect",
      description: "Completed Credit Union Management Path",
      unlocked: progress.management,
      icon: Award,
      color: "#6366f1",
    },
    {
      id: "board_badge",
      title: "NCUA Guardian",
      description: "Completed Board Governance Path",
      unlocked: progress.board,
      icon: ShieldAlert,
      color: "#a855f7",
    },
    {
      id: "prompt_badge",
      title: "Prompt Expert",
      description: "Scored 70%+ in Prompt Engineering Lab",
      unlocked: progress.playgroundScore >= 70,
      icon: Terminal,
      color: "#06b6d4",
    },
    {
      id: "rag_badge",
      title: "RAG Engineer",
      description: "Analyzed policy vectors in RAG Sandbox",
      unlocked: progress.ragUsed,
      icon: Cpu,
      color: "#22d3ee",
    },
    {
      id: "embedding_badge",
      title: "Embedding Analyst",
      description: "Mapped semantic similarity coordinates in Vector Space",
      unlocked: progress.embeddingUsed,
      icon: Database,
      color: "#818cf8",
    },
    {
      id: "tokenizer_badge",
      title: "Token Architect",
      description: "Parsed words and calculated prompt costs in Tokenizer",
      unlocked: progress.tokenizerUsed,
      icon: Calculator,
      color: "#38bdf8",
    },
    {
      id: "risk_badge",
      title: "Risk Analyst",
      description: "Evaluated a project in Risk Assessment Matrix",
      unlocked: progress.riskMatrixUsed,
      icon: ShieldAlert,
      color: "#f59e0b",
    },
    {
      id: "vendor_badge",
      title: "Vendor Auditor",
      description: "Checked contracts in Vendor Governance scorecard",
      unlocked: progress.vendorAudited,
      icon: FileText,
      color: "#f43f5e",
    },
    {
      id: "bias_badge",
      title: "Compliance Auditor",
      description: "Flagged lending bias, CD hallucinations, and SSN leaks",
      unlocked: progress.biasAudited,
      icon: ShieldAlert,
      color: "#f59e0b",
    },
    {
      id: "infosec_badge",
      title: "Zero-Trust Sentinel",
      description: "Completed Information Security Path",
      unlocked: progress.infosec,
      icon: ShieldAlert,
      color: "#f43f5e",
    },
    {
      id: "engineering_badge",
      title: "Security Architect",
      description: "Completed IT & Engineering Path",
      unlocked: progress.engineering,
      icon: Terminal,
      color: "#0ea5e9",
    },
    {
      id: "master",
      title: "Platform Master",
      description: "Unlocked all credit union AI credentials",
      unlocked: progress.staff && progress.management && progress.board && progress.infosec && progress.engineering && progress.riskMatrixUsed && progress.playgroundScore >= 70 && progress.ragUsed && progress.vendorAudited && progress.embeddingUsed && progress.tokenizerUsed && progress.biasAudited,
      icon: Award,
      color: "#e11d48",
    },
  ];

  return (
    <div className="card" style={{ padding: "24px" }}>
      <h3 style={{ marginBottom: "16px", fontSize: "1.3rem" }} className="gradient-text-indigo">
        Your Learning Dashboard
      </h3>

      {/* Progress Bar */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem" }}>
          <span style={{ color: "var(--text-secondary)" }}>Credential Progress</span>
          <span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>{completionPercentage}% ({completedCountText(completedPaths)})</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>

      {/* Modules List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
        <div style={moduleItemStyle(progress.staff)}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CheckCircle2 style={{ width: 18, height: 18, color: progress.staff ? "var(--success)" : "var(--text-muted)" }} />
            <div>
              <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>Staff Learning Path</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Everyday AI & Member Data Safety</p>
            </div>
          </div>
          {progress.staff ? (
            <span className="badge badge-success">Quiz: {progress.staffScore}%</span>
          ) : (
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Not Started</span>
          )}
        </div>

        <div style={moduleItemStyle(progress.management)}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CheckCircle2 style={{ width: 18, height: 18, color: progress.management ? "var(--success)" : "var(--text-muted)" }} />
            <div>
              <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>Management Learning Path</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>ROI & Underwriting Automation</p>
            </div>
          </div>
          {progress.management ? (
            <span className="badge badge-success">Quiz: {progress.managementScore}%</span>
          ) : (
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Not Started</span>
          )}
        </div>

        <div style={moduleItemStyle(progress.board)}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CheckCircle2 style={{ width: 18, height: 18, color: progress.board ? "var(--success)" : "var(--text-muted)" }} />
            <div>
              <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>Board Learning Path</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Governance, Regulatory Risk & ROI</p>
            </div>
          </div>
          {progress.board ? (
            <span className="badge badge-success">Quiz: {progress.boardScore}%</span>
          ) : (
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Not Started</span>
          )}
        </div>

        <div style={moduleItemStyle(progress.infosec)}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CheckCircle2 style={{ width: 18, height: 18, color: progress.infosec ? "var(--success)" : "var(--text-muted)" }} />
            <div>
              <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>InfoSec Learning Path</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>AI Impersonation & Zero-Trust Defense</p>
            </div>
          </div>
          {progress.infosec ? (
            <span className="badge badge-success">Quiz: {progress.infosecScore}%</span>
          ) : (
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Not Started</span>
          )}
        </div>

        <div style={moduleItemStyle(progress.engineering)}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CheckCircle2 style={{ width: 18, height: 18, color: progress.engineering ? "var(--success)" : "var(--text-muted)" }} />
            <div>
              <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>Engineering Learning Path</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Building Safe AI Systems</p>
            </div>
          </div>
          {progress.engineering ? (
            <span className="badge badge-success">Quiz: {progress.engineeringScore}%</span>
          ) : (
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Not Started</span>
          )}
        </div>
      </div>

      {/* Badges Achievements */}
      <div>
        <h4 style={{ fontSize: "1.05rem", marginBottom: "12px", color: "var(--text-secondary)" }}>
          Earned Badges & Credentials
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }} className="badge-grid">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                style={{
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  background: badge.unlocked ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.01)",
                  border: badge.unlocked ? `1px solid ${badge.color}33` : "1px dashed var(--border-color)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  opacity: badge.unlocked ? 1 : 0.4,
                  transition: "var(--transition-fast)",
                }}
                title={badge.description}
              >
                <div
                  style={{
                    padding: "8px",
                    borderRadius: "var(--radius-full)",
                    background: badge.unlocked ? `${badge.color}15` : "transparent",
                    color: badge.unlocked ? badge.color : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon style={{ width: 22, height: 22 }} />
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: badge.unlocked ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {badge.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 480px) {
          .badge-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

function completedCountText(count: number) {
  if (count === 0) return "Beginner";
  if (count === 1) return "Novice";
  if (count === 2) return "Intermediate";
  if (count === 3) return "Advanced";
  if (count === 4) return "Expert";
  return "AI Champion";
}

function moduleItemStyle(completed: boolean): React.CSSProperties {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    borderRadius: "var(--radius-md)",
    background: completed ? "rgba(16, 185, 129, 0.03)" : "rgba(255, 255, 255, 0.01)",
    border: completed ? "1px solid rgba(16, 185, 129, 0.15)" : "1px solid var(--border-color)",
  };
}
