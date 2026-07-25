# AI University: Credit Union Agentic AI Learning Platform

[![CI/CD Quality Pipeline](https://github.com/cilleyperson/ai-edu/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/cilleyperson/ai-edu/actions/workflows/ci.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](file:///c:/Users/jonat/dev-projects/ai-edu/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Styling: Vanilla CSS](https://img.shields.io/badge/Styling-Vanilla%20CSS-6366f1)](https://www.w3.org/Style/CSS/)
[![Industry: Credit Unions](https://img.shields.io/badge/Industry-Credit%20Unions-06b6d4)](#)
[![Compliance: NCUA | GLBA | ECOA](https://img.shields.io/badge/Compliance-NCUA%20%7C%20GLBA%20%7C%20ECOA-a855f7)](#-regulatory-alignment-reference)

AI University is a comprehensive, interactive web-based educational platform built specifically for credit union staff, executive leadership, compliance teams, and board members. The platform translates complex agentic AI concepts (such as ReAct execution loops, vector embeddings, token costs, and LLM explainability) into practical, credit union-specific analogies and operational tools aligned with federal regulatory expectations.

---

## 📚 Technical Documentation Index

For developers, system architects, and devops engineers:

- 🏛️ **[Technical Architecture Guide](file:///c:/Users/jonat/dev-projects/ai-edu/docs/ARCHITECTURE.md):** Deep-dive into Next.js 16 App Router structure, Prisma schema, database connection string normalization, and 24-hour background pricing cache engine.
- 💻 **[Developer Quick-Start Guide](file:///c:/Users/jonat/dev-projects/ai-edu/docs/DEVELOPER_GUIDE.md):** Environment setup, Prisma migrations, code conventions, Windows/PowerShell compatibility rules, and quality verification commands.
- 🚀 **[Releases & Deployment Manual](file:///c:/Users/jonat/dev-projects/ai-edu/docs/RELEASES_AND_DEPLOYMENT.md):** Laravel Forge deployment scripts, GitHub Actions CI/CD workflows, and OAuth registration setup.
- 📜 **[Credit Union AI Governance Research](file:///c:/Users/jonat/dev-projects/ai-edu/docs/ai-gov-bp.md):** Comprehensive research paper on NCUA 2026 Supervisory Priorities, CFPB Circular 2022-03, 2023 Interagency TPRM Guidance, ISO 42001, and AIUC-1 agent standards.

---

## 🌟 Key Platform Features

### 1. Dynamic Dashboard & Learning Progress Tracker
- **Categorized Navigation:** Grouped access to core learning paths, interactive sandbox tools, and compliance auditors.
- **Visual Progress Tracker:** Automatically tracks and unlocks 14 distinct credentials (e.g. *First Steps*, *AI Specialist*, *NCUA Guardian*, *Compliance Auditor*, *Platform Master*) with real-time `localStorage` window synchronization.

### 2. Tailored Role-Based Learning Paths (`/learn/[path]`)
- **Staff Path:** Focuses on prompting parameters, PII privacy boundaries, and customer-first service tone.
- **Management Path:** Focuses on Retrieval-Augmented Generation (RAG) manuals, Return on Investment (ROI), and operational control parameters.
- **Board Path:** Details regulatory mandates (NCUA 2026 Supervisory Priorities), fiduciary duties, and bias assessments.
- **InfoSec Path:** Covers voice cloning, deepfakes, spear phishing social engineering, and zero-trust verification procedures.
- **IT & Engineering Path:** Examines RAG secure namespaces, prompt injection delimiter sandboxing, and safe tool calling policies.
- **Interactive Confetti Quizzes:** End-of-path knowledge validation quizzes with instant grading and explanation panels.

### 3. AI Policy & 6-Stage Operational Implementation Builder (`/policy-builder`)
- **NCUA 2026 Aligned Policy Generator:** Creates customized, publication-ready AI Governance Policies compliant with CFPB Circular 2022-03, 2023 Interagency TPRM rules, and ISO 42001 standards.
- **Draft 6-Stage Operational Blueprint Plan Generator:** Automatically generates detailed execution plans for AI Asset Inventory, Regulatory Mapping Matrix, Vendor TPRM Gap Assessment, Architectural Telemetry Specs, Board Governance Chartering, and Continuous Fair Lending Revalidation Runbooks.
- **Multi-Format Export:** Switch between viewing Policy, 6-Stage Operational Roadmap, or Combined Package, with instant Markdown download and printable PDF export capabilities.

### 4. LLM Tokenizer & Database-Backed Model Price Simulator (`/tokenizer`)
- Text parser splitting queries into color-coded word chunks.
- Estimates execution costs across flagship models (GPT-4o, Claude 3.7/4.5 Sonnet, Gemini 2.5 Pro, DeepSeek-V4, Llama 3.3).
- **Asynchronous 24h Background Auto-Refresh:** Backed by database storage (`ModelPrice`) with non-blocking live provider rate syncing via `/api/models/pricing`.

### 5. Vector Embedding Visualizer (`/embedding-visualizer`)
- Interactive 2D coordinate plane mapping semantic relationships between prompts and documents.
- Models Euclidean distance calculations, coordinate plotting, and nearest-neighbor clustering (Auto Loans, Mortgages, Savings).

### 6. Agent Sandbox Simulator (`/simulator`)
- Interactive trace visualizing a virtual assistant's **ReAct (Reasoning + Action) execution loop**.
- **Interactive Toggles:** Toggle PII scrubbers (regex scrubbing of SSNs, account numbers) and Human-in-the-Loop (HITL) gates.

### 7. Prompt Engineering Lab (`/playground`)
- System prompt builder for Member Service Representative (MSR) bots.
- **Evaluation Scans:** Semantic grader scoring prompts across *Tone & Empathy*, *PII Masking Compliance*, and *Operational Policy Accuracy*.

### 8. Policy RAG Visualizer (`/rag-sandbox`)
- Interactive trace modeling **Retrieval-Augmented Generation (RAG)**.
- Load pre-configured manual sections (Reg CC holds, BSA CIP identity checks) or paste custom policies.
- Traces paragraph chunking, vector match similarity scores, context envelopes, and grounded text generation.

### 9. Credit Union Risk Matrix (`/risk-matrix`)
- Risk grading form evaluating operational, compliance, reputation, and cybersecurity exposures.
- Computes weighted risk dials and formats printable risk assessment logs.

### 10. AI Vendor Governance Auditor (`/vendor-auditor`)
- Diligence checklist aligned with GLBA security standards, SOC 2 audits, ISO 42001, and AIUC-1 agent standards.
- Calculates overall contract compliance grades (A, B, C, F) and outputs legal/data isolation gap reports.

### 11. Bias & Hallucination Auditor (`/bias-auditor`)
- Log auditor examining system outputs for Fair Lending (ECOA) zip code redlining, CD interest rate hallucinations, and SSN leaks.

### 12. Searchable AI Glossary (`/glossary`)
- Searchable database mapping complex AI terminology to clear credit union analogies.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router, static site rendering & serverless API routes)
- **Runtime:** Node.js
- **Database:** Prisma ORM (SQLite for dev, MySQL with Laravel Forge `mysql+ssh://` support for production)
- **Authentication:** NextAuth.js (Google OAuth 2.0 & GitHub OAuth)
- **Styling:** Vanilla CSS3 (Custom design system tokens, dark glassmorphism layout)
- **Icons:** Lucide React
- **Effects:** Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/cilleyperson/ai-edu.git
cd ai-edu

# 2. Install dependencies
npm install

# 3. Setup environment & database
cp .env.example .env.local
npx prisma generate
npx prisma db push

# 4. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏁 Quality Verification

Ensure code quality and compilation alignment by running:

```bash
# Linter check
npm run lint

# TypeScript & Production compilation build
npm run build
```

---

## 📜 Regulatory Alignment Reference
- **NCUA 2026 Supervisory Priorities & CAIO Directives** (OMB M-25-21, AI in Government Act 2020)
- **CFPB Circular 2022-03** (Algorithmic Adverse Action & ECOA Reg B explainability)
- **2023 Interagency Guidance on Third-Party Relationships** (TPRM lifecycle oversight)
- **CFPB Chatbot Guidance & CFPA Section 1036** (UDAAP prevention, Reg E/Z dispute escalations)
- **NIST AI RMF 1.0 & COSO ERM** (Govern, Map, Measure, Manage)
- **ISO 42001 & AIUC-1** (AI Management System & AI agent standards)

---

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](file:///c:/Users/jonat/dev-projects/ai-edu/LICENSE) file for details.
