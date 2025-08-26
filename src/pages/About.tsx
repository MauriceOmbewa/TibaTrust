import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users, Globe, Award, Lightbulb } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: 'Dr. Sarah Kimani',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      bio: 'Former physician with 15 years of experience in Kenyan healthcare systems.'
    },
    {
      name: 'James Omondi',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Blockchain expert with experience at major tech companies across Africa.'
    },
    {
      name: 'Amina Hassan',
      role: 'COO',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
      bio: 'Former healthcare administrator with expertise in operations and policy.'
    },
    {
      name: 'David Njoroge',
      role: 'Head of Partnerships',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Experienced in building partnerships with healthcare providers across Kenya.'
    }
  ];

  const partners = [
    {
      name: 'Nairobi Hospital',
      type: 'Healthcare Provider',
      logo: Shield
    },
    {
      name: 'M-Pesa',
      type: 'Payment Partner',
      logo: Shield
    },
    {
      name: 'Kenya Blockchain Alliance',
      type: 'Technology Partner',
      logo: Shield
    },
    {
      name: 'Ministry of Health',
      type: 'Government Partner',
      logo: Shield
    }
  ];

  const values = [
    {
      title: 'Accessibility',
      description: 'Making quality healthcare available to all Kenyans regardless of income or location.',
      icon: Globe
    },
    {
      title: 'Transparency',
      description: 'Using blockchain to ensure all transactions and operations are fully transparent.',
      icon: Shield
    },
    {
      title: 'Community',
      description: 'Building a supportive community where members help each other in times of need.',
      icon: Users
    },
    {
      title: 'Innovation',
      description: 'Constantly improving our platform to better serve the healthcare needs of Kenyans.',
      icon: Lightbulb
    },
    {
      title: 'Integrity',
      description: 'Operating with the highest ethical standards in all our dealings.',
      icon: Award
    },
    {
      title: 'Compassion',
      description: 'Approaching healthcare with empathy and understanding for all patients.',
      icon: Heart
    }
  ];

  return (
    <PageLayout>
      <section className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About TibaTrust</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            We're on a mission to make quality healthcare accessible to every Kenyan 
            through blockchain technology and community support.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-lg">
                <p>
                  TibaTrust was founded in 2022 by Dr. Sarah Kimani, a physician who witnessed firsthand 
                  the challenges many Kenyans face in accessing quality healthcare due to financial constraints.
                </p>
                <p>
                  After seeing too many patients unable to afford necessary treatments, especially women 
                  suffering from obstetric fistula, Dr. Kimani decided to create a solution that would make 
                  healthcare more accessible and affordable.
                </p>
                <p>
                  By combining blockchain technology with community-based insurance principles, TibaTrust 
                  was born - a platform that provides transparent, affordable healthcare coverage while 
                  enabling community members to support each other.
                </p>
                <p>
                  Today, TibaTrust serves thousands of Kenyans across the country, with a focus on 
                  underserved rural communities and women's health issues.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-highlight/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-primary">2,500+</div>
                <div className="text-muted-foreground">Active Members</div>
              </div>
              <div className="bg-highlight/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-primary">24 hrs</div>
                <div className="text-muted-foreground">Claim Processing</div>
              </div>
              <div className="bg-highlight/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-primary">1,200+</div>
                <div className="text-muted-foreground">Patients Helped</div>
              </div>
              <div className="bg-highlight/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-highlight/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These core principles guide everything we do at TibaTrust.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-card p-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the dedicated professionals working to transform healthcare access in Kenya.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-card overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-highlight/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We collaborate with leading organizations to provide the best healthcare solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white rounded-xl shadow-card p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <partner.logo className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">{partner.name}</h3>
                <p className="text-muted-foreground text-sm">{partner.type}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/contact">
              <Button className="btn-hero">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;