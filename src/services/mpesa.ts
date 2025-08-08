const API_BASE_URL = 'http://localhost:3001/api/mpesa';

export interface MpesaPaymentRequest {
  phone: string;
  amount: number;
  description: string;
}

export interface MpesaResponse {
  success: boolean;
  checkoutRequestId?: string;
  message: string;
}

export const initiateSTKPush = async (paymentData: MpesaPaymentRequest): Promise<MpesaResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stkpush`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

export const checkPaymentStatus = async (checkoutRequestId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ checkoutRequestId }),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Failed to check payment status'
    };
  }
};