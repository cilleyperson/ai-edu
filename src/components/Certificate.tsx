"use client";

import React, { useEffect, useState } from "react";
import { Award, ShieldCheck, CheckCircle, Sparkles, Download, Check } from "lucide-react";
import confetti from "canvas-confetti";

export default function Certificate() {
  const [show, setShow] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [dateCompleted, setDateCompleted] = useState<string>("");

  useEffect(() => {
    const checkCompletion = () => {
      const paths = ["staff", "management", "board", "infosec", "engineering"];
      const allCompleted = paths.every(p => localStorage.getItem(`cu_ai_progress_${p}`) === "completed");
      
      if (allCompleted) {
        let completionDate = localStorage.getItem("cu_ai_completion_date");
        if (!completionDate) {
          completionDate = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
          localStorage.setItem("cu_ai_completion_date", completionDate);
        }
        setDateCompleted(completionDate);

        if (!localStorage.getItem("cu_ai_certificate_awarded")) {
          triggerConfetti();
          localStorage.setItem("cu_ai_certificate_awarded", "true");
        }
        setShow(true);
      } else {
        setShow(false);
      }
    };

    checkCompletion();
    window.addEventListener("storage", checkCompletion);
    window.addEventListener("progressUpdated", checkCompletion);
    return () => {
      window.removeEventListener("storage", checkCompletion);
      window.removeEventListener("progressUpdated", checkCompletion);
    };
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#e11d48', '#0ea5e9', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#e11d48', '#0ea5e9', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // In a real app, this would trigger an html2pdf or generate a PDF backend request
      alert("Certificate PDF downloaded! (Simulation)");
    }, 1500);
  };

  if (!show) return null;

  return (
    <div className="animate-fade-in-up" style={{ marginBottom: "60px" }}>
      <div 
        style={{
          background: "linear-gradient(135deg, rgba(20, 24, 52, 0.9) 0%, rgba(13, 16, 35, 0.95) 100%)",
          border: "2px solid var(--accent)",
          borderRadius: "var(--radius-lg)",
          padding: "40px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(6, 182, 212, 0.2)",
          textAlign: "center"
        }}
      >
        {/* Decorative corner accents */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100px", height: "100px", borderTop: "4px solid var(--accent)", borderLeft: "4px solid var(--accent)", borderTopLeftRadius: "var(--radius-lg)" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "100px", height: "100px", borderBottom: "4px solid var(--accent)", borderRight: "4px solid var(--accent)", borderBottomRightRadius: "var(--radius-lg)" }} />
        
        {/* Glowing background orb */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(0,0,0,0) 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--accent)", color: "var(--accent)" }}>
              <Award style={{ width: 44, height: 44 }} />
            </div>
          </div>

          <h2 style={{ fontSize: "1.2rem", letterSpacing: "4px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Certificate of Completion
          </h2>
          
          <h1 style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "8px", fontFamily: "var(--font-sans)", lineHeight: 1.1 }} className="gradient-text-cyan">
            Master Agentic AI <br/> Platform Architect
          </h1>

          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "24px auto 32px auto", lineHeight: 1.6 }}>
            This certifies that the recipient has successfully completed all five learning paths: <strong>Staff, Management, Board, InfoSec, and Engineering</strong>, demonstrating comprehensive mastery over Agentic AI operations, security, and governance in credit union environments.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--success)" }}>
              <CheckCircle style={{ width: 20, height: 20 }} />
              <span style={{ fontSize: "0.95rem", fontWeight: 600 }}>Zero-Trust Certified</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)" }}>
              <ShieldCheck style={{ width: 20, height: 20 }} />
              <span style={{ fontSize: "0.95rem", fontWeight: 600 }}>Governance Passed</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)" }}>
              <Sparkles style={{ width: 20, height: 20 }} />
              <span style={{ fontSize: "0.95rem", fontWeight: 600 }}>Architecture Verified</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Date Achieved</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{dateCompleted}</p>
            </div>
            
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="btn btn-accent" 
              style={{ padding: "12px 24px", fontSize: "0.95rem" }}
            >
              {downloading ? (
                <>
                  <Check style={{ width: 18, height: 18 }} />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download style={{ width: 18, height: 18 }} />
                  <span>Download Certificate</span>
                </>
              )}
            </button>
            
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Verification ID</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "monospace" }}>CU-AI-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
