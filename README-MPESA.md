# M-Pesa Integration Setup

## Prerequisites

1. **Safaricom Developer Account**: Register at https://developer.safaricom.co.ke
2. **Create an App**: Get Consumer Key and Consumer Secret
3. **Get Test Credentials**: For sandbox testing

## Backend Setup

1. Navigate to server directory:
```bash
cd server
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
```env
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
BASE_URL=http://localhost:3001
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

## Frontend Setup

The frontend is already configured to use the M-Pesa service.

## Testing

1. Use sandbox credentials from Safaricom
2. Test phone numbers: 254708374149, 254711XXXXXX
3. Use amounts between 1-70000 for sandbox

## Production Setup

1. Change `NODE_ENV=production` in `.env`
2. Update `MPESA_BASE_URL` to production endpoint
3. Use production credentials from Safaricom
4. Set up proper SSL/HTTPS for callbacks

## Troubleshooting

- Ensure phone number format is correct (254XXXXXXXXX)
- Check that all environment variables are set
- Verify callback URL is accessible
- Check Safaricom developer portal for API status