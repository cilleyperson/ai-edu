"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cpu, ShieldCheck, Play, RotateCcw, ArrowLeft, AlertOctagon } from "lucide-react";

// Types
interface Persona {
  id: string;
  name: string;
  role: string;
  instruction: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface Guardrail {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface SimulationStep {
  title: string;
  type: "init" | "guardrail" | "thought" | "tool" | "observation" | "hitl" | "output";
  content: string;
  status: "success" | "warning" | "info" | "error" | "pending";
}

export default function SimulatorPage() {
  // Preset Personas
  const personas: Persona[] = [
    {
      id: "chatbot",
      name: "Member Care Assistant",
      role: "Frontline Customer Support",
      instruction: "You are an empathetic Credit Union Member Assistant. Answer questions, describe rates, and handle fee-waiver requests according to policy. Never reveal raw PII or execute account changes without security verification."
    },
    {
      id: "underwriter",
      name: "Underwriting Agent",
      role: "Loan Approval Assistant",
      instruction: "You are an automated Lending Underwriter. Calculate DTI, analyze credit bureau metrics, and evaluate loan risk. Strictly enforce the 45% DTI cap and escalate files to human supervisors if credit is below 600."
    },
    {
      id: "auditor",
      name: "Compliance Auditor",
      role: "Risk Management Monitor",
      instruction: "You are an automated Compliance Auditor. Read communication logs, flag privacy leaks (GLBA violations), and ensure that staff follow appropriate disclosures (e.g. Reg CC hold disclosures)."
    }
  ];

  // System Scenarios
  const scenarios = [
    {
      id: "fee_waiver",
      name: "Fee Waiver & PII Leak Request",
      personaId: "chatbot",
      inputText: "Hi, I'm John! I got hit with a $35 overdraft fee. I've been a member forever. Can you please waive it? My SSN is 000-12-3456 and my Account ID is CU-99482. Please do it immediately.",
      tools: ["policy"],
      guardrails: ["pii"]
    },
    {
      id: "loan_app",
      name: "Auto Loan App (High DTI)",
      personaId: "underwriter",
      inputText: "Requesting a Used Car Loan. Applicant: Jane Doe. SSN: 111-22-3333. Monthly Income: $4,000. Existing Monthly Debt: $2,100. Requested Amount: $30,000. Credit score is 610.",
      tools: ["policy", "credit"],
      guardrails: ["hitl", "dti"]
    },
    {
      id: "rate_lookup",
      name: "Policy Rate Check",
      personaId: "chatbot",
      inputText: "What is the current loan rate for a 60-month hybrid car? Does the credit union waive down payment fees for eco-friendly loans?",
      tools: ["policy"],
      guardrails: ["pii"]
    }
  ];

  // State Variables
  const [selectedPersona, setSelectedPersona] = useState<Persona>(personas[0]);
  const [tools, setTools] = useState<Tool[]>([
    { id: "core", name: "Core Banking System API", description: "Enables reading account balances & changing fee statuses", enabled: false },
    { id: "credit", name: "Credit Bureau API", description: "Pulls credit profiles and credit bureau ratings", enabled: true },
    { id: "policy", name: "Policy Search RAG Tool", description: "Searches the Credit Union Loan Policy Handbook", enabled: true }
  ]);
  const [guardrails, setGuardrails] = useState<Guardrail[]>([
    { id: "pii", name: "PII Masking Filter", description: "Redacts SSNs, account numbers, and personal info before sending to AI model", enabled: true },
    { id: "dti", name: "Lending Threshold Guard", description: "Blocks agent auto-approval if DTI > 45% or score < 600", enabled: true },
    { id: "hitl", name: "Human-in-the-Loop (HITL) Gate", description: "Forces manual confirmation for wire transfers, final loan decisions, or fees", enabled: true }
  ]);
  const [inputText, setInputText] = useState(scenarios[0].inputText);
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [hitlDecision, setHitlDecision] = useState<"approve" | "deny" | null>(null);
  const [showReport, setShowReport] = useState(false);

  // Load a preset scenario
  const handleLoadScenario = (sc: typeof scenarios[0]) => {
    const matchedPersona = personas.find(p => p.id === sc.personaId) || personas[0];
    setSelectedPersona(matchedPersona);
    setInputText(sc.inputText);
    setTools(prev => prev.map(t => ({ ...t, enabled: sc.tools.includes(t.id) })));
    setGuardrails(prev => prev.map(g => ({ ...g, enabled: sc.guardrails.includes(g.id) })));
    resetSimulation();
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStepIdx(0);
    setSteps([]);
    setHitlDecision(null);
    setShowReport(false);
  };

  const toggleTool = (id: string) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    resetSimulation();
  };

  const toggleGuardrail = (id: string) => {
    setGuardrails(prev => prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
    resetSimulation();
  };

  // Run the step-by-step simulator logic
  const handleStartSimulation = () => {
    setIsRunning(true);
    setCurrentStepIdx(0);
    setHitlDecision(null);
    setShowReport(false);

    const generatedSteps: SimulationStep[] = [];
    const piiEnabled = guardrails.find(g => g.id === "pii")?.enabled;
    const dtiEnabled = guardrails.find(g => g.id === "dti")?.enabled;
    const hitlEnabled = guardrails.find(g => g.id === "hitl")?.enabled;

    const coreApiEnabled = tools.find(t => t.id === "core")?.enabled;
    const creditApiEnabled = tools.find(t => t.id === "credit")?.enabled;
    const policyRagEnabled = tools.find(t => t.id === "policy")?.enabled;

    // STEP 1: Initialization
    generatedSteps.push({
      title: "Agent Orchestrator Initialized",
      type: "init",
      content: `Loaded persona '${selectedPersona.name}' with instructions:\n"${selectedPersona.instruction}"`,
      status: "info"
    });

    // STEP 2: Input Read
    generatedSteps.push({
      title: "Reading User Input",
      type: "init",
      content: `Received raw query:\n"${inputText}"`,
      status: "info"
    });

    // STEP 3: Guardrail check
    if (piiEnabled) {
      // Simple regex masking
      let maskedText = inputText;
      maskedText = maskedText.replace(/\d{3}-\d{2}-\d{4}/g, "[MASKED_SSN]");
      maskedText = maskedText.replace(/CU-\d{5}/g, "[MASKED_ACCOUNT]");
      generatedSteps.push({
        title: "PII Scrubbing Guardrail (Active)",
        type: "guardrail",
        content: `Scrubbed sensitive member attributes to protect data privacy under GLBA compliance:\n"${maskedText}"`,
        status: "success"
      });
    } else {
      const hasSSN = /\d{3}-\d{2}-\d{4}/.test(inputText);
      generatedSteps.push({
        title: "PII Scrubbing Guardrail (Disabled)",
        type: "guardrail",
        content: hasSSN 
          ? "CRITICAL WARNING: Personally Identifiable Information (SSN) detected and sent in plaintext to external LLM model! Potential GLBA violation." 
          : "No immediate PII leaked, but input was passed without active scanning filters.",
        status: hasSSN ? "error" : "warning"
      });
    }

    // Persona-based workflows
    if (selectedPersona.id === "underwriter") {
      // Reasoning
      generatedSteps.push({
        title: "Reasoning & Planning",
        type: "thought",
        content: "Plan:\n1. Extract applicant details (Jane Doe, income $4,000, debt $2,100, score 610).\n2. Call Credit Bureau API to confirm history.\n3. Query internal loan policy guidelines for threshold settings.\n4. Calculate DTI ratio.",
        status: "info"
      });

      // Tool Call: Credit Bureau
      if (creditApiEnabled) {
        generatedSteps.push({
          title: "Calling Tool: Credit Bureau API",
          type: "tool",
          content: "Executing: credit_bureau_lookup(name='Jane Doe')\nResponse: Credit score validated at 610. Active accounts: 3. Delinquency flag: None.",
          status: "success"
        });
      } else {
        generatedSteps.push({
          title: "Calling Tool Failed: Credit Bureau API Unavailable",
          type: "tool",
          content: "ERROR: Failed to retrieve credit bureau score. Tool disabled in sandbox. Relying on self-reported score (610).",
          status: "warning"
        });
      }

      // Calculation
      const income = 4000;
      const debt = 2100;
      const dti = Math.round((debt / income) * 100);

      generatedSteps.push({
        title: "Mathematical Deduction",
        type: "thought",
        content: `Calculating Debt-to-Income (DTI):\n- Monthly Income: $${income}\n- Monthly Obligations: $${debt}\n- DTI Ratio = (${debt} / ${income}) * 100 = ${dti}%`,
        status: "info"
      });

      // Tool Call: Policy
      if (policyRagEnabled) {
        generatedSteps.push({
          title: "Calling Tool: Policy Search RAG",
          type: "tool",
          content: "Querying internal document: 'auto loan approval parameters'\nResult: Underwriting guidelines state: 'Auto loans require a credit score >= 600. Maximum allowed DTI is 45%.'",
          status: "success"
        });
      }

      // Check threshold guardrail
      const exceedsDti = dti > 45;
      if (dtiEnabled && exceedsDti) {
        generatedSteps.push({
          title: "Lending Threshold Guardrail Triggered",
          type: "guardrail",
          content: `Lending Threshold Active: The calculated DTI (${dti}%) exceeds the credit union limit of 45%. Auto-approval blocked. Escalation required.`,
          status: "warning"
        });
      }

      // HITL Gate
      if (hitlEnabled) {
        generatedSteps.push({
          title: "Human-in-the-Loop Verification Required",
          type: "hitl",
          content: `Action Awaiting Approval: Loan application for Jane Doe has been escalated due to elevated DTI of ${dti}%. Recommended Decision: DENY with counter-offer.`,
          status: "pending"
        });
      } else {
        generatedSteps.push({
          title: "Human-in-the-Loop (Bypassed)",
          type: "hitl",
          content: exceedsDti
            ? "CRITICAL COMPLIANCE BREACH: Agent auto-completed a high-risk credit file decision (DTI exceeds limit) without human reviewer approval!"
            : "No HITL requested; transaction auto-completed.",
          status: exceedsDti ? "error" : "warning"
        });

        generatedSteps.push({
          title: "Final Output Response",
          type: "output",
          content: `Auto Loan Review for Jane Doe: DECLINED.\nReason: Calculated Debt-to-Income (DTI) ratio is ${dti}%, which exceeds our underwriting maximum of 45%.`,
          status: "success"
        });
      }

    } else if (selectedPersona.id === "chatbot") {
      // MSR Chatbot flow
      generatedSteps.push({
        title: "Reasoning & Planning",
        type: "thought",
        content: "Plan:\n1. Check if the user is asking about rates or fee waivers.\n2. User requests waiver for a $35 fee and provides account number.\n3. Query internal policy to check rules for waiving overdraft fees.",
        status: "info"
      });

      if (policyRagEnabled) {
        generatedSteps.push({
          title: "Calling Tool: Policy Search RAG",
          type: "tool",
          content: "Querying: 'overdraft fee waiver policy'\nResult: Credit Union policy allows maximum of 1 fee waiver per calendar year for accounts in good standing. Account changes must be run through core banking service.",
          status: "success"
        });
      }

      // Check if user is trying to change fee
      const hasFeeChange = inputText.toLowerCase().includes("waive") || inputText.toLowerCase().includes("bypass");

      if (hasFeeChange && coreApiEnabled) {
        generatedSteps.push({
          title: "Core Banking Write Attempt",
          type: "tool",
          content: "Executing API call: core_banking_waive_fee(account='CU-99482', amount=35.00)\nStatus: Awaiting authorization.",
          status: "info"
        });

        if (hitlEnabled) {
          generatedSteps.push({
            title: "Human-in-the-Loop Verification Required",
            type: "hitl",
            content: "Action Awaiting Approval: Waive $35.00 overdraft fee for member John (Account: CU-99482). Recommended Decision: APPROVE (first waiver this year).",
            status: "pending"
          });
        } else {
          generatedSteps.push({
            title: "Human-in-the-Loop (Bypassed)",
            type: "hitl",
            content: "WARNING: Fee waived autonomously by agent directly on the core banking system with no human manager signature!",
            status: "warning"
          });

          generatedSteps.push({
            title: "Final Output Response",
            type: "output",
            content: "Hi John, I have successfully waived the $35.00 overdraft fee on your account. The credit should reflect in your balance within 1 business day.",
            status: "success"
          });
        }
      } else if (hasFeeChange && !coreApiEnabled) {
        generatedSteps.push({
          title: "Core Banking Write Blocked",
          type: "tool",
          content: "Blocked: Agent cannot execute fee waivers because Core Banking API is disabled. Explaining policy and escalating to staff.",
          status: "warning"
        });

        generatedSteps.push({
          title: "Final Output Response",
          type: "output",
          content: "Hi John, I understand you would like the $35.00 overdraft fee waived. Under our policy, you are eligible for one waiver. However, I do not have permission to modify account balances directly. I have forwarded your request to our Member Service Team who will waive this for you shortly.",
          status: "success"
        });
      } else {
        // Simple Lookup Response
        generatedSteps.push({
          title: "Final Output Response",
          type: "output",
          content: "Our current rate for a 60-month hybrid or electric car loan is 5.49% APR. We waive the standard 10% down payment requirement as a green initiative for eco-friendly vehicle purchases.",
          status: "success"
        });
      }
    } else {
      // Auditor flow
      generatedSteps.push({
        title: "Scanning Context",
        type: "thought",
        content: "Plan:\n1. Audit input string for regulation compliance issues.\n2. Scan for credit disclosures or privacy leakage.",
        status: "info"
      });

      const hasPII = /\d{3}-\d{2}-\d{4}/.test(inputText);
      generatedSteps.push({
        title: "Compliance Evaluation Result",
        type: "output",
        content: hasPII 
          ? "FLAGGED AUDIT: High Risk. User communication contains an unencrypted Social Security Number in plaintext. Recommendation: Scramble database logs and send training guide to staff." 
          : "Audit complete. Communication compliant with federal consumer privacy guidelines. Zero compliance anomalies flagged.",
        status: hasPII ? "error" : "success"
      });
    }

    setSteps(generatedSteps);
  };

  // Run next steps automatically up to a pending stage (HITL)
  useEffect(() => {
    if (!isRunning || steps.length === 0) return;

    if (currentStepIdx < steps.length - 1) {
      const currentStep = steps[currentStepIdx];
      
      // If we hit a HITL pending state, we must pause for user input!
      if (currentStep.type === "hitl" && currentStep.status === "pending") {
        return; 
      }

      const timer = setTimeout(() => {
        setCurrentStepIdx(prev => prev + 1);
      }, 1500); // 1.5 second delay per step

      return () => clearTimeout(timer);
    } else {
      // Simulation finished
      setTimeout(() => {
        setIsRunning(false);
        setShowReport(true);
      }, 0);
    }
  }, [isRunning, currentStepIdx, steps]);

  // Handle human click in HITL gate
  const handleHitlDecision = (decision: "approve" | "deny") => {
    setHitlDecision(decision);
    
    // Add final steps depending on approval
    const updatedSteps = [...steps];
    
    // Replace the pending HITL step with completed status
    const hitlStepIdx = updatedSteps.findIndex(s => s.type === "hitl" && s.status === "pending");
    if (hitlStepIdx !== -1) {
      updatedSteps[hitlStepIdx] = {
        ...updatedSteps[hitlStepIdx],
        status: decision === "approve" ? "success" : "warning",
        content: `${updatedSteps[hitlStepIdx].content}\n\n[USER ACTION]: Human supervisor clicked ${decision.toUpperCase()}.`
      };
    }

    // Add final response
    if (selectedPersona.id === "underwriter") {
      updatedSteps.push({
        title: "Final Output Response",
        type: "output",
        content: decision === "approve"
          ? "Loan Application Review: APPROVED (Override). Jane Doe has been approved for a $30,000 auto loan based on a managerial override of the standard 45% DTI threshold."
          : "Loan Application Review: DECLINED. Jane Doe has been declined for a $30,000 auto loan. Debt-to-Income is 52.5% (maximum threshold is 45%).",
        status: "success"
      });
    } else {
      updatedSteps.push({
        title: "Final Output Response",
        type: "output",
        content: decision === "approve"
          ? "Hi John, I have processed the request and waived your $35.00 fee. The credit is visible in your online banking dashboard."
          : "Hi John, I have reviewed the request. Unfortunately, we are unable to waive the overdraft fee at this time because your account had a waiver processed 2 months ago, exceeding the annual limit.",
        status: "success"
      });
    }

    setSteps(updatedSteps);
    // Continue running
    setIsRunning(true);
    setCurrentStepIdx(prev => prev + 1);
  };

  // Generate compliance risk scores
  const getSafetyReport = () => {
    let score = 100;
    const logs: string[] = [];

    const piiEnabled = guardrails.find(g => g.id === "pii")?.enabled;
    const hitlEnabled = guardrails.find(g => g.id === "hitl")?.enabled;
    const coreApiEnabled = tools.find(t => t.id === "core")?.enabled;

    const containsSSN = /\d{3}-\d{2}-\d{4}/.test(inputText);
    const containsAcc = /CU-\d{5}/.test(inputText) || /account/i.test(inputText);

    if (containsSSN && !piiEnabled) {
      score -= 40;
      logs.push("GLBA PRIVACY FAILURE: Plaintext SSN leaked to external LLM provider API. High compliance risk.");
    }
    if (containsAcc && !piiEnabled) {
      score -= 15;
      logs.push("DATA SECURITY LEAK: Unmasked credit union account identification strings exposed to public model.");
    }

    if (selectedPersona.id === "underwriter" && !hitlEnabled) {
      score -= 30;
      logs.push("FAIR LENDING DANGER: Loan underwriting automated decision finalized by agent without a human reviewer validation.");
    }

    if (selectedPersona.id === "chatbot" && coreApiEnabled && !hitlEnabled) {
      score -= 20;
      logs.push("OPERATIONAL EXPOSURE: Financial transactions (overdraft fee waivers) written directly to core systems by AI agent without human check.");
    }

    return { score, logs };
  };

  const report = getSafetyReport();

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

        {/* Title Section */}
        <div style={{ marginBottom: "30px" }}>
          <span className="badge badge-staff" style={{ marginBottom: "10px" }}>Interactive Activity</span>
          <h1 className="gradient-text" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
            Credit Union Agent Sandbox
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "800px" }}>
            Configure an AI agent&apos;s instructions, enable APIs, apply compliance guardrails, and execute a request. Trace the step-by-step reasoning trace to see where guardrails save the day or where regulatory risks occur.
          </p>
        </div>

