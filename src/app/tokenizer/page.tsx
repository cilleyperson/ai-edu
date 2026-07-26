// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Radio } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

export interface ModelPricing {
  id: string;
  name: string;
  provider: "OpenAI" | "Anthropic" | "Google" | "DeepSeek" | "Meta / Open-Source" | "Mistral";
  inputPrice: number; // per 1M tokens
  outputPrice: number; // per 1M tokens
  contextWindow: string;
  tier: "Flagship" | "Fast / Mini" | "Reasoning" | "Open-Weights";
}

const DEFAULT_MODELS: ModelPricing[] = [
  { id: "gpt4o", name: "GPT-4o", provider: "OpenAI", inputPrice: 2.50, outputPrice: 10.00, contextWindow: "128k", tier: "Flagship" },
  { id: "o3_mini", name: "o3-mini Reasoning", provider: "OpenAI", inputPrice: 1.10, outputPrice: 4.40, contextWindow: "200k", tier: "Reasoning" },
  { id: "gpt4o_mini", name: "GPT-4o mini", provider: "OpenAI", inputPrice: 0.15, outputPrice: 0.60, contextWindow: "128k", tier: "Fast / Mini" },
  { id: "claude_sonnet", name: "Claude 3.7 / 4.5 Sonnet", provider: "Anthropic", inputPrice: 3.00, outputPrice: 15.00, contextWindow: "200k", tier: "Flagship" },
  { id: "claude_haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", inputPrice: 1.00, outputPrice: 5.00, contextWindow: "200k", tier: "Fast / Mini" },
  { id: "claude_opus", name: "Claude Opus", provider: "Anthropic", inputPrice: 5.00, outputPrice: 25.00, contextWindow: "200k", tier: "Flagship" },
  { id: "gemini_pro", name: "Gemini 2.5 Pro", provider: "Google", inputPrice: 1.25, outputPrice: 10.00, contextWindow: "2M", tier: "Flagship" },
  { id: "gemini_flash", name: "Gemini 3.6 Flash", provider: "Google", inputPrice: 1.50, outputPrice: 7.50, contextWindow: "1M", tier: "Fast / Mini" },
  { id: "deepseek_flash", name: "DeepSeek-V4 Flash", provider: "DeepSeek", inputPrice: 0.14, outputPrice: 0.28, contextWindow: "128k", tier: "Open-Weights" },
  { id: "deepseek_pro", name: "DeepSeek-V4 Pro", provider: "DeepSeek", inputPrice: 0.435, outputPrice: 0.87, contextWindow: "128k", tier: "Open-Weights" },
  { id: "llama_33", name: "Llama 3.3 70B (Hosted)", provider: "Meta / Open-Source", inputPrice: 0.35, outputPrice: 0.40, contextWindow: "128k", tier: "Open-Weights" },
];

