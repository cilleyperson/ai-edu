"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Award } from "lucide-react";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizComponentProps {
  pathId: "staff" | "management" | "board" | "infosec";
  questions: Question[];
}

export default function QuizComponent({ pathId, questions }: QuizComponentProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setIsAnswered(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // End of quiz
      setShowResults(true);
      
      const finalScorePercentage = Math.round((score / questions.length) * 100);
      
      // Save completion to localStorage
      localStorage.setItem(`cu_ai_progress_${pathId}`, "completed");
      
      // Update score in storage if it is higher than the previous high score
      const prevHighScore = parseInt(localStorage.getItem(`cu_ai_score_${pathId}`) || "0", 10);
      if (finalScorePercentage > prevHighScore) {
        localStorage.setItem(`cu_ai_score_${pathId}`, finalScorePercentage.toString());
      }

      // Dispatch custom event to let other components update immediately
      window.dispatchEvent(new Event("progressUpdated"));

      // Trigger Confetti celebration!
      if (finalScorePercentage >= 70) {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const finalScorePercentage = Math.round((score / questions.length) * 100);

  if (showResults) {
    const passed = finalScorePercentage >= 70;
    return (
      <div className="card text-center animate-fade-in-up" style={{ padding: "40px 24px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "var(--radius-full)",
            background: passed ? "var(--success-glow)" : "var(--danger-glow)",
            color: passed ? "var(--success)" : "var(--danger)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
          }}
        >
          <Award style={{ width: 44, height: 44 }} />
        </div>
        <h2 style={{ fontSize: "2rem", marginBottom: "8px" }} className="gradient-text">
          {passed ? "Certification Unlocked!" : "Quiz Completed"}
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
          {passed
            ? `Fantastic work! You scored ${finalScorePercentage}% and have earned your path credential.`
            : `You scored ${finalScorePercentage}%. Keep reading the materials and try again to achieve the 70% passing score.`}
        </p>

        <div
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            color: passed ? "var(--success)" : "var(--warning)",
            marginBottom: "24px",
          }}
        >
          {score} / {questions.length}
        </div>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button onClick={handleRestart} className="btn btn-secondary">
            <RotateCcw style={{ width: 16, height: 16 }} />
            <span>Retake Quiz</span>
          </button>
          {passed && (
            <Link href="/" className="btn btn-primary">
              <span>View Dashboard</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in-up" style={{ padding: "30px", maxWidth: "650px", margin: "30px auto" }}>
      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, color: "var(--primary)" }}>
          Knowledge Check — {pathId} path
        </span>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Question <strong>{currentIdx + 1}</strong> of {questions.length}
        </span>
      </div>

      {/* Progress Dots */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
        {questions.map((_, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "var(--radius-full)",
              backgroundColor:
                idx === currentIdx
                  ? "var(--primary)"
                  : idx < currentIdx
                  ? "var(--success)"
                  : "rgba(255, 255, 255, 0.08)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Question */}
      <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "20px" }}>
        {currentQuestion.question}
      </h3>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrectAnswer = idx === currentQuestion.correctIndex;
          
          const optionStyle: React.CSSProperties = {
            padding: "16px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            cursor: "pointer",
            textAlign: "left",
            fontSize: "0.95rem",
            fontWeight: 500,
            transition: "all 0.2s ease",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          };

          if (!isAnswered) {
            // Hover styles handled in CSS
          } else {
            // After answer is revealed
            optionStyle.cursor = "not-allowed";
            if (isCorrectAnswer) {
              optionStyle.borderColor = "var(--success)";
              optionStyle.backgroundColor = "var(--success-glow)";
            } else if (isSelected) {
              optionStyle.borderColor = "var(--danger)";
              optionStyle.backgroundColor = "var(--danger-glow)";
            } else {
              optionStyle.opacity = 0.5;
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleOptionClick(idx)}
              style={optionStyle}
              className={`quiz-option ${!isAnswered ? "quiz-option-hoverable" : ""}`}
            >
              <span>{option}</span>
              {isAnswered && isCorrectAnswer && <CheckCircle2 style={{ width: 20, height: 20, color: "var(--success)", flexShrink: 0 }} />}
              {isAnswered && isSelected && !isCorrectAnswer && <XCircle style={{ width: 20, height: 20, color: "var(--danger)", flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {isAnswered && (
        <div
          className="animate-fade-in-up"
          style={{
            padding: "16px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderLeft: `4px solid ${selectedIdx === currentQuestion.correctIndex ? "var(--success)" : "var(--warning)"}`,
            marginBottom: "24px",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
          }}
        >
          <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
            {selectedIdx === currentQuestion.correctIndex ? "✓ Correct!" : "✗ Incorrect"}
          </strong>
          {currentQuestion.explanation}
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {isAnswered && (
          <button onClick={handleNext} className="btn btn-primary">
            <span>{currentIdx < questions.length - 1 ? "Next Question" : "Finish Quiz"}</span>
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>

      <style jsx global>{`
        .quiz-option-hoverable:hover {
          background-color: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
