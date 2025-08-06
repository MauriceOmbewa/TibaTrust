import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Heart, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState<string>('1000');
  const [customAmount, setCustomAmount] = useState<string>('');

  const handleAmountSelect = (amount: string) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setDonationAmount('custom');
  };

  const featuredCases = [
    {
      name: 'Mary Wanjiku',
      age: 28,
      condition: 'Obstetric Fistula Surgery',
      amountNeeded: 120000,
      amountRaised: 85000,
      location: 'Nakuru',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'John Kamau',
      age: 45,
      condition: 'Kidney Dialysis',
      amountNeeded: 200000,
      amountRaised: 120000,
      location: 'Mombasa',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Faith Akinyi',
      age: 7,
      condition: 'Congenital Heart Surgery',
      amountNeeded: 350000,
      amountRaised: 200000,
      location: 'Kisumu',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <PageLayout>
      <section className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Donate to Save Lives</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Your contribution helps provide essential healthcare to Kenyans in need.
            Every shilling is tracked on the blockchain for complete transparency.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Make a Donation</h2>
              <p className="text-muted-foreground mb-8">
                Choose an amount to donate or enter a custom amount. All donations are processed 
                securely through M-Pesa and recorded on the blockchain.
              </p>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Select Amount (KSh)</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['500', '1000', '2500', '5000', '10000', 'custom'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-3 rounded-lg border ${
                        donationAmount === amount 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-card border-border hover:border-primary'
                      }`}
                    >
                      {amount === 'custom' ? 'Custom' : `KSh ${amount}`}
                    </button>
                  ))}
                </div>
                
                {donationAmount === 'custom' && (
                  <div className="mt-4">
                    <label htmlFor="customAmount" className="block text-sm font-medium mb-2">
                      Enter Custom Amount (KSh)
                    </label>
                    <input
                      type="number"
                      id="customAmount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Enter amount"
                      min="100"
                    />
                  </div>
                )}
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Donation Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border hover:border-primary cursor-pointer">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="generalFund" 
                        name="donationType" 
                        className="mr-3" 
                        defaultChecked 
                      />
                      <label htmlFor="generalFund" className="cursor-pointer">
                        <div className="font-medium">General Fund</div>
                        <div className="text-sm text-muted-foreground">Support all patients in need</div>
                      </label>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-border hover:border-primary cursor-pointer">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="specificCase" 
                        name="donationType" 
                        className="mr-3" 
                      />
                      <label htmlFor="specificCase" className="cursor-pointer">
                        <div className="font-medium">Specific Case</div>
                        <div className="text-sm text-muted-foreground">Choose a patient to support</div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="btn-hero w-full">
                Donate Now
                <Heart className="w-5 h-5 ml-2" />
              </Button>
              
              <p className="text-sm text-muted-foreground mt-4 text-center">
                100% of your donation goes directly to patient care. All transactions are recorded on the blockchain.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Featured Cases</h2>
              <p className="text-muted-foreground mb-8">
                These patients urgently need your support. Learn more about their stories and contribute directly to their care.
              </p>
              
              <div className="space-y-6">
                {featuredCases.map((patient, index) => (
                  <div key={index} className="bg-card rounded-xl shadow-card overflow-hidden border border-highlight/20">
                    <div className="flex">
                      <div className="w-1/3">
                        <img 
                          src={patient.image} 
                          alt={patient.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <h3 className="font-semibold text-lg">{patient.name}, {patient.age}</h3>
                        <p className="text-primary font-medium">{patient.condition}</p>
                        <p className="text-sm text-muted-foreground mb-2">{patient.location}</p>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Raised: KSh {patient.amountRaised.toLocaleString()}</span>
                            <span>Goal: KSh {patient.amountNeeded.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-highlight/20 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(patient.amountRaised / patient.amountNeeded) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          Support {patient.name.split(' ')[0]}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="secondary" className="w-full">
                  View All Cases
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-highlight/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Impact</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how your donations are making a difference in the lives of Kenyans.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-card p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">1,200+</h3>
              <p className="text-muted-foreground">Patients Helped</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">KSh 2.5M</h3>
              <p className="text-muted-foreground">Funds Raised</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">100%</h3>
              <p className="text-muted-foreground">Transparency</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Donate;