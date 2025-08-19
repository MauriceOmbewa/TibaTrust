import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Smartphone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { initiateSTKPush, checkPaymentStatus } from '@/services/mpesa';

interface MpesaPaymentProps {
  amount: number;
  description: string;
  onSuccess?: () => void;
  onTrigger?: () => boolean;
}

export const MpesaPayment = ({ amount, description, onSuccess, onTrigger }: MpesaPaymentProps) => {
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState('');

  const handlePayment = async () => {
    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number');
      setIsError(true);
      return;
    }

    setIsProcessing(true);
    setIsError(false);
    
    const formattedPhone = phone.startsWith('0') ? `254${phone.slice(1)}` : phone.replace('+', '');
    
    const response = await initiateSTKPush({
      phone: formattedPhone,
      amount,
      description
    });

    if (response.success && response.checkoutRequestId) {
      setCheckoutRequestId(response.checkoutRequestId);
      
      // Poll for payment status
      let pollCount = 0;
      const maxPolls = 12; // 60 seconds total (15s initial + 12 * 5s)
      
      const pollStatus = async () => {
        pollCount++;
        
        try {
          const status = await checkPaymentStatus(response.checkoutRequestId!);
          console.log('Payment status check:', status);
          
          if (status.ResultCode === '0') {
            // Payment successful
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
              setIsSuccess(false);
              setIsOpen(false);
              onSuccess?.();
            }, 2000);
          } else if (status.ResultCode === '1032') {
            // User cancelled
            setIsProcessing(false);
            setIsError(true);
            setErrorMessage('Payment cancelled by user');
          } else if (status.ResultCode && status.ResultCode !== '1037') {
            // Other error codes (not timeout)
            setIsProcessing(false);
            setIsError(true);
            setErrorMessage(status.ResultDesc || 'Payment failed');
          } else if (pollCount >= maxPolls) {
            // Timeout after 60 seconds
            setIsProcessing(false);
            setIsError(true);
            setErrorMessage('Payment timeout. Please try again.');
          } else {
            // Still processing, poll again
            setTimeout(pollStatus, 5000); // Longer interval
          }
        } catch (error) {
          console.log('Status check failed, retrying...', error);
          if (pollCount >= maxPolls) {
            setIsProcessing(false);
            setIsError(true);
            setErrorMessage('Payment timeout. Please check your M-Pesa messages.');
          } else {
            setTimeout(pollStatus, 5000); // Longer interval between retries
          }
        }
      };
      
      setTimeout(pollStatus, 15000); // Wait 15 seconds before first status check
    } else {
      setIsProcessing(false);
      setIsError(true);
      setErrorMessage(response.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (open && onTrigger && !onTrigger()) {
        return;
      }
      setIsOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <Smartphone className="w-4 h-4 mr-2" />
          Pay with M-Pesa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-green-600" />
            M-Pesa Payment
          </DialogTitle>
        </DialogHeader>
        
        {!isProcessing && !isSuccess && !isError && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold">KSh {amount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712345678 or +254712345678"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            
            <Button onClick={handlePayment} className="w-full" disabled={!phone}>
              Pay with M-Pesa
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              You will receive an M-Pesa prompt on your phone
            </p>
          </div>
        )}
        
        {isProcessing && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-green-600" />
            <p className="text-lg font-semibold">Processing Payment...</p>
            <p className="text-sm text-muted-foreground">Please complete the transaction on your phone</p>
          </div>
        )}
        
        {isSuccess && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <p className="text-lg font-semibold text-green-600">Payment Successful!</p>
            <p className="text-sm text-muted-foreground">Transaction completed successfully</p>
          </div>
        )}
        
        {isError && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <p className="text-lg font-semibold text-red-600">Payment Failed</p>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <Button 
              onClick={() => {
                setIsError(false);
                setErrorMessage('');
              }} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};