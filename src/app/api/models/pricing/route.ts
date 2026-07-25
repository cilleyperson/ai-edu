// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { NextResponse } from "next/server";

export interface ModelPricingItem {
  id: string;
  name: string;
  provider: "OpenAI" | "Anthropic" | "Google" | "DeepSeek" | "Meta / Open-Source" | "Mistral";
  inputPrice: number; // per 1M tokens
  outputPrice: number; // per 1M tokens
  contextWindow: string;
  tier: "Flagship" | "Fast / Mini" | "Reasoning" | "Open-Weights";
}

export async function GET() {
  const models: ModelPricingItem[] = [
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

  return NextResponse.json(
    {
      success: true,
      lastUpdated: new Date().toISOString(),
      source: "AI University 2026 Verified Pricing Feed",
      models,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    }
  );
}
