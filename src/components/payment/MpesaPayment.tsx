import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Smartphone, Loader2, CheckCircle } from 'lucide-react';

interface MpesaPaymentProps {
  amount: number;
  description: string;
  onSuccess?: () => void;
}

export const MpesaPayment = ({ amount, description, onSuccess }: MpesaPaymentProps) => {
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setIsOpen(false);
      onSuccess?.();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
        
        {!isProcessing && !isSuccess && (
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
                placeholder="+254 7XX XXX XXX"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            
            <Button onClick={handlePayment} className="w-full" disabled={!phone}>
              Initiate Payment
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
      </DialogContent>
    </Dialog>
  );
};