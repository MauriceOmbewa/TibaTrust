import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MPESA_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke';

const getAccessToken = async () => {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  
  console.log('Getting M-Pesa access token from:', MPESA_BASE_URL);
  console.log('Using credentials:', process.env.MPESA_CONSUMER_KEY ? 'Key present' : 'Key missing');
  
  try {
    const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });
    console.log('Access token obtained successfully');
    return response.data.access_token;
  } catch (error) {
    console.error('Access token error details:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
};

// STK Push
app.post('/api/mpesa/stkpush', async (req, res) => {
  const { phone, amount, description } = req.body;

  if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'M-Pesa credentials not configured'
    });
  }

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
      CallBackURL: 'https://mydomain.com/payments/callback',
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
    console.error('M-Pesa Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.errorMessage || error.message || 'Payment failed'
    });
  }
});

// Status check
app.post('/api/mpesa/status', async (req, res) => {
  const { checkoutRequestId } = req.body;
  console.log('Status check request for:', checkoutRequestId);

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

    console.log('M-Pesa Status Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Status check error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.errorMessage || error.message || 'Failed to check status'
    });
  }
});

// Callback
app.post('/api/mpesa/callback', (req, res) => {
  console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));
  res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Dev M-Pesa server running on port ${PORT}`);
  console.log('Environment check:');
  console.log('- MPESA_CONSUMER_KEY:', process.env.MPESA_CONSUMER_KEY ? 'Present' : 'Missing');
  console.log('- MPESA_CONSUMER_SECRET:', process.env.MPESA_CONSUMER_SECRET ? 'Present' : 'Missing');
  console.log('- MPESA_SHORTCODE:', process.env.MPESA_SHORTCODE);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
});