// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";
import { useTheme, ThemeMode } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: "system", label: "System", icon: Laptop },
    { mode: "dark", label: "Dark", icon: Moon },
    { mode: "light", label: "Light", icon: Sun },
  ];

  const CurrentIcon = resolvedTheme === "light" ? Sun : Moon;

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary"
        style={{
          padding: "6px 10px",
          fontSize: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid var(--border-color)",
          color: "var(--text-secondary)",
        }}
        aria-label="Select theme mode"
      >
        <CurrentIcon style={{ width: 14, height: 14, color: resolvedTheme === "light" ? "#f59e0b" : "var(--primary)" }} />
        <span style={{ textTransform: "capitalize", fontSize: "0.8rem" }}>{theme}</span>
        <ChevronDown style={{ width: 12, height: 12, opacity: 0.6 }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            width: "140px",
            background: "var(--surface-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "4px",
            boxShadow: "var(--shadow-lg)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
          className="animate-fade-in-up"
        >
          {options.map(({ mode, label, icon: Icon }) => {
            const isSelected = theme === mode;
            return (
              <button
                key={mode}
                onClick={() => {
                  setTheme(mode);
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 10px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  backgroundColor: isSelected ? "var(--surface-hover)" : "transparent",
                  color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: isSelected ? 600 : 400,
                  width: "100%",
                  textAlign: "left",
                  transition: "background 0.15s ease",
                }}
              >
                <Icon style={{ width: 14, height: 14, color: isSelected ? "var(--primary)" : "inherit" }} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
