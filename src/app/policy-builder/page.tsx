// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Download,
  Printer,
  Building,
  Users,
  CheckSquare,
  Shield,
  ShieldAlert,
  ClipboardList,
  FileText,
  Award,
} from "lucide-react";

interface PolicyData {
  creditUnionName: string;
  assetSize: string;
  stateJurisdiction: string;
  version: string;
  effectiveDate: string;
  boardApprovalDate: string;
  governingBody: string;
  aiLiaisonRole: string;
  boardReviewFrequency: string;

  // Approved Use Cases
  useCaseChatbot: boolean;
  useCaseUnderwriting: boolean;
  useCaseFraud: boolean;
  useCaseMarketing: boolean;
  useCaseDocProcessing: boolean;

  // Security & Data Privacy
  allowPublicGenAI: boolean;
  piiRestrictions: string;
  hitlRequired: boolean;
  biasCheckFrequency: string;
  vendorDiligenceRequired: boolean;

  // Research Guidance & Regulatory Alignment (from docs/ai-gov-bp.md)
  ncuaPrioritiesAligned: boolean;
  cfpbCircular202203Aligned: boolean;
  interagencyTprmAligned: boolean;
  cfpbChatbotUdaapAligned: boolean;
  nistRmfFramework: boolean;
  iso42001Certified: boolean;
  explainabilityTelemetry: boolean;
  fourthPartyConsentRequired: boolean;
  unrestrictedRightToAudit: boolean;
  dataDestructionGuarantee: boolean;
}

