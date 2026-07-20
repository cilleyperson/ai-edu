"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, Download, Printer, Building, Users, CheckSquare, 
  Shield, ShieldAlert, ClipboardList, Info, FileText
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
  useCaseChatbot: boolean;
  useCaseUnderwriting: boolean;
  useCaseFraud: boolean;
  useCaseMarketing: boolean;
  useCaseDocProcessing: boolean;
  allowPublicGenAI: boolean;
  piiRestrictions: string;
  hitlRequired: boolean;
  biasCheckFrequency: string;
  vendorDiligenceRequired: boolean;
}

export default function PolicyBuilderPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "governance" | "usecases" | "risk" | "compliance">("profile");
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
      version: "1.0",
      effectiveDate: today.toISOString().split("T")[0],
      boardApprovalDate: future.toISOString().split("T")[0],
      governingBody: "AI Steering Committee",
      aiLiaisonRole: "Chief Risk Officer",
      boardReviewFrequency: "Annually",
      useCaseChatbot: true,
      useCaseUnderwriting: false,
      useCaseFraud: true,
      useCaseMarketing: true,
      useCaseDocProcessing: true,
      allowPublicGenAI: false,
      piiRestrictions: "Strict Prohibition",
      hitlRequired: true,
      biasCheckFrequency: "Quarterly",
      vendorDiligenceRequired: true
    };
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectRadio = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generate Markdown Text
  const generateMarkdown = () => {
    const selectedUseCases = [];
    if (formData.useCaseChatbot) {
      selectedUseCases.push(`*   **Member Support Chatbot:** Conversational agent deployed to assist members with FAQ searches, basic troubleshooting, and navigational guidance.`);
    }
    if (formData.useCaseUnderwriting) {
      selectedUseCases.push(`*   **Credit Underwriting Assistant:** Algorithmic assessment tools that review credit histories, calculate debt-to-income ratios, and provide creditworthiness recommendations to underwriters.`);
    }
    if (formData.useCaseFraud) {
      selectedUseCases.push(`*   **Fraud Detection & AML Compliance:** Real-time transaction pattern monitoring to identify suspicious deposits, potential identity theft, and compliance flags.`);
    }
    if (formData.useCaseMarketing) {
      selectedUseCases.push(`*   **Marketing Content Drafting:** Large Language Models (LLMs) used by creative staff to generate initial drafts for email campaigns, blog posts, and educational resources.`);
    }
    if (formData.useCaseDocProcessing) {
      selectedUseCases.push(`*   **Member Document Processing:** Machine learning OCR systems designed to extract structural data from tax filings, paystubs, and mortgage deeds.`);
    }

    if (selectedUseCases.length === 0) {
      selectedUseCases.push(`*   *No specific use cases selected. All AI deployments require individual steering committee review and risk classification.*`);
    }

    return `# ${formData.creditUnionName.toUpperCase()}
# ARTIFICIAL INTELLIGENCE (AI) POLICY & GOVERNANCE FRAMEWORK

**Document Status:** Approved & Active
**Policy Version:** ${formData.version}
**Effective Date:** ${formData.effectiveDate}
**Board Approval Date:** ${formData.boardApprovalDate}
**Policy Owner:** ${formData.aiLiaisonRole}
**State Jurisdiction:** ${formData.stateJurisdiction}
**Asset Size Tier:** ${formData.assetSize}

---

## 1. OBJECTIVE & SCOPE
The mission of **${formData.creditUnionName}** is to serve our member-owners with integrity, financial safety, and absolute prudence. As we integrate Artificial Intelligence (AI) technologies—including Machine Learning (ML), Large Language Models (LLMs), and Generative AI—into our operational workflows, this Policy establishes a rigorous governance framework.

This policy applies to all employees, contractors, board directors, and third-party software partners. It is structured to align with the technology-neutral examination expectations of the **National Credit Union Administration (NCUA)**, the **NIST AI Risk Management Framework (AI RMF 1.0)**, and the **Gramm-Leach-Bliley Act (GLBA)** privacy requirements.

---

## 2. GOVERNANCE & RESPONSIBILITIES
To maintain clear organizational oversight and accountability, the Credit Union establishes the following governance matrix:

1.  **Board of Directors:** Retains ultimate fiduciary duty. The Board reviews and approves this Policy ${formData.boardReviewFrequency.toLowerCase()}, monitors systemic algorithmic risks, and evaluates AI integrations within annual capital planning.
2.  **${formData.governingBody}:** The primary governing committee responsible for reviewing and approving all proposed AI use cases, maintaining the central AI Use Case Inventory, auditing compliance logs, and approving risk exceptions.
3.  **Primary AI Liaison (${formData.aiLiaisonRole}):** Appointed to oversee day-to-day AI implementation, lead vendor risk assessments, coordinate compliance testing, and serve as the main point of contact for external audits.
4.  **Business Unit Owners:** Retain operational accountability for AI systems deployed within their departments, ensuring staff adhere to prompt safety rules and manual output verification.

---

## 3. APPROVED AI USE CASES & OPERATIONAL BOUNDS
AI technologies may only be deployed for use cases explicitly reviewed and authorized by the **${formData.governingBody}**. The initially approved use cases include:

${selectedUseCases.join("\n")}

### Generative AI Usage Rules (Public vs. Enterprise)
*   **Public GenAI Platforms:** ${formData.allowPublicGenAI ? "Allowed for low-risk business tasks (e.g. email brainstorming, text formatting) strictly subject to entering zero member data or proprietary information." : "Strictly PROHIBITED for all business operations. Employees are forbidden from using consumer-facing public GenAI accounts (e.g., public ChatGPT, Gemini, Claude) for any Credit Union work."}
*   **Member PII Handling:** Under GLBA compliance, **${formData.piiRestrictions === "Strict Prohibition" ? "under no circumstances may Nonpublic Personal Information (PII) or financial data be entered into external AI systems." : "any member PII or financial data must be fully anonymized or masked using approved cryptographic sanitization libraries before processing."}**
*   **Human-in-the-Loop (HITL) Gate:** ${formData.hitlRequired ? "Mandatory. No high-risk AI output (including credit recommendations, account modifications, or member communications) may be executed autonomously. A qualified Credit Union officer must review and verify the outputs prior to execution." : "Recommended. High-risk systems require manual review, whereas moderate/low risk systems may operate under automated supervision."}

---

## 4. RISK TIER CLASSIFICATION & AUDITS
To calibrate due diligence, the Credit Union adopts a three-tier risk model:

| Risk Tier | Definition | Review & Audit Requirements |
| :--- | :--- | :--- |
| **Low Risk** | Productivity tools, code assistants, internal spelling checks. | General compliance review; standard IT security scan. |
| **Moderate Risk** | Marketing drafting, internal knowledge base Q&A, FAQ chatbots. | Vendor due diligence, compliance reviews, annual output spot-audits. |
| **High Risk** | Credit scoring, automated underwriting recommendations, fraud alerts, collections. | Full Model Risk Validation, **${formData.biasCheckFrequency}** bias audits, mandatory HITL, Board-level notifications. |

---

## 5. REGULATORY COMPLIANCE & FAIR LENDING
The Credit Union is committed to preventing algorithmic bias and complying with the **Equal Credit Opportunity Act (ECOA / Regulation B)** and CFPB guidelines.

1.  **Algorithmic Discrimination:** AI models used in underwriting, pricing, or collections are prohibited from utilizing protected classes (e.g., race, gender, age, marital status) as input features, or mathematical proxies thereof.
2.  **Adverse Action Notices:** If an AI system recommends the denial or modification of credit, the Credit Union must provide the member with a clear, specific, and legally compliant Adverse Action explanation. Vague terms like "algorithmic score" are prohibited.
3.  **Quantitative Bias Testing:** All High-Risk models must undergo **${formData.biasCheckFrequency}** quantitative testing to detect disparate impact anomalies. Testing records shall be maintained for exam review.

---

## 6. THIRD-PARTY VENDOR DUE DILIGENCE
Since the Credit Union utilizes third-party SaaS providers for AI capability, all AI vendors must undergo strict security reviews:

*   **Security & Audit Rights:** Vendors must provide SOC 2 Type II reports and agree to regular auditing by Credit Union auditors or the NCUA.
*   **Data Ownership:** Contracts must explicitly state that the **Credit Union retains 100% ownership** of all inputted data and prompt history.
*   **Non-Training Clause:** ${formData.vendorDiligenceRequired ? "Contracts MUST explicitly forbid the vendor from training their public or shared AI models on Credit Union member data or prompts." : "Contracts should seek non-training clauses, or establish dedicated virtual private tenants to separate Credit Union data."}

---

## 7. COMPLIANCE & ENFORCEMENT
Violations of this Policy may result in disciplinary action up to and including termination. Suspicious AI outputs, potential data leaks, or algorithmic anomalies must be reported immediately to the **${formData.aiLiaisonRole}** or via the anonymous compliance hotline.

---

## 8. DISCLAIMER & LEGAL NOTICE
*This document serves as the internal operational policy for ${formData.creditUnionName}. It is designed for regulatory preparedness and organizational risk mapping. It does not constitute formal legal counsel. The Credit Union shall consult legal advisors to ensure compliance with changing state and federal AI statutes.*
`;
  };

  // Download Markdown file
  const downloadMarkdown = () => {
    const mdText = generateMarkdown();
    const blob = new Blob([mdText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // Clean file name
    const sanitizedCuName = formData.creditUnionName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute("download", `${sanitizedCuName}_ai_governance_policy.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#a855f7", "#06b6d4"]
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
      // Fire confetti on complete
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#a855f7", "#06b6d4"]
      });
    }, 500);
  };

  return (
    <div className="section" style={{ paddingTop: "60px", minHeight: "100vh" }}>
      <div className="container">
        
        {/* Breadcrumb / Back Navigation */}
        <div className="no-print" style={{ marginBottom: "20px" }}>
          <Link href="/" className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
            <ArrowLeft style={{ width: 14, height: 14 }} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Title Block */}
        <div className="no-print animate-fade-in-up" style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span className="badge badge-board">Governance Module</span>
          </div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "12px" }}>
            AI Policy & <span className="gradient-text">Governance Builder</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "800px" }}>
            Draft a tailored Artificial Intelligence security and compliance policy for your Credit Union. Calibrate risk thresholds, configure vendor limitations, and enforce oversight mechanisms aligned with NCUA technology-neutral review points.
          </p>
        </div>

        {/* Mobile View Toggles */}
        <div className="no-print flex md:hidden" style={{ display: "none", marginBottom: "20px", gap: "10px" }} id="mobile-view-tabs">
          <button 
            onClick={() => setViewMode("edit")} 
            className={`btn ${viewMode === "edit" ? "btn-primary" : "btn-secondary"}`}
            style={{ flex: 1, padding: "10px" }}
          >
            Configure Policy
          </button>
          <button 
            onClick={() => setViewMode("preview")} 
            className={`btn ${viewMode === "preview" ? "btn-accent" : "btn-secondary"}`}
            style={{ flex: 1, padding: "10px" }}
          >
            Preview Document
          </button>
        </div>

        {/* Builder Layout Split Panel */}
        <div className="builder-layout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "32px", alignItems: "start" }}>
          
          {/* Left Column: Form Questionnaire */}
          <div className={`no-print card ${viewMode === "edit" ? "block" : "hidden-mobile"}`} style={{ padding: "24px", minHeight: "550px" }}>
            
            {/* Tab Navigation Icons */}
            <div className="form-tabs-bar" style={{ display: "flex", gap: "4px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "24px", overflowX: "auto" }}>
              <button 
                type="button"
                onClick={() => setActiveTab("profile")} 
                className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
                title="Profile Settings"
              >
                <Building style={{ width: 16, height: 16 }} />
                <span>Profile</span>
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("governance")} 
                className={`tab-btn ${activeTab === "governance" ? "active" : ""}`}
                title="Governance Matrix"
              >
                <Users style={{ width: 16, height: 16 }} />
                <span>Governance</span>
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("usecases")} 
                className={`tab-btn ${activeTab === "usecases" ? "active" : ""}`}
                title="Use Cases & Safety"
              >
                <CheckSquare style={{ width: 16, height: 16 }} />
                <span>AI Rules</span>
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("risk")} 
                className={`tab-btn ${activeTab === "risk" ? "active" : ""}`}
                title="Risk Calibration"
              >
                <Shield style={{ width: 16, height: 16 }} />
                <span>Risk Tiers</span>
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("compliance")} 
                className={`tab-btn ${activeTab === "compliance" ? "active" : ""}`}
                title="Regulatory Verification"
              >
                <ClipboardList style={{ width: 16, height: 16 }} />
                <span>Compliance</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            
            {/* Tab 1: Profile */}
            {activeTab === "profile" && (
              <div className="form-section">
                <h3 className="section-title">Credit Union Profile</h3>
                <p className="section-desc">Define the core organization metadata for the document header.</p>
                
                <div className="input-group">
                  <label htmlFor="creditUnionName">Credit Union Name</label>
                  <input 
                    type="text" 
                    id="creditUnionName" 
                    name="creditUnionName" 
                    value={formData.creditUnionName} 
                    onChange={handleInputChange} 
                    className="form-input"
                    placeholder="e.g. Community First CU"
                  />
                </div>

                <div className="grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="input-group">
                    <label htmlFor="stateJurisdiction">State Jurisdiction</label>
                    <input 
                      type="text" 
                      id="stateJurisdiction" 
                      name="stateJurisdiction" 
                      value={formData.stateJurisdiction} 
                      onChange={handleInputChange} 
                      className="form-input"
                      placeholder="e.g. Washington"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="version">Document Version</label>
                    <input 
                      type="text" 
                      id="version" 
                      name="version" 
                      value={formData.version} 
                      onChange={handleInputChange} 
                      className="form-input"
                      placeholder="e.g. 1.0"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="assetSize">Asset Size Category</label>
                  <select 
                    id="assetSize" 
                    name="assetSize" 
                    value={formData.assetSize} 
                    onChange={handleInputChange} 
                    className="form-select"
                  >
                    <option value="Under $250 Million">Under $250 Million</option>
                    <option value="$250 Million - $1 Billion">$250 Million - $1 Billion</option>
                    <option value="$1 Billion - $10 Billion">$1 Billion - $10 Billion</option>
                    <option value="Over $10 Billion">Over $10 Billion</option>
                  </select>
                </div>

                <div className="grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="input-group">
                    <label htmlFor="effectiveDate">Effective Date</label>
                    <input 
                      type="date" 
                      id="effectiveDate" 
                      name="effectiveDate" 
                      value={formData.effectiveDate} 
                      onChange={handleInputChange} 
                      className="form-input"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="boardApprovalDate">Board Approval Date</label>
                    <input 
                      type="date" 
                      id="boardApprovalDate" 
                      name="boardApprovalDate" 
                      value={formData.boardApprovalDate} 
                      onChange={handleInputChange} 
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Governance */}
            {activeTab === "governance" && (
              <div className="form-section">
                <h3 className="section-title">Oversight Structure</h3>
                <p className="section-desc">Outline who holds operational responsibility and fiduciary duty for AI controls.</p>

                <div className="input-group">
                  <label htmlFor="governingBody">AI Governing Committee</label>
                  <input 
                    type="text" 
                    id="governingBody" 
                    name="governingBody" 
                    value={formData.governingBody} 
                    onChange={handleInputChange} 
                    className="form-input"
                    placeholder="e.g. AI Risk Committee"
                  />
                  <small className="help-text">The committee that approves use cases and reviews audit logs.</small>
                </div>

                <div className="input-group">
                  <label htmlFor="aiLiaisonRole">Primary AI Liaison Officer</label>
                  <input 
                    type="text" 
                    id="aiLiaisonRole" 
                    name="aiLiaisonRole" 
                    value={formData.aiLiaisonRole} 
                    onChange={handleInputChange} 
                    className="form-input"
                    placeholder="e.g. Chief Risk Officer"
                  />
                  <small className="help-text">Appointed officer leading day-to-day risk management audits.</small>
                </div>

                <div className="input-group">
                  <label htmlFor="boardReviewFrequency">Board Review Frequency</label>
                  <select 
                    id="boardReviewFrequency" 
                    name="boardReviewFrequency" 
                    value={formData.boardReviewFrequency} 
                    onChange={handleInputChange} 
                    className="form-select"
                  >
                    <option value="Quarterly">Quarterly Review</option>
                    <option value="Semi-Annually">Semi-Annual Review</option>
                    <option value="Annually">Annual Review</option>
                  </select>
                  <small className="help-text">How often the Board of Directors audits AI performance logs and reviews this policy.</small>
                </div>
              </div>
            )}

            {/* Tab 3: Use Cases & Rules */}
            {activeTab === "usecases" && (
              <div className="form-section">
                <h3 className="section-title">Approved Use Cases & Rules</h3>
                <p className="section-desc">Select which operations are authorized, and set constraints on public tool access.</p>

                <div className="input-group">
                  <label style={{ marginBottom: "12px", display: "block" }}>Authorized Credit Union Use Cases</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        name="useCaseChatbot" 
                        checked={formData.useCaseChatbot} 
                        onChange={handleInputChange} 
                      />
                      <span className="checkbox-text">Member Support Chatbot (FAQ / Info)</span>
                    </label>
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        name="useCaseUnderwriting" 
                        checked={formData.useCaseUnderwriting} 
                        onChange={handleInputChange} 
                      />
                      <span className="checkbox-text">Credit Underwriting Assistant (Advisory)</span>
                    </label>
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        name="useCaseFraud" 
                        checked={formData.useCaseFraud} 
                        onChange={handleInputChange} 
                      />
                      <span className="checkbox-text">Fraud Detection & AML Transaction Patterns</span>
                    </label>
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        name="useCaseMarketing" 
                        checked={formData.useCaseMarketing} 
                        onChange={handleInputChange} 
                      />
                      <span className="checkbox-text">Marketing Content Drafting (LLM drafts)</span>
                    </label>
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        name="useCaseDocProcessing" 
                        checked={formData.useCaseDocProcessing} 
                        onChange={handleInputChange} 
                      />
                      <span className="checkbox-text">Member Document Processing (Tax filings/Paystubs OCR)</span>
                    </label>
                  </div>
                </div>

                <hr style={{ border: 0, borderTop: "1px solid var(--border-color)", margin: "20px 0" }} />

                <div className="input-group">
                  <label>Allow Public GenAI Tools? (e.g. consumer ChatGPT)</label>
                  <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                    <button 
                      type="button"
                      className={`option-chip ${!formData.allowPublicGenAI ? "active-danger" : ""}`}
                      onClick={() => handleSelectRadio("allowPublicGenAI", false)}
                      style={{ flex: 1 }}
                    >
                      Prohibited
                    </button>
                    <button 
                      type="button"
                      className={`option-chip ${formData.allowPublicGenAI ? "active-success" : ""}`}
                      onClick={() => handleSelectRadio("allowPublicGenAI", true)}
                      style={{ flex: 1 }}
                    >
                      Permitted (Constrained)
                    </button>
                  </div>
                  <small className="help-text">Prohibiting public consumer tools prevents accidental data uploads to public networks.</small>
                </div>

                <div className="input-group">
                  <label htmlFor="piiRestrictions">Member PII Rules</label>
                  <select 
                    id="piiRestrictions" 
                    name="piiRestrictions" 
                    value={formData.piiRestrictions} 
                    onChange={handleInputChange} 
                    className="form-select"
                  >
                    <option value="Strict Prohibition">Strict Prohibition (No PII allowed)</option>
                    <option value="Anonymized/Masked">Anonymized/Masked Only (Sanitized before uploading)</option>
                  </select>
                  <small className="help-text">Under GLBA, NPI/PII (SSNs, names, balances) must be aggressively isolated.</small>
                </div>
              </div>
            )}

            {/* Tab 4: Risk Calibration */}
            {activeTab === "risk" && (
              <div className="form-section">
                <h3 className="section-title">Risk Tier Calibration</h3>
                <p className="section-desc">Classify system applications and designate audit check schedules.</p>

                <div className="input-group">
                  <label htmlFor="biasCheckFrequency">High-Risk Algorithmic Audit Schedule</label>
                  <select 
                    id="biasCheckFrequency" 
                    name="biasCheckFrequency" 
                    value={formData.biasCheckFrequency} 
                    onChange={handleInputChange} 
                    className="form-select"
                  >
                    <option value="Monthly">Monthly Auditing</option>
                    <option value="Quarterly">Quarterly Auditing</option>
                    <option value="Semi-Annually">Semi-Annual Auditing</option>
                    <option value="Annually">Annual Auditing</option>
                  </select>
                  <small className="help-text">How often underwriting, collections, or pricing AI models undergo demographic bias evaluations.</small>
                </div>

                <div className="info-box" style={{ marginTop: "24px" }}>
                  <Info style={{ width: 16, height: 16, color: "var(--accent)", flexShrink: 0 }} />
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <strong>Risk Tiering Best Practice:</strong> Systems making or modifying underwriting assessments (High Risk) require validation, while chatbots providing general public FAQs (Moderate Risk) can rely on annual spot-checking.
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Compliance */}
            {activeTab === "compliance" && (
              <div className="form-section">
                <h3 className="section-title">Compliance & Vendor Diligence</h3>
                <p className="section-desc">Configure checks for Fair Lending (ECOA), Adverse Actions, and vendor constraints.</p>

                <div className="input-group">
                  <label style={{ display: "block", marginBottom: "12px" }}>Governance Checklist Controls</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        name="hitlRequired" 
                        checked={formData.hitlRequired} 
                        onChange={handleInputChange} 
                      />
                      <span className="checkbox-text">
                        <strong>Mandatory Human-in-the-Loop (HITL)</strong>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          Requires a credit union officer to sign off on automated underwriting or collections overrides.
                        </span>
                      </span>
                    </label>

                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        name="vendorDiligenceRequired" 
                        checked={formData.vendorDiligenceRequired} 
                        onChange={handleInputChange} 
                      />
                      <span className="checkbox-text">
                        <strong>Contractual Non-Training Clause</strong>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          Enforce clauses forbidding SaaS vendors from training models on uploaded credit union data.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="info-box" style={{ marginTop: "24px" }}>
                  <Shield style={{ width: 16, height: 16, color: "var(--success)", flexShrink: 0 }} />
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <strong>CFPB Warning:</strong> Vague Adverse Action codes (e.g. &quot;system score low&quot;) violate ECOA rules. The model must yield transparent, explainable reason codes for automated credit decisions.
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Actions (On screen edit mode) */}
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button type="button" onClick={downloadMarkdown} className="btn btn-primary" style={{ width: "100%" }}>
                <Download style={{ width: 18, height: 18 }} />
                <span>Download Markdown (.md)</span>
              </button>
              <button type="button" onClick={handlePrintPDF} className="btn btn-accent" style={{ width: "100%" }}>
                <Printer style={{ width: 18, height: 18 }} />
                <span>Export PDF Document</span>
              </button>
            </div>
            
          </div>

          {/* Right Column: Policy Document Preview */}
          <div className={`print-area ${viewMode === "preview" ? "block" : "hidden-mobile"}`} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Toolbar above preview */}
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.03)", padding: "12px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText style={{ width: 16, height: 16, color: "var(--primary)" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Real-Time Document Preview</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" onClick={downloadMarkdown} className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "0.75rem" }} title="Download Markdown">
                  <Download style={{ width: 14, height: 14 }} />
                  <span>Markdown</span>
                </button>
                <button type="button" onClick={handlePrintPDF} className="btn btn-primary" style={{ padding: "8px 14px", fontSize: "0.75rem" }} title="Print / Save PDF">
                  <Printer style={{ width: 14, height: 14 }} />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Document Paper Sheet Render */}
            <div id="policy-document-preview" className="preview-paper">
              
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1 style={{ fontSize: "1.6rem", margin: "0 0 10px 0", color: "#0f172a", textTransform: "uppercase" }}>
                  <span className="highlight-placeholder">{formData.creditUnionName}</span>
                </h1>
                <h2 style={{ fontSize: "1.1rem", margin: "0 0 20px 0", letterSpacing: "1px", color: "#475569", fontWeight: 600 }}>
                  ARTIFICIAL INTELLIGENCE (AI) POLICY & GOVERNANCE FRAMEWORK
                </h2>
                <div style={{ display: "inline-block", padding: "4px 12px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, backgroundColor: "#f8fafc", color: "#475569" }}>
                  DOCUMENT STATUS: APPROVED & ACTIVE
                </div>
              </div>

              {/* Document Metadata Table */}
              <table style={{ marginBottom: "30px" }}>
                <tbody>
                  <tr>
                    <th>Policy Owner</th>
                    <td><span className="highlight-placeholder">{formData.aiLiaisonRole}</span></td>
                    <th>Policy Version</th>
                    <td><span className="highlight-placeholder">{formData.version}</span></td>
                  </tr>
                  <tr>
                    <th>Effective Date</th>
                    <td><span className="highlight-placeholder">{formData.effectiveDate}</span></td>
                    <th>Board Approval Date</th>
                    <td><span className="highlight-placeholder">{formData.boardApprovalDate}</span></td>
                  </tr>
                  <tr>
                    <th>State Jurisdiction</th>
                    <td><span className="highlight-placeholder">{formData.stateJurisdiction}</span> State Law</td>
                    <th>Asset Size Tier</th>
                    <td><span className="highlight-placeholder">{formData.assetSize}</span></td>
                  </tr>
                </tbody>
              </table>

              <hr />

              {/* Section 1 */}
              <h3 style={{ fontSize: "1.2rem", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                1. OBJECTIVE & SCOPE
              </h3>
              <p>
                The mission of <strong><span className="highlight-placeholder">{formData.creditUnionName}</span></strong> is to serve our member-owners with integrity, financial safety, and absolute prudence. As we integrate Artificial Intelligence (AI) technologies—including Machine Learning (ML), Large Language Models (LLMs), and Generative AI—into our operational workflows, this Policy establishes a rigorous governance framework.
              </p>
              <p style={{ marginTop: "10px" }}>
                This policy applies to all employees, contractors, board directors, and third-party software partners. It is structured to align with the technology-neutral examination expectations of the <strong>National Credit Union Administration (NCUA)</strong>, the <strong>NIST AI Risk Management Framework (AI RMF 1.0)</strong>, and the <strong>Gramm-Leach-Bliley Act (GLBA)</strong> privacy requirements.
              </p>

              {/* Section 2 */}
              <h3 style={{ fontSize: "1.2rem", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", marginTop: "24px" }}>
                2. GOVERNANCE & RESPONSIBILITIES
              </h3>
              <p>
                To maintain clear organizational oversight and accountability, the Credit Union establishes the following governance matrix:
              </p>
              <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                <li>
                  <strong>Board of Directors:</strong> Retains ultimate fiduciary duty. The Board reviews and approves this Policy <strong><span className="highlight-placeholder">{formData.boardReviewFrequency.toLowerCase()}</span></strong>, monitors systemic algorithmic risks, and evaluates AI integrations within annual capital planning.
                </li>
                <li>
                  <strong><span className="highlight-placeholder">{formData.governingBody}</span>:</strong> The primary governing committee responsible for reviewing and approving all proposed AI use cases, maintaining the central AI Use Case Inventory, auditing compliance logs, and approving risk exceptions.
                </li>
                <li>
                  <strong>Primary AI Liaison (<span className="highlight-placeholder">{formData.aiLiaisonRole}</span>):</strong> Appointed to oversee day-to-day AI implementation, lead vendor risk assessments, coordinate compliance testing, and serve as the main point of contact for external audits.
                </li>
                <li>
                  <strong>Business Unit Owners:</strong> Retain operational accountability for AI systems deployed within their departments, ensuring staff adhere to prompt safety rules and manual output verification.
                </li>
              </ul>

              {/* Section 3 */}
              <h3 style={{ fontSize: "1.2rem", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", marginTop: "24px" }}>
                3. APPROVED AI USE CASES & OPERATIONAL BOUNDS
              </h3>
              <p>
                AI technologies may only be deployed for use cases explicitly reviewed and authorized by the <strong><span className="highlight-placeholder">{formData.governingBody}</span></strong>. The initially approved use cases include:
              </p>
              
              <ul style={{ marginTop: "10px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {formData.useCaseChatbot && (
                  <li>
                    <strong>Member Support Chatbot:</strong> Conversational agent deployed to assist members with FAQ searches, basic troubleshooting, and navigational guidance.
                  </li>
                )}
                {formData.useCaseUnderwriting && (
                  <li>
                    <strong>Credit Underwriting Assistant:</strong> Algorithmic assessment tools that review credit histories, calculate debt-to-income ratios, and provide creditworthiness recommendations to underwriters.
                  </li>
                )}
                {formData.useCaseFraud && (
                  <li>
                    <strong>Fraud Detection & AML Compliance:</strong> Real-time transaction pattern monitoring to identify suspicious deposits, potential identity theft, and compliance flags.
                  </li>
                )}
                {formData.useCaseMarketing && (
                  <li>
                    <strong>Marketing Content Drafting:</strong> Large Language Models (LLMs) used by creative staff to generate initial drafts for email campaigns, blog posts, and educational resources.
                  </li>
                )}
                {formData.useCaseDocProcessing && (
                  <li>
                    <strong>Member Document Processing:</strong> Machine learning OCR systems designed to extract structural data from tax filings, paystubs, and mortgage deeds.
                  </li>
                )}
                {!formData.useCaseChatbot && !formData.useCaseUnderwriting && !formData.useCaseFraud && !formData.useCaseMarketing && !formData.useCaseDocProcessing && (
                  <li style={{ fontStyle: "italic", color: "#64748b" }}>
                    No specific use cases selected. All AI deployments require individual steering committee review and risk classification.
                  </li>
                )}
              </ul>

              <h4 style={{ fontSize: "1rem", color: "#0f172a", marginTop: "16px", fontWeight: 600 }}>
                Generative AI Usage Rules (Public vs. Enterprise)
              </h4>
              <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                <li>
                  <strong>Public GenAI Platforms:</strong> {formData.allowPublicGenAI ? (
                    <span>Allowed for low-risk business tasks (e.g. email brainstorming, text formatting) <strong>strictly subject to entering zero member data</strong> or proprietary information.</span>
                  ) : (
                    <span><strong>Strictly PROHIBITED</strong> for all business operations. Employees are forbidden from using consumer-facing public GenAI accounts (e.g., public ChatGPT, Gemini, Claude) for any Credit Union work.</span>
                  )}
                </li>
                <li>
                  <strong>Member PII Handling:</strong> Under GLBA compliance, <strong>{formData.piiRestrictions === "Strict Prohibition" ? (
                    <span>under no circumstances may Nonpublic Personal Information (PII) or financial data be entered into external AI systems.</span>
                  ) : (
                    <span>any member PII or financial data must be fully anonymized or masked using approved cryptographic sanitization libraries before processing.</span>
                  )}</strong>
                </li>
                <li>
                  <strong>Human-in-the-Loop (HITL) Gate:</strong> {formData.hitlRequired ? (
                    <span><strong>Mandatory.</strong> No high-risk AI output (including credit recommendations, account modifications, or member communications) may be executed autonomously. A qualified Credit Union officer must review and verify the outputs prior to execution.</span>
                  ) : (
                    <span>Recommended. High-risk systems require manual review, whereas moderate/low risk systems may operate under automated supervision.</span>
                  )}
                </li>
              </ul>

              {/* Section 4 */}
              <h3 style={{ fontSize: "1.2rem", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", marginTop: "24px" }}>
                4. RISK TIER CLASSIFICATION & AUDITS
              </h3>
              <p>
                To calibrate due diligence, the Credit Union adopts a three-tier risk model:
              </p>
              
              <table style={{ marginTop: "10px" }}>
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Risk Tier</th>
                    <th style={{ width: "40%" }}>Definition</th>
                    <th style={{ width: "40%" }}>Review & Audit Requirements</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700, color: "#475569" }}>Low Risk</td>
                    <td>Productivity tools, code assistants, internal spelling checks.</td>
                    <td>General compliance review; standard IT security scan.</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: "#b45309" }}>Moderate Risk</td>
                    <td>Marketing drafting, internal knowledge base Q&A, FAQ chatbots.</td>
                    <td>Vendor due diligence, compliance reviews, annual output spot-audits.</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: "#be123c" }}>High Risk</td>
                    <td>Credit scoring, automated underwriting recommendations, fraud alerts, collections.</td>
                    <td>Full Model Risk Validation, <strong><span className="highlight-placeholder">{formData.biasCheckFrequency}</span></strong> bias audits, mandatory HITL, Board-level notifications.</td>
                  </tr>
                </tbody>
              </table>

              {/* Section 5 */}
              <h3 style={{ fontSize: "1.2rem", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", marginTop: "24px" }}>
                5. REGULATORY COMPLIANCE & FAIR LENDING
              </h3>
              <p>
                The Credit Union is committed to preventing algorithmic bias and complying with the <strong>Equal Credit Opportunity Act (ECOA / Regulation B)</strong> and CFPB guidelines.
              </p>
              <ol style={{ marginTop: "10px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>
                  <strong>Algorithmic Discrimination:</strong> AI models used in underwriting, pricing, or collections are prohibited from utilizing protected classes (e.g., race, gender, age, marital status) as input features, or mathematical proxies thereof.
                </li>
                <li>
                  <strong>Adverse Action Notices:</strong> If an AI system recommends the denial or modification of credit, the Credit Union must provide the member with a clear, specific, and legally compliant Adverse Action explanation. Vague terms like &quot;algorithmic score&quot; are prohibited.
                </li>
                <li>
                  <strong>Quantitative Bias Testing:</strong> All High-Risk models must undergo <strong><span className="highlight-placeholder">{formData.biasCheckFrequency}</span></strong> quantitative testing to detect disparate impact anomalies. Testing records shall be maintained for exam review.
                </li>
              </ol>

              {/* Section 6 */}
              <h3 style={{ fontSize: "1.2rem", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", marginTop: "24px" }}>
                6. THIRD-PARTY VENDOR DUE DILIGENCE
              </h3>
              <p>
                Since the Credit Union utilizes third-party SaaS providers for AI capability, all AI vendors must undergo strict security reviews:
              </p>
              <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                <li>
                  <strong>Security & Audit Rights:</strong> Vendors must provide SOC 2 Type II reports and agree to regular auditing by Credit Union auditors or the NCUA.
                </li>
                <li>
                  <strong>Data Ownership:</strong> Contracts must explicitly state that the <strong>Credit Union retains 100% ownership</strong> of all inputted data and prompt history.
                </li>
                <li>
                  <strong>Non-Training Clause:</strong> {formData.vendorDiligenceRequired ? (
                    <span>Contracts <strong>MUST explicitly forbid</strong> the vendor from training their public or shared AI models on Credit Union member data or prompts.</span>
                  ) : (
                    <span>Contracts should seek non-training clauses, or establish dedicated virtual private tenants to separate Credit Union data.</span>
                  )}
                </li>
              </ul>

              {/* Section 7 */}
              <h3 style={{ fontSize: "1.2rem", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", marginTop: "24px" }}>
                7. COMPLIANCE & ENFORCEMENT
              </h3>
              <p>
                Violations of this Policy may result in disciplinary action up to and including termination. Suspicious AI outputs, potential data leaks, or algorithmic anomalies must be reported immediately to the <strong><span className="highlight-placeholder">{formData.aiLiaisonRole}</span></strong> or via the anonymous compliance hotline.
              </p>

              {/* Section 8 */}
              <h3 style={{ fontSize: "1.2rem", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", marginTop: "24px" }}>
                8. DISCLAIMER & LEGAL NOTICE
              </h3>
              <p style={{ fontStyle: "italic", fontSize: "0.85rem", color: "#475569" }}>
                This document serves as the internal operational policy for {formData.creditUnionName}. It is designed for regulatory preparedness and organizational risk mapping. It does not constitute formal legal counsel. The Credit Union shall consult legal advisors to ensure compliance with changing state and federal AI statutes.
              </p>

            </div>
          </div>
          
        </div>

        {/* Disclaimer / Warning Footer */}
        <div className="no-print card" style={{ marginTop: "40px", border: "1px solid rgba(245, 158, 11, 0.2)", background: "rgba(245, 158, 11, 0.02)" }}>
          <div style={{ display: "flex", gap: "16px", padding: "20px", alignItems: "flex-start" }}>
            <div style={{ padding: "8px", borderRadius: "var(--radius-sm)", background: "rgba(245,158,11,0.1)", color: "var(--warning)", flexShrink: 0 }}>
              <ShieldAlert style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", color: "var(--text-primary)", margin: "0 0 6px 0" }}>Important Regulatory Disclaimer</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                This tool provides a policy framework based on NCUA Technology-Neutral examination guidance, NIST AI Risk Management Framework, and ECOA guidelines. AI regulations are evolving rapidly at the state and federal levels. Generative outputs are templates and should be vetted by your credit union&apos;s legal counsel and executive risk officers prior to board presentation and signature.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* PDF Export Instructions Modal */}
      {showPrintModal && (
        <div className="modal-backdrop">
          <div className="modal-content animate-scale-up" style={{ maxWidth: "480px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px" }}>
              <div style={{ padding: "12px", borderRadius: "var(--radius-full)", background: "var(--accent-glow)", color: "var(--accent)" }}>
                <Printer style={{ width: 32, height: 32 }} />
              </div>
              <h3 style={{ fontSize: "1.3rem", margin: 0, color: "var(--text-primary)" }}>PDF Export Guidelines</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                For a professional, clean corporate policy document, please apply the following settings in your browser&apos;s print dialogue:
              </p>
              
              <ul style={{ textAlign: "left", fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px", width: "100%", paddingLeft: "12px", listStyleType: "disc" }}>
                <li>Set the <strong>Destination</strong> to <strong>Save as PDF</strong>.</li>
                <li>Set the <strong>Layout</strong> to <strong>Portrait</strong>.</li>
                <li>Under <strong>More Settings</strong>, select/enable <strong>Background graphics</strong> (to print tables and borders correctly).</li>
                <li>Select <strong>Paper size</strong> as <strong>Letter</strong> (8.5&quot; x 11&quot;).</li>
                <li>Deselect/uncheck <strong>Headers and footers</strong> to remove browser-generated URL timestamps.</li>
              </ul>
              
              <div style={{ display: "flex", gap: "12px", width: "100%", marginTop: "10px" }}>
                <button type="button" onClick={() => setShowPrintModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="button" onClick={executePrint} className="btn btn-accent" style={{ flex: 1 }}>
                  Open Print Dialog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Styles */}
      <style jsx global>{`
        /* Form tab button styles */
        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: var(--transition-fast);
          white-space: nowrap;
        }
        .tab-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--border-color);
        }
        .tab-btn.active {
          color: var(--text-primary);
          background: var(--primary-glow);
          border-color: var(--primary);
        }
        
        /* Form inputs styles */
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: fadeIn 0.3s ease-out;
        }
        .section-title {
          font-size: 1.2rem;
          margin: 0;
          color: var(--text-primary);
        }
        .section-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: -12px;
          margin-bottom: 6px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .form-input, .form-select {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          padding: 10px 14px;
          background-color: rgba(6, 8, 20, 0.5);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          outline: none;
          transition: var(--transition-fast);
          width: 100%;
        }
        .form-input:focus, .form-select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
        }
        .help-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        
        /* Option chips (radio style buttons) */
        .option-chip {
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }
        .option-chip:hover {
          color: var(--text-primary);
          background-color: rgba(255, 255, 255, 0.05);
        }
        .option-chip.active-danger {
          border-color: var(--danger);
          background-color: var(--danger-glow);
          color: var(--text-primary);
        }
        .option-chip.active-success {
          border-color: var(--success);
          background-color: var(--success-glow);
          color: var(--text-primary);
        }
        
        /* Checkbox customization */
        .checkbox-container {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid transparent;
          transition: var(--transition-fast);
        }
        .checkbox-container:hover {
          background-color: rgba(255, 255, 255, 0.02);
          border-color: var(--border-color);
        }
        .checkbox-container input[type="checkbox"] {
          margin-top: 4px;
          accent-color: var(--primary);
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
        .checkbox-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        
        /* Info boxes */
        .info-box {
          display: flex;
          gap: 12px;
          padding: 14px;
          background-color: rgba(6, 182, 212, 0.03);
          border: 1px solid rgba(6, 182, 212, 0.1);
          border-radius: var(--radius-sm);
          align-items: flex-start;
        }
        
        /* Modal Backdrop */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          background-color: #0d1023;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 32px;
          width: 90%;
          box-shadow: var(--shadow-md);
        }
        
        /* Animation keyframes */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        /* Paper Preview Area Styling */
        .preview-paper {
          background-color: #ffffff;
          color: #1e293b;
          padding: 40px;
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-md), 0 0 40px rgba(0,0,0,0.1);
          font-family: var(--font-sans), sans-serif;
          font-size: 0.92rem;
          line-height: 1.6;
          border: 1px solid #cbd5e1;
          height: 700px;
          overflow-y: auto;
          text-align: left;
        }
        .preview-paper h2, .preview-paper h3, .preview-paper h4 {
          color: #0f172a;
          margin-top: 1.6em;
          margin-bottom: 0.6em;
        }
        .preview-paper p {
          margin-bottom: 1em;
          color: #334155;
        }
        .preview-paper hr {
          border: 0;
          border-top: 1px solid #e2e8f0;
          margin: 24px 0;
        }
        .preview-paper table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 0.85rem;
        }
        .preview-paper th {
          background-color: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 10px 12px;
          text-align: left;
          font-weight: 700;
          color: #1e293b;
        }
        .preview-paper td {
          border: 1px solid #cbd5e1;
          padding: 8px 12px;
          color: #334155;
        }
        .preview-paper ul, .preview-paper ol {
          margin-bottom: 1.2em;
          padding-left: 20px;
        }
        .preview-paper li {
          margin-bottom: 6px;
          color: #334155;
        }
        
        /* Hover highlighters */
        .highlight-placeholder {
          background-color: rgba(99, 102, 241, 0.1);
          border-bottom: 1.5px dashed var(--primary);
          color: #4f46e5;
          padding: 0 4px;
          border-radius: 2px;
          font-weight: 600;
          transition: all 0.2s ease;
          display: inline-block;
        }
        .highlight-placeholder:hover {
          background-color: rgba(99, 102, 241, 0.25);
          color: #4338ca;
        }
        
        /* Print Stylesheet Overrides */
        @media print {
          body, html {
            background-color: #ffffff !important;
            color: #000000 !important;
            font-size: 11pt !important;
          }
          .no-print, header, .header-wrapper, footer, #mobile-view-tabs, .form-tabs-bar {
            display: none !important;
          }
          main {
            min-height: auto !important;
          }
          .container {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .builder-layout-grid {
            display: block !important;
            grid-template-columns: none !important;
          }
          .print-area {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .preview-paper {
            height: auto !important;
            overflow-y: visible !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            color: #000000 !important;
            background-color: #ffffff !important;
          }
          .preview-paper th {
            background-color: #f1f5f9 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .highlight-placeholder {
            background: transparent !important;
            border: none !important;
            color: #000000 !important;
            padding: 0 !important;
            font-weight: inherit !important;
            text-decoration: none !important;
          }
        }
        
        /* Responsive layout rules */
        @media (max-width: 990px) {
          .builder-layout-grid {
            grid-template-columns: 1fr !important;
          }
          #mobile-view-tabs {
            display: flex !important;
          }
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
