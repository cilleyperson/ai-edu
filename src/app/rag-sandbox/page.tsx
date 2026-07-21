// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Database, ArrowRight, Play, CheckCircle } from "lucide-react";

interface Chunk {
  id: string;
  title: string;
  text: string;
  score: number;
}

export default function RAGSandbox() {
  const policies = {
    reg_cc: `Section 1 (Next-Day Items): Cashier checks, electronic direct deposits, official credit union checks, and the first $225 of any local paper check deposit must be made available to members on the first business day after the day of deposit.

Section 2 (Standard Local Checks): Funds from standard paper checks deposited into established member accounts are subject to a standard hold of 2 business days. The remaining balance above the first $225 is released on the second business day.

Section 3 (Exception Holds): Deposits exceeding $5,525 in a single business day, checks deposited into accounts open less than 30 days, or accounts with frequent overdrafts are subject to exception holds. The credit union can hold the excess funds above $5,525 for up to 7 business days for risk review.`,
    
    bsa_aml: `Section 1 (Identification): Under the Customer Identification Program (CIP), credit union staff must verify and record a government-issued photo ID, physical address, date of birth, and taxpayer identification number (SSN/ITIN) before opening any new account.

Section 2 (CTR Filings): Financial institutions must file a Currency Transaction Report (CTR) for any cash transactions (deposits, withdrawals, or exchanges) exceeding $10,000 in a single business day. Multiple smaller transactions by the same member must be aggregated.

Section 3 (SAR Auditing): A Suspicious Activity Report (SAR) must be filed by compliance staff if a transaction appears designed to evade CTR limits (e.g. structured deposits of $9,900 or frequent Cashier Check purchases). Under federal law, employees are strictly prohibited from disclosing to any member that a SAR has been filed or is under review.`
  };

  const [policyText, setPolicyText] = useState(policies.reg_cc);
  const [query, setQuery] = useState("what hold applies to cashier checks?");
  
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [retrievedChunks, setRetrievedChunks] = useState<Chunk[]>([]);
  const [finalAnswer, setFinalAnswer] = useState("");

  const handleLoadTemplate = (type: "reg_cc" | "bsa_aml") => {
    setPolicyText(policies[type]);
    if (type === "reg_cc") {
      setQuery("what hold applies to cashier checks?");
    } else {
      setQuery("how much cash triggers a CTR report?");
    }
    resetSandbox();
  };

  const resetSandbox = () => {
    setCurrentStep(0);
    setChunks([]);
    setRetrievedChunks([]);
    setFinalAnswer("");
  };

  // Run the RAG simulation loop
  const handleSimulateRAG = () => {
    setCurrentStep(1); // Chunking

    // Step 1: Divide policy into paragraph chunks
    const paragraphs = policyText
      .split("\n\n")
      .filter((p) => p.trim().length > 0);

    const generatedChunks: Chunk[] = paragraphs.map((text, idx) => {
      // Find a mock score based on text matches
      const queryWords = query.toLowerCase().replace(/[^\w\s]/g, "").split(" ");
      let matchCount = 0;
      queryWords.forEach((word) => {
        if (word.length > 3 && text.toLowerCase().includes(word)) {
          matchCount += 1;
        }
      });

      // Calculate a mock vector distance match score (between 0.05 and 0.95)
      let score = 0.05;
      if (matchCount > 0) {
        score = Math.min(0.95, 0.35 + matchCount * 0.15 + Math.random() * 0.05);
      } else {
        score = Math.max(0.05, 0.1 + Math.random() * 0.05);
      }

      // Format score
      score = parseFloat(score.toFixed(2));

      return {
        id: `Chunk_${idx + 1}`,
        title: text.substring(0, text.indexOf(":") + 1) || `Paragraph ${idx + 1}`,
        text,
        score
      };
    });

    setChunks(generatedChunks);

    // Step 2: Simulate similarity threshold retrieval (score >= 0.3)
    const matches = generatedChunks.filter((c) => c.score >= 0.3).sort((a, b) => b.score - a.score);

    // Step 3: LLM generation simulation based on retrieval
    let answerText = "";
    if (matches.length === 0) {
      answerText = "I apologize, but I cannot find information addressing that query in the provided policy document.";
    } else {
      const topMatch = matches[0];
      const queryLower = query.toLowerCase();

      if (queryLower.includes("cashier") || queryLower.includes("next-day") || queryLower.includes("next day")) {
        answerText = "Based on the policy context (Section 1), cashier checks are classified as next-day items. They must be made available to members on the first business day following the day of deposit, with the first $225 accessible immediately.";
      } else if (queryLower.includes("standard") || queryLower.includes("local") || queryLower.includes("paper check")) {
        answerText = "According to Section 2 of the policy guidelines, standard paper check deposits are subject to a 2-business-day hold. The remaining balance (amount deposited exceeding the first $225 next-day availability limit) is released on the second business day.";
      } else if (queryLower.includes("exception") || queryLower.includes("large") || queryLower.includes("overdraft")) {
        answerText = "Under Section 3, exception holds apply to deposits exceeding $5,525, new accounts (open less than 30 days), or frequent overdrafts. The credit union is authorized to hold the excess amount above $5,525 for up to 7 business days for security review.";
      } else if (queryLower.includes("ctr") || queryLower.includes("cash") || queryLower.includes("10,000")) {
        answerText = "Based on Section 2 of the BSA policy handbook, the credit union is legally required to file a Currency Transaction Report (CTR) for any single-day member cash transactions exceeding $10,000. Transactions must be aggregated.";
      } else if (queryLower.includes("sar") || queryLower.includes("suspicious") || queryLower.includes("structure")) {
        answerText = "According to Section 3 of the compliance policy, employees must submit a Suspicious Activity Report (SAR) if structuring is suspected (such as depositing $9,900 to evade CTR reporting). Sharing or disclosing SAR reviews with members is strictly prohibited.";
      } else if (queryLower.includes("identification") || queryLower.includes("cip") || queryLower.includes("new account")) {
        answerText = "Under Section 1 (CIP program guidelines), staff are required to record a government-issued photo ID, physical address, date of birth, and taxpayer ID (SSN/ITIN) prior to creating any new member account.";
      } else {
        // Fallback generic answer
        answerText = `Grounded Answer: The policy mentions that "${topMatch.text.substring(0, 120)}...". Based on this matching section, the regulations require compliance audits and strict adherence to internal workflows.`;
      }
    }

    setRetrievedChunks(matches);
    setFinalAnswer(answerText);

    // Save completion state
    localStorage.setItem("cu_ai_rag_used", "true");
    window.dispatchEvent(new Event("progressUpdated"));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 0 | 1 | 2 | 3 | 4);
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
          <span className="badge badge-mgmt" style={{ marginBottom: "10px" }}>Interactive Activity</span>
          <h1 className="gradient-text" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
            Policy RAG Visualizer
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "850px" }}>
            Retrieval-Augmented Generation (RAG) is how AI assistants search policy manuals. Paste guidelines, write a query, and trace the vector similarity matches, prompt envelopes, and grounded text generation.
          </p>
        </div>

        {/* Workspace Setup */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px", marginBottom: "40px" }} className="rag-workspace-grid">
          
          {/* Document Loader Left Column */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                <h3 style={{ fontSize: "1.15rem", margin: 0 }} className="gradient-text-indigo">
                  1. Policy Manual Database
                </h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleLoadTemplate("reg_cc")} style={{ fontSize: "0.75rem", padding: "4px 8px", cursor: "pointer", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", borderRadius: "var(--radius-sm)" }} className="nav-link">
                    Load Reg CC
                  </button>
                  <button onClick={() => handleLoadTemplate("bsa_aml")} style={{ fontSize: "0.75rem", padding: "4px 8px", cursor: "pointer", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", borderRadius: "var(--radius-sm)" }} className="nav-link">
                    Load BSA/AML
                  </button>
                </div>
              </div>
              <textarea
                className="form-input"
                style={{ minHeight: "160px", fontSize: "0.85rem", resize: "vertical" }}
                value={policyText}
                onChange={(e) => { setPolicyText(e.target.value); resetSandbox(); }}
                placeholder="Paste internal policy sections here..."
              />
            </div>

            <div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "12px" }} className="gradient-text-violet">
                2. Enter Query
              </h3>
              <div style={{ position: "relative" }}>
                <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "var(--text-muted)" }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: "42px" }}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); resetSandbox(); }}
                  placeholder="e.g. what is hold limit for local checks?"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleSimulateRAG}
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={!query.trim() || !policyText.trim()}
              >
                <Play style={{ width: 16, height: 16 }} />
                <span>Simulate RAG Process</span>
              </button>
              <button
                onClick={resetSandbox}
                className="btn btn-secondary"
                style={{ padding: "12px" }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Stepper Execution Right Column */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.15rem" }} className="gradient-text-indigo">
                RAG Pipeline Progress
              </h3>
              {currentStep > 0 && currentStep < 4 && (
                <button
                  onClick={handleNextStep}
                  className="btn btn-accent animate-fade-in-up"
                  style={{ padding: "4px 10px", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
                >
                  <span>Next Step</span>
                  <ArrowRight style={{ width: 12, height: 12 }} />
                </button>
              )}
            </div>

            {currentStep === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.9rem", minHeight: "220px" }}>
                <Database style={{ width: 44, height: 44, strokeWidth: 1.5, marginBottom: "8px" }} />
                <p>Enter policy manual & query then run simulation</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* Step indicators */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                  {[1, 2, 3, 4].map((stepNum) => (
                    <div 
                      key={stepNum}
                      style={{
                        height: "4px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: currentStep >= stepNum ? "var(--primary)" : "rgba(255,255,255,0.06)",
                        transition: "all 0.3s ease"
                      }}
                    />
                  ))}
                </div>

                {/* STEP 1: Chunking Visualizer */}
                {currentStep >= 1 && (
                  <div className="animate-fade-in-up" style={stepContainerStyle(currentStep === 1)}>
                    <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                      Step 1: Document Chunking
                    </strong>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "10px" }}>
                      The text database cuts long documents into smaller semantic units (chunks) so search remains focused.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {chunks.map((c) => (
                        <div 
                          key={c.id} 
                          style={{ 
                            padding: "8px 12px", 
                            borderRadius: "var(--radius-sm)", 
                            backgroundColor: "rgba(255,255,255,0.02)", 
                            border: "1px solid var(--border-color)",
                            fontSize: "0.75rem",
                            fontFamily: "monospace"
                          }}
                        >
                          <span style={{ color: "var(--primary)", fontWeight: "bold" }}>[{c.id}]</span> {c.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Vector Search Retrieval Visualizer */}
                {currentStep >= 2 && (
                  <div className="animate-fade-in-up" style={stepContainerStyle(currentStep === 2)}>
                    <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                      Step 2: Vector Matching & Retrieval
                    </strong>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "10px" }}>
                      Calculates conceptual distance scores between the query and chunks. High match chunks are retrieved.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {chunks.map((c) => {
                        const isRetrieved = c.score >= 0.3;
                        return (
                          <div 
                            key={c.id}
                            style={{
                              padding: "10px",
                              borderRadius: "var(--radius-sm)",
                              backgroundColor: isRetrieved ? "var(--success-glow)" : "rgba(255,255,255,0.01)",
                              border: "1px solid",
                              borderColor: isRetrieved ? "var(--success)" : "var(--border-color)",
                              fontSize: "0.75rem"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span style={{ fontWeight: 700 }}>{c.id}</span>
                              <strong style={{ color: isRetrieved ? "var(--success)" : "var(--text-muted)" }}>
                                Match: {Math.round(c.score * 100)}%
                              </strong>
                            </div>
                            <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {c.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 3: Context Envelope Tracing */}
                {currentStep >= 3 && (
                  <div className="animate-fade-in-up" style={stepContainerStyle(currentStep === 3)}>
                    <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                      Step 3: Context Envelope Packaging
                    </strong>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "10px" }}>
                      Packs the retrieved paragraphs into the system prompt envelope sent to the LLM model.
                    </p>
                    
                    <div style={{ padding: "10px", borderRadius: "var(--radius-md)", backgroundColor: "rgba(6, 8, 20, 0.8)", border: "1px solid var(--border-color)", fontSize: "0.75rem", fontFamily: "monospace", color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--primary)" }}>[SYSTEM PROMPT]</span><br />
                      You are a compliance assistant. Answer the query based ONLY on the context below.<br /><br />
                      <span style={{ color: "var(--success)" }}>[CONTEXT]</span><br />
                      {retrievedChunks.length > 0 
                        ? retrievedChunks.map(c => `// ${c.id}\n${c.text}`).join("\n\n")
                        : "// NO CONTEXT RETRIEVED"}<br /><br />
                      <span style={{ color: "var(--accent)" }}>[QUERY]</span><br />
                      {query}
                    </div>
                  </div>
                )}

                {/* STEP 4: Grounded Generation */}
                {currentStep >= 4 && (
                  <div className="animate-fade-in-up" style={stepContainerStyle(true)}>
                    <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                      Step 4: Grounded LLM Generation
                    </strong>
                    
                    <div style={{ padding: "12px", borderRadius: "var(--radius-md)", backgroundColor: "var(--success-glow)", border: "1px solid var(--success)", color: "var(--text-primary)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                      <p style={{ fontWeight: 600, color: "var(--success)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "6px", display: "flex", gap: "6px", alignItems: "center" }}>
                        <CheckCircle style={{ width: 14, height: 14 }} />
                        Grounded AI Response:
                      </p>
                      {finalAnswer}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .rag-workspace-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function stepContainerStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: "16px",
    borderRadius: "var(--radius-md)",
    backgroundColor: isActive ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.005)",
    border: "1px solid",
    borderColor: isActive ? "var(--border-active)" : "var(--border-color)",
    opacity: isActive ? 1 : 0.6,
    transition: "all 0.3s ease"
  };
}
