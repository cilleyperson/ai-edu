// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserCheck, ShieldAlert, FileText, Check, X, Edit3, CheckCircle2, AlertTriangle, Send } from "lucide-react";

interface ReviewTask {
  id: string;
  memberQuery: string;
  aiDraft: string;
  hasViolation: boolean;
  violationFeedback: string;
}

export default function HITLSimulator() {
  const [tasks] = useState<ReviewTask[]>([
    {
      id: "TASK-001",
      memberQuery: "I'm looking to buy a house soon. Can I get a good rate?",
      aiDraft: "We can absolutely help you with that! We guarantee you'll be approved for a 5.5% fixed rate mortgage.",
      hasViolation: true,
      violationFeedback: "Compliance Violation: The AI used the word 'guarantee' and promised a specific rate without pulling credit or verifying income. This violates fair lending and advertising regulations."
    },
    {
      id: "TASK-002",
      memberQuery: "What are your hours on Saturday for the downtown branch?",
      aiDraft: "The downtown branch is open from 9:00 AM to 1:00 PM on Saturdays.",
      hasViolation: false,
      violationFeedback: "This is a safe and accurate response."
    },
    {
      id: "TASK-003",
      memberQuery: "I lost my debit card, please send a new one to 123 Main St.",
      aiDraft: "I've ordered a replacement debit card to be mailed to 123 Main St. It will arrive in 3-5 business days.",
      hasViolation: true,
      violationFeedback: "Security Violation: The AI fulfilled a card replacement request via chat without verifying the user's identity through secure authentication protocols."
    }
  ]);

  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [editedDraft, setEditedDraft] = useState(tasks[0].aiDraft);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; message: string } | null>(null);
  
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const isLabComplete = completedTasks.length === tasks.length;

  const handleApprove = () => {
    const task = tasks[currentTaskIdx];
    // If they approve and it's unedited but has a violation, they fail
    if (task.hasViolation && editedDraft === task.aiDraft) {
      setFeedback({
        isSuccess: false,
        message: task.violationFeedback
      });
    } else {
      // If it has no violation, or they edited it, we consider it a pass for the simulation
      setFeedback({
        isSuccess: true,
        message: "Action approved! The response was safe to send."
      });
      markCompleted(task.id);
    }
  };

  const handleReject = () => {
    const task = tasks[currentTaskIdx];
    if (!task.hasViolation) {
      setFeedback({
        isSuccess: false,
        message: "You rejected a perfectly safe and accurate response! This causes unnecessary delays for the member."
      });
    } else {
      setFeedback({
        isSuccess: true,
        message: "Good catch! You correctly identified that the AI's response was unsafe. " + task.violationFeedback
      });
      markCompleted(task.id);
    }
  };

  const markCompleted = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      const newCompleted = [...completedTasks, taskId];
      setCompletedTasks(newCompleted);
      
      if (newCompleted.length === tasks.length) {
        localStorage.setItem("cu_ai_hitl_completed", "completed");
        window.dispatchEvent(new Event("progressUpdated"));
      }
    }
  };

  const loadNextTask = () => {
    setFeedback(null);
    setIsEditing(false);
    const nextIdx = (currentTaskIdx + 1) % tasks.length;
    setCurrentTaskIdx(nextIdx);
    setEditedDraft(tasks[nextIdx].aiDraft);
  };

  const currentTask = tasks[currentTaskIdx];

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
              Human-in-the-Loop (HITL) Simulator
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "800px" }}>
              AI shouldn&apos;t run on autopilot in financial services. Step into the role of a human overseer reviewing AI-generated actions. Catch compliance violations and hallucinations before they impact members.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Queue: {completedTasks.length} / {tasks.length} Resolved
            </span>
            {isLabComplete && (
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--success)", fontWeight: 600, marginLeft: "12px" }}>
                <CheckCircle2 style={{ width: 18, height: 18 }} />
                Lab Complete
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "24px" }} className="hitl-grid">
          
          {/* Main Triage Panel */}
          <div className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText style={{ width: 18, height: 18, color: "var(--primary)" }} />
                Review Task: {currentTask.id}
              </h3>
              {completedTasks.includes(currentTask.id) && (
                <span className="badge" style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", color: "var(--success)" }}>Resolved</span>
              )}
            </div>
            
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px", flex: 1 }}>
              
              {/* Member Query */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>
                  <UserCheck style={{ width: 14, height: 14 }} /> Member Input
                </label>
                <div style={{ padding: "16px", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--accent)" }}>
                  <p style={{ margin: 0, fontSize: "1rem", color: "var(--text-primary)" }}>
                    &quot;{currentTask.memberQuery}&quot;
                  </p>
                </div>
              </div>

              {/* AI Draft */}
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>
                    <ShieldAlert style={{ width: 14, height: 14 }} /> AI Draft Response
                  </label>
                  {!isEditing && !completedTasks.includes(currentTask.id) && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
                    >
                      <Edit3 style={{ width: 14, height: 14 }} /> Edit Draft
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <textarea
                    value={editedDraft}
                    onChange={(e) => setEditedDraft(e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      padding: "16px",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "var(--text-primary)",
                      fontFamily: "inherit",
                      fontSize: "1rem",
                      border: "1px solid var(--primary)",
                      borderRadius: "var(--radius-md)",
                      outline: "none",
                      resize: "vertical",
                      lineHeight: 1.5
                    }}
                  />
                ) : (
                  <div style={{ 
                    padding: "16px", 
                    backgroundColor: "rgba(99, 102, 241, 0.05)", 
                    borderRadius: "var(--radius-md)", 
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    minHeight: "120px"
                  }}>
                    <p style={{ margin: 0, fontSize: "1rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                      {editedDraft}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              {!completedTasks.includes(currentTask.id) && !feedback && (
                <div style={{ display: "flex", gap: "12px", marginTop: "auto", paddingTop: "20px" }}>
                  <button className="btn btn-primary" onClick={handleApprove} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "var(--success)" }}>
                    <Check style={{ width: 18, height: 18 }} />
                    Approve & Send
                  </button>
                  <button className="btn btn-secondary" onClick={handleReject} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "1px solid var(--danger)", color: "var(--danger)" }}>
                    <X style={{ width: 18, height: 18 }} />
                    Reject Action
                  </button>
                </div>
              )}

              {/* Feedback Alert */}
              {feedback && (
                <div className="animate-fade-in-up" style={{ 
                  marginTop: "auto",
                  padding: "20px", 
                  borderRadius: "var(--radius-md)",
                  backgroundColor: feedback.isSuccess ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  border: `1px solid ${feedback.isSuccess ? "var(--success)" : "var(--danger)"}`
                }}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    {feedback.isSuccess ? (
                      <CheckCircle2 style={{ width: 24, height: 24, color: "var(--success)", flexShrink: 0 }} />
                    ) : (
                      <AlertTriangle style={{ width: 24, height: 24, color: "var(--danger)", flexShrink: 0 }} />
                    )}
                    <div>
                      <h4 style={{ margin: "0 0 8px 0", fontSize: "1.05rem", color: feedback.isSuccess ? "var(--success)" : "var(--danger)" }}>
                        {feedback.isSuccess ? "Good Decision" : "Oversight Failure"}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {feedback.message}
                      </p>
                      
                      <button 
                        onClick={loadNextTask}
                        className="btn btn-primary"
                        style={{ marginTop: "16px", padding: "8px 16px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        Next Task <Send style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Panel: Queue List */}
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", margin: "0 0 16px 0" }}>
              Triage Queue
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {tasks.map((task, idx) => {
                const isActive = idx === currentTaskIdx;
                const isDone = completedTasks.includes(task.id);
                
                return (
                  <button
                    key={task.id}
                    onClick={() => {
                      setCurrentTaskIdx(idx);
                      setEditedDraft(tasks[idx].aiDraft);
                      setFeedback(null);
                      setIsEditing(false);
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: isActive ? "rgba(99, 102, 241, 0.1)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isActive ? "var(--primary)" : "var(--border-color)"}`,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: isActive ? "var(--primary)" : "var(--text-primary)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ fontSize: "0.9rem", fontWeight: isActive ? 600 : 400 }}>{task.id}</span>
                    {isDone && <CheckCircle2 style={{ width: 16, height: 16, color: "var(--success)" }} />}
                  </button>
                );
              })}
            </div>
            
            <div style={{ marginTop: "32px", padding: "16px", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-md)" }}>
              <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Oversight Guidelines</h4>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "8px", lineHeight: 1.4 }}>
                <li>Do not approve promises of specific rates or guarantees.</li>
                <li>Verify identity before executing account actions.</li>
                <li>Edit hallucinations to provide factual information.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .hitl-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
