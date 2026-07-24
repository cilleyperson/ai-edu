// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

export interface OAuthUserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  provider: string;
}

export function getOAuthAuthUrl(provider: string, baseUrl: string): string | null {
  const redirectUri = `${baseUrl}/api/auth/callback/${provider}`;

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) return null;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  if (provider === "github") {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) return null;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "read:user user:email",
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  if (provider === "microsoft") {
    const clientId = process.env.AZURE_AD_CLIENT_ID || process.env.MICROSOFT_CLIENT_ID;
    const tenantId = process.env.AZURE_AD_TENANT_ID || "common";
    if (!clientId) return null;
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      response_mode: "query",
      scope: "openid profile email User.Read",
    });
    return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  return null;
}

export async function processOAuthCallback(
  provider: string,
  code: string,
  baseUrl: string
): Promise<OAuthUserProfile | null> {
  const redirectUri = `${baseUrl}/api/auth/callback/${provider}`;

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;

    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return null;

    // Fetch user profile
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await userRes.json();

    return {
      id: profile.id || `google_${Date.now()}`,
      name: profile.name || profile.email?.split("@")[0] || "Google User",
      email: profile.email || "user@google.com",
      image: profile.picture,
      provider: "google",
    };
  }

  if (provider === "github") {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return null;

    // Fetch user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "AI-University-App",
      },
    });
    const profile = await userRes.json();

    // Fetch primary email if profile email is null
    let email = profile.email;
    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "AI-University-App",
        },
      });
      const emails = await emailRes.json();
      if (Array.isArray(emails)) {
        const primary = emails.find((e: { primary: boolean }) => e.primary) || emails[0];
        email = primary?.email;
      }
    }

    return {
      id: String(profile.id),
      name: profile.name || profile.login || "GitHub User",
      email: email || `${profile.login}@users.noreply.github.com`,
      image: profile.avatar_url,
      provider: "github",
    };
  }

  if (provider === "microsoft") {
    const clientId = process.env.AZURE_AD_CLIENT_ID || process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.AZURE_AD_CLIENT_SECRET || process.env.MICROSOFT_CLIENT_SECRET;
    const tenantId = process.env.AZURE_AD_TENANT_ID || "common";
    if (!clientId || !clientSecret) return null;

    const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return null;

    const userRes = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await userRes.json();

    return {
      id: profile.id || `ms_${Date.now()}`,
      name: profile.displayName || profile.givenName || "Microsoft User",
      email: profile.mail || profile.userPrincipalName || "user@microsoft.com",
      provider: "microsoft",
    };
  }

  return null;
}
