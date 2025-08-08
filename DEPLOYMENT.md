# Vercel Deployment Guide

## Prerequisites
1. Vercel account
2. M-Pesa Daraja API credentials from Safaricom

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Convert to Vercel API routes"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with default settings

### 3. Set Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:

```
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
NODE_ENV=production
```

### 4. Update Callback URL
After deployment, update the callback URL in:
- `api/mpesa/stkpush.js` line 42
- Replace `your-app.vercel.app` with your actual Vercel domain

### 5. Redeploy
After updating the callback URL, redeploy the application.

## API Endpoints
- `POST /api/mpesa/stkpush` - Initiate payment
- `POST /api/mpesa/status` - Check payment status  
- `POST /api/mpesa/callback` - M-Pesa callback

## Testing
Use sandbox credentials and test phone numbers:
- 254708374149
- 254711XXXXXX

## Production
1. Change `NODE_ENV=production`
2. Use production M-Pesa credentials
3. Update callback URL to production domain