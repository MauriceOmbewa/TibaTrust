import { Shield, Heart, Users, Smartphone, Globe, TrendingUp } from 'lucide-react';
import iconInsurance from '@/assets/icon-insurance.jpg';
import iconBlockchain from '@/assets/icon-blockchain.jpg';
import iconCommunity from '@/assets/icon-community.jpg';
import iconHealthcare from '@/assets/icon-healthcare.jpg';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      image: iconInsurance,
      title: 'Affordable Health Insurance',
      description: 'Comprehensive health coverage starting from just KSh 500 per month. Covers obstetric fistula treatment, maternal care, and general medical needs.',
      highlights: ['24/7 Coverage', 'No Hidden Fees', 'Instant Claims']
    },
    {
      icon: Users,
      image: iconBlockchain,
      title: 'Blockchain Transparency',
      description: 'Every transaction is recorded on the blockchain for complete transparency. Track your contributions, see exactly how funds are used.',
      highlights: ['100% Transparent', 'Immutable Records', 'Smart Contracts']
    },
    {
      icon: Heart,
      image: iconCommunity,
      title: 'Community Support',
      description: 'Join a caring community that supports each other. Receive donations from fellow members and contribute to others in need.',
      highlights: ['Peer-to-Peer Support', 'Group Funding', 'Emergency Aid']
    },
    {
      icon: Smartphone,
      image: iconHealthcare,
      title: 'Mobile-First Access',
      description: 'Access your insurance, make claims, and receive support directly from your mobile phone. Works with M-Pesa and mobile money.',
      highlights: ['M-Pesa Integration', 'Offline Access', 'SMS Updates']
    }
  ];

  const stats = [
    { label: 'Average Monthly Premium', value: 'KSh 750', icon: TrendingUp },
    { label: 'Claim Processing Time', value: '24 Hours', icon: Shield },
    { label: 'Community Members', value: '2,500+', icon: Users },
    { label: 'Countries Served', value: '3', icon: Globe }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            How TibaTrust Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our platform combines blockchain technology with community support to provide 
            affordable, transparent, and accessible healthcare for all Kenyans.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-feature group cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-smooth">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 bg-highlight/20 text-primary text-sm font-medium rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-card rounded-2xl p-8 shadow-card border border-highlight/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Platform Impact</h3>
            <p className="text-foreground/70">Real numbers showing our community's success</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-primary counter-animate">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;