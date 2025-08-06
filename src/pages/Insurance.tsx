import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, X, Shield } from 'lucide-react';

const Insurance = () => {
  const plans = [
    {
      name: 'Basic',
      price: '500',
      description: 'Essential coverage for individuals',
      features: [
        'Outpatient care',
        'Prescription medication',
        'Preventive care',
        'Emergency services',
        'Maternity care (basic)'
      ],
      notIncluded: [
        'Dental coverage',
        'Vision care',
        'Specialized treatments',
        'International coverage'
      ],
      popular: false,
      color: 'bg-secondary'
    },
    {
      name: 'Standard',
      price: '1,000',
      description: 'Comprehensive coverage for families',
      features: [
        'All Basic features',
        'Inpatient hospitalization',
        'Maternity care (full)',
        'Chronic disease management',
        'Dental coverage (basic)',
        'Mental health services'
      ],
      notIncluded: [
        'Vision care',
        'International coverage'
      ],
      popular: true,
      color: 'bg-primary'
    },
    {
      name: 'Premium',
      price: '2,500',
      description: 'Complete healthcare solution',
      features: [
        'All Standard features',
        'Vision care',
        'Specialized treatments',
        'International coverage (East Africa)',
        'Wellness programs',
        'Telehealth services',
        'Home healthcare'
      ],
      notIncluded: [],
      popular: false,
      color: 'bg-accent'
    }
  ];

  return (
    <PageLayout>
      <section className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Insurance Plans</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Choose the right healthcare coverage for you and your family with our affordable, 
            transparent insurance plans.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Insurance Plans</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Affordable monthly premiums with comprehensive coverage options for every need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-xl shadow-card overflow-hidden border border-highlight/20 ${
                  plan.popular ? 'ring-2 ring-primary transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground py-2 text-center font-medium">
                    Most Popular
                  </div>
                )}
                <div className={`${plan.color} text-primary-foreground p-6 text-center`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center">
                    <span className="text-sm">KSh</span>
                    <span className="text-4xl font-bold mx-1">{plan.price}</span>
                    <span className="text-sm">/month</span>
                  </div>
                  <p className="mt-2 text-primary-foreground/80">{plan.description}</p>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.notIncluded.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Not Included:</h4>
                      <ul className="space-y-2">
                        {plan.notIncluded.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-muted-foreground">
                            <X className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Link to="/register">
                    <Button className={`w-full ${plan.popular ? 'btn-hero' : 'btn-outline'}`}>
                      Choose {plan.name}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-highlight/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose BimaBora Insurance?</h2>
              <ul className="space-y-4">
                {[
                  'Transparent blockchain-based claims processing',
                  'No hidden fees or surprise charges',
                  'Fast claim approvals within 24 hours',
                  'Access to quality healthcare providers across Kenya',
                  'Mobile-first platform with M-Pesa integration',
                  'Community support for special medical needs'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Shield className="w-6 h-6 text-primary mr-3 flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-card">
              <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our team is ready to help you choose the right plan for your needs.
                Contact us for personalized assistance.
              </p>
              <div className="space-y-4">
                <Link to="/contact">
                  <Button className="w-full">Contact Us</Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" className="w-full">Learn How It Works</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Insurance;