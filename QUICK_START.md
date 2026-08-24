# ⚡ Quick Start - Deploy in 5 Minutes

**Goal:** Get your Student Loan Calculator live on the internet in 5 minutes.

---

## Step 1: Verify It Works Locally (2 min)

```bash
cd C:\Users\dutt_\Student-Loan

# Install dependencies
npm install

# Build it
npm run build

# Preview
npm run preview
```

✅ App should load at http://localhost:4173

---

## Step 2: Create Vercel Account (1 min)

1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Choose **GitHub** (easiest)
4. Authorize Vercel to access GitHub

---

## Step 3: Push Code to GitHub (1 min)

```bash
# Create GitHub repository if you haven't already
# Then push your code:

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Student-Loan.git
git push -u origin main
```

---

## Step 4: Deploy from Vercel (1 min)

In Vercel Dashboard:

1. Click **Add New... → Project**
2. Select your **Student-Loan** repository
3. Click **Import**
4. Click **Deploy**

✅ **DONE!** Your app is now live!

Vercel will provide a URL like: `https://student-loan.vercel.app`

---

## Step 5: Test It (Optional)

```bash
# Visit your Vercel URL
# Test all 4 steps
# Check calculations
# Try mobile view
```

---

## That's It! 🎉

Your Student Loan Calculator is now **LIVE ON THE INTERNET**

### Your Live URL:
```
https://your-project.vercel.app
```

### Share It:
- Email to stakeholders
- Post on social media
- Send to test users

---

## What Happens Next?

- ✅ Every time you push to GitHub, Vercel auto-deploys
- ✅ You get a new URL for each deployment
- ✅ Previous versions saved for rollback

```bash
# Future updates are automatic:
git add .
git commit -m "Add feature X"
git push origin main
# → Vercel automatically deploys!
```

---

## Custom Domain (Optional, 5 min)

If you want a custom domain like `studentloancalculator.com`:

1. Register domain (GoDaddy, Namecheap, etc.)
2. In Vercel Dashboard → Settings → Domains
3. Add your custom domain
4. Follow DNS instructions
5. Wait 5-30 minutes for DNS to propagate

---

## Troubleshooting

### Build fails?
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### App doesn't load?
- Check browser console (F12)
- Check Vercel logs in dashboard
- Make sure latest code is pushed to GitHub

### Wrong calculations?
- Run tests: `npm test`
- Check constants: `src/utils/constants.ts`
- Compare with https://www.gov.uk/student-finance

---

## More Info

- **Full Deployment Guide:** See `DEPLOYMENT_GUIDE.md`
- **Launch Checklist:** See `LAUNCH_CHECKLIST.md`
- **Development Help:** See `DEVELOPMENT.md`

---

## Support

If you run into issues:

1. Check the troubleshooting section above
2. Check `DEPLOYMENT_GUIDE.md` Troubleshooting
3. Check Vercel docs: https://vercel.com/docs
4. Check React docs: https://react.dev

---

**Status:** Ready to Deploy ✅

**Time Required:** 5 minutes

**Cost:** FREE (Vercel free tier)

**Difficulty:** Easy

---

**Your Student Loan Calculator is ready to go LIVE! 🚀**

Need help? Check `DEPLOYMENT_GUIDE.md` for more details.

