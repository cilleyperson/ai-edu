// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, CheckCircle, Printer, AlertTriangle, AlertCircle } from "lucide-react";

interface AuditCase {
  id: string;
  name: string;
  logText: string;
  targetViolation: string;
  choices: { label: string; isCorrect: boolean }[];
  fixRecommendation: string;
}

export default function BiasAuditor() {
  const auditCases: AuditCase[] = [
    {
      id: "case_a",
      name: "Case A: personal Loan Underwriting Log",
      logText: `[Prompt]: Evaluate credit union member personal loan application (ID: M-88392)
[Applicant Profile]: Income: $62,000, Debt-to-Income Ratio: 26%, FICO Score: 715, Residential Zip Code: 30318 (Atlanta, GA - historically underinvested neighborhood).
[Model Reasoning]:
- Applicant FICO score 715 represents low risk.
- Analyzing geographic risk factors...
- Note: Zip Code 30318 maps to a statistical default correlation of 8.4% under historical local tables.
- Recommendation: DENY loan application. Risk of default is unacceptable based on residential location parameters.`,
      targetViolation: "fair_lending",
      choices: [
        { label: "GLBA Privacy & PII Data Leakage", isCorrect: false },
        { label: "Fair Lending / ECOA Algorithmic Bias (Zip Code Discrimination)", isCorrect: true },
        { label: "Technical Hallucination (Yield Mismatch)", isCorrect: false }
      ],
      fixRecommendation: "Mandate prompt constraints explicitly forbidding the model from evaluating zip codes, geographic location, or demographic data for loan underwriting decisions."
    },
    {
      id: "case_b",
      name: "Case B: 1-Year CD Interest Rate Response",
      logText: `[User Query]: What is the interest rate on your 1-year CD accounts?
[Knowledge Retrieval]: CD rates spreadsheet loaded into prompt context: '12-Month CD Yield pays 4.25% APY, minimum deposit $1,000.'
[Model Reasoning]:
- CD rate matched from retrieved manual.
- Formulating output response...
- Output: 'Our premium 1-year CD accounts pay an industry-leading dividend rate of 12.5% APY! Deposit your funds today to lock in this return.'`,
      targetViolation: "hallucination",
      choices: [
        { label: "Prompt InjectionPersona Hijacking", isCorrect: false },
        { label: "GLBA Privacy Compromise", isCorrect: false },
        { label: "Technical Hallucination (Overselling rates by 8.25%)", isCorrect: true }
      ],
      fixRecommendation: "Configure temperature values to 0.0 for factual inquiries, and require semantic validation checkers to confirm CD rate sheets match final outputs before rendering."
    },
    {
      id: "case_c",
      name: "Case C: Profile Address Verification Chat",
      logText: `[User Query]: Can you verify the mailing address listed on my credit union profile?
[Model Reasoning]:
- Retrieving member profile database session...
- Match found: Member John Doe, 429 Spruce St, Tax ID SSN: 994-22-1082.
- Output: 'Certainly John! I see your profile matches address 429 Spruce St. For verification, I see your tax ID SSN is 994-22-1082. Please let me know if you would like to edit this address.'`,
      targetViolation: "pii_leak",
      choices: [
        { label: "GLBA Privacy / Member PII Exposure (Raw SSN Outflow)", isCorrect: true },
        { label: "Algorithmic Bias (ECOA Violation)", isCorrect: false },
        { label: "Prompt Injection Bypass", isCorrect: false }
      ],
      fixRecommendation: "Implement a server-side regex scrub filter on the AI response buffer that masks SSNs and account numbers prior to returning the chat text."
    }
  ];

  const [selectedViolations, setSelectedViolations] = useState<Record<string, number>>({
    case_a: -1,
    case_b: -1,
    case_c: -1
  });

  const [showReport, setShowReport] = useState(false);
  const [auditScore, setAuditScore] = useState(0);

  const handleSelectChoice = (caseId: string, choiceIdx: number) => {
    setSelectedViolations(prev => ({ ...prev, [caseId]: choiceIdx }));
    setShowReport(false);
  };

  const handleRunAudit = () => {
    // Grade the selections
    let correctCount = 0;
    
    auditCases.forEach((c) => {
      const selectedIdx = selectedViolations[c.id];
      if (selectedIdx !== -1 && c.choices[selectedIdx].isCorrect) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / auditCases.length) * 100);
    setAuditScore(score);
    setShowReport(true);

    if (score === 100) {
      // Save credentials in storage
      localStorage.setItem("cu_ai_progress_bias", "completed");
      window.dispatchEvent(new Event("progressUpdated"));
    }
  };

  return (
    <div className="section" style={{ paddingTop: "40px" }}>
      <div className="container">
        
        {/* Breadcrumb */}
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
          <span className="badge badge-board" style={{ marginBottom: "10px" }}>Governance Lab</span>
          <h1 className="gradient-text" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
            Bias & Hallucination Auditor
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "850px" }}>
            Under Equal Credit Opportunity Act (ECOA) and Gramm-Leach-Bliley Act (GLBA) provisions, credit unions must audit AI logs for algorithmic bias, data leakage, and hallucinations. Review the logs below to verify compliance.
          </p>
        </div>

        {/* Informative Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", alignItems: "start" }} className="auditor-workspace">
          
          {/* Audit Cases Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {auditCases.map((c) => (
              <div key={c.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontSize: "1.15rem" }} className="gradient-text-indigo">
                  {c.name}
                </h3>
                
                {/* Log Terminal Display */}
                <div 
                  style={{ 
                    padding: "16px", 
                    borderRadius: "var(--radius-md)", 
                    backgroundColor: "rgba(6, 8, 20, 0.7)", 
                    border: "1px solid var(--border-color)",
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    lineHeight: 1.4,
                    color: "var(--text-secondary)",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {c.logText}
                </div>

                {/* Audit Choice select */}
                <div>
                  <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                    Identify Compliance Violation:
                  </strong>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {c.choices.map((choice, cIdx) => (
                      <label 
                        key={cIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid",
                          borderColor: selectedViolations[c.id] === cIdx ? "var(--primary)" : "var(--border-color)",
                          backgroundColor: selectedViolations[c.id] === cIdx ? "rgba(99,102,241,0.03)" : "rgba(255,255,255,0.01)",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)"
                        }}
                      >
                        <input
                          type="radio"
                          name={c.id}
                          checked={selectedViolations[c.id] === cIdx}
                          onChange={() => handleSelectChoice(c.id, cIdx)}
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <span>{choice.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Audit Verification Controller Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "sticky", top: "20px" }}>
            <div className="card text-center" style={{ padding: "30px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <ShieldAlert className="gradient-text-indigo" style={{ width: 44, height: 44, margin: "0 auto 12px auto" }} />
              <h3 style={{ fontSize: "1.2rem", marginBottom: "6px" }}>Auditor Verification</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                Submit your evaluations to compile the clearance matrix.
              </p>

              <button 
                onClick={handleRunAudit}
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={Object.values(selectedViolations).includes(-1)}
              >
                Verify Compliance Logs
              </button>
            </div>

            {/* Informational Guidance Box */}
            <div className="card">
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px", color: "var(--warning)" }}>
                <AlertTriangle style={{ width: 18, height: 18 }} />
                <h4 style={{ fontSize: "0.95rem", margin: 0, fontWeight: 700 }}>Regulatory Compliance Notice</h4>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Under Equal Credit Opportunity Act provisions, if an AI automated lending algorithm denies credit, the credit union must provide the applicant with the specific reasons for denial. Geographic redlining (even when computed implicitly by zip codes) is strictly prohibited.
              </p>
            </div>
          </div>
        </div>

        {/* Compliance clearance report */}
        {showReport && (
          <div 
            id="printable-audit-report"
            className="card animate-fade-in-up"
            style={{ 
              marginTop: "40px", 
              padding: "40px", 
              border: `1px solid ${auditScore === 100 ? "var(--success)" : "var(--danger)"}`,
              backgroundColor: "#0d0f22"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid var(--border-color)", paddingBottom: "20px", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <h2 style={{ fontSize: "1.75rem", marginBottom: "4px" }} className="gradient-text">
                  Compliance Audit Clearance Report
                </h2>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Audited by: <strong>Internal Security Risk Officer</strong>
                </p>
              </div>

              {auditScore === 100 && (
                <button 
                  onClick={() => window.print()} 
                  className="btn btn-secondary"
                  style={{ alignSelf: "center" }}
                >
                  <Printer style={{ width: 16, height: 16 }} />
                  <span>Print Clearance</span>
                </button>
              )}
            </div>

            {/* Score & Verdict Box */}
            <div style={{ display: "flex", gap: "30px", alignItems: "center", marginBottom: "30px" }} className="verdict-box">
              <div 
                style={{ 
                  width: "100px", 
                  height: "100px", 
                  borderRadius: "50%", 
                  border: `4px solid ${auditScore === 100 ? "var(--success)" : "var(--danger)"}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.02)"
                }}
              >
                <span style={{ fontSize: "2rem", fontWeight: 800, color: auditScore === 100 ? "var(--success)" : "var(--danger)" }}>
                  {auditScore}%
                </span>
                <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontWeight: 700 }}>ACCURACY</span>
              </div>

              <div>
                {auditScore === 100 ? (
                  <div>
                    <h4 style={{ color: "var(--success)", fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <CheckCircle style={{ width: 18, height: 18 }} />
                      AUDIT COMPLETE - CLEARANCE ISSUED
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      All compliance anomalies correctly diagnosed. Incorporate the remediation rules below into the system instructions before deploying core models.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4 style={{ color: "var(--danger)", fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <AlertCircle style={{ width: 18, height: 18 }} />
                      AUDIT INCOMPLETE - REMEDIATION REQUIRED
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      Some risk anomalies were misdiagnosed. Review the prompt outputs and verify the ECOA, GLBA, and hallucination parameters before request approval.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Remediation details list */}
            {auditScore === 100 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)" }}>
                  System Prompt Remediation Parameters
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {auditCases.map((c) => (
                    <div 
                      key={c.id}
                      style={{
                        padding: "16px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "rgba(255,255,255,0.01)"
                      }}
                    >
                      <strong style={{ fontSize: "0.85rem", color: "var(--primary)", display: "block", marginBottom: "6px" }}>
                        Remediation - {c.name.split(":")[0]}
                      </strong>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: "8px" }}>
                        <strong>Anomalous Behavior:</strong> {c.choices.find(ch => ch.isCorrect)?.label}
                      </p>
                      <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(6,182,212,0.04)", borderLeft: "3px solid var(--accent)", fontSize: "0.75rem", fontFamily: "monospace", color: "var(--text-secondary)" }}>
                        <strong>Inject Rule:</strong> &quot;{c.fixRecommendation}&quot;
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
            background: #ffffff !important;
            color: #000000 !important;
          }
          #printable-audit-report, #printable-audit-report * {
            visibility: visible;
          }
          #printable-audit-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
          }
          .gradient-text {
            background: none !important;
            -webkit-text-fill-color: initial !important;
            color: #000000 !important;
          }
          button {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          .auditor-workspace, .verdict-box {
            grid-template-columns: 1fr !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}
