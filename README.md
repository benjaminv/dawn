# 🎯 Dawn Boilerplate Setup & Workflow Guide

This document describes how we maintain our custom Dawn boilerplate while staying synced with Shopify's upstream Dawn theme.

---

## 📋 Repository Structure

### Branch Strategy

```
main (origin/main)
├── Clean mirror of Shopify/dawn upstream
├── Syncs with upstream/main for easy updates
└── NO custom modifications

develop (origin/develop) [DEFAULT BRANCH]
├── Your custom boilerplate base
├── Has frontend tooling (pnpm, Vite, Tailwind, TypeScript)
├── Has src/theme/ restructured directory
├── Has custom GitHub Actions workflows
└── Target for all PRs and deployments

boilerplate/X.X.X (e.g., boilerplate/15.4.1)
├── Version-specific customizations
└── Based on upstream tags (v15.4.1)

release/X.X.X
└── Mirror of upstream release branches (for reference)
```

### Directory Structure

```
.
├── .github/
│   ├── actions/              # Composite actions
│   │   ├── install-dependencies/
│   │   ├── push-to-preview-theme/
│   │   ├── stats/
│   │   └── preview-summary/
│   └── workflows/            # CI/CD workflows
│       ├── on-pr.yml
│       ├── on-push-main.yml
│       ├── on-close.yml
│       └── deploy-*.yml
├── src/
│   ├── frontend/             # Custom frontend code
│   │   └── entrypoints/
│   │       ├── app.css
│   │       ├── app.js
│   │       └── product-sticky-atc.js
│   └── theme/                # Dawn theme files
│       ├── assets/
│       ├── config/
│       ├── layout/
│       ├── locales/
│       ├── sections/
│       ├── snippets/
│       └── templates/
├── package.json              # pnpm dependencies
├── pnpm-lock.yaml
├── vite.config.mts          # Build configuration
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── shopify.theme.toml       # Shopify CLI config
```

---

## 🔄 Syncing with Upstream Shopify/dawn

### 1. Sync Main Branch (Weekly/Monthly)

```bash
# Fetch latest from upstream
git fetch upstream --tags

# Switch to main and sync
git checkout main
git merge --ff-only upstream/main

# Push to your fork
git push origin main
```

### 2. Sync Tags

```bash
# Pull all upstream tags
git fetch upstream --tags

# Push all tags to your fork
git push origin --tags
```

### 3. Create/Update Release Branches

```bash
# For each new upstream release
git checkout -b release/15.4.1 upstream/release/15.4.1
git push origin release/15.4.1
```

---

## 🚀 Upgrading Boilerplate Versions

When Shopify releases a new Dawn version (e.g., v15.4.1 → v15.5.0):

### Step 1: Create New Boilerplate Branch

```bash
# Create from your current boilerplate
git checkout -b boilerplate/15.5.0 boilerplate/15.4.1
```

### Step 2: Identify Upstream Changes

```bash
# See what changed between versions
git diff --name-status v15.4.1..v15.5.0

# View commit log
git log --oneline v15.4.1..v15.5.0
```

### Step 3: Apply Upstream Changes to Your Structure

Since we use `src/theme/` instead of root-level theme files, we need to apply changes carefully:

```bash
# For modified files in assets/
git show v15.5.0:assets/cart.js > src/theme/assets/cart.js
git show v15.5.0:assets/global.js > src/theme/assets/global.js

# For modified files in sections/
git show v15.5.0:sections/main-product.liquid > src/theme/sections/main-product.liquid

# For modified files in snippets/
git show v15.5.0:snippets/price.liquid > src/theme/snippets/price.liquid

# For new files
git show v15.5.0:snippets/unit-price.liquid > src/theme/snippets/unit-price.liquid
```

### Step 4: Update Locales & Config

```bash
# Update all locale files
for locale in bg cs da de el en es fi fr hr hu id it ja ko lt nb nl pl pt-BR pt-PT ro ru sk sl sv th tr vi zh-CN zh-TW; do
  git show v15.5.0:locales/${locale}.json > src/theme/locales/${locale}.json 2>/dev/null || true
  git show v15.5.0:locales/${locale}.schema.json > src/theme/locales/${locale}.schema.json 2>/dev/null || true
done

# Update config
git show v15.5.0:config/settings_schema.json > src/theme/config/settings_schema.json
```

### Step 5: Update GitHub Workflows (if needed)

```bash
# Check for new workflow files
git diff --name-only v15.4.1..v15.5.0 .github/

# Review and selectively apply changes
# Note: Keep our custom workflows, only update if necessary
```

### Step 6: Commit & Push

```bash
git add -A
git commit -m "Upgrade boilerplate to v15.5.0

Applied upstream changes from v15.4.1 to v15.5.0:
- Fixed cart performance measurement
- Updated nested cart lines support
- Improved unit price display
- Updated translations across all locales
- [Add other key changes]

Changes applied to src/theme/ structure."

git push origin boilerplate/15.5.0
```

### Step 7: Merge to Develop

```bash
git checkout develop
git merge boilerplate/15.5.0
# Resolve any conflicts if needed
git push origin develop
```

---

## ⚙️ GitHub Actions CI/CD

### Workflows Overview

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **on-pr.yml** | PR to `develop` | Deploy preview theme |
| **on-push-main.yml** | Push to `develop` | Deploy to live & tagged themes |
| **on-close.yml** | PR merged/closed | Clean up preview themes |
| **deploy-to-preview-theme.yml** | Reusable | Preview deployment logic |
| **deploy-to-published-theme.yml** | Reusable | Live theme deployment |
| **deploy-to-tagged-themes.yml** | Reusable | Tagged themes deployment |
| **remove-preview-theme.yml** | Reusable | Preview cleanup logic |

