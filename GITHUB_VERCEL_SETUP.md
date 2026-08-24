# Deploy to GitHub & Vercel - Complete Guide

Follow these steps to get your app live with automatic deployments.

---

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface (Easiest)

1. Go to **https://github.com/new**
2. Repository name: `Student-Loan`
3. Description: `UK Student Loan Calculator for Parents`
4. Choose: **Public** (so Vercel can access it)
5. Click **Create repository**

### Option B: Using GitHub CLI

```bash
gh repo create Student-Loan --public --source=. --remote=origin --push
```

---

## Step 2: Push Your Code to GitHub

Run these commands in your project directory:

```bash
cd C:\Users\dutt_\Student-Loan

# Configure git (one time)
git config --global user.name "Your Name"
git config --global user.email "anildutta007@gmail.com"

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/Student-Loan.git

# Rename branch to main (if needed)
git branch -M main

# Push all commits to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username!

---

## Step 3: Verify Code on GitHub

1. Go to **https://github.com/YOUR_USERNAME/Student-Loan**
2. You should see all your files and commit history
3. ✅ Code is now backed up on GitHub!

---

## Step 4: Connect to Vercel for Auto-Deployment

### 4A: Create Vercel Account

1. Go to **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Done! ✅

### 4B: Import Project to Vercel

1. After signing in, go to **https://vercel.com/dashboard**
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select **"Student-Loan"** repository
5. Click **"Import"**

### 4C: Configure Project Settings

**Build Settings** (should auto-detect):
- Framework Preset: **Vite**
- Build Command: `npm run build` ✓
- Output Directory: `dist` ✓
- Install Command: `npm install` ✓

**Environment Variables** (optional):
- Add any `.env.production` variables if needed

Click **"Deploy"**

⏳ Vercel builds and deploys (1-2 minutes)

---

## Step 5: Your App is LIVE! 🎉

### Get Your Vercel URL

After deployment completes, you'll see:
```
🎉 Congratulations! Your project has been successfully deployed.
```

Click the **Domain** link to see your live app:
```
https://student-loan.vercel.app
```

---

## Step 6: Set Up Automatic Deployments

✅ **Already configured!** Vercel automatically:
- Watches your GitHub repository
- Deploys on every push to `main` branch
- Shows deployment status in GitHub

### Verify Auto-Deploy Works

1. Edit a file locally:
   ```bash
   cd C:\Users\dutt_\Student-Loan
   # Make a small change (e.g., edit README.md)
   ```

2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin main
   ```

3. Watch it deploy:
   - Go to **https://vercel.com/dashboard**
   - See new deployment in progress ⏳
   - Within 2 minutes, your change is live! ✅

---

## Step 7: Custom Domain (Optional)

If you have a custom domain like `studentloancalculator.com`:

1. In **Vercel Dashboard** → Select your project
2. Go to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS instructions from your domain registrar
5. Wait 5-30 minutes for DNS to propagate

---

## Future Workflow

### To push updates:

```bash
# Make changes
code .

# Test locally
npm run dev

# Commit and push
git add .
git commit -m "Add new feature"
git push origin main
```

✅ Vercel automatically deploys!

### To view deployments:

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Production URL**: https://student-loan.vercel.app (or your custom domain)
- **GitHub**: https://github.com/YOUR_USERNAME/Student-Loan

---

## Troubleshooting

### Build fails on Vercel but works locally?

```bash
# Test production build locally
npm run build
npm run preview
```

Check for errors, fix, then push.

### Changes not showing on Vercel?

1. Verify push succeeded: `git log --oneline -5`
2. Check Vercel dashboard for failed deployments
3. Check build logs in Vercel for errors

### GitHub not connected?

1. Go to **Vercel Settings** → **Connected Accounts**
2. Disconnect and reconnect GitHub
3. Re-authorize if needed

---

## What You Now Have

✅ **Code backed up** on GitHub  
✅ **Live app** at https://student-loan.vercel.app  
✅ **Auto-deployment** on every git push  
✅ **Free HTTPS** (automatic)  
✅ **Global CDN** (fast worldwide)  
✅ **Free tier** includes unlimited deployments  

---

## Environment Variables (if needed)

If you add new environment variables:

1. **Locally**: Add to `.env.local`
2. **Vercel**: 
   - Dashboard → Settings → Environment Variables
   - Add each variable
   - Redeploy

---

## Key Commands Reference

```bash
# First time setup
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git remote add origin https://github.com/YOUR_USERNAME/Student-Loan.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Your message"
git push origin main
```

---

## You're All Set! 🚀

Your Student Loan Calculator is now:
- ✅ On GitHub (backed up & version controlled)
- ✅ Live on Vercel (auto-deploys)
- ✅ Accessible worldwide
- ✅ Updated automatically on every push

**Share your app:** https://student-loan.vercel.app

---

**Need help?**
- GitHub Docs: https://docs.github.com
- Vercel Docs: https://vercel.com/docs
- Git Tutorial: https://git-scm.com/book
