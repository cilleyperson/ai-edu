// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Activity, Users, DollarSign, Target, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface Choice {
  id: string;
  text: string;
  impact: { reputation: number; compliance: number; financial: number };
  consequenceText: string;
}

interface ScenarioStep {
  id: number;
  title: string;
  description: string;
  choices: Choice[];
}

export default function WarRoom() {
  const [currentStepId, setCurrentStepId] = useState(0);
  const [metrics, setMetrics] = useState({ reputation: 100, compliance: 100, financial: 100 });
  const [history, setHistory] = useState<{ step: ScenarioStep; choice: Choice }[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const scenarioSteps: ScenarioStep[] = [
    {
      id: 0,
      title: "Incident 01: The Rogue Loan Agent",
      description: "At 9:45 AM, InfoSec detects that your new public-facing AI loan assistant offered a user a $1,000,000 unsecured loan at a 0% interest rate. The user has screenshotted the conversation and posted it to social media, where it is currently trending.",
      choices: [
        {
          id: "c1",
          text: "Immediately pull the plug on the AI system and issue a public apology stating it was a glitch.",
          impact: { reputation: -10, compliance: 5, financial: -5 },
          consequenceText: "You halted the damage quickly, but the public apology drew more attention. The system downtime also frustrated normal users."
        },
        {
          id: "c2",
          text: "Leave the system online but rapidly deploy a patch to the system prompt to ban 0% loans.",
          impact: { reputation: -20, compliance: -15, financial: -10 },
          consequenceText: "The patch was bypassed within 20 minutes by users using prompt injection. The regulator is unhappy the risky system was left online."
        },
        {
          id: "c3",
          text: "Throttle the system to 'maintenance mode' and contact legal to evaluate if the chatbot's offer constitutes a legally binding contract.",
          impact: { reputation: -5, compliance: 10, financial: -15 },
          consequenceText: "A prudent choice. Legal advises that the chat log is not a binding contract due to your Terms of Service, but legal fees are piling up."
        }
      ]
    },
    {
      id: 1,
      title: "Incident 02: The NCUA Inquiry",
      description: "It's 2:00 PM. The NCUA (regulator) has contacted your compliance department regarding the morning's incident. They are requesting the model's audit logs and fair lending impact assessment.",
      choices: [
        {
          id: "c1",
          text: "Hand over the complete raw RAG logs and model weights immediately to show full transparency.",
          impact: { reputation: 10, compliance: -20, financial: 0 },
          consequenceText: "You handed over raw logs that accidentally contained unmasked member PII (Social Security Numbers) embedded in the context window. Huge compliance violation!"
        },
        {
          id: "c2",
          text: "Delay the regulators. State that the AI vendor owns the logs and it will take 30 days to retrieve them.",
          impact: { reputation: -15, compliance: -30, financial: -20 },
          consequenceText: "The NCUA views this as a lack of vendor oversight. They issue a formal warning letter (Letter of Understanding and Agreement) for poor governance."
        },
        {
          id: "c3",
          text: "Provide the sanitized audit trail showing the Human-in-the-Loop (HITL) architecture prevented the loan from actually being funded.",
          impact: { reputation: 15, compliance: 25, financial: 5 },
          consequenceText: "Excellent. Because you had a HITL gateway, no money actually moved. The regulator is satisfied with your architectural safeguards."
        }
      ]
    },
    {
      id: 2,
      title: "Incident 03: The Vendor Ransom",
      description: "Day 2, 8:00 AM. The third-party vendor providing your LLM API emails you. They suffered a breach. Hackers are threatening to leak your credit union's cached chat logs unless a ransom is paid.",
      choices: [
        {
          id: "c1",
          text: "Pay the ransom quietly to protect member data and avoid a PR nightmare.",
          impact: { reputation: -40, compliance: -50, financial: -50 },
          consequenceText: "Paying ransoms without notifying authorities violates OFAC regulations. The hackers leak the data anyway. A complete disaster."
        },
        {
          id: "c2",
          text: "Refuse to pay. Trigger your Incident Response plan, notify law enforcement, and force all members to reset passwords.",
          impact: { reputation: 5, compliance: 20, financial: -15 },
          consequenceText: "A painful but necessary process. Members are annoyed by the password resets, but regulators commend your adherence to incident response protocols."
        },
        {
          id: "c3",
          text: "Check your vendor SLA. Since you enforced a Zero-Data-Retention policy with the LLM vendor, you verify they have no logs to leak.",
          impact: { reputation: 30, compliance: 30, financial: 20 },
          consequenceText: "Brilliant foresight! Because your initial vendor contract mandated 'Zero Data Retention' for API calls, the hackers stole empty databases. You issue a confident press release."
        }
      ]
    }
  ];

  const handleChoice = (choice: Choice) => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setMetrics(prev => ({
        reputation: Math.max(0, Math.min(100, prev.reputation + choice.impact.reputation)),
        compliance: Math.max(0, Math.min(100, prev.compliance + choice.impact.compliance)),
        financial: Math.max(0, Math.min(100, prev.financial + choice.impact.financial)),
      }));

      setHistory(prev => [...prev, { step: scenarioSteps[currentStepId], choice }]);

      if (currentStepId < scenarioSteps.length - 1) {
        setCurrentStepId(prev => prev + 1);
      } else {
        setIsGameOver(true);
        // Save completion status
        localStorage.setItem("cu_ai_warroom_completed", "completed");
        window.dispatchEvent(new Event("progressUpdated"));
      }
      
      setIsAnimating(false);
    }, 600);
  };

  const getMetricColor = (value: number) => {
    if (value >= 70) return "var(--success)";
    if (value >= 40) return "var(--warning)";
    return "var(--danger)";
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

        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <span className="badge badge-mgmt" style={{ marginBottom: "10px" }}>Executive Simulation</span>
          <h1 className="gradient-text-indigo" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
            Executive War Room
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "800px" }}>
            Tabletop crisis simulator. You are the crisis commander during an unfolding AI security incident. Make executive decisions to protect the credit union's reputation, regulatory compliance, and financial standing.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", alignItems: "start" }} className="warroom-grid">
          
          {/* Metrics Panel */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
              <Activity style={{ width: 20, height: 20, color: "var(--primary)" }} />
              Command Center Metrics
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Reputation */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.9rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                    <Users style={{ width: 14, height: 14 }} /> Public Reputation
                  </span>
                  <strong style={{ color: getMetricColor(metrics.reputation) }}>{metrics.reputation}/100</strong>
                </div>
                <div className="progress-bar-container" style={{ height: "8px" }}>
                  <div className="progress-bar-fill" style={{ width: `${metrics.reputation}%`, backgroundColor: getMetricColor(metrics.reputation), transition: "width 0.5s ease, background-color 0.5s ease" }}></div>
                </div>
              </div>

              {/* Compliance */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.9rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                    <ShieldAlert style={{ width: 14, height: 14 }} /> Regulatory Compliance
                  </span>
                  <strong style={{ color: getMetricColor(metrics.compliance) }}>{metrics.compliance}/100</strong>
                </div>
                <div className="progress-bar-container" style={{ height: "8px" }}>
                  <div className="progress-bar-fill" style={{ width: `${metrics.compliance}%`, backgroundColor: getMetricColor(metrics.compliance), transition: "width 0.5s ease, background-color 0.5s ease" }}></div>
                </div>
              </div>

              {/* Financial */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.9rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                    <DollarSign style={{ width: 14, height: 14 }} /> Financial Stability
                  </span>
                  <strong style={{ color: getMetricColor(metrics.financial) }}>{metrics.financial}/100</strong>
                </div>
                <div className="progress-bar-container" style={{ height: "8px" }}>
                  <div className="progress-bar-fill" style={{ width: `${metrics.financial}%`, backgroundColor: getMetricColor(metrics.financial), transition: "width 0.5s ease, background-color 0.5s ease" }}></div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "10px", padding: "16px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>Incident Log</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {history.map((h, i) => (
                  <div key={i} style={{ fontSize: "0.8rem", color: "var(--text-secondary)", borderLeft: "2px solid var(--primary)", paddingLeft: "8px" }}>
                    <strong>{h.step.title}</strong>
                    <p style={{ marginTop: "4px", fontSize: "0.75rem" }}>{h.choice.consequenceText}</p>
                  </div>
                ))}
                {history.length === 0 && <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Awaiting initial telemetry...</span>}
              </div>
            </div>
          </div>

          {/* Main Simulation Area */}
          <div className="card" style={{ padding: "0", overflow: "hidden", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column" }}>
            
            {/* Header */}
            <div style={{ padding: "16px 24px", backgroundColor: "rgba(6, 182, 212, 0.05)", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "10px" }}>
              <Target style={{ width: 22, height: 22, color: "var(--accent)" }} />
              <h2 style={{ fontSize: "1.25rem", margin: 0, color: "var(--text-primary)" }}>
                {isGameOver ? "Incident Resolved - After Action Report" : scenarioSteps[currentStepId].title}
              </h2>
            </div>

            {/* Content Body */}
            <div style={{ padding: "24px", opacity: isAnimating ? 0.5 : 1, transition: "opacity 0.3s ease" }}>
              {!isGameOver ? (
                <div className="animate-fade-in-up">
                  <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "24px" }}>
                    {scenarioSteps[currentStepId].description}
                  </p>

                  <h4 style={{ fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "16px" }}>Select Executive Action:</h4>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {scenarioSteps[currentStepId].choices.map(choice => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoice(choice)}
                        disabled={isAnimating}
                        style={{
                          textAlign: "left",
                          padding: "16px",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "rgba(255,255,255,0.03)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-primary)",
                          fontSize: "0.95rem",
                          lineHeight: 1.5,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "16px"
                        }}
                        className="choice-btn"
                      >
                        <span>{choice.text}</span>
                        <ArrowRight style={{ width: 16, height: 16, color: "var(--text-muted)", flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 0" }}>
                  
                  {metrics.reputation > 50 && metrics.compliance > 50 && metrics.financial > 50 ? (
                    <>
                      <CheckCircle2 style={{ width: 64, height: 64, color: "var(--success)", marginBottom: "16px" }} />
                      <h3 style={{ fontSize: "1.75rem", color: "var(--success)", marginBottom: "12px" }}>Crisis Averted</h3>
                      <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: "500px", lineHeight: 1.6 }}>
                        Excellent executive management. You navigated the AI incident while maintaining public trust, satisfying regulators, and protecting the balance sheet.
                      </p>
                    </>
                  ) : (
                    <>
                      <AlertTriangle style={{ width: 64, height: 64, color: "var(--danger)", marginBottom: "16px" }} />
                      <h3 style={{ fontSize: "1.75rem", color: "var(--danger)", marginBottom: "12px" }}>Crisis Mismanaged</h3>
                      <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: "500px", lineHeight: 1.6 }}>
                        The situation escalated out of control. Your executive decisions led to critical failures in compliance or reputation.
                      </p>
                    </>
                  )}

                  <div style={{ marginTop: "30px", width: "100%" }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setCurrentStepId(0);
                        setMetrics({ reputation: 100, compliance: 100, financial: 100 });
                        setHistory([]);
                        setIsGameOver(false);
                      }}
                    >
                      Run Simulation Again
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <style jsx>{`
        .choice-btn:hover {
          background-color: rgba(99, 102, 241, 0.1) !important;
          border-color: var(--primary) !important;
        }
        .choice-btn:hover svg {
          color: var(--primary) !important;
        }
        @media (max-width: 900px) {
          .warroom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