### Composite Actions

| Action | Purpose |
|--------|---------|
| **install-dependencies** | Install pnpm, Node.js, Shopify CLI, build assets |
| **push-to-preview-theme** | Deploy preview theme, return URLs |
| **stats** | Generate metadata (date, time, branch name) |
| **preview-summary** | Comment PR with preview URLs |

### Required GitHub Configuration

#### 1. Set Default Branch

Go to **Settings → General** and set `develop` as the default branch.

#### 2. Create Environment

Go to **Settings → Environments** and create: `production`

#### 3. Add Secrets & Variables

In the `production` environment:

**Secrets:**
```
SHOPIFY_CLI_THEME_TOKEN
```
- Get from: Shopify Admin → Apps → Theme Access
- Generate a password token
- Paste into GitHub secret

**Variables:**
```
SHOPIFY_FLAG_STORE = your-store-name
NODE_VERSION = 20
```

### How It Works

#### Preview Deployment (on PR)

1. **PR created** to `develop` branch
2. **Workflow triggers**: `on-pr.yml`
3. **Actions run**:
   - Install pnpm dependencies
   - Build Vite assets (`pnpm run build`)
   - Pull live theme settings (templates, locales, config, sections)
   - Deploy to preview theme (named after branch)
   - Comment on PR with preview URLs

#### Live Deployment (on merge)

1. **PR merged** to `develop` branch
2. **Workflow triggers**: `on-push-main.yml`
3. **Actions run**:
   - Install dependencies & build
   - Deploy to live theme
   - Deploy to all tagged `[main]` themes (excluding `[live]`)

#### Preview Cleanup (on PR close)

1. **PR closed** or merged
2. **Workflow triggers**: `on-close.yml`
3. **Actions run**:
   - Find preview theme by branch name
   - Delete preview theme

---

## 🧪 Testing Workflows via PR

### Step 1: Create Test Branch

```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/test-something

# Make changes
echo "Test change" >> README.md
git add README.md
git commit -m "Test: workflow validation"

# Push to GitHub
git push -u origin feature/test-something
```

### Step 2: Create Pull Request

```bash
# Option A: Using GitHub CLI
gh pr create --base develop --title "Test workflow" --body "Testing preview deployment"

# Option B: Via GitHub Web UI
# Go to: https://github.com/benjaminv/dawn/compare/develop...feature/test-something
```

### Step 3: Monitor Workflow

```bash
# Check workflow runs
gh run list --branch feature/test-something

# Watch specific run
gh run watch

# View logs
gh run view --log
```

### Step 4: Review Preview

The workflow will comment on your PR with:
- **Preview URL**: Public preview link
- **Editor URL**: Theme editor link
- **Store info**: Store URL and theme name

### Step 5: Merge & Clean Up

When merged:
- Preview theme automatically deleted
- Code deployed to live theme
- Branch can be deleted

---

## 📝 Daily Development Workflow

### Starting New Work

```bash
# 1. Sync develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes and commit
# ... do your work ...
git add .
git commit -m "feat: add new feature"

# 4. Push and create PR
git push -u origin feature/my-feature
gh pr create --base develop
```

### Preview Deploys Automatically

- Your PR triggers the workflow
- Preview theme created with name: `feature/my-feature`
- Comment appears on PR with URLs

### Merge to Deploy

```bash
# After review, merge PR
gh pr merge --squash

# Automatic actions:
# - Preview theme deleted
# - Code deployed to live theme
# - Tagged themes updated
```

---

## 🛠️ Troubleshooting

### Build Fails: "pnpm not found"

**Issue**: pnpm is installed after setup-node tries to use it.

**Fix**: Already resolved - pnpm is installed before setup-node in our workflows.

### Deploy Fails: "Flag --theme expects a value"

**Issue**: Incorrect Shopify CLI syntax.

**Fix**: Already resolved - using `--live --store` instead of `--theme --live`.

### No Preview Theme Created

**Check**:
1. GitHub secrets are set correctly (`SHOPIFY_CLI_THEME_TOKEN`)
2. Store variable is correct (`SHOPIFY_FLAG_STORE`)
3. Theme Access app is installed in Shopify

### Build Takes Too Long

**Optimization**:
- Caching is enabled for pnpm and node_modules
- First build: ~2-3 minutes
- Subsequent builds: ~30-60 seconds

---

## 🎓 Best Practices

### Branch Management

1. **Keep main clean**: Never commit directly to main
2. **Develop is your base**: All feature branches from develop
3. **One feature per branch**: Keep changes focused
4. **Delete merged branches**: Clean up after merging

### Commit Messages

Use conventional commits:
```
feat: add new product card component
fix: resolve cart drawer layout issue
chore: update dependencies
docs: update README with new workflow
style: format code with prettier
```

### Pull Requests

- Keep PRs small and focused
- Write clear descriptions
- Reference related issues
- Request reviews when needed
- Test preview theme before merging

### Upstream Syncing

- Sync weekly or after major Dawn releases
- Review changes before applying to boilerplate
- Test thoroughly after upgrades
- Document breaking changes

---

## 📚 Resources

- **Shopify Dawn**: https://github.com/Shopify/dawn
- **Shopify CLI**: https://shopify.dev/themes/tools/cli
- **Theme Access**: https://shopify.dev/themes/tools/theme-access
- **GitHub Actions**: https://docs.github.com/actions
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com

---

## 🤝 Contributing

1. Create feature branch from `develop`
2. Make changes
3. Test locally with `pnpm run dev`
4. Push and create PR
5. Review preview deployment
6. Merge after approval

---

## 📄 License

This boilerplate extends [Shopify Dawn](https://github.com/Shopify/dawn) which is licensed under MIT.

---

**Last Updated**: December 16, 2025
