# AI University Developer Guide & Conventions

This guide provides instructions for setting up your local development environment, contributing code, managing database models, writing components, and running quality verification checks.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: v2.30 or higher

### 2. Initial Setup
```bash
# 1. Clone repository
git clone https://github.com/cilleyperson/ai-edu.git
cd ai-edu

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env.local
```

### 3. Database Initialization & Prisma CLI
```bash
# Generate Prisma Client TypeScript definitions
npx prisma generate

# Push database schema to local SQLite database (dev)
npx prisma db push
```

### 4. Running Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🛠️ Project Conventions & Coding Standards

### 1. Framework & Core Technologies
- **Next.js 16 App Router**: Place page routes in `src/app/<route>/page.tsx` and serverless API endpoints in `src/app/api/<route>/route.ts`.
- **Vanilla CSS Styling**: Use design system CSS custom properties from `src/app/globals.css` rather than ad-hoc inline styles or utility classes.
- **Icons**: Import vector icons from `lucide-react`.

### 2. Client vs. Server Components
- Interactive pages using React hooks (`useState`, `useEffect`, `useCallback`) must include the `"use client";` directive at the top of the file.
- API route handlers (`route.ts`) must export standard async HTTP method functions (`GET`, `POST`, `PUT`, `DELETE`).

### 3. Database Access & Connection Safety
- Always import `db` from `@/lib/db`.
- `src/lib/db.ts` handles global Prisma Client instantiation to prevent connection leaks during Next.js Hot Module Replacement (HMR).

### 4. Windows / PowerShell Guidelines
When writing or executing scripts on Windows:
- **Brackets in Paths:** Next.js dynamic route paths often contain brackets (e.g. `[path]`). PowerShell cmdlets treat brackets as wildcards when using `-Path`. Always use `-LiteralPath` instead.
- **File Reading/Writing:** For cross-version PowerShell file manipulation, prefer direct .NET APIs:
  - Read: `[System.IO.File]::ReadAllText($filePath)`
  - Write: `[System.IO.File]::WriteAllText($filePath, $content)`

---

## 🏁 Code Quality & Build Verification

Before submitting pull requests or pushing commits, execute quality verification commands:

```bash
# 1. ESLint & Syntax Validation
npm run lint

# 2. Production TypeScript Compilation & Next.js Build
npm run build
```

---

## 📦 Adding a New Interactive Learning Module

To add a new tool or interactive simulator to AI University:

1. **Create Page Component:** Add `src/app/my-new-tool/page.tsx`.
2. **Add Component Icons & UI:** Structure using standard `.card`, `.section`, `.btn`, and `.container` CSS classes.
3. **Register Navigation:**
   - Add to `src/components/Header.tsx` navigation menu.
   - Add to `src/components/CommandPalette.tsx` for quick search access (`Ctrl+K` / `Cmd+K`).
   - Add card entry to dashboard grid in `src/app/page.tsx`.
4. **Run Verification:** Execute `npm run lint` and `npm run build`.
