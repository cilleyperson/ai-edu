// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { NextResponse } from "next/server";
import { processOAuthCallback } from "@/lib/oauth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const baseUrl = process.env.NEXTAUTH_URL || url.origin;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=Missing+authorization+code`);
  }

  try {
    const userProfile = await processOAuthCallback(provider, code, baseUrl);

    if (!userProfile) {
      return NextResponse.redirect(`${baseUrl}/?auth_error=OAuth+authentication+failed`);
    }

    // Redirect to home with authenticated session params so client hydrates session
    const redirectUrl = new URL("/", baseUrl);
    redirectUrl.searchParams.set("auth_success", "true");
    redirectUrl.searchParams.set("user_id", userProfile.id);
    redirectUrl.searchParams.set("user_name", userProfile.name);
    redirectUrl.searchParams.set("user_email", userProfile.email);
    redirectUrl.searchParams.set("user_provider", userProfile.provider);
    if (userProfile.image) {
      redirectUrl.searchParams.set("user_image", userProfile.image);
    }

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("cu_ai_auth_session", JSON.stringify(userProfile), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    return NextResponse.redirect(
      `${baseUrl}/?auth_error=${encodeURIComponent((error as Error).message)}`
    );
  }
}
