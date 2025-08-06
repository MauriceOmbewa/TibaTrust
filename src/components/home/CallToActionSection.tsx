import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Heart, CheckCircle } from 'lucide-react';

const CallToActionSection = () => {
  const benefits = [
    'Affordable monthly premiums starting at KSh 500',
    '24/7 medical coverage with fast claim processing',
    'Transparent blockchain-based transactions',
    'Community support when you need it most',
    'Mobile-first platform with M-Pesa integration',
    'Access to quality healthcare providers across Kenya'
  ];

  const actionCards = [
    {
      icon: Shield,
      title: 'Get Protected',
      description: 'Choose an insurance plan that fits your needs and budget',
      action: 'View Plans',
      href: '/insurance',
      color: 'primary'
    },
    {
      icon: Heart,
      title: 'Support Others',
      description: 'Help fellow Kenyans access the healthcare they deserve',
      action: 'Donate Now',
      href: '/donate',
      color: 'secondary'
    },
    {
      icon: Users,
      title: 'Join Community',
      description: 'Connect with others and share your healthcare journey',
      action: 'Sign Up',
      href: '/register',
      color: 'accent'
    }
  ];

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-white/5 bg-[length:40px_40px] bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Healthcare?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of Kenyans who have already taken control of their health 
            with our blockchain-powered healthcare platform.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-highlight flex-shrink-0" />
              <span className="text-primary-foreground/90">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {actionCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-smooth group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <card.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                  {card.title}
                </h3>
                <p className="text-primary-foreground/80 mb-4">
                  {card.description}
                </p>
                <Link to={card.href}>
                  <Button
                    variant="secondary"
                    className="w-full group-hover:scale-105 transition-transform"
                  >
                    {card.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-primary-foreground mb-4">
              Healthcare is a Human Right
            </h3>
            <p className="text-primary-foreground/90 mb-6 leading-relaxed">
              Don't let financial barriers prevent you from accessing quality healthcare. 
              Join BimaBora today and be part of a community that believes in 
              affordable, accessible healthcare for all Kenyans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-white text-primary hover:bg-highlight hover:text-primary px-8 py-4 text-lg font-semibold group">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-sm text-primary-foreground/70 mt-4">
              No setup fees • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;