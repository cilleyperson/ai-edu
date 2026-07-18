import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { learningPaths } from "@/data/learningPaths";
import QuizComponent from "@/components/QuizComponent";
import { BookOpen, Award, ShieldAlert, ArrowLeft, Clock, ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{
    path: string;
  }>;
}

export default async function LearnPathPage({ params }: PageProps) {
  const { path } = await params;
  
  // Validate path parameter
  if (path !== "staff" && path !== "management" && path !== "board") {
    notFound();
  }

  const pathData = learningPaths[path];

  // Map icon names to lucide icons
  const iconMap = {
    staff: BookOpen,
    management: Award,
    board: ShieldAlert,
  };
  
  const PathIcon = iconMap[pathData.iconName] || BookOpen;

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
            transition: "var(--transition-fast)"
          }}
          className="nav-link"
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Hero Section */}
        <div 
          className="card" 
          style={{ 
            marginBottom: "40px", 
            position: "relative", 
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(13, 16, 35, 0.8) 0%, rgba(20, 24, 52, 0.4) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)"
          }}
        >
          {/* Decorative glowing gradient sphere in corner */}
          <div 
            style={{ 
              position: "absolute", 
              top: "-50px", 
              right: "-50px", 
              width: "150px", 
              height: "150px", 
              borderRadius: "50%", 
              background: "radial-gradient(circle, var(--primary) 0%, rgba(0,0,0,0) 70%)", 
              opacity: 0.3,
              pointerEvents: "none"
            }} 
          />

          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div 
              style={{ 
                padding: "16px", 
                borderRadius: "var(--radius-md)", 
                background: "rgba(255,255,255,0.03)", 
                border: "1px solid var(--border-color)",
                color: "var(--primary)"
              }}
            >
              <PathIcon style={{ width: 36, height: 36 }} />
            </div>
            
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                <span className={`badge badge-${path === "staff" ? "staff" : path === "management" ? "mgmt" : "board"}`}>
                  {path === "staff" ? "Staff Path" : path === "management" ? "Management Path" : "Board Path"}
                </span>
                <span 
                  style={{ 
                    fontSize: "0.85rem", 
                    color: "var(--text-secondary)", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "4px" 
                  }}
                >
                  <Clock style={{ width: 14, height: 14 }} />
                  {pathData.timeEstimate}
                </span>
              </div>
              
              <h1 style={{ fontSize: "2rem", marginBottom: "8px" }} className="gradient-text">
                {pathData.title}
              </h1>
              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", fontWeight: 500, marginBottom: "16px" }}>
                {pathData.tagline}
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {pathData.introduction}
              </p>
            </div>
          </div>
        </div>

        {/* Content Modules */}
        <div style={{ maxWidth: "850px", margin: "0 auto 60px auto" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "24px" }} className="gradient-text-indigo">
            Learning Modules
          </h2>
          
          {pathData.modules.map((mod, idx) => (
            <div 
              key={idx} 
              className="card" 
              style={{ 
                marginBottom: "28px", 
                padding: "24px",
                borderLeft: "4px solid var(--primary)" 
              }}
            >
              <h3 style={{ fontSize: "1.25rem", marginBottom: "8px", color: "var(--text-primary)" }}>
                {mod.title}
              </h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px", fontStyle: "italic" }}>
                {mod.subtitle}
              </p>
              
              <ul style={{ paddingLeft: "20px", marginBottom: "20px", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                {mod.points.map((pt, pIdx) => (
                  <li key={pIdx} style={{ marginBottom: "10px" }}>{pt}</li>
                ))}
              </ul>

              {/* Highlighted Case Study */}
              {mod.caseStudy && (
                <div 
                  style={{ 
                    padding: "16px", 
                    borderRadius: "var(--radius-md)", 
                    backgroundColor: "rgba(99, 102, 241, 0.04)", 
                    border: "1px solid rgba(99, 102, 241, 0.15)",
                    marginBottom: "16px"
                  }}
                >
                  <strong style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontSize: "0.9rem", marginBottom: "6px" }}>
                    <ShieldCheck style={{ width: 16, height: 16 }} />
                    {mod.caseStudy.title}
                  </strong>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {mod.caseStudy.description}
                  </p>
                </div>
              )}

              {/* Compliance Warning Box */}
              {mod.complianceWarning && (
                <div 
                  style={{ 
                    padding: "16px", 
                    borderRadius: "var(--radius-md)", 
                    backgroundColor: "rgba(239, 68, 68, 0.04)", 
                    border: "1px solid rgba(239, 68, 68, 0.15)"
                  }}
                >
                  <strong style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--danger)", fontSize: "0.9rem", marginBottom: "6px" }}>
                    <ShieldAlert style={{ width: 16, height: 16 }} />
                    Compliance & Regulatory Advisory
                  </strong>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {mod.complianceWarning}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quiz Module */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "50px" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.75rem", marginBottom: "8px" }} className="gradient-text-violet">
              Unlock Your Certification
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "550px", margin: "0 auto" }}>
              Complete the knowledge check below to verify your mastery. Get a score of 70% or higher to unlock the path credential.
            </p>
          </div>
          
          <QuizComponent pathId={pathData.id} questions={pathData.quiz} />
        </div>

      </div>
    </div>
  );
}
