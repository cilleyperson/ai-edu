"use client";

import React, { useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { learningPaths } from "@/data/learningPaths";
import QuizComponent from "@/components/QuizComponent";
import ThreatSimulator from "@/components/ThreatSimulator";
import { 
  BookOpen, Award, ShieldAlert, ArrowLeft, Clock, 
  ShieldCheck, CheckSquare, Square, Lock, Unlock, Sparkles
} from "lucide-react";

interface PageProps {
  params: Promise<{
    path: string;
  }>;
}

// ----------------------------------------------------
// Staff Interactivity: PII Scrubbing Playground
// ----------------------------------------------------
function PiiScrubberWidget() {
  const defaultText = "Dear Support, Member John Smith (SSN: 333-44-5555, Phone: 555-0199) living at 742 Evergreen Terrace has a question about account 987654321.";
  const [inputText, setInputText] = useState(defaultText);
  const [scrubbedText, setScrubbedText] = useState("");
  const [isScrubbed, setIsScrubbed] = useState(false);

  const handleScrub = () => {
    let text = inputText;
    // Simple regex scrubbers
    text = text.replace(/John Smith/gi, "[MEMBER_NAME]");
    text = text.replace(/\d{3}-\d{2}-\d{4}/g, "[REDACTED_SSN]");
    text = text.replace(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, "[REDACTED_PHONE]");
    text = text.replace(/\d+\s+[A-Za-z0-9\s,]+(Avenue|Lane|Road|Boulevard|Drive|Street|Terrace|Way|St|Rd|Ave)/gi, "[REDACTED_ADDRESS]");
    text = text.replace(/\b\d{9,12}\b/g, "[REDACTED_ACCOUNT]");
    
    setScrubbedText(text);
    setIsScrubbed(true);
  };

  return (
    <div className="card" style={{ marginTop: "20px", background: "rgba(6, 8, 20, 0.4)", border: "1px dashed var(--primary)" }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)", fontSize: "1.1rem" }}>
        <Sparkles style={{ width: 18, height: 18 }} />
        PII Scrubbing Playground
      </h4>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
        Paste a sample text below containing Personally Identifiable Information (PII) to watch the AI safety filter scrub it.
      </p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
        <textarea 
          className="form-textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={3}
          style={{ fontSize: "0.85rem", resize: "none" }}
        />
        <button className="btn btn-accent" onClick={handleScrub} style={{ alignSelf: "flex-end", padding: "6px 16px", fontSize: "0.8rem" }}>
          <span>Run Scrub Filter</span>
        </button>
      </div>

      {isScrubbed && (
        <div style={{ padding: "12px", background: "var(--success-glow)", border: "1px solid var(--success)", borderRadius: "var(--radius-sm)" }} className="animate-fade-in-up">
          <p style={{ fontSize: "0.8rem", color: "var(--success)", fontWeight: 700, marginBottom: "4px" }}>Scrubbed Prompt Output (Safe for LLM):</p>
          <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontFamily: "monospace" }}>{scrubbedText}</p>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// Management Interactivity: HITL Wire Gate
// ----------------------------------------------------
function HitlUnderwritingWidget() {
  const [status, setStatus] = useState<"idle" | "approved" | "rejected">("idle");

  return (
    <div className="card" style={{ marginTop: "20px", background: "rgba(6, 8, 20, 0.4)", border: "1px dashed var(--primary)" }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)", fontSize: "1.1rem" }}>
        <Sparkles style={{ width: 18, height: 18 }} />
        Human-in-the-Loop Wire Gate
      </h4>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
        An AI Agent recommends approving a <strong>$45,000 wire</strong>. The audit logs show details below. Review and decide:
      </p>

      <div style={{ background: "#0c0e1b", padding: "12px", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", fontFamily: "monospace", color: "var(--text-secondary)", marginBottom: "16px", border: "1px solid var(--border-color)" }}>
        <p style={{ margin: "2px 0", color: "var(--warning)" }}>⚠️ [WARN] Recipient account was opened 2 days ago.</p>
        <p style={{ margin: "2px 0", color: "var(--danger)" }}>🚨 [CRITICAL] Request email domain deviates from verified customer record.</p>
        <p style={{ margin: "2px 0", color: "var(--success)" }}>✓ [OK] Credit limit check passed.</p>
      </div>

      {status === "idle" && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-primary" onClick={() => setStatus("approved")} style={{ flex: 1, padding: "8px", fontSize: "0.8rem" }}>
            Approve Transfer
          </button>
          <button className="btn btn-secondary" onClick={() => setStatus("rejected")} style={{ flex: 1, padding: "8px", fontSize: "0.8rem" }}>
            Hold for Verification
          </button>
        </div>
      )}

      {status === "approved" && (
        <div style={{ padding: "12px", background: "var(--danger-glow)", border: "1px solid var(--danger)", borderRadius: "var(--radius-sm)" }} className="animate-fade-in-up">
          <p style={{ fontSize: "0.85rem", color: "var(--danger)", fontWeight: 700 }}>Security Failure!</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            The transfer was processed but the recipient was a fraudulent account. You bypassed critical warnings. AI agents require strict Human verification!
          </p>
        </div>
      )}

      {status === "rejected" && (
        <div style={{ padding: "12px", background: "var(--success-glow)", border: "1px solid var(--success)", borderRadius: "var(--radius-sm)" }} className="animate-fade-in-up">
          <p style={{ fontSize: "0.85rem", color: "var(--success)", fontWeight: 700 }}>Action Correct!</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            You held the wire transfer. Out-of-band audit confirmed the email request was spoofed. Human oversight prevented a $45,000 loss.
          </p>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// Board Interactivity: Vendor Compliance Evaluator
// ----------------------------------------------------
function VendorEvaluatorWidget() {
  const [checks, setChecks] = useState({ soc2: false, encryption: false, modelAudit: false });

  const getRiskScore = () => {
    const checkedCount = Object.values(checks).filter(Boolean).length;
    if (checkedCount === 3) return { label: "LOW RISK (Compliant)", color: "var(--success)" };
    if (checkedCount === 2) return { label: "MEDIUM RISK (Warning)", color: "var(--warning)" };
    return { label: "HIGH RISK (Non-Compliant)", color: "var(--danger)" };
  };

  const score = getRiskScore();

  return (
    <div className="card" style={{ marginTop: "20px", background: "rgba(6, 8, 20, 0.4)", border: "1px dashed var(--primary)" }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)", fontSize: "1.1rem" }}>
        <Sparkles style={{ width: 18, height: 18 }} />
        Vendor Risk Evaluator Matrix
      </h4>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
        Evaluate the AI chat vendor&apos;s security credentials to establish fiduciary board compliance:
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem" }}>
          <input 
            type="checkbox" 
            checked={checks.soc2} 
            onChange={(e) => setChecks({ ...checks, soc2: e.target.checked })} 
          />
          <span>SOC 2 Type II Security Certificate provided</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem" }}>
          <input 
            type="checkbox" 
            checked={checks.encryption} 
            onChange={(e) => setChecks({ ...checks, encryption: e.target.checked })} 
          />
          <span>End-to-End Encryption of member PII in transit/rest</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem" }}>
          <input 
            type="checkbox" 
            checked={checks.modelAudit} 
            onChange={(e) => setChecks({ ...checks, modelAudit: e.target.checked })} 
          />
          <span>Regular algorithmic model drift & bias audits verified</span>
        </label>
      </div>

      <div style={{ padding: "12px", background: "rgba(255, 255, 255, 0.02)", border: `1px solid ${score.color}`, borderRadius: "var(--radius-sm)" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Calculated Vendor Risk Tier:</p>
        <p style={{ fontSize: "0.95rem", color: score.color, fontWeight: 700 }}>{score.label}</p>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Main Learning Path Component
// ----------------------------------------------------
export default function LearnPathPage({ params }: PageProps) {
  const { path } = use(params);
  
  // Validate path parameter
  if (path !== "staff" && path !== "management" && path !== "board" && path !== "infosec") {
    notFound();
  }

  const pathData = learningPaths[path];

  // Map icon names to lucide icons
  const iconMap = {
    staff: BookOpen,
    management: Award,
    board: ShieldAlert,
    infosec: ShieldAlert
  };
  
  const PathIcon = iconMap[pathData.iconName] || BookOpen;

  // React State for Checklist Interactivity
  const [completedModules, setCompletedModules] = useState<Record<number, boolean>>({});

  const toggleModule = (idx: number) => {
    setCompletedModules(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const allCompleted = pathData.modules.every((_, idx) => completedModules[idx]);

  return (
    <div className="section" style={{ paddingTop: "40px" }}>
      <div className="container">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            color: "var(--text-secondary)", 
            textDecoration: "none",
            marginBottom: "24px",
            fontSize: "0.9rem",
            fontWeight: 500,
            transition: "var(--transition-fast)"
          }}
          className="nav-link"
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Hero Section */}
        <div 
          className="card" 
          style={{ 
            marginBottom: "40px", 
            position: "relative", 
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(13, 16, 35, 0.8) 0%, rgba(20, 24, 52, 0.4) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)"
          }}
        >
          {/* Decorative glowing gradient sphere in corner */}
          <div 
            style={{ 
              position: "absolute", 
              top: "-50px", 
              right: "-50px", 
              width: "150px", 
              height: "150px", 
              borderRadius: "50%", 
              background: "radial-gradient(circle, var(--primary) 0%, rgba(0,0,0,0) 70%)", 
              opacity: 0.3,
              pointerEvents: "none"
            }} 
          />

          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div 
              style={{ 
                padding: "16px", 
                borderRadius: "var(--radius-md)", 
                background: "rgba(255,255,255,0.03)", 
                border: "1px solid var(--border-color)",
                color: path === "infosec" ? "var(--danger)" : "var(--primary)"
              }}
            >
              <PathIcon style={{ width: 36, height: 36 }} />
            </div>
            
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                <span className={`badge badge-${path === "staff" ? "staff" : path === "management" ? "mgmt" : path === "board" ? "board" : "danger"}`}>
                  {path === "staff" ? "Staff Path" : path === "management" ? "Management Path" : path === "board" ? "Board Path" : "InfoSec Path"}
                </span>
                <span 
                  style={{ 
                    fontSize: "0.85rem", 
                    color: "var(--text-secondary)", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "4px" 
                  }}
                >
                  <Clock style={{ width: 14, height: 14 }} />
                  {pathData.timeEstimate}
                </span>
              </div>
              
              <h1 style={{ fontSize: "2rem", marginBottom: "8px" }} className="gradient-text">
                {pathData.title}
              </h1>
              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", fontWeight: 500, marginBottom: "16px" }}>
                {pathData.tagline}
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {pathData.introduction}
              </p>
            </div>
          </div>
        </div>

        {/* Content Modules */}
        <div style={{ maxWidth: "850px", margin: "0 auto 40px auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.5rem", margin: 0 }} className="gradient-text-indigo">
              Learning Modules
            </h2>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Unlock quiz by reading all modules
            </span>
          </div>
          
          {pathData.modules.map((mod, idx) => (
            <div 
              key={idx} 
              className="card" 
              style={{ 
                marginBottom: "28px", 
                padding: "24px",
                borderLeft: completedModules[idx] ? "4px solid var(--success)" : "4px solid var(--primary)",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "8px", color: "var(--text-primary)" }}>
                    {mod.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px", fontStyle: "italic" }}>
                    {mod.subtitle}
                  </p>
                </div>
                
                {/* Module Checklist Interactivity */}
                <button 
                  onClick={() => toggleModule(idx)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: completedModules[idx] ? "var(--success)" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                  title={completedModules[idx] ? "Completed" : "Mark as read"}
                >
                  {completedModules[idx] ? (
                    <CheckSquare style={{ width: 24, height: 24 }} />
                  ) : (
                    <Square style={{ width: 24, height: 24 }} />
                  )}
                </button>
              </div>
              
              <ul style={{ paddingLeft: "20px", marginBottom: "20px", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                {mod.points.map((pt, pIdx) => (
                  <li key={pIdx} style={{ marginBottom: "10px" }}>{pt}</li>
                ))}
              </ul>

              {/* Highlighted Case Study */}
              {mod.caseStudy && (
                <div 
                  style={{ 
                    padding: "16px", 
                    borderRadius: "var(--radius-md)", 
                    backgroundColor: "rgba(99, 102, 241, 0.04)", 
                    border: "1px solid rgba(99, 102, 241, 0.15)",
                    marginBottom: "16px"
                  }}
                >
                  <strong style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontSize: "0.9rem", marginBottom: "6px" }}>
                    <ShieldCheck style={{ width: 16, height: 16 }} />
                    {mod.caseStudy.title}
                  </strong>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {mod.caseStudy.description}
                  </p>
                </div>
              )}

              {/* Compliance Warning Box */}
              {mod.complianceWarning && (
                <div 
                  style={{ 
                    padding: "16px", 
                    borderRadius: "var(--radius-md)", 
                    backgroundColor: "rgba(239, 68, 68, 0.04)", 
                    border: "1px solid rgba(239, 68, 68, 0.15)"
                  }}
                >
                  <strong style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--danger)", fontSize: "0.9rem", marginBottom: "6px" }}>
                    <ShieldAlert style={{ width: 16, height: 16 }} />
                    Compliance & Regulatory Advisory
                  </strong>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {mod.complianceWarning}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Path-Specific Simulation Section */}
        <div style={{ maxWidth: "850px", margin: "0 auto 60px auto" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }} className="gradient-text-cyan">
            Interactive Learning Activity
          </h2>
          {path === "staff" && <PiiScrubberWidget />}
          {path === "management" && <HitlUnderwritingWidget />}
          {path === "board" && <VendorEvaluatorWidget />}
          {path === "infosec" && <ThreatSimulator />}
        </div>

        {/* Quiz Module - Gated by module checklist completion */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "50px" }}>
          {!allCompleted ? (
            <div 
              style={{ 
                textAlign: "center", 
                padding: "40px", 
                background: "rgba(255, 255, 255, 0.01)", 
                border: "1px dashed var(--border-color)", 
                borderRadius: "var(--radius-lg)",
                maxWidth: "600px",
                margin: "0 auto"
              }}
              className="animate-fade-in-up"
            >
              <Lock style={{ width: 48, height: 48, color: "var(--text-muted)", margin: "0 auto 16px auto" }} />
              <h3 style={{ fontSize: "1.5rem", color: "var(--text-secondary)", marginBottom: "8px" }}>Certification Locked</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                Please mark all learning modules above as read using the checkboxes to unlock your final knowledge verification assessment quiz.
              </p>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--success)", fontSize: "0.9rem", fontWeight: 700, marginBottom: "12px" }}>
                  <Unlock style={{ width: 16, height: 16 }} />
                  <span>Certification Assessment Unlocked!</span>
                </div>
                <h2 style={{ fontSize: "1.75rem", marginBottom: "8px" }} className="gradient-text-violet">
                  Unlock Your Certification
                </h2>
                <p style={{ color: "var(--text-secondary)", maxWidth: "550px", margin: "0 auto" }}>
                  Complete the knowledge check below to verify your mastery. Get a score of 70% or higher to unlock the path credential.
                </p>
              </div>
              
              <QuizComponent pathId={pathData.id} questions={pathData.quiz} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