        {/* Configurations Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }} className="config-grid">
          
          {/* Config Left Column */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "12px" }} className="gradient-text-indigo">
                1. Select Agent Persona
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {personas.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPersona(p); resetSimulation(); }}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid",
                      borderColor: selectedPersona.id === p.id ? "var(--primary)" : "var(--border-color)",
                      backgroundColor: selectedPersona.id === p.id ? "var(--primary-glow)" : "rgba(255, 255, 255, 0.01)",
                      color: "var(--text-primary)",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{p.name}</span>
                      <span className="badge badge-staff" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>{p.role}</span>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{p.instruction.substring(0, 85)}...</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "12px" }} className="gradient-text-indigo">
                2. Equip API Tools
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {tools.map((t) => (
                  <label
                    key={t.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      background: t.enabled ? "rgba(6, 182, 212, 0.04)" : "transparent",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: "10px" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", display: "block" }}>{t.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.description}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={t.enabled}
                      onChange={() => toggleTool(t.id)}
                      style={{ cursor: "pointer", width: "18px", height: "18px", accentColor: "var(--accent)" }}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "12px" }} className="gradient-text-indigo">
                3. Apply Compliance Guardrails
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {guardrails.map((g) => (
                  <label
                    key={g.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      background: g.enabled ? "rgba(16, 185, 129, 0.04)" : "transparent",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: "10px" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", display: "block" }}>{g.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{g.description}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={g.enabled}
                      onChange={() => toggleGuardrail(g.id)}
                      style={{ cursor: "pointer", width: "18px", height: "18px", accentColor: "var(--success)" }}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Config Right Column */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "12px" }} className="gradient-text-violet">
                4. Select Scenario or Write Input
              </h3>
              
              {/* Presets */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                {scenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => handleLoadScenario(sc)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    className="nav-link"
                  >
                    Load: {sc.name}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="form-group" style={{ marginBottom: "0" }}>
                <label className="form-label">Member Prompt Input</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: "130px", fontSize: "0.9rem", fontFamily: "monospace", resize: "none" }}
                  value={inputText}
                  onChange={(e) => { setInputText(e.target.value); resetSimulation(); }}
                  placeholder="Enter custom query text here..."
                />
              </div>
            </div>

            {/* Run Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleStartSimulation}
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={!inputText.trim()}
              >
                <Play style={{ width: 16, height: 16 }} />
                <span>Run Agent Simulation</span>
              </button>
              <button
                onClick={resetSimulation}
                className="btn btn-secondary"
                style={{ padding: "12px" }}
                title="Reset simulation"
              >
                <RotateCcw style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Simulated Live Output screen */}
            <div 
              style={{ 
                flex: 1, 
                border: "1px solid var(--border-color)", 
                borderRadius: "var(--radius-md)", 
                backgroundColor: "rgba(6, 8, 20, 0.7)", 
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)", marginBottom: "12px", display: "block" }}>
                Execution Terminal (Live Trace)
              </span>
              
              {steps.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  <Cpu style={{ width: 44, height: 44, strokeWidth: 1.5, marginBottom: "8px" }} />
                  <p>Configure agent options above and click &apos;Run&apos;</p>
                </div>
              ) : (
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "300px", paddingRight: "6px" }}>
                  {steps.slice(0, currentStepIdx + 1).map((step, idx) => {
                    const isPendingHITL = step.type === "hitl" && step.status === "pending" && hitlDecision === null;
                    
                    return (
                      <div 
                        key={idx}
                        className="animate-fade-in-up"
                        style={{
                          padding: "12px",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: 
                            step.status === "success" ? "var(--success-glow)" : 
                            step.status === "warning" ? "var(--warning-glow)" :
                            step.status === "error" ? "var(--danger-glow)" :
                            "rgba(255,255,255,0.02)",
                          border: "1px solid",
                          borderColor:
                            step.status === "success" ? "var(--success)" : 
                            step.status === "warning" ? "var(--warning)" :
                            step.status === "error" ? "var(--danger)" :
                            "var(--border-color)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{step.title}</strong>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{step.type}</span>
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                          {step.content}
                        </p>

                        {/* Interactive HITL Buttons */}
                        {isPendingHITL && (
                          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                            <button
                              onClick={() => handleHitlDecision("approve")}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "var(--radius-sm)",
                                backgroundColor: "var(--success)",
                                border: "none",
                                color: "#ffffff",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer"
                              }}
                            >
                              Approve Decision
                            </button>
                            <button
                              onClick={() => handleHitlDecision("deny")}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "var(--radius-sm)",
                                backgroundColor: "var(--danger)",
                                border: "none",
                                color: "#ffffff",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer"
                              }}
                            >
                              Deny Request
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Safety & Compliance Report */}
        {showReport && (
          <div className="card animate-fade-in-up" style={{ padding: "24px", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "4px" }}>
                  Compliance & Safety Post-Audit Report
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Automated scan of safety parameters, data inputs, and system permissions.
                </p>
              </div>

              {/* Safety Gauge */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>Safety Rating:</span>
                <div 
                  style={{ 
                    padding: "8px 16px", 
                    borderRadius: "var(--radius-md)", 
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    backgroundColor: report.score >= 80 ? "var(--success-glow)" : report.score >= 50 ? "var(--warning-glow)" : "var(--danger-glow)",
                    color: report.score >= 80 ? "var(--success)" : report.score >= 50 ? "var(--warning)" : "var(--danger)",
                    border: `1px solid ${report.score >= 80 ? "var(--success)" : report.score >= 50 ? "var(--warning)" : "var(--danger)"}`,
                  }}
                >
                  {report.score} / 100
                </div>
              </div>
            </div>

            {report.logs.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px", borderRadius: "var(--radius-md)", backgroundColor: "var(--success-glow)", border: "1px solid var(--success)", color: "var(--success)", fontSize: "0.9rem" }}>
                <ShieldCheck style={{ width: 20, height: 20 }} />
                <span><strong>All Clear!</strong> This configuration is compliant with credit union data standards, GLBA guidelines, and NCUA oversight rules.</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--warning)", marginBottom: "4px", fontSize: "0.9rem" }}>
                  <AlertOctagon style={{ width: 18, height: 18 }} />
                  <span>The following regulatory issues were flagged:</span>
                </div>
                {report.logs.map((log, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      padding: "10px 14px", 
                      borderRadius: "var(--radius-sm)", 
                      backgroundColor: "rgba(239, 68, 68, 0.05)", 
                      borderLeft: "4px solid var(--danger)", 
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)"
                    }}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .config-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
