// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Terminal, Code2, Cpu, CheckCircle2, AlertCircle, RefreshCw, Layers } from "lucide-react";

interface Mission {
  id: number;
  title: string;
  description: string;
  taskPrompt: string;
  defaultCode: string;
  validate: (code: string) => { success: boolean; trace: TraceStep[] };
}

interface TraceStep {
  type: "THINK" | "ACTION" | "OBSERVATION" | "ERROR" | "FINAL_ANSWER";
  content: string;
}

export default function AgentStudio() {
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [missionSuccess, setMissionSuccess] = useState<boolean | null>(null);
  const traceEndRef = useRef<HTMLDivElement>(null);

  const missions: Mission[] = [
    {
      id: 1,
      title: "Mission 1: Tool Calling",
      description: "Agents need external tools to fetch real-world data to avoid hallucination. Write a JavaScript function named `getAutoLoanRate()` that returns the string '5.25%'. The agent will invoke this tool to answer a member's query.",
      taskPrompt: "User Query: 'What is today's auto loan rate?'",
      defaultCode: `// Define your tool here
function getAutoLoanRate() {
  // TODO: Return the current rate
  
}`,
      validate: (userCode: string) => {
        const traceLog: TraceStep[] = [];
        let success = false;
        
        traceLog.push({ type: "THINK", content: "I need to answer the user's query about the auto loan rate. I should use the `getAutoLoanRate` tool to get accurate data." });
        traceLog.push({ type: "ACTION", content: "Calling tool: getAutoLoanRate()" });

        try {
          // Unsafe eval for simulation purposes in a controlled client environment
          const funcEval = new Function(`
            ${userCode}
            if (typeof getAutoLoanRate !== 'function') throw new Error('Function getAutoLoanRate is not defined');
            return getAutoLoanRate();
          `);
          
          const result = funcEval();
          
          traceLog.push({ type: "OBSERVATION", content: `Tool returned: "${result}"` });
          
          if (result === "5.25%") {
            traceLog.push({ type: "THINK", content: "I have the correct rate. I will formulate the final response." });
            traceLog.push({ type: "FINAL_ANSWER", content: "Today's auto loan rate is 5.25%." });
            success = true;
          } else {
            traceLog.push({ type: "THINK", content: "The tool did not return the expected rate of '5.25%'." });
            traceLog.push({ type: "FINAL_ANSWER", content: "I'm sorry, I could not retrieve the correct rate." });
          }
        } catch (e: unknown) {
          traceLog.push({ type: "ERROR", content: `Tool execution failed: ${(e as Error).message}` });
          traceLog.push({ type: "FINAL_ANSWER", content: "I encountered an internal error while fetching the rates." });
        }
        
        return { success, trace: traceLog };
      }
    },
    {
      id: 2,
      title: "Mission 2: Reflection & Guardrails",
      description: "Agents can make mistakes. It is best practice to have an agent 'reflect' or evaluate its own proposed output against a compliance tool before sending it. Write a function `checkCompliance(text)` that returns 'DENY' if the text contains 'guarantee', otherwise return 'APPROVE'.",
      taskPrompt: "Agent Draft: 'We guarantee you will be approved for a $50k loan!'",
      defaultCode: `function checkCompliance(text) {
  // Return 'DENY' if text includes 'guarantee'
  // Return 'APPROVE' otherwise
  
}`,
      validate: (userCode: string) => {
        const traceLog: TraceStep[] = [];
        let success = false;
        
        traceLog.push({ type: "THINK", content: "I have drafted a response: 'We guarantee you will be approved for a $50k loan!'. Before sending, I must call the `checkCompliance` tool to reflect on safety." });
        traceLog.push({ type: "ACTION", content: "Calling tool: checkCompliance('We guarantee you will be approved for a $50k loan!')" });

        try {
          const funcEval = new Function(`
            ${userCode}
            if (typeof checkCompliance !== 'function') throw new Error('Function checkCompliance is not defined');
            return checkCompliance('We guarantee you will be approved for a $50k loan!');
          `);
          
          const result = funcEval();
          traceLog.push({ type: "OBSERVATION", content: `Tool returned: "${result}"` });
          
          if (result === "DENY") {
            traceLog.push({ type: "THINK", content: "The compliance check failed. I must revise my response." });
            traceLog.push({ type: "ACTION", content: "Calling tool: checkCompliance('You pre-qualify for up to $50k.')" });
            
            const funcEval2 = new Function(`
              ${userCode}
              return checkCompliance('You pre-qualify for up to $50k.');
            `);
            const result2 = funcEval2();
            traceLog.push({ type: "OBSERVATION", content: `Tool returned: "${result2}"` });
            
            if (result2 === "APPROVE") {
               traceLog.push({ type: "FINAL_ANSWER", content: "You pre-qualify for up to $50k." });
               success = true;
            } else {
               traceLog.push({ type: "ERROR", content: "Second compliance check failed unexpectedly." });
            }
          } else {
            traceLog.push({ type: "ERROR", content: "The tool approved a non-compliant message! ECOA violation detected." });
            traceLog.push({ type: "FINAL_ANSWER", content: "We guarantee you will be approved for a $50k loan! (COMPLIANCE FAILURE)" });
          }
        } catch (e: unknown) {
          traceLog.push({ type: "ERROR", content: `Tool execution failed: ${(e as Error).message}` });
        }
        
        return { success, trace: traceLog };
      }
    },
    {
      id: 3,
      title: "Mission 3: Multi-Agent Orchestration",
      description: "Complex tasks require specialized agents passing data. You are configuring a 'Router Agent'. Write a function `routeQuery(query)` that returns 'LOAN_AGENT' if the query includes 'loan', and 'SUPPORT_AGENT' otherwise.",
      taskPrompt: "User Query: 'I need help resetting my password.'",
      defaultCode: `function routeQuery(query) {
  
}`,
      validate: (userCode: string) => {
        const traceLog: TraceStep[] = [];
        let success = false;
        
        traceLog.push({ type: "THINK", content: "I am the Orchestrator Agent. I need to decide which specialized agent should handle this user request: 'I need help resetting my password.'" });
        traceLog.push({ type: "ACTION", content: "Calling tool: routeQuery('I need help resetting my password.')" });

        try {
          const funcEval = new Function(`
            ${userCode}
            if (typeof routeQuery !== 'function') throw new Error('Function routeQuery is not defined');
            return routeQuery('I need help resetting my password.');
          `);
          
          const result = funcEval();
          traceLog.push({ type: "OBSERVATION", content: `Tool returned: "${result}"` });
          
          if (result === "SUPPORT_AGENT") {
            traceLog.push({ type: "THINK", content: "Handoff to SUPPORT_AGENT successful." });
            
            traceLog.push({ type: "ACTION", content: "SUPPORT_AGENT executing..." });
            traceLog.push({ type: "FINAL_ANSWER", content: "I can help you reset your password. Please click the link sent to your email." });
            success = true;
          } else {
            traceLog.push({ type: "ERROR", content: "Routed to the wrong agent. The Loan Agent cannot help with passwords." });
          }
        } catch (e: unknown) {
          traceLog.push({ type: "ERROR", content: `Tool execution failed: ${(e as Error).message}` });
        }
        
        return { success, trace: traceLog };
      }
    }
  ];

  const currentMission = missions[currentMissionIdx];

  // Load default code when switching missions
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(currentMission.defaultCode);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTrace([]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMissionSuccess(null);
  }, [currentMissionIdx]);

  useEffect(() => {
    if (traceEndRef.current) {
      traceEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [trace]);

  const handleRunAgent = () => {
    setIsRunning(true);
    setTrace([]);
    setMissionSuccess(null);

    const result = currentMission.validate(code);
    
    // Simulate real-time trace output
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < result.trace.length) {
        setTrace((prev) => [...prev, result.trace[stepIndex]]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setMissionSuccess(result.success);
        
        if (result.success && currentMissionIdx === missions.length - 1) {
          localStorage.setItem("cu_ai_agent_studio_completed", "completed");
          window.dispatchEvent(new Event("progressUpdated"));
        }
      }
    }, 800); // 800ms delay between simulated steps
  };

  const getTraceIcon = (type: string) => {
    switch (type) {
      case "THINK": return <Cpu style={{ width: 16, height: 16, color: "var(--accent)" }} />;
      case "ACTION": return <Code2 style={{ width: 16, height: 16, color: "var(--primary)" }} />;
      case "OBSERVATION": return <Layers style={{ width: 16, height: 16, color: "var(--success)" }} />;
      case "FINAL_ANSWER": return <CheckCircle2 style={{ width: 16, height: 16, color: "var(--text-primary)" }} />;
      case "ERROR": return <AlertCircle style={{ width: 16, height: 16, color: "var(--danger)" }} />;
      default: return <Terminal style={{ width: 16, height: 16 }} />;
    }
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
            <span className="badge badge-board" style={{ marginBottom: "10px" }}>Developer Simulator</span>
            <h1 className="gradient-text-violet" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
              Agentic AI Studio
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "800px" }}>
              Learn how to build autonomous AI agents. Write custom tool code and watch the agent&apos;s internal &quot;ReAct&quot; (Reasoning + Action) execution loop in real-time.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "8px" }}>
            {missions.map((m, idx) => (
              <div 
                key={m.id}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: currentMissionIdx === idx ? "var(--primary)" : currentMissionIdx > idx ? "var(--success)" : "rgba(255,255,255,0.1)",
                  border: currentMissionIdx === idx ? "2px solid #fff" : "none"
                }}
                title={m.title}
              />
            ))}
          </div>
        </div>

        {/* Workspace Split */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", minHeight: "600px" }} className="studio-grid">
          
          {/* Left Panel: Code Editor */}
          <div className="card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", border: "1px solid var(--border-color)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(255,255,255,0.02)" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--primary)" }}>{currentMission.title}</h3>
              <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {currentMission.description}
              </p>
            </div>
            
            <div style={{ flex: 1, position: "relative", backgroundColor: "#0f172a" }}>
              <div style={{ position: "absolute", top: "12px", right: "12px", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                tools.js
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "20px",
                  backgroundColor: "transparent",
                  color: "#e2e8f0",
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  fontSize: "0.95rem",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  lineHeight: 1.6
                }}
                spellCheck="false"
              />
            </div>
            
            <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end" }}>
              <button 
                className="btn btn-primary" 
                onClick={handleRunAgent} 
                disabled={isRunning}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {isRunning ? <RefreshCw className="spin" style={{ width: 16, height: 16 }} /> : <Play style={{ width: 16, height: 16 }} />}
                <span>{isRunning ? "Agent Executing..." : "Run Agent"}</span>
              </button>
            </div>
          </div>

          {/* Right Panel: Trace Visualizer */}
          <div className="card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", border: "1px solid var(--border-color)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Terminal style={{ width: 18, height: 18, color: "var(--accent)" }} />
                Execution Trace
              </h3>
            </div>
            
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(0,0,0,0.3)" }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", fontFamily: "monospace" }}>
                <strong style={{ color: "var(--text-primary)" }}>{currentMission.taskPrompt}</strong>
              </p>
            </div>

            <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "rgba(0,0,0,0.15)" }}>
              {trace.map((step, idx) => (
                <div key={idx} className="animate-fade-in-up" style={{ display: "flex", gap: "12px" }}>
                  <div style={{ marginTop: "2px" }}>
                    {getTraceIcon(step.type)}
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                      {step.type}
                    </span>
                    <div style={{ 
                      marginTop: "4px", 
                      fontSize: "0.9rem", 
                      lineHeight: 1.5, 
                      color: step.type === "ERROR" ? "var(--danger)" : "var(--text-primary)",
                      fontFamily: step.type === "ACTION" || step.type === "OBSERVATION" ? "monospace" : "inherit"
                    }}>
                      {step.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {trace.length === 0 && !isRunning && (
                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", marginTop: "40px" }}>
                  Write your tool code and click &quot;Run Agent&quot; to see the execution trace.
                </div>
              )}
              
              <div ref={traceEndRef} />
            </div>

            {/* Mission Success/Failure Panel */}
            {missionSuccess !== null && !isRunning && (
              <div className="animate-fade-in-up" style={{ padding: "20px", borderTop: "1px solid var(--border-color)", backgroundColor: missionSuccess ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {missionSuccess ? (
                      <CheckCircle2 style={{ width: 24, height: 24, color: "var(--success)" }} />
                    ) : (
                      <AlertCircle style={{ width: 24, height: 24, color: "var(--danger)" }} />
                    )}
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1rem", color: missionSuccess ? "var(--success)" : "var(--danger)" }}>
                        {missionSuccess ? "Mission Accomplished!" : "Mission Failed"}
                      </h4>
                    </div>
                  </div>
                  
                  {missionSuccess && currentMissionIdx < missions.length - 1 && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => setCurrentMissionIdx(prev => prev + 1)}
                    >
                      Next Mission
                    </button>
                  )}
                  {missionSuccess && currentMissionIdx === missions.length - 1 && (
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--success)" }}>
                      Studio Complete! 🎉
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 900px) {
          .studio-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
