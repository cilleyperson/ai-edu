// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Play, ShieldAlert, Cpu, Database, User, Shield, CheckCircle2, Zap, AlertTriangle, MessageSquare, Trash2, ArrowRight } from "lucide-react";

type BlockType = "input" | "llm" | "rag" | "pii_scrubber" | "guardrail" | "output";

interface PipelineBlock {
  id: string;
  type: BlockType;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  riskScore: number; // Positive is good (lowers risk), negative increases risk
}

const PALETTE: PipelineBlock[] = [
  { id: "b_input", type: "input", title: "Member Chat Input", description: "Raw text input from credit union members.", icon: User, color: "var(--primary)", riskScore: -10 },
  { id: "b_pii", type: "pii_scrubber", title: "PII Scrubber", description: "Removes SSNs, account numbers before processing.", icon: Shield, color: "var(--success)", riskScore: 30 },
  { id: "b_rag", type: "rag", title: "Policy RAG Database", description: "Searches approved CU policies for context.", icon: Database, color: "var(--accent)", riskScore: 10 },
  { id: "b_llm", type: "llm", title: "LLM (GPT-4)", description: "The core reasoning engine.", icon: Cpu, color: "var(--primary)", riskScore: -20 },
  { id: "b_guard", type: "guardrail", title: "Output Guardrail", description: "Checks output for fair lending violations.", icon: ShieldAlert, color: "var(--warning)", riskScore: 25 },
  { id: "b_output", type: "output", title: "Chat Response", description: "Final message sent to the member.", icon: MessageSquare, color: "var(--primary)", riskScore: 0 }
];

