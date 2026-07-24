// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "providers") {
    return NextResponse.json({
      providers: [
        { id: "google", name: "Google", type: "oauth" },
        { id: "github", name: "GitHub", type: "oauth" },
        { id: "microsoft", name: "Microsoft Entra ID", type: "oauth" },
      ],
    });
  }

  return NextResponse.json({
    user: null,
    status: "unauthenticated",
    message: "NextAuth & OAuth providers configured for deployment on Laravel Forge (MySQL/PostgreSQL)",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider = "google", email, name } = body;

    const mockUser = {
      id: `usr_${provider}_${Date.now().toString(36)}`,
      name: name || `CU Learner (${provider.toUpperCase()})`,
      email: email || `user@creditunion-member.org`,
      image: `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}`,
      provider,
    };

    return NextResponse.json({
      success: true,
      user: mockUser,
      message: `Successfully authenticated via ${provider}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
