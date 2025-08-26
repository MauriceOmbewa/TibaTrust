import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Sign Up',
      description: 'Create your account with basic information and verify your identity.',
      icon: '1'
    },
    {
      title: 'Choose a Plan',
      description: 'Select an insurance plan that fits your needs and budget.',
      icon: '2'
    },
    {
      title: 'Make Payments',
      description: 'Pay your premiums through M-Pesa or other mobile money services.',
      icon: '3'
    },
    {
      title: 'Access Healthcare',
      description: 'Visit any of our partner healthcare facilities when you need care.',
      icon: '4'
    },
    {
      title: 'Submit Claims',
      description: 'Submit your claims through our mobile app or website.',
      icon: '5'
    },
    {
      title: 'Receive Benefits',
      description: 'Get your claims processed quickly and transparently.',
      icon: '6'
    }
  ];

  return (
    <PageLayout>
      <section className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">How TibaTrust Works</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Our blockchain-powered healthcare platform makes insurance accessible, 
            affordable, and transparent for all Kenyans.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple Steps to Healthcare Access</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow these easy steps to get started with TibaTrust and secure your health coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="card-feature">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 text-xl font-bold text-primary-foreground">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-foreground/70">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
            <Link to="/register">
              <Button className="btn-hero group">
                Join TibaTrust Today
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-highlight/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Blockchain Technology</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn how we use blockchain to ensure transparency and trust in healthcare financing.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-card p-8 mb-8">
            <h3 className="text-xl font-semibold mb-4">How Blockchain Makes Healthcare Better</h3>
            <ul className="space-y-3">
              {[
                'Transparent record of all transactions and claims',
                'Immutable ledger prevents fraud and mismanagement',
                'Smart contracts automate claim processing',
                'Reduced administrative costs mean lower premiums',
                'Community governance ensures the platform serves its members'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HowItWorks;