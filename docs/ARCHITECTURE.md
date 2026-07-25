# AI University System Architecture

This document provides a comprehensive technical overview of the **AI University** platform, including application framework, database schema, background pricing cache synchronization, authentication pipelines, and design system conventions.

---

## 🏗️ High-Level System Architecture

AI University is built as a single-repo Next.js 16 web application utilizing React 19, TypeScript, Prisma ORM, and NextAuth.js.

```mermaid
graph TD
    Client[Browser Frontend - React 19] --> AppRouter[Next.js 16 App Router]
    
    subgraph Frontend Pages & Simulators
        AppRouter --> LearnPages[/learn/[path] Learning Paths]
        AppRouter --> Simulators[Interactive Simulators / ReAct / RAG]
        AppRouter --> PolicyBuilder[/policy-builder Governance & Blueprint]
        AppRouter --> Tokenizer[/tokenizer Model Cost Simulator]
    end
    
    subgraph API Services
        AppRouter --> AuthAPI[/api/auth NextAuth OAuth]
        AppRouter --> PricingAPI[/api/models/pricing Live Rates & Cache]
        AppRouter --> ProgressAPI[/api/progress Learner Sync]
    end

    subgraph Data & Cache Layer
        PricingAPI --> ProviderAPI[External Live Providers - OpenRouter]
        PricingAPI --> PrismaDB[(Prisma MySQL / SQLite Database)]
        AuthAPI --> PrismaDB
        ProgressAPI --> PrismaDB
    end
```

---

## 📁 Directory Structure & Key Modules

```
ai-edu/
├── docs/                      # Comprehensive technical & governance documentation
│   ├── ARCHITECTURE.md        # Technical architecture overview (this file)
│   ├── DEVELOPER_GUIDE.md     # Developer setup, conventions, & contribution guide
│   ├── RELEASES_AND_DEPLOYMENT.md # Deployment manual (Laravel Forge, CI/CD, OAuth)
│   └── ai-gov-bp.md           # Research foundation for credit union AI governance
├── prisma/                    # Database models & schema migrations
│   └── schema.prisma          # User, Account, Session, ModelPrice schemas
├── public/                    # Static assets & public media
├── src/
│   ├── app/                   # Next.js 16 App Router pages & API routes
│   │   ├── api/               # Serverless API routes
│   │   │   ├── auth/          # NextAuth OAuth authentication handlers
│   │   │   ├── models/pricing # Database-backed model pricing with 24h background sync
│   │   │   └── progress/      # User progress tracking endpoint
│   │   ├── learn/[path]/      # Dynamic role-based learning paths & quizzes
│   │   ├── policy-builder/    # AI Policy & 6-Stage Operational Implementation Builder
│   │   ├── tokenizer/         # LLM Tokenizer & Model Cost Simulator
│   │   ├── simulator/         # ReAct agent trace with PII & HITL controls
│   │   ├── rag-sandbox/       # Policy RAG vector search visualizer
│   │   ├── embedding-visualizer/ # 2D semantic embedding vector space
│   │   ├── vendor-auditor/    # AI Vendor GLBA, SOC 2, ISO 42001 & AIUC-1 auditor
│   │   ├── bias-auditor/      # ECOA fair lending & zip code bias log auditor
│   │   ├── risk-matrix/       # Enterprise risk dial calculator
│   │   ├── playground/        # Prompt engineering lab & compliance evaluator
│   │   ├── glossary/          # Searchable AI-to-Credit-Union term dictionary
│   │   ├── globals.css        # Global CSS design tokens & glassmorphism theme
│   │   ├── layout.tsx         # Root layout with Header, Footer, & Providers
│   │   └── page.tsx           # Dashboard landing page & progress tracking
│   ├── components/            # Reusable UI components (Header, Footer, Navbar, Cards)
│   └── lib/                   # Shared utility modules & service layers
│       ├── db.ts              # Prisma Client instance with Laravel Forge URI normalizer
│       ├── modelPricingService.ts # Live provider fetcher & 24h background cache engine
│       └── authOptions.ts     # NextAuth configuration with Google & GitHub providers
```

---

## 🗄️ Database Schema & Prisma ORM

The application uses **Prisma Client** for database persistence (`prisma/schema.prisma`), supporting both SQLite (local development) and MySQL (Laravel Forge production):

### Key Models:
1. **`User` / `Account` / `Session` / `VerificationToken`**: NextAuth.js standard authentication models supporting Google and GitHub OAuth logins.
2. **`UserProgress`**: Tracks learner progress across 14 credentials, quiz scores, and certificate issue dates.
3. **`ModelPrice`**: Caches real-time LLM token pricing per 1,000,000 tokens (USD):
   ```prisma
   model ModelPrice {
     id            String   @id
     name          String
     provider      String
     inputPrice    Float    // USD per 1M prompt tokens
     outputPrice   Float    // USD per 1M completion tokens
     contextWindow String
     tier          String
     updatedAt     DateTime @updatedAt
   }
   ```

### Connection URI Normalization (`src/lib/db.ts`)
Laravel Forge provisions MySQL connections formatted as `mysql+ssh://user@host/db:pass@127.0.0.1/dbname`. To ensure seamless compatibility with Prisma without breaking connection parsers, `src/lib/db.ts` normalizes Forge SSH URIs into standard Prisma MySQL URIs (`mysql://user:pass@127.0.0.1:3306/dbname`) automatically at runtime.

---

## ⚡ Asynchronous Non-Blocking Pricing Cache Engine

The LLM Tokenizer & Model Cost Simulator (`/tokenizer`) retrieves real-time pricing for flagship models (GPT-4o, Claude 3.7/4.5 Sonnet, Gemini 2.5 Pro, DeepSeek-V4, Llama 3.3).

To guarantee zero latency for end-users, the pricing API (`src/app/api/models/pricing/route.ts`) operates on a **24-hour stale-while-revalidate background cache**:

1. **Instant Response (< 50ms):** When `/api/models/pricing` is called, it immediately queries `ModelPrice` records from the database and returns them to the client.
2. **24-Hour Stale Detection:** If the database records are older than 24 hours (or if `?force=true` is requested), an asynchronous background task (`syncLiveModelPricesToDatabase()`) is dispatched without holding up the HTTP response.
3. **Live Provider Synchronization:** The background service fetches raw prompt and completion rates from public provider feeds (`https://openrouter.ai/api/v1/models`), converts prices to per-1M token rates, and upserts them into the `ModelPrice` database table.

---

## 🔑 Authentication & NextAuth.js Callback Handling

Authentication is powered by **NextAuth.js** (`src/lib/authOptions.ts`).
- **OAuth Providers:** Google OAuth 2.0 and GitHub OAuth.
- **Provider Callback Normalization:** Handles callback URLs automatically across development (`http://localhost:3000/api/auth/callback/[provider]`) and production (`https://your-domain.com/api/auth/callback/[provider]`).
- **Session Strategy:** JWT-backed session tokens synced with Prisma database user records.

---

## 🎨 Styling & Design System

- **Vanilla CSS3:** Clean, framework-agnostic CSS design system defined in `src/app/globals.css`.
- **Theme:** Sleek dark glassmorphism layout with CSS custom properties (`--bg-primary`, `--card-bg`, `--primary`, `--border-color`, `--radius-md`).
- **Responsive Breakpoints:** Mobile-first responsive layouts supporting tablets, laptops, and desktop displays.