export default function Tokenizer() {
  const { addToast } = useToast();
  const [inputText, setInputText] = useState(
    "What is the late fee on our member checking accounts? I would like to request a waiver for a $35 fee on my statement balance."
  );

  const [models, setModels] = useState<ModelPricing[]>(DEFAULT_MODELS);
  const [selectedModelId, setSelectedModelId] = useState<string>("gpt4o");
  const [ragBloat, setRagBloat] = useState<number>(4000);
  const [outputTokens, setOutputTokens] = useState<number>(500);
  const [dailyQueries, setDailyQueries] = useState<number>(5000);

  // Discount switches
  const [enablePromptCaching, setEnablePromptCaching] = useState<boolean>(false);
  const [enableBatchAPI, setEnableBatchAPI] = useState<boolean>(false);

  // Auto-Sync state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // Sync pricing from live API route
  const fetchLivePricing = useCallback(async (isManual: boolean = false) => {
    setIsSyncing(true);
    try {
      const url = isManual ? "/api/models/pricing?force=true" : "/api/models/pricing";
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.models)) {
        setModels(data.models);
        const formattedTime = new Date(data.lastUpdated || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setLastSyncedTime(formattedTime);

        try {
          localStorage.setItem("cu_ai_tokenizer_models", JSON.stringify(data.models));
        } catch {
          // Ignore
        }

        if (isManual) {
          addToast({
            type: "success",
            title: "Model Pricing Synced",
            message: "Successfully fetched latest 2026 flagship model rates.",
          });
        }
      }
    } catch {
      if (isManual) {
        addToast({
          type: "error",
          title: "Sync Failed",
          message: "Using cached 2026 flagship baseline rates.",
        });
      }
    } finally {
      setIsSyncing(false);
    }
  }, [addToast]);

  // Load custom pricing overrides from localStorage & auto-sync once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cu_ai_tokenizer_models");
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setModels(JSON.parse(saved));
      }
    } catch {
      // Ignore parse errors
    }

    fetchLivePricing(false);
  }, [fetchLivePricing]);

  // Save models to localStorage when edited manually
  const updateModelPrice = (id: string, field: "inputPrice" | "outputPrice", value: number) => {
    const updated = models.map((m) => (m.id === id ? { ...m, [field]: Math.max(0, value) } : m));
    setModels(updated);
    try {
      localStorage.setItem("cu_ai_tokenizer_models", JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const resetToDefaultPrices = () => {
    setModels(DEFAULT_MODELS);
    localStorage.removeItem("cu_ai_tokenizer_models");
    addToast({
      type: "info",
      title: "Rates Reset",
      message: "Restored baseline 2026 flagship pricing tiers.",
    });
  };

  // Sub-word Tokenize Simulator Logic
  const tokenize = (text: string) => {
    if (!text) return [];
    const tokenRegex = /\w+|[^\w\s]|\s+/g;
    const matches = text.match(tokenRegex) || [];

    const finalTokens: string[] = [];
    matches.forEach((m) => {
      if (m.trim().length > 7) {
        const half = Math.ceil(m.length / 2);
        finalTokens.push(m.substring(0, half));
        finalTokens.push(m.substring(half));
      } else {
        finalTokens.push(m);
      }
    });

    return finalTokens;
  };

  const tokens = tokenize(inputText);
  const coreInputTokens = tokens.length;
  const totalInputTokens = coreInputTokens + ragBloat;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const selectedModel = models.find((m) => m.id === selectedModelId) || models[0];

  // Calculate cost per single query
  const calculateSingleQueryCost = (m: ModelPricing) => {
    let effectiveInputPrice = m.inputPrice;
    const effectiveOutputPrice = m.outputPrice;

    if (enablePromptCaching) {
      effectiveInputPrice = effectiveInputPrice * 0.5; // 50% discount on cached prompt
    }

    const inputCost = (totalInputTokens / 1_000_000) * effectiveInputPrice;
    const outputCost = (outputTokens / 1_000_000) * effectiveOutputPrice;
    let total = inputCost + outputCost;

    if (enableBatchAPI) {
      total = total * 0.5; // 50% off for 24h batch API execution
    }

    return total;
  };

  const currentQueryCost = calculateSingleQueryCost(selectedModel);
  const monthlyCost = currentQueryCost * dailyQueries * 30;
  const annualCost = monthlyCost * 12;

  // Track activity progress
  useEffect(() => {
    try {
      localStorage.setItem("cu_ai_progress_tokenizer", "completed");
      window.dispatchEvent(new Event("progressUpdated"));
    } catch {
      // Ignore
    }
  }, []);

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

        {/* Title & Live Sync Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "30px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span className="badge badge-staff">Interactive Activity</span>
              <span className="badge badge-indigo">2026 Flagship LLMs</span>
            </div>
            <h1 className="gradient-text" style={{ fontSize: "2.25rem", marginBottom: "8px" }}>
              LLM Tokenizer & Enterprise Cost Simulator
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "850px" }}>
              Explore sub-word token parsing, simulate RAG context bloat, model 2026 flagship frontier LLMs (OpenAI o3-mini, GPT-4o, Claude 3.7/4.5 Sonnet, Gemini 2.5 Pro, DeepSeek-V4), and project credit union operational budgets.
            </p>
          </div>

          {/* Auto-Sync Live Rates Indicator Badge */}
          <div
            className="card"
            style={{
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(16, 185, 129, 0.06)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <Radio style={{ width: 18, height: 18, color: "var(--success)" }} className={isSyncing ? "animate-pulse" : ""} />
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Database 24h Auto-Refresh</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {lastSyncedTime ? `Synced at ${lastSyncedTime}` : "Database Feed Ready"}
              </span>
            </div>
            <button
              onClick={() => fetchLivePricing(true)}
              disabled={isSyncing}
              className="btn btn-secondary"
              style={{ padding: "6px 10px", fontSize: "0.75rem", marginLeft: "6px" }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} className={isSyncing ? "spin" : ""} />
            </button>
          </div>
        </div>

        {/* Workspace Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }} className="tokenizer-grid">
          {/* Column 1: Text Tokenizer Visualizer */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "10px" }} className="gradient-text-indigo">
                1. Prompt Tokenizer Sandbox
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                Type or edit a prompt to see how large language models break strings down into sub-word tokens.
              </p>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.95rem",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </div>

            {/* Token Stats Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border-color)",
                textAlign: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Characters</span>
                <p style={{ margin: "2px 0 0 0", fontWeight: 700, fontSize: "1.1rem" }}>{charCount}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Words</span>
                <p style={{ margin: "2px 0 0 0", fontWeight: 700, fontSize: "1.1rem" }}>{wordCount}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Core Tokens</span>
                <p style={{ margin: "2px 0 0 0", fontWeight: 700, fontSize: "1.1rem", color: "var(--primary)" }}>
                  {coreInputTokens}
                </p>
              </div>
            </div>

            {/* Visual Token Output Highlighting */}
            <div>
              <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                Tokenized Output Breakdown ({tokens.length} tokens):
              </h4>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  border: "1px solid var(--border-color)",
                  maxHeight: "180px",
                  overflowY: "auto",
                }}
              >
                {tokens.map((token, idx) => {
                  const colors = [
                    "rgba(99, 102, 241, 0.25)",
                    "rgba(168, 85, 247, 0.25)",
                    "rgba(6, 182, 212, 0.25)",
                    "rgba(16, 185, 129, 0.25)",
                    "rgba(245, 158, 11, 0.25)",
                  ];
                  const borderColors = [
                    "rgba(99, 102, 241, 0.5)",
                    "rgba(168, 85, 247, 0.5)",
                    "rgba(6, 182, 212, 0.5)",
                    "rgba(16, 185, 129, 0.5)",
                    "rgba(245, 158, 11, 0.5)",
                  ];
                  const colorIdx = idx % colors.length;

                  return (
                    <span
                      key={idx}
                      style={{
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: colors[colorIdx],
                        border: `1px solid ${borderColors[colorIdx]}`,
                        fontSize: "0.85rem",
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {token === " " ? "␣" : token}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: RAG Context & Enterprise Volume Controls */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ fontSize: "1.15rem", margin: 0 }} className="gradient-text-indigo">
              2. RAG Context & Volume Simulator
            </h3>

            {/* RAG Context Selector */}
            <div>
              <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "8px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>RAG Policy Context Bloat:</span>
                <span style={{ color: "var(--accent)", fontWeight: 700 }}>+{ragBloat.toLocaleString()} tokens</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                {[0, 4000, 16000, 32000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRagBloat(val)}
                    style={{
                      padding: "8px",
                      borderRadius: "var(--radius-sm)",
                      border: `1px solid ${ragBloat === val ? "var(--primary)" : "var(--border-color)"}`,
                      backgroundColor: ragBloat === val ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.02)",
                      color: "var(--text-primary)",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {val === 0 ? "Direct Prompt" : `+${val / 1000}k RAG`}
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Output Completion Tokens Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Expected Output Tokens:</span>
                <span style={{ color: "var(--secondary)", fontWeight: 700 }}>{outputTokens.toLocaleString()} tokens</span>
              </div>
              <input
                type="range"
                min="50"
                max="4000"
                step="50"
                value={outputTokens}
                onChange={(e) => setOutputTokens(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--secondary)", cursor: "pointer" }}
              />
            </div>

            {/* Enterprise Daily Query Volume Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Daily Query Volume:</span>
                <span style={{ color: "var(--success)", fontWeight: 700 }}>{dailyQueries.toLocaleString()} queries / day</span>
              </div>
              <input
                type="range"
                min="100"
                max="50000"
                step="500"
                value={dailyQueries}
                onChange={(e) => setDailyQueries(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--success)", cursor: "pointer" }}
              />
            </div>

            {/* Discount Switches */}
            <div
              style={{
                padding: "14px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>
                Cost Reduction Options
              </span>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={enablePromptCaching}
                  onChange={(e) => setEnablePromptCaching(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                />
                <span>Prompt Caching (50% input token discount)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={enableBatchAPI}
                  onChange={(e) => setEnableBatchAPI(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                />
                <span>Batch Execution API (50% total discount for async jobs)</span>
              </label>
            </div>

            {/* Selected Model Summary Card */}
            <div
              style={{
                padding: "16px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "rgba(99, 102, 241, 0.08)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  {selectedModel.name} Projection
                </span>
                <span className="badge badge-indigo">{selectedModel.provider}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", textAlign: "center" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Per Query</span>
                  <p style={{ margin: "2px 0 0 0", fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)" }}>
                    ${currentQueryCost < 0.01 ? currentQueryCost.toFixed(5) : currentQueryCost.toFixed(4)}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Monthly Budget</span>
                  <p style={{ margin: "2px 0 0 0", fontWeight: 800, fontSize: "1rem", color: "var(--warning)" }}>
                    ${monthlyCost.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Annual OpEx</span>
                  <p style={{ margin: "2px 0 0 0", fontWeight: 800, fontSize: "1.1rem", color: "var(--success)" }}>
                    ${annualCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2026 Flagship Pricing Matrix & SLA Editor */}
        <div className="card" style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontSize: "1.25rem", margin: "0 0 4px 0" }} className="gradient-text-indigo">
                3. Flagship Model Matrix & Enterprise SLA Overrides
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Edit rates directly to model custom enterprise SLAs or vendor volume discounts. Prices per 1,000,000 tokens.
              </p>
            </div>

            <button
              onClick={resetToDefaultPrices}
              className="btn btn-secondary"
              style={{ padding: "6px 12px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} />
              <span>Reset Baseline</span>
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model Name</th>
                  <th>Provider</th>
                  <th>Input $/1M</th>
                  <th>Output $/1M</th>
                  <th>Per Query</th>
                  <th>Annual OpEx</th>
                  <th style={{ width: "120px" }}>Select</th>
                </tr>
              </thead>
              <tbody>
                {models
                  .map((m) => {
                    const qCost = calculateSingleQueryCost(m);
                    const annCost = qCost * dailyQueries * 365;
                    return { ...m, qCost, annCost };
                  })
                  .sort((a, b) => a.annCost - b.annCost)
                  .map((m) => {
                    const isSelected = m.id === selectedModelId;
                    return (
                      <tr
                        key={m.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                          backgroundColor: isSelected ? "rgba(99, 102, 241, 0.08)" : "transparent",
                          transition: "background 0.15s ease",
                        }}
                      >
                        <td style={{ padding: "12px 14px", fontWeight: 600 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>{m.name}</span>
                            <span className="badge badge-staff" style={{ fontSize: "0.65rem", padding: "1px 5px" }}>
                              {m.tier}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>{m.provider}</td>

                        {/* Input Price Editable Cell */}
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ color: "var(--text-muted)" }}>$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={m.inputPrice}
                              onChange={(e) => updateModelPrice(m.id, "inputPrice", parseFloat(e.target.value) || 0)}
                              style={{
                                width: "70px",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                border: "1px solid var(--border-color)",
                                backgroundColor: "var(--surface-hover)",
                                color: "var(--text-primary)",
                                fontSize: "0.85rem",
                              }}
                            />
                          </div>
                        </td>

                        {/* Output Price Editable Cell */}
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ color: "var(--text-muted)" }}>$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={m.outputPrice}
                              onChange={(e) => updateModelPrice(m.id, "outputPrice", parseFloat(e.target.value) || 0)}
                              style={{
                                width: "70px",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                border: "1px solid var(--border-color)",
                                backgroundColor: "var(--surface-hover)",
                                color: "var(--text-primary)",
                                fontSize: "0.85rem",
                              }}
                            />
                          </div>
                        </td>

                        <td style={{ padding: "12px 14px", fontWeight: 600 }}>
                          ${m.qCost < 0.01 ? m.qCost.toFixed(5) : m.qCost.toFixed(4)}
                        </td>

                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--success)" }}>
                          ${m.annCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                        </td>

                        <td style={{ padding: "12px 14px" }}>
                          <button
                            onClick={() => setSelectedModelId(m.id)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "6px",
                              border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border-color)",
                              backgroundColor: isSelected ? "var(--primary)" : "transparent",
                              color: isSelected ? "#fff" : "var(--text-secondary)",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            {isSelected ? "Active" : "Simulate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
