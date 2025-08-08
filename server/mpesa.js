const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MPESA_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke';

// Get OAuth token
const getAccessToken = async () => {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  
  try {
    const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });
    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to get access token');
  }
};

// STK Push
app.post('/api/mpesa/stkpush', async (req, res) => {
  const { phone, amount, description } = req.body;

  try {
    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    const stkPushData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: `${process.env.BASE_URL}/api/mpesa/callback`,
      AccountReference: 'BimaBora',
      TransactionDesc: description
    };

    const response = await axios.post(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, stkPushData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      checkoutRequestId: response.data.CheckoutRequestID,
      message: 'STK Push sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.errorMessage || 'Payment failed'
    });
  }
});

// Callback endpoint
app.post('/api/mpesa/callback', (req, res) => {
  console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));
  res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

// Check transaction status
app.post('/api/mpesa/status', async (req, res) => {
  const { checkoutRequestId } = req.body;

  try {
    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    const queryData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    const response = await axios.post(`${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`, queryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check status'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`M-Pesa server running on port ${PORT}`);
});