// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Info, Sparkles, BarChart2 } from "lucide-react";

interface VectorPoint {
  name: string;
  x: number;
  y: number;
  category: "auto" | "mortgage" | "savings";
}

export default function EmbeddingVisualizer() {
  // Coordinates based on an SVG viewBox of 0 0 500 400
  const preloadedPoints: VectorPoint[] = [
    // Auto Loans Cluster (Center around 100, 100)
    { name: "Car Loan Rate", x: 90, y: 80, category: "auto" },
    { name: "Vehicle Finance", x: 120, y: 110, category: "auto" },
    { name: "Auto Loan Terms", x: 75, y: 120, category: "auto" },
    { name: "RV & Boat Financing", x: 130, y: 70, category: "auto" },

    // Mortgages Cluster (Center around 380, 120)
    { name: "Fixed Mortgage", x: 370, y: 100, category: "mortgage" },
    { name: "Escrow Account", x: 410, y: 130, category: "mortgage" },
    { name: "Home Valuation", x: 350, y: 140, category: "mortgage" },
    { name: "Refinance Fees", x: 400, y: 90, category: "mortgage" },

    // Savings Cluster (Center around 250, 290)
    { name: "High-Yield CD", x: 230, y: 280, category: "savings" },
    { name: "Money Market APY", x: 270, y: 310, category: "savings" },
    { name: "Checking Dividend", x: 210, y: 310, category: "savings" },
    { name: "Savings Deposit", x: 280, y: 260, category: "savings" }
  ];

  const clusterCenters = {
    auto: { x: 104, y: 95, name: "Auto Loan Rates" },
    mortgage: { x: 382, y: 115, name: "Mortgages & Escrow" },
    savings: { x: 247, y: 290, name: "Savings & CD Rates" }
  };

  const [query, setQuery] = useState("what is the rate for a 5-year used truck?");
  const [isPlotting, setIsPlotting] = useState(false);
  const [queryPoint, setQueryPoint] = useState<{ x: number; y: number } | null>(null);
  const [distances, setDistances] = useState<{
    key: string;
    clusterName: string;
    distance: number;
    similarity: number;
    isNearest: boolean;
  }[]>([]);

  const handlePlotEmbedding = () => {
    setIsPlotting(true);

    const queryLower = query.toLowerCase();
    
    // Project custom queries to mock 2D space based on keywords
    let targetX = 250;
    let targetY = 200;

    if (
      queryLower.includes("car") || 
      queryLower.includes("truck") || 
      queryLower.includes("auto") || 
      queryLower.includes("vehicle") || 
      queryLower.includes("finance") || 
      queryLower.includes("loan")
    ) {
      // Auto Loans Cluster Focus
      targetX = 100 + (Math.random() * 50 - 25);
      targetY = 100 + (Math.random() * 50 - 25);
    } else if (
      queryLower.includes("home") || 
      queryLower.includes("house") || 
      queryLower.includes("mortgage") || 
      queryLower.includes("escrow") || 
      queryLower.includes("refi") || 
      queryLower.includes("valuation")
    ) {
      // Mortgage Cluster Focus
      targetX = 370 + (Math.random() * 50 - 25);
      targetY = 110 + (Math.random() * 50 - 25);
    } else if (
      queryLower.includes("checking") || 
      queryLower.includes("savings") || 
      queryLower.includes("cd") || 
      queryLower.includes("dividend") || 
      queryLower.includes("money market") || 
      queryLower.includes("deposit") || 
      queryLower.includes("rate") || 
      queryLower.includes("interest") || 
      queryLower.includes("yield")
    ) {
      // Savings Cluster Focus
      targetX = 240 + (Math.random() * 50 - 25);
      targetY = 280 + (Math.random() * 50 - 25);
    } else {
      // Unrelated Fallback Focus (Outlier coordinates)
      targetX = 150 + Math.random() * 200;
      targetY = 180 + Math.random() * 80;
    }

    // Rounds to coordinate integers
    targetX = Math.round(targetX);
    targetY = Math.round(targetY);

    // Calculate Euclidean distances to cluster centers
    const calculatedDistances = Object.entries(clusterCenters).map(([key, center]) => {
      const dist = Math.sqrt(Math.pow(targetX - center.x, 2) + Math.pow(targetY - center.y, 2));
      // Project distance to a percentage match score (0-100%)
      const similarity = Math.max(5, Math.round(100 - (dist / 3.5)));
      return {
        key,
        clusterName: center.name,
        distance: parseFloat(dist.toFixed(1)),
        similarity
      };
    });

    // Find nearest neighbor
    const minDistance = Math.min(...calculatedDistances.map((d) => d.distance));
    const finalDistances = calculatedDistances.map((d) => ({
      ...d,
      isNearest: d.distance === minDistance
    })).sort((a, b) => a.distance - b.distance);

    setTimeout(() => {
      setQueryPoint({ x: targetX, y: targetY });
      setDistances(finalDistances);
      setIsPlotting(false);

      // Save credentials in storage
      localStorage.setItem("cu_ai_progress_embeddings", "completed");
      window.dispatchEvent(new Event("progressUpdated"));
    }, 1200);
  };

  return (
    <div className="section" style={{ paddingTop: "40px" }}>
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

        {/* Title */}
        <div style={{ marginBottom: "30px" }}>
          <span className="badge badge-staff" style={{ marginBottom: "10px" }}>Visual Lab</span>
          <h1 className="gradient-text" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
            Vector Embedding Visualizer
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "850px" }}>
            Unstructured documents are converted into dense lists of numbers (embeddings) which define positions in geometric space. Type a prompt and watch how AI matches your search using Euclidean distance math.
          </p>
        </div>

        {/* Informative Analogy Card */}
        <div 
          className="card" 
          style={{ 
            marginBottom: "30px", 
            borderLeft: "4px solid var(--primary)", 
            background: "linear-gradient(135deg, rgba(13, 16, 35, 0.6) 0%, rgba(99, 102, 241, 0.03) 100%)" 
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", color: "var(--primary)" }}>
            <Info style={{ width: 20, height: 20 }} />
            <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>Under the Hood: Dimensionality Reduction</h3>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Real AI models map text into high-dimensional semantic spaces (e.g. 1536 coordinates!). To explain this to auditors and board members, we use mathematical algorithms (like PCA or t-SNE) to flatten those values onto a simple 2D coordinate grid. Close proximity means closely matching meaning.
          </p>
        </div>

        {/* Interface Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px", marginBottom: "40px" }} className="visualizer-grid">
          
          {/* SVG Map Chart Column */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "4px" }} className="gradient-text-indigo">
              2D Semantic Vector Space
            </h3>

            {/* SVG Visual Plot */}
            <div 
              style={{ 
                background: "rgba(6, 8, 20, 0.6)", 
                border: "1px solid var(--border-color)", 
                borderRadius: "var(--radius-md)", 
                overflow: "hidden", 
                position: "relative" 
              }}
            >
              <svg 
                viewBox="0 0 500 400" 
                style={{ width: "100%", height: "auto", display: "block" }}
              >
                {/* Grid Lines */}
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="500" height="400" fill="url(#grid)" />

                {/* Axis Labels */}
                <text x="250" y="390" fill="rgba(255,255,255,0.15)" fontSize="9" textAnchor="middle" letterSpacing="2">SEMANTIC DIMENSION X</text>
                <text x="15" y="200" fill="rgba(255,255,255,0.15)" fontSize="9" textAnchor="middle" transform="rotate(-90 15 200)" letterSpacing="2">SEMANTIC DIMENSION Y</text>

                {/* Cluster Boundaries/Glow */}
                <circle cx={clusterCenters.auto.x} cy={clusterCenters.auto.y} r="65" fill="rgba(6, 182, 212, 0.02)" stroke="rgba(6, 182, 212, 0.1)" strokeDasharray="3,3" />
                <circle cx={clusterCenters.mortgage.x} cy={clusterCenters.mortgage.y} r="65" fill="rgba(99, 102, 241, 0.02)" stroke="rgba(99, 102, 241, 0.1)" strokeDasharray="3,3" />
                <circle cx={clusterCenters.savings.x} cy={clusterCenters.savings.y} r="65" fill="rgba(168, 85, 247, 0.02)" stroke="rgba(168, 85, 247, 0.1)" strokeDasharray="3,3" />

                {/* Pre-loaded Database Vector Points */}
                {preloadedPoints.map((pt, idx) => {
                  let color = "var(--accent)";
                  if (pt.category === "mortgage") color = "var(--primary)";
                  if (pt.category === "savings") color = "var(--secondary)";

                  return (
                    <g key={idx}>
                      <circle cx={pt.x} cy={pt.y} r="4" fill={color} opacity="0.6" />
                      <text x={pt.x} y={pt.y - 8} fill="rgba(255,255,255,0.3)" fontSize="7" textAnchor="middle" pointerEvents="none">{pt.name}</text>
                    </g>
                  );
                })}

                {/* Cluster Centers Labels */}
                <text x={clusterCenters.auto.x} y={clusterCenters.auto.y - 50} fill="var(--accent)" fontSize="10" fontWeight="bold" textAnchor="middle">Auto Loans</text>
                <text x={clusterCenters.mortgage.x} y={clusterCenters.mortgage.y - 50} fill="var(--primary)" fontSize="10" fontWeight="bold" textAnchor="middle">Mortgages</text>
                <text x={clusterCenters.savings.x} y={clusterCenters.savings.y + 60} fill="var(--secondary)" fontSize="10" fontWeight="bold" textAnchor="middle">Savings & CDs</text>

                {/* Query plotted node */}
                {queryPoint && (
                  <g className="animate-fade-in">
                    {/* Glowing outer wave */}
                    <circle cx={queryPoint.x} cy={queryPoint.y} r="16" fill="rgba(245, 158, 11, 0.15)" stroke="var(--warning)" strokeWidth="1">
                      <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                    </circle>
                    {/* Nearest distance path indicators */}
                    {distances.map((d, dIdx) => {
                      const center = clusterCenters[d.key as "auto" | "mortgage" | "savings"];
                      return (
                        <line 
                          key={dIdx}
                          x1={queryPoint.x} 
                          y1={queryPoint.y} 
                          x2={center.x} 
                          y2={center.y} 
                          stroke={d.isNearest ? "var(--warning)" : "rgba(255,255,255,0.1)"} 
                          strokeWidth={d.isNearest ? "1.5" : "0.5"}
                          strokeDasharray={d.isNearest ? "none" : "2,2"}
                        />
                      );
                    })}
                    {/* Core node */}
                    <circle cx={queryPoint.x} cy={queryPoint.y} r="6" fill="#f59e0b" />
                    <text x={queryPoint.x} y={queryPoint.y - 12} fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">Your Query</text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Form & Proximity analysis sidebar Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Input query form */}
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "1.15rem" }} className="gradient-text-indigo">
                Query Vectorization
              </h3>
              
              <div className="form-group">
                <label className="form-label">Type Member Request</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setQueryPoint(null); }}
                  placeholder="e.g. what are your home refinance rates?"
                />
              </div>

              <button 
                onClick={handlePlotEmbedding} 
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={isPlotting || !query.trim()}
              >
                <Sparkles style={{ width: 16, height: 16 }} />
                <span>{isPlotting ? "Vectorizing & Plotting..." : "Plot Vector Embedding"}</span>
              </button>
            </div>

            {/* Calculations results */}
            {queryPoint && distances.length > 0 && (
              <div className="card animate-fade-in-up" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontSize: "1.1rem" }} className="gradient-text-indigo">
                  Euclidean Proximity Scores
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {distances.map((dist, dIdx) => (
                    <div 
                      key={dIdx}
                      style={{
                        padding: "12px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: dist.isNearest ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.01)",
                        border: "1px solid",
                        borderColor: dist.isNearest ? "var(--warning)" : "var(--border-color)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", alignItems: "center" }}>
                        <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                          {dist.clusterName}
                        </strong>
                        {dist.isNearest && (
                          <span className="badge badge-success" style={{ fontSize: "0.6rem", padding: "1px 5px", background: "rgba(245, 158, 11, 0.15)", color: "var(--warning)" }}>
                            NEAREST
                          </span>
                        )}
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        <span>Distance: <strong>{dist.distance} units</strong></span>
                        <span>Cosine Match: <strong style={{ color: dist.isNearest ? "var(--warning)" : "var(--text-primary)" }}>{dist.similarity}%</strong></span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grounding Explanation */}
                <div style={{ padding: "12px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--primary)", textTransform: "uppercase", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                    <BarChart2 style={{ width: 14, height: 14 }} />
                    Retrieval Grounding Decision
                  </span>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    Query coordinates <strong>[{queryPoint.x}, {queryPoint.y}]</strong> fall closest to the <strong>{distances[0].clusterName}</strong> database vector category. The RAG system will query tables related to this category to retrieve system references.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .visualizer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
