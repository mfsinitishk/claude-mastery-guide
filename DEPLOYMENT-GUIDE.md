# Deployment Guide - Claude Mastery Guide Website

## 🚀 Quick Start

### Prerequisites
- Python 3.x installed
- Git installed
- GitHub account

### Local Development

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Preview the site locally:**
```bash
mkdocs serve
```
   - Site will be available at: http://127.0.0.1:8000
   - Auto-reloads on file changes

3. **Build static site:**
```bash
mkdocs build
```
   - Generates static HTML in `site/` directory

---

## 📦 Deploy to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

**Setup:**

1. **Initialize Git repository (if not already done):**
```bash
cd /Users/nitishkumar/db-design/claude-mastery-guide
git init
git add .
git commit -m "Initial commit: Complete Claude Mastery Guide"
```

2. **Create GitHub repository:**
   - Go to https://github.com/new
   - Name: `claude-mastery-guide`
   - Description: "Comprehensive training curriculum for mastering Claude AI development"
   - Public or Private (your choice)
   - Do NOT initialize with README, .gitignore, or license

3. **Push to GitHub:**
```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/claude-mastery-guide.git
git push -u origin main
```

4. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically by workflow)
   - Click Save

5. **Automatic deployment:**
   - Every push to `main` branch automatically deploys
   - GitHub Actions workflow (`.github/workflows/deploy.yml`) handles it
   - Check Actions tab for deployment status

**Your site will be available at:**
```
https://YOUR-USERNAME.github.io/claude-mastery-guide/
```

### Option 2: Manual Deployment

**One-time deployment:**
```bash
mkdocs gh-deploy
```
   - Builds site and pushes to `gh-pages` branch
   - Enable GitHub Pages (step 4 above)

---

## 🌐 Alternative Hosting Options

### Deploy to Netlify

1. **Build the site:**
```bash
mkdocs build
```

2. **Deploy to Netlify:**
   - Go to https://app.netlify.com/
   - Drag and drop the `site/` folder
   - Or connect GitHub repository

**Netlify config file** (optional - `netlify.toml`):
```toml
[build]
  command = "pip install -r requirements.txt && mkdocs build"
  publish = "site"

[build.environment]
  PYTHON_VERSION = "3.11"
```

### Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
mkdocs build
cd site
vercel --prod
```

### Deploy to Custom Server

1. **Build static site:**
```bash
mkdocs build
```

2. **Upload `site/` directory to your web server:**
   - Via FTP/SFTP
   - Via rsync: `rsync -avz site/ user@server:/var/www/html/`
   - Point web server to the directory

---

## 🎨 Customization

### Theme Colors

Edit `mkdocs.yml`:
```yaml
theme:
  palette:
    - scheme: default
      primary: indigo  # Change to: red, pink, purple, blue, cyan, teal, green, etc.
      accent: indigo
```

### Logo and Favicon

1. Add logo: `docs/assets/logo.png`
2. Add favicon: `docs/assets/favicon.ico`
3. Update `mkdocs.yml`:
```yaml
theme:
  logo: assets/logo.png
  favicon: assets/favicon.ico
```

### Google Analytics

Add to `mkdocs.yml`:
```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

### Social Links

Already configured in `mkdocs.yml`:
```yaml
extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/YOUR-USERNAME/claude-mastery-guide
```

---

## 🔧 Advanced Configuration

### Custom Domain

**GitHub Pages with custom domain:**

1. Add `CNAME` file to `docs/` directory:
```
your-domain.com
```

2. Configure DNS:
   - Add A records:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or CNAME: `YOUR-USERNAME.github.io`

3. Enable in GitHub repository settings

### Search Configuration

Already enabled in `mkdocs.yml`. To customize:
```yaml
plugins:
  - search:
      lang: en
      separator: '[\s\-\.]+'
```

### PDF Export

Install plugin:
```bash
pip install mkdocs-pdf-export-plugin
```

Add to `mkdocs.yml`:
```yaml
plugins:
  - pdf-export
```

---

## 📊 Monitoring

### Check Build Status

**GitHub Actions:**
- Go to repository → Actions tab
- See deployment history
- View logs for any errors

**Local build test:**
```bash
mkdocs build --strict
```
   - Fails on any warnings
   - Good for CI/CD validation

---

## 🐛 Troubleshooting

### Build Fails

**Check Python version:**
```bash
python --version  # Should be 3.x
```

**Reinstall dependencies:**
```bash
pip install --upgrade -r requirements.txt
```

### Links Broken

**Use relative links in markdown:**
```markdown
[Link](../other-section/file.md)  ✓ Correct
[Link](/absolute/path.md)          ✗ Breaks on GitHub Pages
```

### Images Not Loading

**Place images in `docs/` directory:**
```
docs/
  assets/
    images/
      diagram.png
```

**Reference in markdown:**
```markdown
![Diagram](assets/images/diagram.png)
```

### Site Not Updating

**Clear GitHub Pages cache:**
1. Make a small change and commit
2. Wait 2-3 minutes
3. Hard refresh browser (Ctrl+Shift+R)

---

## ✅ Deployment Checklist

Before deploying:

- [ ] Test locally with `mkdocs serve`
- [ ] Check all navigation links work
- [ ] Verify all images load
- [ ] Test search functionality
- [ ] Review on mobile (responsive design)
- [ ] Check both light and dark themes
- [ ] Validate all code examples render correctly
- [ ] Test on different browsers
- [ ] Review deployment workflow
- [ ] Set up custom domain (optional)

---

## 🎯 Post-Deployment

### Share Your Site

**Example URLs:**
```
GitHub Pages:  https://username.github.io/claude-mastery-guide/
Netlify:       https://claude-mastery-guide.netlify.app/
Vercel:        https://claude-mastery-guide.vercel.app/
Custom:        https://your-domain.com/
```

### Promote:
- Share on Twitter/LinkedIn
- Add to GitHub profile README
- Submit to awesome lists
- Create blog post announcement

### Analytics:
- Track page views
- Monitor popular sections
- Identify areas for improvement

---

## 📝 Maintenance

### Update Content

1. Edit markdown files in `docs/`
2. Commit and push changes
3. Automatic deployment updates site

### Update Dependencies

```bash
pip install --upgrade mkdocs mkdocs-material
pip freeze > requirements.txt
```

### Backup

Regular backups:
- GitHub repository (already backed up)
- Clone to local: `git clone <url>`
- Export to ZIP periodically

---

## 🚀 You're Ready!

Your comprehensive Claude Mastery Guide is now:
- ✅ Converted to beautiful static website
- ✅ Ready for GitHub Pages deployment
- ✅ Optimized for search and navigation
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Light/dark theme support
- ✅ Professional documentation experience

**Quick deploy:**
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Test locally
mkdocs serve

# 3. Deploy to GitHub Pages
mkdocs gh-deploy

# Or push to GitHub and let Actions handle it!
```

---

**Need help?** Check the MkDocs documentation: https://www.mkdocs.org/
