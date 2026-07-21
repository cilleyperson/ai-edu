// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState } from "react";
import { Send, AlertTriangle, CheckCircle, ShieldAlert, User, Bot, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "system" | "assistant";
  content: string;
  isViolation?: boolean;
}

export default function PromptSandbox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Welcome to the Staff Prompt Engineering Sandbox. Try asking the AI to draft an email to a member regarding a loan status. Remember the Golden Rule: Do not include real Personally Identifiable Information (PII) like SSNs or Account Numbers."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sandboxCompleted, setSandboxCompleted] = useState(false);

  // Simple regex for PII detection (SSNs and Account numbers)
  const containsPII = (text: string) => {
    const ssnRegex = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/;
    // Looking for a 9 to 12 digit number which could be an account number
    const accountRegex = /\b\d{9,12}\b/;
    return ssnRegex.test(text) || accountRegex.test(text);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    const isViolation = containsPII(userText);
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userText, isViolation }]);

    if (isViolation) {
      // Immediate system block
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "system",
          content: "BLOCKED: PII Detected! You attempted to send a Social Security Number or Account Number to an external AI model. This violates GLBA compliance.",
          isViolation: true
        }]);
      }, 500);
    } else {
      // Simulate AI response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "Here is your requested draft: 'Dear Member, we are currently reviewing your loan application...'\n\n(Great job! You provided context without leaking any sensitive member data.)"
        }]);
        setSandboxCompleted(true);
      }, 1500);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "system",
        content: "Welcome to the Staff Prompt Engineering Sandbox. Try asking the AI to draft an email to a member regarding a loan status. Remember the Golden Rule: Do not include real Personally Identifiable Information (PII) like SSNs or Account Numbers."
      }
    ]);
    setInput("");
    setSandboxCompleted(false);
  };

  return (
    <div className="card animate-fade-in-up" style={{ padding: "0", maxWidth: "700px", margin: "20px auto", border: "1px solid var(--border-color)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "rgba(6, 8, 20, 0.7)", padding: "16px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.95rem", fontWeight: 700, color: "var(--accent)" }}>
          <ShieldAlert style={{ width: 18, height: 18 }} />
          Prompt Engineering Lab
        </span>
        <button onClick={handleReset} className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem" }}>
          <RefreshCw style={{ width: 12, height: 12 }} /> Reset
        </button>
      </div>

      {/* Chat Area */}
      <div style={{ height: "350px", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", background: "rgba(13, 16, 35, 0.4)" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div 
              style={{
                maxWidth: "80%",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                background: msg.role === "user" 
                  ? (msg.isViolation ? "var(--danger-glow)" : "var(--primary-glow)")
                  : (msg.isViolation ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.05)"),
                border: msg.role === "user"
                  ? (msg.isViolation ? "1px solid var(--danger)" : "1px solid var(--primary)")
                  : (msg.isViolation ? "1px solid var(--danger)" : "1px solid var(--border-color)"),
                color: msg.isViolation ? "var(--danger)" : "var(--text-primary)",
                borderBottomRightRadius: msg.role === "user" ? "4px" : "var(--radius-md)",
                borderBottomLeftRadius: msg.role !== "user" ? "4px" : "var(--radius-md)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", fontSize: "0.75rem", fontWeight: 600, color: msg.isViolation ? "var(--danger)" : "var(--text-secondary)", textTransform: "uppercase" }}>
                {msg.role === "user" ? <User style={{ width: 12, height: 12 }} /> : <Bot style={{ width: 12, height: 12 }} />}
                {msg.role === "system" ? "System Guardrail" : msg.role === "user" ? "You" : "AI Assistant"}
              </div>
              <div style={{ fontSize: "0.9rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "12px 16px", borderRadius: "var(--radius-md)", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-color)", borderBottomLeftRadius: "4px" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                <span className="dot-typing" style={{ animationDelay: "0s" }}>.</span>
                <span className="dot-typing" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="dot-typing" style={{ animationDelay: "0.4s" }}>.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)", background: "rgba(6, 8, 20, 0.5)" }}>
        <div style={{ position: "relative" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your prompt here... (e.g., 'Draft an email for Member A')"
            disabled={sandboxCompleted}
            style={{
              width: "100%",
              background: "rgba(13, 16, 35, 0.8)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "12px 48px 12px 16px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
              minHeight: "60px",
              resize: "none",
              outline: "none",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sandboxCompleted}
            style={{
              position: "absolute",
              right: "8px",
              bottom: "10px",
              background: input.trim() && !sandboxCompleted ? "var(--primary)" : "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: input.trim() && !sandboxCompleted ? "#fff" : "var(--text-muted)",
              cursor: input.trim() && !sandboxCompleted ? "pointer" : "not-allowed",
              transition: "all 0.2s"
            }}
          >
            <Send style={{ width: 14, height: 14 }} />
          </button>
        </div>
        {sandboxCompleted && (
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px", color: "var(--success)", fontSize: "0.85rem", fontWeight: 600 }}>
            <CheckCircle style={{ width: 16, height: 16 }} />
            Sandbox challenge completed successfully!
          </div>
        )}
        <div style={{ marginTop: "8px", fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
          <AlertTriangle style={{ width: 12, height: 12, color: "var(--warning)" }} />
          Test inputs only. Do not use real data. Press Enter to send.
        </div>
      </div>

      <style jsx>{`
        @keyframes typing {
          0% { opacity: 0.3; transform: translateY(0px); }
          50% { opacity: 1; transform: translateY(-2px); }
          100% { opacity: 0.3; transform: translateY(0px); }
        }
        .dot-typing {
          display: inline-block;
          font-weight: bold;
          animation: typing 1.4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
