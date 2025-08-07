import PageLayout from '@/components/layout/PageLayout';
import { ClaimForm } from '@/components/claims/ClaimForm';
import { useApp } from '@/contexts/AppContext';
import { Navigate } from 'react-router-dom';

const Claims = () => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Submit a Claim</h1>
            <p className="text-muted-foreground">Upload your medical receipts and get reimbursed quickly</p>
          </div>
          <ClaimForm />
        </div>
      </div>
    </PageLayout>
  );
};

export default Claims;