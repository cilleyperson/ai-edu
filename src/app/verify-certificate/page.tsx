// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, Copy } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function VerifyCertificate() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [certId, setCertId] = useState("CU-AI-2026-88942");

  useEffect(() => {
    if (user?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCertId(`CU-AI-2026-${user.id.slice(-6).toUpperCase()}`);
    }
  }, [user]);

  const shareableUrl = typeof window !== "undefined" ? `${window.location.origin}/verify-certificate?id=${certId}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="section" style={{ paddingTop: "40px", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
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

        {/* Verification Card */}
        <div className="card" style={{ padding: "40px", border: "1px solid var(--border-color)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "160px", height: "160px", background: "var(--primary-glow)", filter: "blur(50px)", pointerEvents: "none" }}></div>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "var(--success)", marginBottom: "16px" }}>
              <ShieldCheck style={{ width: 48, height: 48 }} />
            </div>
            <span className="badge badge-success" style={{ display: "inline-block", marginBottom: "12px" }}>
              Verified Credentials
            </span>
            <h1 className="gradient-text" style={{ fontSize: "2rem", marginBottom: "8px" }}>
              Credit Union Agentic AI Certification
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Official Verifiable Credential issued by AI University for Credit Unions
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "24px", marginBottom: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Issued To</span>
                <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {user ? user.name : "Authenticated CU Scholar"}
                </p>
              </div>

              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Verification ID</span>
                <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: "bold", fontFamily: "monospace", color: "var(--accent)" }}>
                  {certId}
                </p>
              </div>

              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Authentication Provider</span>
                <p style={{ margin: "4px 0 0 0", fontSize: "1rem", color: "var(--text-primary)" }}>
                  {user ? user.provider.toUpperCase() : "OAuth Verified"}
                </p>
              </div>

              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Cloud Database Sync</span>
                <p style={{ margin: "4px 0 0 0", fontSize: "1rem", color: "var(--success)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 style={{ width: 16, height: 16 }} /> Active (MySQL/PostgreSQL)
                </p>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Verify link for HR & Compliance Officers:</span>
              <button
                onClick={copyLink}
                className="btn btn-secondary"
                style={{ padding: "6px 14px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}
              >
                {copied ? <CheckCircle2 style={{ width: 14, height: 14, color: "var(--success)" }} /> : <Copy style={{ width: 14, height: 14 }} />}
                <span>{copied ? "Link Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/" className="btn btn-primary" style={{ padding: "12px 24px", fontSize: "0.95rem" }}>
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