export default function PipelineBuilder() {
  const [pipeline, setPipeline] = useState<PipelineBlock[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<{ score: number; messages: string[]; passed: boolean } | null>(null);

  const addBlock = (block: PipelineBlock) => {
    // Generate a unique ID for the instance in the pipeline
    setPipeline([...pipeline, { ...block, id: `${block.type}_${Date.now()}` }]);
    setResults(null);
  };

  const removeBlock = (index: number) => {
    const newPipeline = [...pipeline];
    newPipeline.splice(index, 1);
    setPipeline(newPipeline);
    setResults(null);
  };

  const simulatePipeline = () => {
    setIsSimulating(true);
    setResults(null);
    
    setTimeout(() => {
      let score = 100;
      let passed = true;
      const msgs: string[] = [];

      // Validate structure
      if (pipeline.length < 2) {
        msgs.push("Pipeline must have at least an Input and an Output.");
        passed = false;
        score = 0;
      } else {
        if (pipeline[0].type !== "input") {
          msgs.push("Pipeline should start with an Input block.");
          passed = false;
          score -= 20;
        }
        if (pipeline[pipeline.length - 1].type !== "output") {
          msgs.push("Pipeline should end with an Output block.");
          passed = false;
          score -= 20;
        }

        const hasLLM = pipeline.some(b => b.type === "llm");
        if (!hasLLM) {
          msgs.push("No LLM present! This is just a basic text filter, not an AI agent.");
          passed = false;
          score -= 40;
        }

        // Check for PII before LLM
        let llmIndex = pipeline.findIndex(b => b.type === "llm");
        if (llmIndex > -1) {
          let piiBeforeLLM = pipeline.findIndex((b, idx) => b.type === "pii_scrubber" && idx < llmIndex);
          if (piiBeforeLLM === -1) {
            msgs.push("CRITICAL: PII Scrubber missing before LLM. Member SSNs were sent to OpenAI.");
            passed = false;
            score -= 50;
          } else {
            msgs.push("Good: PII was scrubbed before hitting the external LLM.");
          }

          // Check for guardrail after LLM
          let guardAfterLLM = pipeline.findIndex((b, idx) => b.type === "guardrail" && idx > llmIndex);
          if (guardAfterLLM === -1) {
            msgs.push("WARNING: No Output Guardrail after LLM. The AI recommended a discriminatory loan product.");
            passed = false;
            score -= 30;
          } else {
            msgs.push("Good: Output Guardrail caught and blocked an unsafe LLM response.");
          }
        }
        
        // Sum up inherent risk scores
        const riskMod = pipeline.reduce((acc, curr) => acc + curr.riskScore, 0);
        score += Math.max(-50, Math.min(50, riskMod)); // Cap modifier
      }

      score = Math.max(0, Math.min(100, score));
      
      setResults({ score, messages: msgs, passed: passed && score >= 80 });
      setIsSimulating(false);

      if (passed && score >= 80) {
        localStorage.setItem("cu_ai_pipeline_completed", "completed");
        window.dispatchEvent(new Event("progressUpdated"));
      }

    }, 1500);
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
        <div style={{ marginBottom: "40px" }}>
          <span className="badge badge-board" style={{ marginBottom: "10px" }}>Architecture</span>
          <h1 className="gradient-text-indigo" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
            Visual AI Pipeline Builder
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "800px" }}>
            Construct a secure Agentic AI pipeline. Drag and drop (or click) blocks to assemble your architecture. Ensure you handle PII and hallucinations before deploying to production.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "32px", alignItems: "start" }} className="pipeline-grid">
          
          {/* Component Palette */}
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus style={{ width: 18, height: 18, color: "var(--primary)" }} />
              Add Components
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {PALETTE.map((block) => {
                const Icon = block.icon;
                return (
                  <div 
                    key={block.id}
                    onClick={() => addBlock(block)}
                    className="palette-item"
                    style={{ 
                      padding: "12px", 
                      borderRadius: "var(--radius-md)", 
                      border: "1px dashed var(--border-color)",
                      backgroundColor: "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: `${block.color}15`, color: block.color }}>
                      <Icon style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.9rem", margin: "0 0 4px 0", color: "var(--text-primary)" }}>{block.title}</h4>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
                        {block.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Builder Canvas */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div className="card" style={{ minHeight: "400px", padding: "30px", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Canvas</h3>
                <button 
                  className="btn btn-primary"
                  onClick={simulatePipeline}
                  disabled={isSimulating || pipeline.length === 0}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px" }}
                >
                  {isSimulating ? <Zap className="spin" style={{ width: 16, height: 16 }} /> : <Play style={{ width: 16, height: 16 }} />}
                  <span>{isSimulating ? "Deploying..." : "Deploy Pipeline"}</span>
                </button>
              </div>

              {pipeline.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
                  <Plus style={{ width: 48, height: 48, color: "var(--text-muted)", marginBottom: "16px" }} />
                  <p style={{ color: "var(--text-secondary)" }}>Click components on the left to add them to your pipeline.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", flex: 1, alignContent: "flex-start" }}>
                  {pipeline.map((block, index) => {
                    const Icon = block.icon;
                    return (
                      <React.Fragment key={block.id}>
                        <div 
                          className="pipeline-block animate-fade-in"
                          style={{
                            padding: "16px",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            border: `1px solid ${block.color}50`,
                            borderRadius: "var(--radius-lg)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                            minWidth: "120px",
                            position: "relative",
                            boxShadow: `0 0 20px ${block.color}10`
                          }}
                        >
                          <button 
                            onClick={() => removeBlock(index)}
                            style={{
                              position: "absolute",
                              top: "-8px",
                              right: "-8px",
                              backgroundColor: "var(--danger)",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "24px",
                              height: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                            }}
                          >
                            <Trash2 style={{ width: 12, height: 12 }} />
                          </button>

                          <div style={{ padding: "12px", borderRadius: "50%", backgroundColor: `${block.color}20`, color: block.color }}>
                            <Icon style={{ width: 24, height: 24 }} />
                          </div>
                          <span style={{ fontSize: "0.8rem", fontWeight: 600, textAlign: "center" }}>{block.title}</span>
                        </div>
                        
                        {index < pipeline.length - 1 && (
                          <div className="animate-fade-in" style={{ color: "var(--text-muted)" }}>
                            <ArrowRight style={{ width: 24, height: 24 }} />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Results Panel */}
            {results && (
              <div className="card animate-fade-in-up" style={{ padding: "24px", borderLeft: `4px solid ${results.passed ? "var(--success)" : "var(--danger)"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  {results.passed ? (
                    <CheckCircle2 style={{ width: 32, height: 32, color: "var(--success)" }} />
                  ) : (
                    <AlertTriangle style={{ width: 32, height: 32, color: "var(--danger)" }} />
                  )}
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.25rem", color: results.passed ? "var(--success)" : "var(--danger)" }}>
                      {results.passed ? "Deployment Successful" : "Deployment Rejected"}
                    </h3>
                    <p style={{ margin: "4px 0 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                      Security & Compliance Score: <strong style={{ color: results.score >= 80 ? "var(--success)" : "var(--danger)" }}>{results.score}/100</strong>
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                  <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>Audit Trail</h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {results.messages.map((msg, i) => (
                      <li key={i} style={{ fontSize: "0.9rem", color: msg.includes("CRITICAL") || msg.includes("WARNING") ? "var(--danger)" : "var(--text-secondary)" }}>
                        {msg}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      <style jsx>{`
        .palette-item:hover {
          border-color: var(--primary) !important;
          background-color: rgba(99, 102, 241, 0.05) !important;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 900px) {
          .pipeline-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