export default function PolicyBuilderPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "governance" | "usecases" | "risk" | "tprm">("profile");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Form State initialized via pure lazy initializer
  const [formData, setFormData] = useState<PolicyData>(() => {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 30);

    return {
      creditUnionName: "Community First Credit Union",
      assetSize: "$250 Million - $1 Billion",
      stateJurisdiction: "Washington",
      version: "2.0",
      effectiveDate: today.toISOString().split("T")[0],
      boardApprovalDate: future.toISOString().split("T")[0],
      governingBody: "Executive AI Steering Committee",
      aiLiaisonRole: "Chief Risk Officer",
      boardReviewFrequency: "Annually",

      useCaseChatbot: true,
      useCaseUnderwriting: true,
      useCaseFraud: true,
      useCaseMarketing: true,
      useCaseDocProcessing: true,

      allowPublicGenAI: false,
      piiRestrictions: "Strict Prohibition",
      hitlRequired: true,
      biasCheckFrequency: "Quarterly",
      vendorDiligenceRequired: true,

      ncuaPrioritiesAligned: true,
      cfpbCircular202203Aligned: true,
      interagencyTprmAligned: true,
      cfpbChatbotUdaapAligned: true,
      nistRmfFramework: true,
      iso42001Certified: true,
      explainabilityTelemetry: true,
      fourthPartyConsentRequired: true,
      unrestrictedRightToAudit: true,
      dataDestructionGuarantee: true,
    };
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Generate Markdown Text incorporating research from docs/ai-gov-bp.md
  const generateMarkdown = () => {
    const selectedUseCases = [];
    if (formData.useCaseChatbot) {
      selectedUseCases.push(
        `*   **Member Support Chatbots & Conversational AI:** Conversational agents deployed for member FAQ response, basic troubleshooting, and navigational guidance. Subject to CFPB CFPA Section 1036 UDAAP safeguards and mandatory Regulation E (EFT) / Regulation Z (Billing Dispute) human escalation triggers.`
      );
    }
    if (formData.useCaseUnderwriting) {
      selectedUseCases.push(
        `*   **Automated Credit Underwriting & Risk Scoring:** Algorithmic credit scoring and DTI calculation models evaluating loan applications. Subject to CFPB Circular 2022-03 explainability rules, SHAP/LIME feature attributions, and quarterly ECOA fair lending bias audits.`
      );
    }
    if (formData.useCaseFraud) {
      selectedUseCases.push(
        `*   **Fraud Screening & Transaction Monitoring:** Real-time transaction pattern recognition to detect account takeover, identity theft, and synthetic voice/video deepfake attacks.`
      );
    }
    if (formData.useCaseMarketing) {
      selectedUseCases.push(
        `*   **Marketing Content Drafting & Personalization:** Generative AI models assisting staff in drafting promotional text, member newsletter copy, and financial literacy guides.`
      );
    }
    if (formData.useCaseDocProcessing) {
      selectedUseCases.push(
        `*   **Member Document Processing & OCR Extraction:** Machine learning vision models extracting structured data from tax documents, pay stubs, and mortgage deeds.`
      );
    }

    if (selectedUseCases.length === 0) {
      selectedUseCases.push(
        `*   *No specific use cases selected. All AI deployments require individual Steering Committee review and risk classification.*`
      );
    }

    return `# ${formData.creditUnionName.toUpperCase()}
# ENTERPRISE ARTIFICIAL INTELLIGENCE (AI) GOVERNANCE & COMPLIANCE POLICY

**Document Status:** Approved & Active  
**Policy Version:** ${formData.version} (Incorporating NCUA 2026 Supervisory Priorities & Interagency Guidance)  
**Effective Date:** ${formData.effectiveDate}  
**Board Approval Date:** ${formData.boardApprovalDate}  
**Policy Owner:** ${formData.aiLiaisonRole}  
**Primary Governing Body:** ${formData.governingBody}  
**Jurisdiction:** State of ${formData.stateJurisdiction} | NCUA Region  
**Asset Classification:** ${formData.assetSize}  

---

## 1. EXECUTIVE OBJECTIVE & REGULATORY ALIGNMENT

### 1.1 Purpose
The mission of **${formData.creditUnionName}** is to serve our member-owners with financial integrity, operational safety, and absolute fiduciary prudence. As the Credit Union integrates Artificial Intelligence (AI), Machine Learning (ML), and Large Language Models (LLMs) into member service, underwriting, and risk monitoring, this Policy establishes an examiner-defensible governance framework.

### 1.2 Statutory & Supervisory Framework
This policy explicitly incorporates technology-neutral supervisory expectations established by federal regulatory authorities:
*   **NCUA 2026 Supervisory Priorities & CAIO Directives:** Aligned with Office of Management and Budget (OMB) Memorandum M-25-21 and the AI in Government Act of 2020. Artificial intelligence deployments are evaluated through core examination pillars including BSA/AML, ECOA, GLBA, and Third-Party Risk Management (TPRM).
*   **CFPB Circular 2022-03 (Adverse Action Disclosures):** Mandates specific, accurate principal reason disclosures under ECOA (Regulation B) for algorithmic credit denials. Technological complexity is strictly prohibited as a defense for "black-box" decision opacity.
*   **2023 Interagency Guidance on Third-Party Relationships:** Enforces non-delegable institutional liability for all third-party AI fintech vendors and sub-processors.
*   **CFPB Chatbot Guidance & CFPA Section 1036:** Prevents Unfair, Deceptive, or Abusive Acts or Practices (UDAAP) in automated member communications and enforces mandatory escalation for Regulation E (Electronic Fund Transfers) and Regulation Z (Truth in Lending) disputes.
*   **NIST AI Risk Management Framework (NIST AI RMF 1.0):** Operationalizes technical trustworthiness across four core functions: **Govern, Map, Measure, and Manage**.

---

## 2. STRATEGIC GOVERNANCE ARCHITECTURE & OVERSIGHT

### 2.1 Governance Roles & Accountabilities
1.  **Board of Directors:** Retains ultimate fiduciary duty. The Board approves this Policy ${formData.boardReviewFrequency.toLowerCase()}, establishes the institutional AI Risk Appetite, and reviews model risk exposure during capital planning.
2.  **${formData.governingBody}:** Cross-functional executive body comprising Risk, Compliance, Lending, IT, and Operations. Responsible for approving new AI use cases, maintaining the central AI Asset Inventory, reviewing SHAP/LIME explainability audits, and evaluating vendor due diligence files.
3.  **Primary AI Liaison (${formData.aiLiaisonRole}):** Manages day-to-day AI risk operations, coordinates model revalidations, reviews telemetry logs, and serves as primary point-of-contact for NCUA examiners.
4.  **Model Risk Management (MRM) Team:** Conducts independent pre-deployment model validations, bias audits, and drift monitoring.
5.  **Third-Party Risk Management (TPRM) Team:** Executes initial vendor due diligence, contract negotiations, SOC report reviews, and 4th-party subcontractor tracking.

---

## 3. THREE-TIER AI RISK TAXONOMY & OPERATIONAL SAFEGUARDS

To calibrate due diligence, **${formData.creditUnionName}** categorizes all automated systems into three risk tiers:

| AI Risk Tier | Categorization Criteria & Scope | Approved Credit Union Use Cases | Mandatory Governance Safeguards |
| :--- | :--- | :--- | :--- |
| **High Risk** | Direct impact on credit availability, financial standing, BSA/AML, or legal rights. | Automated credit underwriting, dynamic risk pricing, BSA/AML monitoring, automated fraud blocking. | Pre-deployment bias testing (AIR/Marginal Effect), full SHAP/LIME validation, decision logging by design, mandatory ${formData.hitlRequired ? "Human-in-the-Loop (HITL)" : "Steering Committee review"}, **${formData.biasCheckFrequency}** fair lending audits. |
| **Moderate Risk** | Direct member interaction or operational routing without binding financial decisions. | Member-facing chatbots, marketing segmentation, loan doc OCR routing, internal knowledge Q&A. | Real-time accuracy validation, RAG hallucination guardrails, mandatory Reg E/Z human escalation triggers, NPI privacy masking. |
| **Low Risk** | Isolated internal productivity tools operating without member data access. | Code assistance tools, internal document formatting, aggregated operational analytics. | Baseline IT security scan, Data Loss Prevention (DLP) monitoring, acceptable use policy enforcement. |

---

## 4. APPROVED USE CASES & OPERATIONAL BOUNDS

The Credit Union authorizes the following initial AI use cases, strictly subject to the specified operational controls:

${selectedUseCases.join("\n\n")}

### Generative AI Usage & Data Privacy Rules
*   **Public GenAI Platforms:** ${formData.allowPublicGenAI ? "Permitted ONLY for non-sensitive administrative task brainstorming, strictly prohibited from receiving member NPI or proprietary credit union data." : "STRICTLY PROHIBITED for all business operations. Employees are forbidden from using consumer-facing public accounts (e.g. ChatGPT, Claude) for credit union work."}
*   **Member PII Safeguards:** Under GLBA compliance, **${formData.piiRestrictions === "Strict Prohibition" ? "under no circumstances may Nonpublic Personal Information (PII) or financial data be entered into external AI systems." : "any member PII or financial data must be fully anonymized or masked using approved cryptographic sanitization libraries before processing."}**
*   **Human-in-the-Loop (HITL) Requirement:** ${formData.hitlRequired ? "Mandatory for all High-Risk AI outputs. No automated system may issue binding credit denials, account closures, or wire transfers without explicit sign-off by a qualified credit union officer." : "Recommended for High-Risk workflows; automated execution permitted under strict real-time telemetry monitoring."}

---

## 5. MODEL RISK MANAGEMENT, FAIR LENDING & EXPLAINABILITY TELEMETRY

### 5.1 Fair Lending Compliance (ECOA / Regulation B)
Models involved in underwriting or credit evaluation are strictly prohibited from utilizing protected attributes (race, gender, age, marital status) or proxy variables (e.g. zip code, educational background). Continuous fair lending monitoring requires **${formData.biasCheckFrequency}** bias audits utilizing Adverse Impact Ratios (AIR) and Marginal Effect Analysis.

### 5.2 Algorithmic Explainability & CFPB Circular 2022-03
To comply with Adverse Action notification requirements, all complex non-linear models must integrate local explainability pipelines (SHAP or LIME). Mathematical factor attributions are mapped directly to standardized ECOA denial reason codes. Vague justifications such as "algorithmic score" are legally non-compliant.

### 5.3 Immutable Decision Logging Telemetry
Every automated credit or risk decision must generate an immutable audit log capturing:

| Telemetry Field | Audit & Regulatory Purpose |
| :--- | :--- |
| **Timestamp & Session ID** | Verifies execution timing and operational context. |
| **Model ID & Version** | Ensures model version control and validation tracking. |
| **Ingested Data Inputs** | FCRA / ECOA data accuracy safeguards. |
| **Raw Model Probability Score** | Captures mathematical confidence and drift. |
| **Local Feature Attributions** | Quantifies top 4 negative impact factors via SHAP/LIME values. |
| **Executed Action & ECOA Codes** | Logs final action (Approved, Referred, Denied) and exact adverse action reason codes. |

---

## 6. THIRD-PARTY RISK MANAGEMENT (TPRM) & VENDOR CLAUSES

In compliance with the 2023 Interagency Guidance on Third-Party Relationships, all AI fintech vendors must undergo a structured 5-stage lifecycle evaluation:

1.  **Planning:** Classify vendor criticality and define risk boundaries.
2.  **Due Diligence:** Evaluate model provenance, training data sources, and verify **ISO 42001 (AI Management System)** and **AIUC-1 (AI Agent Standard)** certifications.
3.  **Contract Negotiation:** Mandatory inclusion of:
    *   **Unrestricted Right-to-Audit:** Grants Credit Union and NCUA examiners independent authority to audit models, code, and security controls.
    *   **4th-Party Subcontractor Consent:** Vendors must obtain explicit Credit Union consent before introducing new sub-processors or model updates.
    *   **Data Non-Training Clause:** Explicitly forbids vendors from training public/shared models on Credit Union data.
4.  **Ongoing Monitoring:** Continuous review of SOC 2 Type II reports, SLA metrics, and annual model revalidations.
5.  **Termination & Data Destruction:** Enforce secure extraction and destruction of member NPI and decision logs upon offboarding.

---

## 7. MEMBER CHATBOTS, UDAAP PREVENTION & FRAUD DEFENSE

### 7.1 Chatbot Safeguards & CFPA Section 1036
Member-facing conversational agents operating under Retrieval-Augmented Generation (RAG) must adhere to strict retrieval boundaries. Misleading responses regarding account fees or loan terms constitute UDAAP violations under CFPA Section 1036.

### 7.2 Mandatory Dispute Escalation Triggers
Automated agents are programmed to detect statutory dispute language under **Regulation E (Electronic Fund Transfers)** and **Regulation Z (Truth in Lending)** and immediately execute a seamless transfer to a human compliance representative.

### 7.3 AI-Driven Fraud Protections
To counter synthetic voice (vishing), deepfake video, and prompt injection attacks, the Credit Union deploys biometric liveness verification and API guardrails for all remote onboarding and wire transfer channels.

---

## 8. SIX-STAGE OPERATIONAL IMPLEMENTATION BLUEPRINT

To maintain compliance readiness, the Credit Union executes a structured 6-stage operational blueprint:
1.  **AI Asset Inventory:** Maintain a centralized inventory of all active AI models and risk classifications.
2.  **Regulatory Mapping:** Map every AI asset to BSA/AML, ECOA, FCRA, GLBA, and UDAAP obligations.
3.  **Gap Assessment:** Audit vendor contracts and model validation files against Interagency TPRM rules.
4.  **Architectural Review:** Enforce compliance-first design, decision logging, and data masking.
5.  **Formal Governance:** Maintain Board Risk Appetite approval and AI Steering Committee charters.
6.  **Continuous Testing:** Execute **${formData.biasCheckFrequency}** fair lending revalidations and telemetry tracking.

---

## 9. ENFORCEMENT & DISCLAIMER
Violations of this Policy may result in disciplinary action up to and including termination. Suspicious AI outputs or potential data exposure must be reported immediately to the **${formData.aiLiaisonRole}**.

*This document constitutes the internal AI Governance Policy of ${formData.creditUnionName}. Prepared for NCUA supervisory review and institutional risk management.*
`;
  };

  // Download Markdown file
  const downloadMarkdown = () => {
    const mdText = generateMarkdown();
    const blob = new Blob([mdText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const sanitizedCuName = formData.creditUnionName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    link.setAttribute("download", `${sanitizedCuName}_ai_governance_policy.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#a855f7", "#06b6d4"],
    });
  };

  // Download PDF / Print
  const handlePrintPDF = () => {
    setShowPrintModal(true);
  };

  const executePrint = () => {
    setShowPrintModal(false);
    setTimeout(() => {
      window.print();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#a855f7", "#06b6d4"],
      });
    }, 500);
  };

  return (
    <div className="section" style={{ paddingTop: "40px", minHeight: "100vh" }}>
      <div className="container">
        {/* Breadcrumb / Back Navigation */}
        <div className="no-print" style={{ marginBottom: "20px" }}>
          <Link href="/" className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
            <ArrowLeft style={{ width: 14, height: 14 }} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Title Block */}
        <div className="no-print animate-fade-in-up" style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span className="badge badge-board">NCUA 2026 Aligned</span>
            <span className="badge badge-indigo">NIST AI RMF & ISO 42001</span>
          </div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "12px" }}>
            AI Policy & <span className="gradient-text">Governance Builder</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "850px", fontSize: "1.05rem" }}>
            Configure and export a complete, NCUA-examiner-defensible AI Governance Policy for your credit union. Incorporates CFPB Circular 2022-03 Adverse Action rules, 2023 Interagency TPRM guidance, SHAP/LIME explainability, and ISO 42001 / AIUC-1 standards.
          </p>
        </div>

        {/* View Toggle Bar */}
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "30px",
            padding: "16px 20px",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {/* Mode Switcher */}
          <div style={{ display: "flex", gap: "8px", background: "rgba(0,0,0,0.3)", padding: "4px", borderRadius: "var(--radius-md)" }}>
            <button
              onClick={() => setViewMode("edit")}
              className={`btn ${viewMode === "edit" ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            >
              <ClipboardList style={{ width: 14, height: 14 }} />
              <span>Interactive Policy Editor</span>
            </button>

            <button
              onClick={() => setViewMode("preview")}
              className={`btn ${viewMode === "preview" ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            >
              <FileText style={{ width: 14, height: 14 }} />
              <span>Preview Policy Document</span>
            </button>
          </div>

          {/* Export Actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={downloadMarkdown} className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
              <Download style={{ width: 14, height: 14 }} />
              <span>Export Markdown (.md)</span>
            </button>

            <button onClick={handlePrintPDF} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
              <Printer style={{ width: 14, height: 14 }} />
              <span>Export PDF / Print</span>
            </button>
          </div>
        </div>

        {/* MAIN WORKSPACE CONTENT */}
        {viewMode === "edit" ? (
          <div className="no-print" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "28px", alignItems: "start" }}>
            {/* Editor Input Form */}
            <div className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Editor Tabs Navigation */}
              <div style={{ display: "flex", gap: "6px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", overflowX: "auto" }}>
                {[
                  { id: "profile", label: "CU Profile", icon: Building },
                  { id: "governance", label: "Oversight", icon: Users },
                  { id: "usecases", label: "Use Cases", icon: CheckSquare },
                  { id: "risk", label: "Risk & Telemetry", icon: ShieldAlert },
                  { id: "tprm", label: "TPRM & Standards", icon: Shield },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as "profile" | "governance" | "usecases" | "risk" | "tprm")}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: isActive ? "var(--primary)" : "transparent",
                        color: isActive ? "#fff" : "var(--text-secondary)",
                        transition: "all 0.2s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Icon style={{ width: 14, height: 14 }} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: CU PROFILE */}
              {activeTab === "profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--primary)" }}>Credit Union Profile & Charter Details</h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Credit Union Name</label>
                    <input
                      type="text"
                      name="creditUnionName"
                      value={formData.creditUnionName}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Asset Size Tier</label>
                      <select
                        name="assetSize"
                        value={formData.assetSize}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-color)",
                          backgroundColor: "rgba(18, 21, 38, 0.95)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <option value="Under $100 Million">Under $100 Million</option>
                        <option value="$100 Million - $250 Million">$100 Million - $250 Million</option>
                        <option value="$250 Million - $1 Billion">$250 Million - $1 Billion</option>
                        <option value="$1 Billion - $10 Billion">$1 Billion - $10 Billion</option>
                        <option value="Over $10 Billion">Over $10 Billion</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>State Jurisdiction</label>
                      <input
                        type="text"
                        name="stateJurisdiction"
                        value={formData.stateJurisdiction}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-color)",
                          backgroundColor: "rgba(0,0,0,0.3)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Policy Version</label>
                      <input
                        type="text"
                        name="version"
                        value={formData.version}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-color)",
                          backgroundColor: "rgba(0,0,0,0.3)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Effective Date</label>
                      <input
                        type="date"
                        name="effectiveDate"
                        value={formData.effectiveDate}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-color)",
                          backgroundColor: "rgba(18, 21, 38, 0.95)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: GOVERNANCE & ROLES */}
              {activeTab === "governance" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--primary)" }}>Board Oversight & Committee Structure</h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Primary Governing Body</label>
                    <input
                      type="text"
                      name="governingBody"
                      value={formData.governingBody}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Primary AI Liaison Role</label>
                      <select
                        name="aiLiaisonRole"
                        value={formData.aiLiaisonRole}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-color)",
                          backgroundColor: "rgba(18, 21, 38, 0.95)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <option value="Chief Risk Officer">Chief Risk Officer (CRO)</option>
                        <option value="Chief Information Officer">Chief Information Officer (CIO)</option>
                        <option value="Chief Compliance Officer">Chief Compliance Officer (CCO)</option>
                        <option value="Chief Technology Officer">Chief Technology Officer (CTO)</option>
                        <option value="AI Governance Officer">AI Governance Officer</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Board Review Frequency</label>
                      <select
                        name="boardReviewFrequency"
                        value={formData.boardReviewFrequency}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-color)",
                          backgroundColor: "rgba(18, 21, 38, 0.95)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <option value="Quarterly">Quarterly</option>
                        <option value="Semi-Annually">Semi-Annually</option>
                        <option value="Annually">Annually</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: USE CASES */}
              {activeTab === "usecases" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--primary)" }}>Authorized Credit Union AI Use Cases</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { key: "useCaseChatbot", title: "Member Support Chatbots & Conversational AI", desc: "Includes Reg E/Z dispute escalation triggers and UDAAP safeguards." },
                      { key: "useCaseUnderwriting", title: "Credit Underwriting & Risk Scoring", desc: "Includes CFPB Circular 2022-03 explainability & SHAP attributions." },
                      { key: "useCaseFraud", title: "Fraud Screening & Transaction Monitoring", desc: "Deepfake, vishing, and synthetic identity defenses." },
                      { key: "useCaseMarketing", title: "Marketing Content Drafting", desc: "Generative AI copywriting and literacy content." },
                      { key: "useCaseDocProcessing", title: "Member Document Processing & OCR", desc: "Paystubs, tax forms, and mortgage extraction." },
                    ].map((item) => (
                      <label
                        key={item.key}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "rgba(255,255,255,0.02)",
                          border: "1px solid var(--border-color)",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          name={item.key}
                          checked={Boolean(formData[item.key as keyof PolicyData])}
                          onChange={handleInputChange}
                          style={{ width: 18, height: 18, accentColor: "var(--primary)", marginTop: "2px" }}
                        />
                        <div>
                          <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{item.title}</strong>
                          <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: RISK & TELEMETRY */}
              {activeTab === "risk" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--primary)" }}>Model Risk Management & Decision Telemetry</h3>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Fair Lending Bias Audit Frequency</label>
                    <select
                      name="biasCheckFrequency"
                      value={formData.biasCheckFrequency}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "rgba(18, 21, 38, 0.95)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Semi-Annually">Semi-Annually</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="explainabilityTelemetry"
                        checked={formData.explainabilityTelemetry}
                        onChange={handleInputChange}
                        style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                      />
                      <span>Enforce Immutable Decision Logging Telemetry (SHAP/LIME attributions + ECOA Reason Codes)</span>
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="hitlRequired"
                        checked={formData.hitlRequired}
                        onChange={handleInputChange}
                        style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                      />
                      <span>Mandatory Human-in-the-Loop (HITL) Gate for High-Risk Applications</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 5: TPRM & STANDARDS */}
              {activeTab === "tprm" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--primary)" }}>5-Stage TPRM & Vendor Certification Standards</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="iso42001Certified"
                        checked={formData.iso42001Certified}
                        onChange={handleInputChange}
                        style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                      />
                      <span>Require ISO 42001 (AI Management System) & AIUC-1 Agent Standards</span>
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="unrestrictedRightToAudit"
                        checked={formData.unrestrictedRightToAudit}
                        onChange={handleInputChange}
                        style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                      />
                      <span>Contractual Unrestricted Right-to-Audit for Credit Union & NCUA Examiners</span>
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="fourthPartyConsentRequired"
                        checked={formData.fourthPartyConsentRequired}
                        onChange={handleInputChange}
                        style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                      />
                      <span>Mandatory Consent for 4th-Party Subcontractors & Sub-processors</span>
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="dataDestructionGuarantee"
                        checked={formData.dataDestructionGuarantee}
                        onChange={handleInputChange}
                        style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                      />
                      <span>Enforce Secure NPI & Decision Log Extraction upon Offboarding</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Regulatory Guidance Cheat-Sheet */}
            <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Award style={{ width: 20, height: 20, color: "var(--warning)" }} />
                <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-primary)" }}>
                  2026 Regulatory Examination Benchmarks
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
                <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                  <strong style={{ color: "var(--primary)", display: "block", marginBottom: "4px" }}>NCUA 2026 Supervisory Priorities</strong>
                  Examiners evaluate AI through existing BSA/AML, ECOA, and TPRM pillars. Continuous decision logging and board oversight are mandatory.
                </div>

                <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "rgba(168, 85, 247, 0.08)", border: "1px solid rgba(168, 85, 247, 0.2)" }}>
                  <strong style={{ color: "var(--secondary)", display: "block", marginBottom: "4px" }}>CFPB Circular 2022-03 (Adverse Action)</strong>
                  Black-box algorithms are prohibited. Denial disclosures must state exact negative impact factors mapped to ECOA codes.
                </div>

                <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                  <strong style={{ color: "var(--success)", display: "block", marginBottom: "4px" }}>2023 Interagency TPRM Guidance</strong>
                  Institutional liability cannot be outsourced. Vendors must provide audit access and 4th-party subcontractor consent.
                </div>

                <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.2)" }}>
                  <strong style={{ color: "var(--accent)", display: "block", marginBottom: "4px" }}>ISO 42001 & AIUC-1 Certification</strong>
                  Benchmark standards for AI management systems and quarterly adversarial agent testing.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* PREVIEW MODE: Publication-Ready Policy Document */
          <div className="card" style={{ padding: "40px", backgroundColor: "#fff", color: "#111827", borderRadius: "var(--radius-lg)" }}>
            <pre style={{ fontFamily: "serif", fontSize: "0.95rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {generateMarkdown()}
            </pre>
          </div>
        )}

        {/* PRINT MODAL CONFIRMATION */}
        {showPrintModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(6px)",
              zIndex: 3000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div className="card" style={{ maxWidth: "480px", width: "100%", padding: "28px" }}>
              <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Prepare Policy Document for Export</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                Ready to generate printable PDF / Examiner submission package for <strong>{formData.creditUnionName}</strong>.
              </p>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={() => setShowPrintModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={executePrint} className="btn btn-primary">
                  <Printer style={{ width: 16, height: 16 }} />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
