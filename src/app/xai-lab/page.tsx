// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, BarChart3, Info, Target, CheckCircle2 } from "lucide-react";

export default function XAILab() {
  const [creditScore, setCreditScore] = useState(650);
  const [income, setIncome] = useState(60000);
  const [dti, setDti] = useState(35); // Debt-to-Income ratio %
  const [loanAmount, setLoanAmount] = useState(25000);
  
  const [baseScore] = useState(0.40); // Base probability of approval
  const [confidence, setConfidence] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  
  // SHAP-like feature contributions
  const [contributions, setContributions] = useState({
    creditScore: 0,
    income: 0,
    dti: 0,
    loanAmount: 0
  });

  const [hasExplored, setHasExplored] = useState(false);
  const [explorationCount, setExplorationCount] = useState(0);

  // Recalculate Model Predictions
  useEffect(() => {
    // Mock Model Logic
    // Credit Score: 300 to 850
    // Ideal > 720 (+0.30), Bad < 600 (-0.20)
    const creditContrib = (creditScore - 650) / 400; // rough linear mapping
    
    // Income: 20k to 200k
    const incomeContrib = (income - 50000) / 500000;
    
    // DTI: 0% to 60%
    // High DTI is bad. Ideal < 30%
    const dtiContrib = (30 - dti) / 100;
    
    // Loan Amount: 5k to 100k
    // High loan amount is riskier
    const loanContrib = (15000 - loanAmount) / 300000;

    let finalScore = baseScore + creditContrib + incomeContrib + dtiContrib + loanContrib;
    
    // Bound between 0 and 1
    finalScore = Math.max(0.01, Math.min(0.99, finalScore));
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContributions({
      creditScore: creditContrib,
      income: incomeContrib,
      dti: dtiContrib,
      loanAmount: loanContrib
    });
    
    setConfidence(finalScore);
    setIsApproved(finalScore > 0.65); // Threshold for approval

    setExplorationCount(prev => prev + 1);
    if (explorationCount > 10) {
      setHasExplored(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditScore, income, dti, loanAmount, baseScore]);

  const completeLab = () => {
    localStorage.setItem("cu_ai_xai_completed", "completed");
    window.dispatchEvent(new Event("progressUpdated"));
  };

  const getBarColor = (value: number) => {
    return value >= 0 ? "var(--success)" : "var(--danger)";
  };

  const formatPercent = (val: number) => {
    return (Math.abs(val) * 100).toFixed(1) + "%";
  };

  return (
    <div className="section" style={{ paddingTop: "40px", minHeight: "100vh" }}>
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
        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <span className="badge badge-mgmt" style={{ marginBottom: "10px" }}>Governance</span>
            <h1 className="gradient-text-indigo" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
              Explainable AI (XAI) Lab
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "800px" }}>
              Regulators demand that AI in lending is transparent. Use this lab to visualize how a machine learning model weighs different member data points to reach a &quot;deterministic&quot; and explainable decision.
            </p>
          </div>
          
          {hasExplored && (
            <button className="btn btn-primary animate-fade-in" onClick={completeLab} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 style={{ width: 18, height: 18 }} />
              Complete Lab
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="xai-grid">
          
          {/* Left Panel: Inputs */}
          <div className="card" style={{ padding: "0", border: "1px solid var(--border-color)", overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(255,255,255,0.02)" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Target style={{ width: 20, height: 20, color: "var(--primary)" }} />
                Member Profile Simulation
              </h3>
            </div>
            
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Credit Score */}
              <div className="input-group">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 500 }}>FICO Credit Score</label>
                  <span style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>{creditScore}</span>
                </div>
                <input 
                  type="range" 
                  min="300" max="850" step="10" 
                  value={creditScore}
                  onChange={(e) => setCreditScore(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--primary)" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  <span>300 (Poor)</span>
                  <span>850 (Excellent)</span>
                </div>
              </div>

              {/* Income */}
              <div className="input-group">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 500 }}>Annual Income</label>
                  <span style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>${income.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="20000" max="200000" step="5000" 
                  value={income}
                  onChange={(e) => setIncome(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--primary)" }}
                />
              </div>

              {/* DTI */}
              <div className="input-group">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 500 }}>Debt-to-Income (DTI)</label>
                  <span style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>{dti}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" max="60" step="1" 
                  value={dti}
                  onChange={(e) => setDti(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--primary)" }}
                />
              </div>

              {/* Loan Amount */}
              <div className="input-group">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 500 }}>Requested Loan Amount</label>
                  <span style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>${loanAmount.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" max="100000" step="1000" 
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--primary)" }}
                />
              </div>

            </div>
          </div>

          {/* Right Panel: Explainability Output */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Outcome Card */}
            <div className="card" style={{ 
              padding: "24px", 
              borderLeft: `4px solid ${isApproved ? "var(--success)" : "var(--danger)"}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "1.5rem", color: isApproved ? "var(--success)" : "var(--danger)" }}>
                  {isApproved ? "Approved" : "Declined"}
                </h3>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  AI Confidence Score: <strong>{(confidence * 100).toFixed(1)}%</strong>
                </p>
                <p style={{ margin: "4px 0 0 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  Threshold for approval is 65.0%
                </p>
              </div>
              <div style={{ padding: "16px", borderRadius: "50%", backgroundColor: isApproved ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)" }}>
                <BrainCircuit style={{ width: 32, height: 32, color: isApproved ? "var(--success)" : "var(--danger)" }} />
              </div>
            </div>

            {/* Feature Importance Waterfall / SHAP */}
            <div className="card" style={{ padding: "24px", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <BarChart3 style={{ width: 20, height: 20, color: "var(--accent)" }} />
                <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Feature Importance (Explainability)</h3>
              </div>
              
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
                This chart demonstrates how much each feature contributed positively or negatively to the final AI decision, meeting regulatory requirements for transparency.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* Base Score */}
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 60px", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Base Prob.</span>
                  <div style={{ height: "12px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "6px", position: "relative" }}>
                    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(255,255,255,0.2)" }} />
                    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: `${baseScore * 50}%`, backgroundColor: "var(--text-muted)", borderRadius: "0 6px 6px 0" }} />
                  </div>
                  <span style={{ fontSize: "0.85rem", fontFamily: "monospace", textAlign: "right" }}>+40.0%</span>
                </div>

                {/* Credit Score Contrib */}
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 60px", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Credit Score</span>
                  <div style={{ height: "12px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "6px", position: "relative" }}>
                    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(255,255,255,0.2)" }} />
                    <div style={{ 
                      position: "absolute", 
                      top: 0, bottom: 0, 
                      backgroundColor: getBarColor(contributions.creditScore),
                      ...(contributions.creditScore >= 0 
                        ? { left: "50%", width: `${Math.min(50, contributions.creditScore * 100)}%`, borderRadius: "0 6px 6px 0" } 
                        : { right: "50%", width: `${Math.min(50, Math.abs(contributions.creditScore) * 100)}%`, borderRadius: "6px 0 0 6px" })
                    }} />
                  </div>
                  <span style={{ fontSize: "0.85rem", fontFamily: "monospace", textAlign: "right", color: getBarColor(contributions.creditScore) }}>
                    {contributions.creditScore >= 0 ? "+" : "-"}{formatPercent(contributions.creditScore)}
                  </span>
                </div>

                {/* Income Contrib */}
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 60px", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Income</span>
                  <div style={{ height: "12px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "6px", position: "relative" }}>
                    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(255,255,255,0.2)" }} />
                    <div style={{ 
                      position: "absolute", 
                      top: 0, bottom: 0, 
                      backgroundColor: getBarColor(contributions.income),
                      ...(contributions.income >= 0 
                        ? { left: "50%", width: `${Math.min(50, contributions.income * 100)}%`, borderRadius: "0 6px 6px 0" } 
                        : { right: "50%", width: `${Math.min(50, Math.abs(contributions.income) * 100)}%`, borderRadius: "6px 0 0 6px" })
                    }} />
                  </div>
                  <span style={{ fontSize: "0.85rem", fontFamily: "monospace", textAlign: "right", color: getBarColor(contributions.income) }}>
                    {contributions.income >= 0 ? "+" : "-"}{formatPercent(contributions.income)}
                  </span>
                </div>

                {/* DTI Contrib */}
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 60px", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>DTI Ratio</span>
                  <div style={{ height: "12px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "6px", position: "relative" }}>
                    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(255,255,255,0.2)" }} />
                    <div style={{ 
                      position: "absolute", 
                      top: 0, bottom: 0, 
                      backgroundColor: getBarColor(contributions.dti),
                      ...(contributions.dti >= 0 
                        ? { left: "50%", width: `${Math.min(50, contributions.dti * 100)}%`, borderRadius: "0 6px 6px 0" } 
                        : { right: "50%", width: `${Math.min(50, Math.abs(contributions.dti) * 100)}%`, borderRadius: "6px 0 0 6px" })
                    }} />
                  </div>
                  <span style={{ fontSize: "0.85rem", fontFamily: "monospace", textAlign: "right", color: getBarColor(contributions.dti) }}>
                    {contributions.dti >= 0 ? "+" : "-"}{formatPercent(contributions.dti)}
                  </span>
                </div>

                {/* Loan Amount Contrib */}
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 60px", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Loan Size</span>
                  <div style={{ height: "12px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "6px", position: "relative" }}>
                    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(255,255,255,0.2)" }} />
                    <div style={{ 
                      position: "absolute", 
                      top: 0, bottom: 0, 
                      backgroundColor: getBarColor(contributions.loanAmount),
                      ...(contributions.loanAmount >= 0 
                        ? { left: "50%", width: `${Math.min(50, contributions.loanAmount * 100)}%`, borderRadius: "0 6px 6px 0" } 
                        : { right: "50%", width: `${Math.min(50, Math.abs(contributions.loanAmount) * 100)}%`, borderRadius: "6px 0 0 6px" })
                    }} />
                  </div>
                  <span style={{ fontSize: "0.85rem", fontFamily: "monospace", textAlign: "right", color: getBarColor(contributions.loanAmount) }}>
                    {contributions.loanAmount >= 0 ? "+" : "-"}{formatPercent(contributions.loanAmount)}
                  </span>
                </div>

              </div>

              <div style={{ marginTop: "24px", padding: "12px", backgroundColor: "rgba(139, 92, 246, 0.1)", borderRadius: "var(--radius-md)", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <Info style={{ width: 18, height: 18, color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  This visualization uses techniques similar to SHAP (SHapley Additive exPlanations) values to break down a model&apos;s output into the distinct contributions of each input feature, enabling regulatory compliance for Equal Credit Opportunity Act (ECOA) adverse action notices.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .xai-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
