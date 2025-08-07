import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { FileText, Upload, Loader2 } from 'lucide-react';

export const ClaimForm = () => {
  const [formData, setFormData] = useState({
    claimType: '',
    facility: '',
    date: '',
    amount: '',
    description: '',
    receipts: null as File[] | null
  });
  const { isLoading } = useApp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, receipts: Array.from(e.target.files!) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Claim submitted:', formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Submit New Claim
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Claim Type</label>
            <select
              name="claimType"
              value={formData.claimType}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Select claim type</option>
              <option value="outpatient">Outpatient Visit</option>
              <option value="inpatient">Inpatient Care</option>
              <option value="prescription">Prescription</option>
              <option value="emergency">Emergency Care</option>
              <option value="maternity">Maternity Care</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Healthcare Facility</label>
            <input
              type="text"
              name="facility"
              value={formData.facility}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Name of hospital/clinic"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date of Service</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount (KSh)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border rounded-lg"
              placeholder="Brief description of treatment received"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload Receipts</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="receipts"
              />
              <label htmlFor="receipts" className="cursor-pointer">
                <span className="text-sm text-gray-600">
                  Click to upload receipts or drag and drop
                </span>
                <br />
                <span className="text-xs text-gray-400">
                  PNG, JPG, PDF up to 10MB each
                </span>
              </label>
            </div>
            {formData.receipts && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  {formData.receipts.length} file(s) selected
                </p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Claim'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};