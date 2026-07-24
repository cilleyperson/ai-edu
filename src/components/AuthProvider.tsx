// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  provider: string;
  image?: string;
}

interface AuthContextType {
  user: UserSession | null;
  status: "authenticated" | "unauthenticated" | "loading";
  login: (provider: "google" | "github" | "microsoft", customEmail?: string) => Promise<void>;
  logout: () => void;
  syncCloudProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "unauthenticated",
  login: async () => {},
  logout: () => {},
  syncCloudProgress: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");

  useEffect(() => {
    const stored = localStorage.getItem("cu_ai_user_session");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(parsed);
        setStatus("authenticated");
      } catch {
        localStorage.removeItem("cu_ai_user_session");
        setStatus("unauthenticated");
      }
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const login = async (provider: "google" | "github" | "microsoft", customEmail?: string) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/auth/nextauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          email: customEmail || `cu_member@${provider}.org`,
          name: `${provider.toUpperCase()} Credit Union Member`,
        }),
      });

      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        setStatus("authenticated");
        localStorage.setItem("cu_ai_user_session", JSON.stringify(data.user));

        // Auto-trigger cloud sync on login
        await triggerSync(data.user.id);
        window.dispatchEvent(new Event("progressUpdated"));
      }
    } catch {
      setStatus("unauthenticated");
    }
  };

  const logout = () => {
    setUser(null);
    setStatus("unauthenticated");
    localStorage.removeItem("cu_ai_user_session");
    window.dispatchEvent(new Event("progressUpdated"));
  };

  const triggerSync = async (userId: string) => {
    // Read local progress from localStorage
    const localPayload = {
      staff: localStorage.getItem("cu_ai_progress_staff") === "completed",
      management: localStorage.getItem("cu_ai_progress_management") === "completed",
      board: localStorage.getItem("cu_ai_progress_board") === "completed",
      infosec: localStorage.getItem("cu_ai_progress_infosec") === "completed",
      engineering: localStorage.getItem("cu_ai_progress_engineering") === "completed",
      staffScore: parseInt(localStorage.getItem("cu_ai_score_staff") || "0", 10),
      managementScore: parseInt(localStorage.getItem("cu_ai_score_management") || "0", 10),
      boardScore: parseInt(localStorage.getItem("cu_ai_score_board") || "0", 10),
      infosecScore: parseInt(localStorage.getItem("cu_ai_score_infosec") || "0", 10),
      engineeringScore: parseInt(localStorage.getItem("cu_ai_score_engineering") || "0", 10),
      riskMatrixUsed: localStorage.getItem("cu_ai_risk_completed") === "true",
      playgroundScore: parseInt(localStorage.getItem("cu_ai_score_playground") || "0", 10),
      ragUsed: localStorage.getItem("cu_ai_rag_used") === "true",
      vendorAudited: localStorage.getItem("cu_ai_vendor_audited") === "true",
      embeddingUsed: localStorage.getItem("cu_ai_progress_embeddings") === "completed",
      tokenizerUsed: localStorage.getItem("cu_ai_progress_tokenizer") === "completed",
      biasAudited: localStorage.getItem("cu_ai_progress_bias") === "completed",
      redteamLvl1: localStorage.getItem("cu_ai_redteam_lvl1") === "completed",
      redteamLvl2: localStorage.getItem("cu_ai_redteam_lvl2") === "completed",
      warroomUsed: localStorage.getItem("cu_ai_warroom_completed") === "completed",
      pipelineUsed: localStorage.getItem("cu_ai_pipeline_completed") === "completed",
      agentStudioCompleted: localStorage.getItem("cu_ai_agent_studio_completed") === "completed",
      xaiCompleted: localStorage.getItem("cu_ai_xai_completed") === "completed",
      hitlCompleted: localStorage.getItem("cu_ai_hitl_completed") === "completed",
    };

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, progress: localPayload }),
      });
      const data = await res.json();
      if (data.success && data.progress) {
        // Write merged back to local storage
        const p = data.progress;
        if (p.staff) localStorage.setItem("cu_ai_progress_staff", "completed");
        if (p.management) localStorage.setItem("cu_ai_progress_management", "completed");
        if (p.board) localStorage.setItem("cu_ai_progress_board", "completed");
        if (p.infosec) localStorage.setItem("cu_ai_progress_infosec", "completed");
        if (p.engineering) localStorage.setItem("cu_ai_progress_engineering", "completed");
        if (p.staffScore) localStorage.setItem("cu_ai_score_staff", p.staffScore.toString());
        if (p.managementScore) localStorage.setItem("cu_ai_score_management", p.managementScore.toString());
        if (p.boardScore) localStorage.setItem("cu_ai_score_board", p.boardScore.toString());
        if (p.infosecScore) localStorage.setItem("cu_ai_score_infosec", p.infosecScore.toString());
        if (p.engineeringScore) localStorage.setItem("cu_ai_score_engineering", p.engineeringScore.toString());
        if (p.riskMatrixUsed) localStorage.setItem("cu_ai_risk_completed", "true");
        if (p.playgroundScore) localStorage.setItem("cu_ai_score_playground", p.playgroundScore.toString());
        if (p.ragUsed) localStorage.setItem("cu_ai_rag_used", "true");
        if (p.vendorAudited) localStorage.setItem("cu_ai_vendor_audited", "true");
        if (p.embeddingUsed) localStorage.setItem("cu_ai_progress_embeddings", "completed");
        if (p.tokenizerUsed) localStorage.setItem("cu_ai_progress_tokenizer", "completed");
        if (p.biasAudited) localStorage.setItem("cu_ai_progress_bias", "completed");
        if (p.redteamLvl1) localStorage.setItem("cu_ai_redteam_lvl1", "completed");
        if (p.redteamLvl2) localStorage.setItem("cu_ai_redteam_lvl2", "completed");
        if (p.warroomUsed) localStorage.setItem("cu_ai_warroom_completed", "completed");
        if (p.pipelineUsed) localStorage.setItem("cu_ai_pipeline_completed", "completed");
        if (p.agentStudioCompleted) localStorage.setItem("cu_ai_agent_studio_completed", "completed");
        if (p.xaiCompleted) localStorage.setItem("cu_ai_xai_completed", "completed");
        if (p.hitlCompleted) localStorage.setItem("cu_ai_hitl_completed", "completed");
      }
    } catch {
      // Offline fallback
    }
  };

  const syncCloudProgress = async () => {
    if (user) {
      await triggerSync(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, status, login, logout, syncCloudProgress }}>
      {children}
    </AuthContext.Provider>
  );
}
