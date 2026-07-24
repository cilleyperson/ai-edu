// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { NextResponse } from "next/server";

export interface ProgressPayload {
  staff: boolean;
  management: boolean;
  board: boolean;
  infosec: boolean;
  engineering: boolean;
  staffScore: number;
  managementScore: number;
  boardScore: number;
  infosecScore: number;
  engineeringScore: number;
  riskMatrixUsed: boolean;
  playgroundScore: number;
  ragUsed: boolean;
  vendorAudited: boolean;
  embeddingUsed: boolean;
  tokenizerUsed: boolean;
  biasAudited: boolean;
  redteamLvl1: boolean;
  redteamLvl2: boolean;
  warroomUsed: boolean;
  pipelineUsed: boolean;
  agentStudioCompleted: boolean;
  xaiCompleted: boolean;
  hitlCompleted: boolean;
}

// In-memory fallback session store for demo / zero-config environments
const memoryProgressStore = new Map<string, ProgressPayload>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "guest-user";

  const progress = memoryProgressStore.get(userId) || {
    staff: false,
    management: false,
    board: false,
    infosec: false,
    engineering: false,
    staffScore: 0,
    managementScore: 0,
    boardScore: 0,
    infosecScore: 0,
    engineeringScore: 0,
    riskMatrixUsed: false,
    playgroundScore: 0,
    ragUsed: false,
    vendorAudited: false,
    embeddingUsed: false,
    tokenizerUsed: false,
    biasAudited: false,
    redteamLvl1: false,
    redteamLvl2: false,
    warroomUsed: false,
    pipelineUsed: false,
    agentStudioCompleted: false,
    xaiCompleted: false,
    hitlCompleted: false,
  };

  return NextResponse.json({ success: true, userId, progress });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = "guest-user", progress } = body;

    if (!progress) {
      return NextResponse.json({ success: false, error: "Missing progress payload" }, { status: 400 });
    }

    const existing = memoryProgressStore.get(userId) || {
      staff: false,
      management: false,
      board: false,
      infosec: false,
      engineering: false,
      staffScore: 0,
      managementScore: 0,
      boardScore: 0,
      infosecScore: 0,
      engineeringScore: 0,
      riskMatrixUsed: false,
      playgroundScore: 0,
      ragUsed: false,
      vendorAudited: false,
      embeddingUsed: false,
      tokenizerUsed: false,
      biasAudited: false,
      redteamLvl1: false,
      redteamLvl2: false,
      warroomUsed: false,
      pipelineUsed: false,
      agentStudioCompleted: false,
      xaiCompleted: false,
      hitlCompleted: false,
    };

    // Merging logic: Keep true if either local or remote is true; take higher score
    const mergedProgress: ProgressPayload = {
      staff: existing.staff || progress.staff,
      management: existing.management || progress.management,
      board: existing.board || progress.board,
      infosec: existing.infosec || progress.infosec,
      engineering: existing.engineering || progress.engineering,
      staffScore: Math.max(existing.staffScore, progress.staffScore || 0),
      managementScore: Math.max(existing.managementScore, progress.managementScore || 0),
      boardScore: Math.max(existing.boardScore, progress.boardScore || 0),
      infosecScore: Math.max(existing.infosecScore, progress.infosecScore || 0),
      engineeringScore: Math.max(existing.engineeringScore, progress.engineeringScore || 0),
      riskMatrixUsed: existing.riskMatrixUsed || progress.riskMatrixUsed,
      playgroundScore: Math.max(existing.playgroundScore, progress.playgroundScore || 0),
      ragUsed: existing.ragUsed || progress.ragUsed,
      vendorAudited: existing.vendorAudited || progress.vendorAudited,
      embeddingUsed: existing.embeddingUsed || progress.embeddingUsed,
      tokenizerUsed: existing.tokenizerUsed || progress.tokenizerUsed,
      biasAudited: existing.biasAudited || progress.biasAudited,
      redteamLvl1: existing.redteamLvl1 || progress.redteamLvl1,
      redteamLvl2: existing.redteamLvl2 || progress.redteamLvl2,
      warroomUsed: existing.warroomUsed || progress.warroomUsed,
      pipelineUsed: existing.pipelineUsed || progress.pipelineUsed,
      agentStudioCompleted: existing.agentStudioCompleted || progress.agentStudioCompleted,
      xaiCompleted: existing.xaiCompleted || progress.xaiCompleted,
      hitlCompleted: existing.hitlCompleted || progress.hitlCompleted,
    };

    memoryProgressStore.set(userId, mergedProgress);

    return NextResponse.json({ success: true, userId, progress: mergedProgress });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
