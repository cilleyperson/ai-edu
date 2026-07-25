// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { NextResponse } from "next/server";
import { getModelPricesFromDatabase, syncLiveModelPricesToDatabase } from "@/lib/modelPricingService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("force") === "true";

  // 1. Fetch current stored model rates from Database immediately
  const { models, lastUpdated, isStale } = await getModelPricesFromDatabase();

  // 2. If data is older than 24 hours (or force flag passed), trigger background refresh non-blockingly!
  if (isStale || forceRefresh) {
    // Non-blocking background task: fetch live provider prices & update database
    syncLiveModelPricesToDatabase().catch(() => {});
  }

  // 3. Return database rates instantly (never block user UI)
  return NextResponse.json(
    {
      success: true,
      lastUpdated,
      isStale,
      backgroundSyncTriggered: isStale || forceRefresh,
      source: "Database-Backed Live Provider Feed",
      models,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}

export async function POST() {
  // Manual trigger endpoint for forced background refresh
  const updatedModels = await syncLiveModelPricesToDatabase();
  return NextResponse.json({
    success: true,
    lastUpdated: new Date().toISOString(),
    message: "Successfully synchronized live provider pricing into database.",
    models: updatedModels,
  });
}
