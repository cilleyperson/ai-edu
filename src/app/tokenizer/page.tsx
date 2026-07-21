// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, DollarSign } from "lucide-react";

export default function Tokenizer() {
  const [inputText, setInputText] = useState(
    "What is the late fee on our checking accounts? I want to waive a $35 fee from my balance."
  );
  
  // RAG Bloat Factor (add simulated tokens)
  const [ragBloat, setRagBloat] = useState<0 | 4000 | 16000>(0);

  // Model Pricing configurations (per 1M tokens)
  const pricingModels = [
    { name: "GPT-4o (OpenAI)", inputPrice: 2.50, outputPrice: 10.00, speed: "Fast" },
    { name: "Claude 3.5 Sonnet (Anthropic)", inputPrice: 3.00, outputPrice: 15.00, speed: "Ultra-Fast" },
    { name: "Llama 3 70B (Open-Source Host)", inputPrice: 0.59, outputPrice: 0.79, speed: "Standard" }
  ];

  // Tokenize logic: split into words, punctuation, spaces
  const tokenize = (text: string) => {
    if (!text) return [];
    // Regex splits by word, punctuation marks, or white space blocks
    const tokenRegex = /\w+|[^\w\s]|\s+/g;
    const matches = text.match(tokenRegex) || [];
    
    // In real English models, 1 word is roughly 1.3 tokens due to syllables/suffixes.
    // We simulate this by occasionally splitting longer words to show sub-word tokens!
    const finalTokens: string[] = [];
    matches.forEach((m) => {
      if (m.trim().length > 7) {
        // Split long words in half to simulate sub-word tokenization
        const half = Math.ceil(m.length / 2);
        finalTokens.push(m.substring(0, half));
        finalTokens.push(m.substring(half));
      } else {
        finalTokens.push(m);
      }
    });

    return finalTokens;
  };

  const tokens = tokenize(inputText);
  const coreTokenCount = tokens.length;
  const totalInputTokens = coreTokenCount + ragBloat;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

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
          <span className="badge badge-staff" style={{ marginBottom: "10px" }}>Interactive Activity</span>
          <h1 className="gradient-text" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
            LLM Tokenizer & Cost Calculator
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "850px" }}>
            Language models read text in chunks called tokens. Learn how prompts are parsed, estimate prompt costs across different LLM platforms, and simulate how adding RAG reference manuals affects operating budgets.
          </p>
        </div>

        {/* Workspace Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px", marginBottom: "40px" }} className="tokenizer-grid">
          
          {/* Tokenizer Visualizer Column */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "10px" }} className="gradient-text-indigo">
                1. Text Input & Tokenizer
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                Type a query. Large Language Models convert text characters into integer tokens before processing.
              </p>
              
              <textarea
                className="form-input"
                style={{ minHeight: "120px", fontSize: "0.85rem", resize: "vertical", marginBottom: "16px" }}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  // Trigger progress save
                  localStorage.setItem("cu_ai_progress_tokenizer", "completed");
                  window.dispatchEvent(new Event("progressUpdated"));
                }}
                placeholder="Enter prompt text here..."
              />
            </div>

            {/* Alternating token rendering block */}
            <div>
              <h4 style={{ fontSize: "0.95rem", marginBottom: "10px", color: "var(--text-secondary)" }}>
                Alternating Token Highlighting ({coreTokenCount} Tokens)
              </h4>
              <div 
                style={{ 
                  padding: "16px", 
                  borderRadius: "var(--radius-md)", 
                  backgroundColor: "rgba(6, 8, 20, 0.6)", 
                  border: "1px solid var(--border-color)",
                  minHeight: "100px",
                  lineHeight: 1.8,
                  fontSize: "0.9rem",
                  fontFamily: "monospace",
                  wordBreak: "break-word"
                }}
              >
                {tokens.length === 0 ? (
                  <span style={{ color: "var(--text-muted)" }}>Tokenized output will render here...</span>
                ) : (
                  tokens.map((tok, idx) => {
                    const isEven = idx % 2 === 0;
                    const bg = isEven ? "rgba(6, 182, 212, 0.15)" : "rgba(99, 102, 241, 0.15)";
                    const border = isEven ? "rgba(6, 182, 212, 0.3)" : "rgba(99, 102, 241, 0.3)";
                    
                    return (
                      <span 
                        key={idx} 
                        style={{
                          background: bg,
                          border: `1px solid ${border}`,
                          borderRadius: "2px",
                          padding: "2px 1px",
                          margin: "0 1px",
                          color: "var(--text-primary)"
                        }}
                      >
                        {/* Replace spaces with a visual middle dot symbol to show trailing spaces */}
                        {tok.replace(/ /g, "·")}
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {/* Metrics Counters */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>Words</span>
                <strong style={{ fontSize: "1.2rem", color: "var(--text-primary)" }}>{wordCount}</strong>
              </div>
              <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>Characters</span>
                <strong style={{ fontSize: "1.2rem", color: "var(--text-primary)" }}>{charCount}</strong>
              </div>
              <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>Tokens</span>
                <strong style={{ fontSize: "1.2rem", color: "var(--primary)" }}>{coreTokenCount}</strong>
              </div>
            </div>
          </div>

          {/* Pricing & RAG Bloat Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* RAG Bloat controller */}
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <h3 style={{ fontSize: "1.15rem" }} className="gradient-text-indigo">
                2. RAG Context Manual Bloat
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Simulate appending credit union reference manuals to the prompt. Injecting extensive manuals increases token inputs exponentially.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <input 
                    type="radio" 
                    name="bloat" 
                    checked={ragBloat === 0} 
                    onChange={() => setRagBloat(0)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span>No reference manual (Raw query: 0 extra tokens)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <input 
                    type="radio" 
                    name="bloat" 
                    checked={ragBloat === 4000} 
                    onChange={() => setRagBloat(4000)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span>Small policy manual (~5 pages: +4,000 tokens)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <input 
                    type="radio" 
                    name="bloat" 
                    checked={ragBloat === 16000} 
                    onChange={() => setRagBloat(16000)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span>Large manual database (~20 pages: +16,000 tokens)</span>
                </label>
              </div>
            </div>

            {/* Prompt Cost Estimates */}
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "1.15rem" }} className="gradient-text-indigo">
                3. Active Prompt Cost Calculator
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {pricingModels.map((model, idx) => {
                  // Cost = (Input tokens / 1,000,000) * inputPrice + simulated answer (fixed at 150 output tokens for query)
                  const inputCost = (totalInputTokens / 1000000) * model.inputPrice;
                  const outputCost = (150 / 1000000) * model.outputPrice;
                  const totalCost = inputCost + outputCost;

                  return (
                    <div 
                      key={idx}
                      style={{
                        padding: "12px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "rgba(255,255,255,0.01)",
                        border: "1px solid var(--border-color)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{model.name}</span>
                        <span className="badge badge-success" style={{ fontSize: "0.6rem", padding: "1px 5px" }}>{model.speed}</span>
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "8px" }}>
                        <span>Total Tokens: <strong>{totalInputTokens.toLocaleString()}</strong></span>
                        <span style={{ display: "flex", alignItems: "center", color: "var(--success)" }}>
                          <DollarSign style={{ width: 12, height: 12 }} />
                          <strong>{totalCost.toFixed(6)} / execution</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Regulatory warning context */}
              {ragBloat >= 4000 && (
                <div style={{ display: "flex", gap: "8px", padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(245, 158, 11, 0.05)", border: "1px solid var(--warning)", color: "var(--warning)", fontSize: "0.75rem", lineHeight: 1.4 }}>
                  <AlertTriangle style={{ width: 18, height: 18, flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong>Fiduciary Notice:</strong> Injecting reference manuals on every query balloons prompt input lengths, increasing operational costs. Underwriters must leverage token caching or filter indices to save API budgets.
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .tokenizer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
