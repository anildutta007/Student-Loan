# Tip/Donation Feature Setup Guide

## Overview
This guide explains how to set up the tip/donation feature for the Student Loan Calculator using Stripe.

## What was implemented
- 💝 Tip button in the header
- Modal with preset amounts (£1, £2) + custom option
- Stripe checkout integration
- Success page after payment
- Google Analytics tracking

## Setup Instructions

### Step 1: Create a Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Sign up for a free Stripe account
3. Complete your account setup (personal/business info)

### Step 2: Get Your API Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)
3. Keep these safe! Never commit them to git.

### Step 3: Set Environment Variables

#### Local Development (.env.local)
Create or update `.env.local` in your project root:
```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
```

#### Production (.env.production)
Update `.env.production` with live keys:
```env
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY_HERE
NEXT_PUBLIC_VERCEL_URL=https://your-domain.com
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Test Locally
1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Click the 💝 Tip button in the header
4. Use Stripe test card: **4242 4242 4242 4242**
5. Any future date and CVC code will work

### Step 6: Deploy to Vercel
1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `STRIPE_SECRET_KEY` (use live key)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (use live key)
5. Deploy!

## Testing with Stripe Test Cards

### Success scenarios
- Card: `4242 4242 4242 4242` - Standard test card
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

### Failure scenarios (optional to test)
- Declined: `4000 0000 0000 0002`
- Insufficient funds: `4000 0000 0000 9995`

## File Structure
```
src/
├── components/tip/
│   ├── TipModal.tsx         # Main tip modal component
│   └── TipButton.tsx        # Tip button in header
├── pages/
│   └── TipSuccessPage.tsx   # Success page after payment
└── ...

api/
└── create-checkout-session.ts  # Stripe API endpoint
```

## Features

### Tip Amounts
- **£1** - Quick support
- **£2** - Standard support  
- **Custom** - User-defined amount

### User Experience
✅ Modal popup when user clicks tip button  
✅ Easy amount selection  
✅ Secure Stripe checkout  
✅ Success confirmation  
✅ Analytics tracking  

## Analytics Events
The tip feature tracks these Google Analytics events:
- `tip_modal_opened` - When tip modal is opened
- `tip_payment_success` - When payment completes

## Stripe Dashboard
After setup, monitor your tips at:
- Payments: https://dashboard.stripe.com/payments
- Customers: https://dashboard.stripe.com/customers
- Settings: https://dashboard.stripe.com/account

## Pricing
Stripe charges per transaction:
- **2.9% + £0.30** per payment
- £1 tip → £0.67 to you
- £2 tip → £1.55 to you
- Custom £5 → £4.50 to you

## Troubleshooting

### "STRIPE_SECRET_KEY not found"
- Make sure `.env.local` or environment variables are set
- Restart dev server after adding env vars

### Payment redirect not working
- Check NEXT_PUBLIC_VERCEL_URL matches your domain
- Verify Stripe keys are correct in dashboard

### Test card declining
- Use test card `4242 4242 4242 4242` (not live cards!)
- Check expiry date is in future

## Security Notes
🔒 Never commit Stripe keys to git  
🔒 Use environment variables only  
🔒 Stripe Checkout is PCI-compliant  
🔒 All payments are secure and encrypted  

## Next Steps
1. [ ] Create Stripe account
2. [ ] Get API keys
3. [ ] Set environment variables
4. [ ] Install dependencies (`npm install`)
5. [ ] Test locally with test cards
6. [ ] Deploy to Vercel
7. [ ] Update env vars in Vercel dashboard
8. [ ] Switch to live keys in production

## Support
For Stripe issues: https://support.stripe.com/
For app issues: Create an issue on GitHub

---
Last updated: 2026-09-29
