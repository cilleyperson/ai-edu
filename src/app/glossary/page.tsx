// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, HelpCircle, ArrowLeft } from "lucide-react";

interface GlossaryTerm {
  term: string;
  definition: string;
  analogy: string;
  category: "Technical" | "Oversight" | "Security";
}

export default function GlossaryPage() {
  const terms: GlossaryTerm[] = [
    {
      term: "Agentic AI",
      definition: "An AI architecture that uses large language models to reason, plan, select external tools, and execute multi-step processes autonomously rather than just responding to simple text queries.",
      analogy: "Like hiring a virtual assistant who doesn't just read you the policy handbook but actually fills out the loan spreadsheet, double-checks the numbers, and files it for manager approval.",
      category: "Technical"
    },
    {
      term: "RAG (Retrieval-Augmented Generation)",
      definition: "A method that searches internal documents (like policy manuals) to find factual reference texts, copying them into the AI prompt so it answers questions using real, up-to-date information rather than memory.",
      analogy: "Like giving an employee an open-book exam. Instead of guessing from memory, they read the exact page in the loan guidelines before writing their answer.",
      category: "Technical"
    },
    {
      term: "PII (Personally Identifiable Information)",
      definition: "Any information that can be used to distinguish or trace an individual's identity, such as SSNs, names, account numbers, addresses, or biometric records.",
      analogy: "The vault keys. Paste them in public AI systems and they are public. Always mask them first.",
      category: "Security"
    },
    {
      term: "Human-in-the-Loop (HITL)",
      definition: "An operational design where an AI agent can execute low-risk tasks, but must pause and await explicit approval from a human employee before executing high-risk operations (e.g., approving a loan or wire transfer).",
      analogy: "Like a new loan officer trainee. They compile the applicant file and run calculations, but the senior underwriter must physically sign the loan release.",
      category: "Oversight"
    },
    {
      term: "System Prompt",
      definition: "The master instruction sheet given to an AI agent at initialization that defines its role, permissions, boundaries, and safety policies.",
      analogy: "The official employee job description and code of conduct document given on day one.",
      category: "Oversight"
    },
    {
      term: "Hallucination",
      definition: "A phenomenon where an AI model generates responses that sound confident and grammatical, but are factually incorrect or unsupported by the source text.",
      analogy: "Like a staff member who guesses an interest rate off the top of their head to sound helpful, instead of looking up the daily rate sheet.",
      category: "Technical"
    },
    {
      term: "Vector Database",
      definition: "A database that stores text as mathematical coordinates (vectors), allowing AI models to find conceptually related ideas rapidly instead of matching exact keyword strings.",
      analogy: "Like organizing the credit union filing cabinet by topics and concepts (e.g., placing all files about 'auto risk' together) rather than strictly alphabetical labels.",
      category: "Technical"
    },
    {
      term: "GLBA (Gramm-Leach-Bliley Act)",
      definition: "A federal law requiring financial institutions to explain their information-sharing practices and safeguard sensitive member data.",
      analogy: "The privacy framework that makes sharing raw SSNs or tax files with third-party, non-compliant AI services illegal.",
      category: "Security"
    },
    {
      term: "Model Drift",
      definition: "The decay of an AI model's accuracy over time due to changes in real-world data distributions or updates in systemic guidelines.",
      analogy: "Like a lending policy getting outdated because economic conditions shift, making old underwriting scores unreliable under current market rates.",
      category: "Oversight"
    },
    {
      term: "ReAct Framework (Reasoning + Action)",
      definition: "An agentic planning loop where the AI alternates between 'thinking' (reasoning about goals) and 'acting' (invoking database lookups or calculators) until a problem is solved.",
      analogy: "Like a teller: 1. Think ('The member wants to withdraw $100'). 2. Act (Check account balance). 3. Observe ('Balance is $500'). 4. Think ('It is safe to withdraw'). 5. Act (Hand over money).",
      category: "Technical"
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Technical" | "Oversight" | "Security">("All");

  // Filters
  const filteredTerms = terms.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <span className="badge badge-staff" style={{ marginBottom: "10px" }}>Reference Guide</span>
          <h1 className="gradient-text" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
            Credit Union AI Glossary
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "800px" }}>
            Demystify AI technical, compliance, and governance definitions. Use credit union analogies to explain complex agentic concepts to board directors, managers, and staff alike.
          </p>
        </div>

        {/* Search and Filters Card */}
        <div className="card" style={{ padding: "20px", marginBottom: "30px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
            <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "42px" }}
              placeholder="Search terms or definitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {(["All", "Technical", "Oversight", "Security"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  backgroundColor: activeCategory === cat ? "var(--primary)" : "rgba(255,255,255,0.03)",
                  border: "1px solid",
                  borderColor: activeCategory === cat ? "var(--primary)" : "var(--border-color)",
                  color: activeCategory === cat ? "#ffffff" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Term List */}
        {filteredTerms.length === 0 ? (
          <div className="card text-center" style={{ padding: "40px", color: "var(--text-muted)" }}>
            <HelpCircle style={{ width: 44, height: 44, strokeWidth: 1.5, margin: "0 auto 12px auto" }} />
            <p>No glossary terms match your search query.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {filteredTerms.map((t, idx) => (
              <div 
                key={idx}
                className="card animate-fade-in-up"
                style={{ 
                  padding: "24px", 
                  borderLeft: `4px solid ${
                    t.category === "Technical" ? "var(--primary)" : 
                    t.category === "Oversight" ? "var(--secondary)" : "var(--accent)"
                  }`
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                  <h3 style={{ fontSize: "1.3rem", margin: 0 }}>{t.term}</h3>
                  <span 
                    className={`badge badge-${
                      t.category === "Technical" ? "mgmt" : 
                      t.category === "Oversight" ? "board" : "staff"
                    }`}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {t.category}
                  </span>
                </div>
                
                <p style={{ color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "16px", lineHeight: 1.6 }}>
                  {t.definition}
                </p>

                {/* Analogies Card */}
                <div 
                  style={{ 
                    padding: "12px 16px", 
                    borderRadius: "var(--radius-md)", 
                    backgroundColor: "rgba(255, 255, 255, 0.02)", 
                    border: "1px dashed var(--border-color)",
                    fontSize: "0.85rem"
                  }}
                >
                  <strong style={{ display: "block", color: "var(--text-secondary)", marginBottom: "4px", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                    Credit Union Analogy:
                  </strong>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {t.analogy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
