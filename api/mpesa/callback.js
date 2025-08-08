export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Log the callback data for debugging
  console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));
  
  // Respond to M-Pesa with success
  res.json({ 
    ResultCode: 0, 
    ResultDesc: 'Success' 
  });
}