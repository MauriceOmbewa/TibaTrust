import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const Register = () => {
  const [step, setStep] = useState(1);
  
  const handleNextStep = () => {
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const benefits = [
    'Affordable healthcare coverage',
    'Transparent blockchain transactions',
    'Community support network',
    'Fast claim processing',
    'Mobile-first platform'
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80" />
      
      <div className="w-full max-w-4xl space-y-8 relative">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-highlight rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">BimaBora</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-primary-foreground">
            Join BimaBora
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Create your account to access affordable healthcare
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-center">
          <div className="flex items-center w-full max-w-xs">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= i ? 'bg-highlight text-primary' : 'bg-white/20 text-primary-foreground'
                }`}>
                  {step > i ? <CheckCircle className="w-5 h-5" /> : i}
                </div>
                {i < 3 && (
                  <div className={`h-1 flex-1 ${
                    step > i ? 'bg-highlight' : 'bg-white/20'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Registration Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-card border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Form Section */}
            <div className="md:col-span-3">
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary-foreground">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-primary-foreground mb-2">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-primary-foreground placeholder-primary-foreground/50 focus:border-highlight focus:ring-1 focus:ring-highlight"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-primary-foreground mb-2">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-primary-foreground placeholder-primary-foreground/50 focus:border-highlight focus:ring-1 focus:ring-highlight"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-primary-foreground placeholder-primary-foreground/50 focus:border-highlight focus:ring-1 focus:ring-highlight"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-primary-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-primary-foreground placeholder-primary-foreground/50 focus:border-highlight focus:ring-1 focus:ring-highlight"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium text-primary-foreground mb-2">
                      ID Number
                    </label>
                    <input
                      id="idNumber"
                      name="idNumber"
                      type="text"
                      required
                      className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-primary-foreground placeholder-primary-foreground/50 focus:border-highlight focus:ring-1 focus:ring-highlight"
                      placeholder="Your national ID number"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleNextStep} className="w-full bg-white text-primary hover:bg-highlight hover:text-primary">
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary-foreground">Choose Your Plan</h3>
                  
                  <div className="space-y-4">
                    {['Basic', 'Standard', 'Premium'].map((plan, index) => (
                      <div key={index} className="border border-white/20 rounded-lg p-4 cursor-pointer hover:bg-white/10">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id={`plan-${index}`} 
                            name="plan" 
                            className="mr-3" 
                            defaultChecked={index === 1} 
                          />
                          <label htmlFor={`plan-${index}`} className="cursor-pointer flex-1">
                            <div className="flex justify-between items-center">
                              <div className="font-medium text-primary-foreground">{plan}</div>
                              <div className="text-highlight font-bold">
                                {index === 0 ? 'KSh 500' : index === 1 ? 'KSh 1,000' : 'KSh 2,500'}
                                <span className="text-xs text-primary-foreground/70">/month</span>
                              </div>
                            </div>
                            <div className="text-sm text-primary-foreground/70 mt-1">
                              {index === 0 ? 'Essential coverage for individuals' : 
                               index === 1 ? 'Comprehensive coverage for families' : 
                               'Complete healthcare solution'}
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button onClick={handlePrevStep} variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                      Back
                    </Button>
                    <Button onClick={handleNextStep} className="bg-white text-primary hover:bg-highlight hover:text-primary">
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary-foreground">Create Password</h3>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-primary-foreground mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-primary-foreground placeholder-primary-foreground/50 focus:border-highlight focus:ring-1 focus:ring-highlight"
                      placeholder="Create a strong password"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-foreground mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-primary-foreground placeholder-primary-foreground/50 focus:border-highlight focus:ring-1 focus:ring-highlight"
                      placeholder="Confirm your password"
                    />
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-highlight"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-primary-foreground/80">
                        I agree to the <a href="#" className="text-highlight hover:text-highlight/80">Terms of Service</a> and <a href="#" className="text-highlight hover:text-highlight/80">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button onClick={handlePrevStep} variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                      Back
                    </Button>
                    <Button className="bg-white text-primary hover:bg-highlight hover:text-primary">
                      Complete Registration
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Benefits Section */}
            <div className="md:col-span-2 bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-foreground mb-4">Benefits of Joining</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-highlight mr-2 flex-shrink-0" />
                    <span className="text-primary-foreground/90">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-sm text-primary-foreground/80 mb-2">Already have an account?</div>
                  <Link to="/login">
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;