# Project Instructions for AI Coding Agents

This file provides instructions and context for AI coding agents working on the **AI University** platform.

---

## Quick Reference Commands

```bash
# Development Server
npm run dev

# Quality Gates (Must pass clean with 0 errors/warnings)
npm run lint
npm run build

# Prisma Database Commands
npx prisma generate
npx prisma db push
```

---

## Key Architecture Overview

- **Framework**: Next.js 16 (App Router), React 19, TypeScript.
- **Database**: Prisma Client (`prisma/schema.prisma`), supporting SQLite (local dev) and MySQL (production via Laravel Forge). Connection URI is normalized in `src/lib/db.ts` to handle Laravel Forge `mysql+ssh://` strings.
- **Live Model Pricing Cache**: `/api/models/pricing` serves cached database prices (`ModelPrice`) instantly (< 50ms) and asynchronously triggers background refresh if data is older than 24 hours via `src/lib/modelPricingService.ts`.
- **Authentication**: NextAuth.js (`src/lib/authOptions.ts`) supporting Google OAuth and GitHub OAuth.
- **Styling**: Vanilla CSS custom properties in `src/app/globals.css`.

---

## Documentation Index

For detailed architectural and deployment context:
- `docs/ARCHITECTURE.md` - Technical architecture & module structure
- `docs/DEVELOPER_GUIDE.md` - Setup, Prisma, & coding conventions
- `docs/RELEASES_AND_DEPLOYMENT.md` - Laravel Forge, CI/CD, & OAuth setup
- `docs/ai-gov-bp.md` - Research paper on credit union AI governance

---

## Windows / PowerShell Guidelines

When writing or executing PowerShell commands or scripts:

1. **Brackets in Paths (Wildcard Prevention)**:
   - Next.js dynamic routes contain brackets (e.g., `[path]`). PowerShell cmdlets (like `Get-Content`, `Set-Content`, `Remove-Item`) treat brackets as wildcards by default when using `-Path`.
   - **Always use `-LiteralPath` instead of `-Path`** to prevent wildcard expansion errors when manipulating files.

2. **Cross-Version PowerShell Compatibility**:
   - Parameters like `-Raw` or `-NoNewline` are not supported in older PowerShell versions.
   - For robust file reading and writing across all PowerShell versions, prefer using direct .NET APIs:
     - Read entire file: `[System.IO.File]::ReadAllText($filePath)`
     - Write entire file: `[System.IO.File]::WriteAllText($filePath, $content)`
