# Deployment & Release Management Guide

This document outlines deployment procedures, CI/CD pipelines, git branching workflows, and OAuth registration requirements for deploying **AI University** to production environments (such as Laravel Forge).

---

## 🚀 Branching Strategy & Git Workflow

AI University adheres to a clean 3-tier git branching strategy:

```
[feature/*]  ---> (Pull Request / Merge) --->  [dev]  ---> (Production Release) --->  [main]
```

1. **`feature/*` Branches:** All feature development, bug fixes, and documentation work must occur on dedicated feature branches (e.g. `feature/db-live-model-pricing`).
2. **`dev` Branch:** Integration branch for testing and CI validation. All completed features are merged into `dev`.
3. **`main` Branch:** Production deployment branch. Changes are merged from `dev` to `main` when verified.

---

## 🌐 Production Deployment on Laravel Forge

AI University is designed for seamless deployment on **Laravel Forge** running Node.js / Next.js server applications.

### 1. Environment Variables Configuration
In your Forge Site Environment settings, configure the following environment variables:

```env
# Application URLs
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-strong-random-secret-key"

# Database Connection (Laravel Forge MySQL)
DATABASE_URL="mysql+ssh://forge@YOUR_FORGE_IP/forge:password@127.0.0.1/forge?name=ai-edu&usePrivateKey=true"

# OAuth Authentication Credentials
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-oauth-client-id"
GITHUB_SECRET="your-github-oauth-client-secret"
```

### 2. Forge Build & Deploy Script
In Forge Site Deploy Script, configure the following non-interactive deployment commands:

```bash
cd /home/forge/your-domain.com

git pull origin main
npm ci
npx prisma db push
npm run build

# Restart Node.js application process daemon (PM2 / Supervisor)
pm2 reload ai-edu || pm2 start npm --name "ai-edu" -- start
```

---

## 🔐 OAuth Provider Setup

To enable live Google and GitHub logins in production:

### 1. Google OAuth 2.0 Configuration
- Open [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
- Create OAuth 2.0 Client ID for a **Web Application**.
- Set **Authorized JavaScript Origins**: `https://your-domain.com`
- Set **Authorized Redirect URIs**: `https://your-domain.com/api/auth/callback/google`

### 2. GitHub OAuth Configuration
- Open [GitHub Developer Settings - OAuth Apps](https://github.com/settings/developers).
- Create a **New OAuth App**.
- Set **Homepage URL**: `https://your-domain.com`
- Set **Authorization Callback URL**: `https://your-domain.com/api/auth/callback/github`

---

## ⚙️ GitHub Actions CI/CD Pipeline

The repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically runs on every push to `dev` and `main`, as well as on all open Pull Requests:

1. **Dependency Installation:** `npm ci`
2. **Prisma Generation:** `npx prisma generate`
3. **Linter Verification:** `npm run lint`
4. **Production Compilation:** `npm run build`
