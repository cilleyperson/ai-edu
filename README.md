# AI University: Credit Union Agentic AI Learning Platform

[![CI/CD Quality Pipeline](https://github.com/cilleyperson/ai-edu/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/cilleyperson/ai-edu/actions/workflows/ci.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](file:///c:/Users/jonat/dev-projects/ai-edu/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Styling: Vanilla CSS](https://img.shields.io/badge/Styling-Vanilla%20CSS-6366f1)](https://www.w3.org/Style/CSS/)
[![Industry: Credit Unions](https://img.shields.io/badge/Industry-Credit%20Unions-06b6d4)](#)
[![Compliance: NCUA | GLBA | ECOA](https://img.shields.io/badge/Compliance-NCUA%20%7C%20GLBA%20%7C%20ECOA-a855f7)](#-regulatory-alignment-reference)

AI University is a comprehensive, interactive, web-based educational portal built specifically for credit union staff, management, and board members. The platform translates complex agentic AI concepts (such as ReAct loops, vector search, and token costs) into practical, credit union-specific analogies and workflows, ensuring financial institutions can deploy AI safely, ethically, and in alignment with regulatory guidelines.

---

## 🌟 Key Features

### 1. Grouped Navigation & Dynamic Progress Tracker
- **Categorized Dashboard:** Consolidates learning modules, interactive sandbox spaces, and governance matrices.
- **Visual Progress Tracker:** Tracks and unlocks 14 distinct credentials (e.g. *First Steps*, *AI Specialist*, *Strategic Architect*, *NCUA Guardian*, *Prompt Expert*, *RAG Engineer*, *Embedding Analyst*, *Token Architect*, *Risk Analyst*, *Vendor Auditor*, *Compliance Auditor*, *Zero-Trust Sentinel*, *Security Architect*, *Platform Master*) stored in `localStorage` with automated window sync triggers.

### 2. Targeted Learning Paths & Confetti Quizzes (`/learn/[path]`)
- **Staff Path:** Focuses on prompting parameters, PII privacy boundaries, and customer-first service tone.
- **Management Path:** Focuses on Retrieval-Augmented Generation (RAG) manuals, Return on Investment (ROI), and operational control parameters.
- **Board Path:** Details regulatory mandates (NCUA Letter to Credit Unions 22-CU-05), fiduciary duties, and bias assessments.
- **InfoSec Path:** Covers voice cloning, deepfakes, spear phishing social engineering, and zero-trust verification procedures.
- **IT & Engineering Path:** Examines RAG secure namespaces, prompt injection delimiter sandboxing, and safe tool calling policies.
- **Interactive Quizzes:** End-of-path quizzes validating knowledge with instant grading feedback, explanation panels, and celebration confetti.

### 3. Vector Embedding Visualizer (`/embedding-visualizer`)
- Interactive 2D coordinate plane mapping semantic relationships between prompts and documents.
- Models Euclidean distance calculations, coordinate plotting, and nearest-neighbor clustering (Auto Loans, Mortgages, Savings).

### 4. LLM Tokenizer & Cost Calculator (`/tokenizer`)
- Text parser splitting queries into color-coded word chunks.
- Estimates execution costs across GPT-4, Claude, and Llama models, demonstrating the budget bloat of raw RAG manuals.

### 5. Agent Sandbox Simulator (`/simulator`)
- Interactive trace visualizing a virtual assistant's **ReAct (Reasoning + Action) execution loop**.
- **Interactive Toggles:** Toggle PII scrubbers (regex scrubbing of SSNs, account numbers) and Human-in-the-Loop (HITL) gates.
- Pauses execution for manager authorization when checking databases or waiving transaction fees.

### 6. Prompt Engineering Lab (`/playground`)
- A system prompt builder for a front-office Member Service Representative (MSR) bot.
- **Evaluation Scans:** Semantic grader scoring prompts across *Tone & Empathy*, *PII Masking Compliance*, and *Operational Policy Accuracy*.
- **Test Sandbox:** Executes prompts against aggressive requests, prompt injection override attempts, and policy inquiries.

### 7. Policy RAG Visualizer (`/rag-sandbox`)
- Interactive trace modeling **Retrieval-Augmented Generation (RAG)**.
- Load pre-configured manual sections (Reg CC holds, BSA CIP identity checks) or paste custom policies.
- Traces paragraph chunking, vector match similarity scores, context envelopes, and grounded text generation.

### 8. Credit Union Risk Matrix (`/risk-matrix`)
- Risk grading form evaluating operational, compliance, reputation, and cybersecurity exposures.
- Computes weighted risk dials and formats printable risk assessment logs.

### 9. AI Vendor Governance Auditor (`/vendor-auditor`)
- Diligence checklist aligned with GLBA security standards and SOC 2 audits.
- Calculates overall contract compliance grades (A, B, C, F), outputs legal/data isolation gaps, and prepares printable briefing documents for board meetings.

### 10. Bias & Hallucination Auditor (`/bias-auditor`)
- Log auditor examining system outputs for Fair Lending (ECOA) zip code redlining, CD interest rate hallucinations, and SSN leaks.
- Generates official compliance clearance reports.

### 11. AI Policy Builder (`/policy-builder`)
- An interactive tabbed wizard generating a customized credit-union-compliant AI Acceptable Use Policy.
- Select institutional profile (asset size, jurisdiction), authorize specific use cases (chatbot, underwriting, fraud, marketing, doc processing), configure governance rules (AI liaison role, review frequency), and set security controls (public model access, PII limits, HITL requirements).
- Allows previewing, printing, and downloading the finalized policy document.

### 12. Glossary (`/glossary`)
- Searchable database mapping complex AI terminology to clear credit union analogies (e.g. comparing LLM weights to loan underwriting guides, and vector search to file drawer indexing).

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router, static site rendering optimized)
- **Runtime:** Node.js
- **Styling:** Vanilla CSS3 (Custom design system tokens, dark glassmorphism layout, responsive breakpoints)
- **Icons:** Lucide React
- **Effects:** Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/cilleyperson/ai-edu.git
   cd ai-edu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🏁 Quality Verification

Ensure code quality and layout alignment by running validation commands:

- **TypeScript and Production Compilation:**
  ```bash
  npm run build
  ```
- **Linter (TypeScript and Syntax styling checks):**
  ```bash
  npm run lint
  ```

---

## 📜 Regulatory Alignment Reference
- **NCUA Letter to Credit Unions 22-CU-05** (Fiduciary AI Risk Management)
- **GLBA (Gramm-Leach-Bliley Act)** (Financial privacy & member data protections)
- **ECOA (Equal Credit Opportunity Act)** (Fair lending algorithmic bias requirements)

---

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](file:///c:/Users/jonat/dev-projects/ai-edu/LICENSE) file for details.

