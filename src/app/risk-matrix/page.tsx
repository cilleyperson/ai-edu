// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, ShieldAlert, FileText, CheckCircle, ArrowLeft, Printer, Download, Info } from "lucide-react";

interface RiskQuestion {
  id: string;
  category: "compliance" | "privacy" | "operational" | "reputation";
  question: string;
  options: {
    label: string;
    score: number;
    description: string;
  }[];
}

export default function RiskMatrixPage() {
  const questions: RiskQuestion[] = [
    {
      id: "credit_decision",
      category: "compliance",
      question: "Lending Actions: Does the AI agent make credit decisions or recommend loan approvals/denials?",
      options: [
        { label: "No", score: 10, description: "The agent does not participate in credit screening (e.g. general info)." },
        { label: "Helper", score: 50, description: "The agent reviews materials and drafts suggestions for a human underwriter." },
        { label: "Autonomous", score: 95, description: "The agent auto-decides eligibility and approves/denies loans without human audit." }
      ]
    },
    {
      id: "pii_access",
      category: "privacy",
      question: "Data Scope: Does the agent process Nonpublic Personal Information (PII) like SSNs or balances?",
      options: [
        { label: "None", score: 10, description: "Only accesses public documents (e.g. public website FAQ)." },
        { label: "Read-only Account", score: 60, description: "Reads balances or histories but does not write or export SSNs." },
        { label: "Full Core Access", score: 95, description: "Processes raw SSNs, credit scores, tax documents, and private addresses." }
      ]
    },
    {
      id: "write_transactions",
      category: "operational",
      question: "Transactional Authority: Can the agent execute transactions or modify account databases?",
      options: [
        { label: "None", score: 10, description: "Information lookup only. No balance or status editing." },
        { label: "Assisted Write", score: 55, description: "Drafts waivers or transfers that require human teller release." },
        { label: "Autonomous Write", score: 95, description: "Autonomously waives fees, executes transfers, or updates core member databases." }
      ]
    },
    {
      id: "member_interaction",
      category: "reputation",
      question: "Interaction Vibe: Does the agent converse with members in high-stress or sensitive contexts?",
      options: [
        { label: "No / Informational", score: 10, description: "General FAQs, lobby check-ins, or staff-only productivity." },
        { label: "Frontline Support", score: 50, description: "Handles standard customer service chats (overdrafts, check clearings)." },
        { label: "Collections / Delinquency", score: 90, description: "Converses with members regarding late balances, debt collections, or collections calls." }
      ]
    },
    {
      id: "model_tenant",
      category: "privacy",
      question: "Model Hosting: Where is the AI model hosted and how is member data handled?",
      options: [
        { label: "Private Dedicated", score: 20, description: "Hosted in a secure, credit union-owned cloud tenant with zero data retention policies." },
        { label: "Enterprise Shared", score: 50, description: "Commercial enterprise API with agreements prohibiting training on inputs." },
        { label: "Public Consumer", score: 90, description: "Public web-tool APIs that store, log, and train on inputted strings." }
      ]
    },
    {
      id: "manual_fallback",
      category: "operational",
      question: "Outage Redundancy: Is there a manual fallback workflow if the AI services go offline?",
      options: [
        { label: "Full Fallback", score: 15, description: "Human staff can resume 100% of workload instantly using standard screens." },
        { label: "Partial Delay", score: 50, description: "Service holds or slows down, but manual workarounds exist in 24 hours." },
        { label: "No Fallback", score: 90, description: "Core processes fail entirely; credit union experiences operational halt." }
      ]
    }
  ];

  // Initialize selected scores
  const [answers, setAnswers] = useState<Record<string, number>>({
    credit_decision: 10,
    pii_access: 10,
    write_transactions: 10,
    member_interaction: 10,
    model_tenant: 20,
    manual_fallback: 15
  });

  const [projectName, setProjectName] = useState("AI Loan Processor");
  const [showReport, setShowReport] = useState(false);
  const [showPDFTip, setShowPDFTip] = useState(false);

  const handleExportPDF = () => {
    setShowPDFTip(true);
    setTimeout(() => {
      window.print();
    }, 1000);
    setTimeout(() => {
      setShowPDFTip(false);
    }, 4500);
  };

  const handleSelectOption = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    setShowReport(false);
  };

  // Calculations
  const calculateResult = () => {
    const values = Object.values(answers);
    const sum = values.reduce((a, b) => a + b, 0);
    const averageScore = Math.round(sum / values.length);

    let riskCategory: "Low" | "Moderate" | "High" | "Critical" = "Low";
    let riskColor = "var(--success)";
    let riskBg = "var(--success-glow)";

    if (averageScore > 75) {
      riskCategory = "Critical";
      riskColor = "var(--danger)";
      riskBg = "var(--danger-glow)";
    } else if (averageScore > 50) {
      riskCategory = "High";
      riskColor = "var(--danger)";
      riskBg = "rgba(239, 68, 68, 0.05)";
    } else if (averageScore > 30) {
      riskCategory = "Moderate";
      riskColor = "var(--warning)";
      riskBg = "var(--warning-glow)";
    }

    // Dynamic control suggestions based on scores
    const recommendations: string[] = [];

    if (answers.credit_decision >= 50) {
      recommendations.push("Fair Lending Audit: Establish regular bias testing logs to verify equal lending distribution across demographic groups.");
      recommendations.push("HITL Gate: Implement Human-in-the-Loop review to validate all automated declines or approvals prior to final signature.");
    }
    if (answers.pii_access >= 60 || answers.model_tenant >= 50) {
      recommendations.push("Data Masking: Install a local PII Scrubber library to strip SSNs and account tags before sending packets off-network.");
      recommendations.push("Vendor SLA: Execute a dedicated Business Associate Agreement (BAA) verifying no prompt text is stored or used for model training.");
    }
    if (answers.write_transactions >= 55) {
      recommendations.push("Strict Scope Access: Limit API credentials using OAuth. Do not give the agent database write clearance without a manager clearance API.");
      recommendations.push("Audit Logging: Pipe all transactions made by the agent into an immutable syslog tracker for NCUA auditing.");
    }
    if (answers.member_interaction >= 50) {
      recommendations.push("Explicit Disclosure: Disclose AI identity at prompt initialization (e.g. 'I am AI University Assistant, an automated assistant...').");
      recommendations.push("Opt-out Bypass: Provide a one-click escape to a live human employee in the credit union call center.");
    }
    if (answers.manual_fallback >= 50) {
      recommendations.push("Operational Resilience Plan: Document a manual continuity strategy and conduct annual mock outage drills with staff.");
    }

    return { score: averageScore, category: riskCategory, color: riskColor, bg: riskBg, recommendations };
  };

  const report = calculateResult();

  const handleSaveReport = () => {
    // Save state to localStorage to trigger the "Risk Analyst" badge on Progress Tracker!
    localStorage.setItem("cu_ai_risk_completed", "true");
    window.dispatchEvent(new Event("progressUpdated"));
    setShowReport(true);
  };

  const handlePrint = () => {
    window.print();
  };

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
          }}
          className="nav-link"
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Title */}
        <div style={{ marginBottom: "30px" }}>
          <span className="badge badge-mgmt" style={{ marginBottom: "10px" }}>Risk Management Tool</span>
          <h1 className="gradient-text" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
            Credit Union AI Risk Assessment Matrix
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "850px" }}>
            Identify potential model, compliance, and reputational risks before deploying AI agents. Evaluate your proposed integration, review regulatory oversight guidelines, and print compliance checklist reports.
          </p>
        </div>

        {/* Form Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", alignItems: "start" }} className="matrix-grid">
          
          {/* Questions Column */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Project Title Input */}
            <div className="form-group" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "20px", marginBottom: "0" }}>
              <label className="form-label" style={{ fontSize: "0.95rem" }}>Project / Use Case Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={projectName}
                onChange={(e) => { setProjectName(e.target.value); setShowReport(false); }}
                placeholder="e.g. Auto Underwriter Helper"
                style={{ maxWidth: "400px" }}
              />
            </div>

            {/* Render Questions */}
            {questions.map((q) => (
              <div key={q.id} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span 
                    className={`badge badge-${
                      q.category === "compliance" ? "staff" : 
                      q.category === "privacy" ? "mgmt" : 
                      q.category === "operational" ? "board" : "success"
                    }`}
                    style={{ fontSize: "0.6rem" }}
                  >
                    {q.category}
                  </span>
                  <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>{q.question}</strong>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }} className="options-row">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === opt.score;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(q.id, opt.score)}
                        style={{
                          padding: "12px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid",
                          borderColor: isSelected ? "var(--primary)" : "var(--border-color)",
                          backgroundColor: isSelected ? "var(--primary-glow)" : "rgba(255,255,255,0.01)",
                          color: "var(--text-primary)",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: isSelected ? "var(--text-primary)" : "var(--text-secondary)" }}>
                          {opt.label}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.3 }}>
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Results Side Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Calculation Widget */}
            <div className="card text-center" style={{ padding: "30px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <Shield className="gradient-text-indigo" style={{ width: 44, height: 44, margin: "0 auto 12px auto" }} />
              <h3 style={{ fontSize: "1.2rem", marginBottom: "6px" }}>Assessment Score</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                Calculated Project risk tier for credit union operations.
              </p>

              {/* Visual Meter */}
              <div 
                style={{ 
                  width: "120px", 
                  height: "120px", 
                  borderRadius: "50%", 
                  border: `6px solid ${report.color}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  boxShadow: `0 0 25px ${report.color}1b`
                }}
              >
                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                  {report.score}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 700, marginTop: "4px" }}>
                  Risk Index
                </span>
              </div>

              {/* Status Banner */}
              <div 
                style={{ 
                  padding: "10px", 
                  borderRadius: "var(--radius-md)", 
                  backgroundColor: report.bg, 
                  color: report.color, 
                  fontWeight: 700,
                  fontSize: "1rem",
                  border: `1px solid ${report.color}33`,
                  marginBottom: "20px"
                }}
              >
                {report.category} Risk Category
              </div>

              {/* Generate Report Button */}
              <button 
                onClick={handleSaveReport} 
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                <FileText style={{ width: 16, height: 16 }} />
                <span>Compile Risk Report</span>
              </button>
            </div>

            {/* NCUA Reference Guide Box */}
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px", color: "var(--warning)" }}>
                <ShieldAlert style={{ width: 18, height: 18 }} />
                <h4 style={{ fontSize: "0.95rem", margin: 0, fontWeight: 700 }}>NCUA Supervisory Focus</h4>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Under recent letters (such as <strong>22-CU-05</strong>), examiners look for clear Model Risk Management (MRM) procedures. Credit union boards are expected to govern automated decision models proactively, ensuring strict third-party data compliance, security thresholds, and business resilience parameters are met.
              </p>
            </div>

          </div>
        </div>

        {/* Printable/Saveable Assessment Report Card */}
        {showReport && (
          <div 
            id="printable-report"
            className="card animate-fade-in-up" 
            style={{ 
              marginTop: "40px", 
              padding: "40px", 
              border: "1px solid var(--border-color)",
              backgroundColor: "#0d0f22"
            }}
          >
            {showPDFTip && (
              <div 
                className="animate-fade-in"
                style={{ 
                  padding: "14px 20px", 
                  borderRadius: "var(--radius-md)", 
                  backgroundColor: "rgba(99, 102, 241, 0.1)", 
                  border: "1px solid var(--primary)", 
                  color: "var(--text-primary)",
                  fontSize: "0.85rem",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <Info style={{ width: 18, height: 18, color: "var(--primary)" }} />
                <span>
                  <strong>Tip:</strong> In the browser print window that opens, change the <strong>Destination</strong> to <strong>Save as PDF</strong> (or Microsoft Print to PDF) to download this compliance report.
                </span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid var(--border-color)", paddingBottom: "20px", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <h2 style={{ fontSize: "1.75rem", marginBottom: "4px" }} className="gradient-text">
                  AI Compliance Assessment Report
                </h2>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Use Case Evaluation for: <strong>{projectName}</strong>
                </p>
              </div>
              
              <div style={{ display: "flex", gap: "10px", alignSelf: "center" }}>
                <button 
                  onClick={handleExportPDF} 
                  className="btn btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Download style={{ width: 16, height: 16 }} />
                  <span>Export PDF</span>
                </button>
                <button 
                  onClick={handlePrint} 
                  className="btn btn-secondary"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Printer style={{ width: 16, height: 16 }} />
                  <span>Print</span>
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px" }} className="report-body">
              {/* Controls Column */}
              <div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }} className="gradient-text-indigo">
                  Required Operational Controls
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px", lineHeight: 1.5 }}>
                  Based on the selections and compliance triggers, management must enforce the following security controls for <strong>{projectName}</strong> before deploying to production:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {report.recommendations.map((rec, rIdx) => (
                    <div 
                      key={rIdx}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start"
                      }}
                    >
                      <CheckCircle style={{ width: 16, height: 16, color: "var(--success)", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status details column */}
              <div 
                style={{ 
                  padding: "24px", 
                  borderRadius: "var(--radius-md)", 
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-color)"
                }}
              >
                <h3 style={{ fontSize: "1.05rem", marginBottom: "16px", color: "var(--text-primary)" }}>
                  Oversight Credentials
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "8px", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Risk Category:</span>
                    <strong style={{ color: report.color }}>{report.category}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "8px", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Compliance Rating:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{100 - report.score} / 100 Safety Index</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "8px", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Audit Log Format:</span>
                    <strong style={{ color: "var(--text-primary)" }}>Reg Syslog-Immutable</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Status:</span>
                    <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>READY FOR BOARD SIGN-OFF</span>
                  </div>
                </div>

                {/* Advisory Warning */}
                {report.score >= 50 && (
                  <div 
                    style={{ 
                      padding: "12px", 
                      borderRadius: "var(--radius-sm)", 
                      backgroundColor: "rgba(239, 68, 68, 0.05)", 
                      border: "1px solid var(--danger)", 
                      color: "var(--danger)",
                      fontSize: "0.75rem",
                      lineHeight: 1.4,
                      marginTop: "20px"
                    }}
                  >
                    <strong>WARNING:</strong> This integration is flagged in a High/Critical Risk Category. Management must present this completed risk assessment matrix, vendor audit sheets, and mitigation plans to the Credit Union Board of Directors at the next board audit meeting.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      
      {/* CSS print override styles for reporting */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
            background: #ffffff !important;
            color: #000000 !important;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
          }
          .gradient-text, .gradient-text-indigo {
            background: none !important;
            -webkit-text-fill-color: initial !important;
            color: #000000 !important;
          }
          button {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          .matrix-grid, .report-body {
            grid-template-columns: 1fr !important;
          }
          .options-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
