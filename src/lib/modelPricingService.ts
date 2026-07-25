// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import db from "@/lib/db";

export interface ModelPricingItem {
  id: string;
  name: string;
  provider: "OpenAI" | "Anthropic" | "Google" | "DeepSeek" | "Meta / Open-Source" | "Mistral";
  inputPrice: number; // per 1M tokens (USD)
  outputPrice: number; // per 1M tokens (USD)
  contextWindow: string;
  tier: "Flagship" | "Fast / Mini" | "Reasoning" | "Open-Weights";
  updatedAt?: string;
}

interface OpenRouterPricing {
  prompt?: string;
  completion?: string;
}

interface OpenRouterModel {
  id: string;
  pricing?: OpenRouterPricing;
}

interface DbModelPriceRecord {
  id: string;
  name: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
  contextWindow: string;
  tier: string;
  updatedAt: Date;
}

export const FALLBACK_MODELS: ModelPricingItem[] = [
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

/**
 * Fetch live model pricing from public model pricing API feeds (OpenRouter)
 * and update database records asynchronously.
 */
export async function syncLiveModelPricesToDatabase(): Promise<ModelPricingItem[]> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Pricing API returned status ${response.status}`);
    }

    const data = await response.json();
    const liveList: OpenRouterModel[] = data.data || [];

    // Map public models to our flagship model catalog IDs
    const updatedModels: ModelPricingItem[] = FALLBACK_MODELS.map((fallback) => {
      let matchedModel: OpenRouterModel | undefined;

      if (fallback.id === "gpt4o") {
        matchedModel = liveList.find((m) => m.id === "openai/gpt-4o" || m.id.includes("gpt-4o"));
      } else if (fallback.id === "o3_mini") {
        matchedModel = liveList.find((m) => m.id.includes("o3-mini"));
      } else if (fallback.id === "gpt4o_mini") {
        matchedModel = liveList.find((m) => m.id.includes("gpt-4o-mini"));
      } else if (fallback.id === "claude_sonnet") {
        matchedModel = liveList.find((m) => m.id.includes("claude-3.5-sonnet") || m.id.includes("claude-3.7-sonnet"));
      } else if (fallback.id === "claude_haiku") {
        matchedModel = liveList.find((m) => m.id.includes("claude-3.5-haiku"));
      } else if (fallback.id === "claude_opus") {
        matchedModel = liveList.find((m) => m.id.includes("claude-3-opus"));
      } else if (fallback.id === "gemini_pro") {
        matchedModel = liveList.find((m) => m.id.includes("gemini-pro"));
      } else if (fallback.id === "gemini_flash") {
        matchedModel = liveList.find((m) => m.id.includes("gemini-flash"));
      } else if (fallback.id === "deepseek_flash") {
        matchedModel = liveList.find((m) => m.id.includes("deepseek") && m.id.includes("chat"));
      } else if (fallback.id === "deepseek_pro") {
        matchedModel = liveList.find((m) => m.id.includes("deepseek") && m.id.includes("coder"));
      } else if (fallback.id === "llama_33") {
        matchedModel = liveList.find((m) => m.id.includes("llama-3.3-70b"));
      }

      if (matchedModel && matchedModel.pricing) {
        const rawPromptPrice = parseFloat(matchedModel.pricing.prompt || "0");
        const rawCompletionPrice = parseFloat(matchedModel.pricing.completion || "0");

        // Convert per-token price to per 1,000,000 tokens
        const inputPrice = rawPromptPrice > 0 ? Number((rawPromptPrice * 1_000_000).toFixed(4)) : fallback.inputPrice;
        const outputPrice = rawCompletionPrice > 0 ? Number((rawCompletionPrice * 1_000_000).toFixed(4)) : fallback.outputPrice;

        return { ...fallback, inputPrice, outputPrice };
      }

      return fallback;
    });

    // Save to Database asynchronously via Prisma Client
    try {
      const prismaDb = db as unknown as {
        modelPrice: {
          upsert: (args: {
            where: { id: string };
            update: Partial<ModelPricingItem>;
            create: ModelPricingItem;
          }) => Promise<DbModelPriceRecord>;
        };
      };

      for (const model of updatedModels) {
        await prismaDb.modelPrice.upsert({
          where: { id: model.id },
          update: {
            name: model.name,
            provider: model.provider,
            inputPrice: model.inputPrice,
            outputPrice: model.outputPrice,
            contextWindow: model.contextWindow,
            tier: model.tier,
          },
          create: {
            id: model.id,
            name: model.name,
            provider: model.provider,
            inputPrice: model.inputPrice,
            outputPrice: model.outputPrice,
            contextWindow: model.contextWindow,
            tier: model.tier,
          },
        });
      }
    } catch {
      // Silent fallback
    }

    return updatedModels;
  } catch {
    return FALLBACK_MODELS;
  }
}

/**
 * Retrieve model prices from Database.
 * Returns models, lastUpdated timestamp, and whether data is older than 24 hours.
 */
export async function getModelPricesFromDatabase(): Promise<{
  models: ModelPricingItem[];
  lastUpdated: string;
  isStale: boolean;
}> {
  try {
    const prismaDb = db as unknown as {
      modelPrice: {
        findMany: () => Promise<DbModelPriceRecord[]>;
      };
    };

    const dbRecords = await prismaDb.modelPrice.findMany();

    if (!dbRecords || dbRecords.length === 0) {
      return {
        models: FALLBACK_MODELS,
        lastUpdated: new Date().toISOString(),
        isStale: true,
      };
    }

    // Find newest update timestamp
    let newestTimestamp = 0;
    const models: ModelPricingItem[] = dbRecords.map((r) => {
      const updatedAtMs = new Date(r.updatedAt).getTime();
      if (updatedAtMs > newestTimestamp) newestTimestamp = updatedAtMs;

      return {
        id: r.id,
        name: r.name,
        provider: r.provider as ModelPricingItem["provider"],
        inputPrice: r.inputPrice,
        outputPrice: r.outputPrice,
        contextWindow: r.contextWindow,
        tier: r.tier as ModelPricingItem["tier"],
        updatedAt: r.updatedAt.toISOString(),
      };
    });

    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
    const isStale = Date.now() - newestTimestamp > TWENTY_FOUR_HOURS_MS;
    const lastUpdated = newestTimestamp > 0 ? new Date(newestTimestamp).toISOString() : new Date().toISOString();

    return { models, lastUpdated, isStale };
  } catch {
    return {
      models: FALLBACK_MODELS,
      lastUpdated: new Date().toISOString(),
      isStale: true,
    };
  }
}
