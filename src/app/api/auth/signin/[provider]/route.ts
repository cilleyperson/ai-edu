// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { NextResponse } from "next/server";
import { getOAuthAuthUrl } from "@/lib/oauth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const url = new URL(request.url);
  const baseUrl = (process.env.NEXTAUTH_URL || url.origin).trim().replace(/\/+$/, "");

  const authUrl = getOAuthAuthUrl(provider, baseUrl);

  if (authUrl) {
    return NextResponse.redirect(authUrl);
  }

  // If environment variables are not configured for this provider, inform the user
  return NextResponse.redirect(
    `${baseUrl}/?auth_error=${encodeURIComponent(`Missing client credentials for ${provider}`)}`
  );
}
