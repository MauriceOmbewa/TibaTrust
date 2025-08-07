import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VideoModal } from '@/components/ui/video-modal';
import { ArrowRight, Play, Shield, Users, Heart } from 'lucide-react';
import heroImage from '@/assets/healthcare-hero.jpg';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-white/5 bg-[length:60px_60px] bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <div className="flex items-center space-x-1">
                <Heart className="w-5 h-5 text-highlight" />
                <Shield className="w-5 h-5 text-highlight" />
                <Users className="w-5 h-5 text-highlight" />
              </div>
              <span className="text-highlight font-medium">Blockchain-Powered Healthcare</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Healthcare for
              <span className="text-highlight block">Every Kenyan</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Affordable insurance, medical aid, and community support for underserved patients. 
              Powered by transparent blockchain technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link to="/register">
                <Button className="btn-hero group">
                  Join Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/donate">
              {/* <Button className="btn-outline text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"> */}
                <Button className="btn-outline">
                  Donate Now
                </Button>
              </Link>
              {/* <Button variant="ghost" className="text-primary-foreground hover:bg-white/10 hover:text-primary group"> */}
              <VideoModal
                trigger={
                  <Button variant="ghost" className="text-primary-foreground hover:bg-white/10 group">
                    <Play className="w-5 h-5 mr-2" />
                    Watch How It Works
                  </Button>
                }
                title="How BimaBora Healthcare Platform Works"
              />
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-highlight">1,200+</div>
                <div className="text-sm text-primary-foreground/80">Patients Helped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-highlight">KSh 2.5M</div>
                <div className="text-sm text-primary-foreground/80">Funds Raised</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-highlight">500+</div>
                <div className="text-sm text-primary-foreground/80">Active Members</div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-hero">
              <img
                src={heroImage}
                alt="Kenyan healthcare worker with tablet helping patients"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-highlight rounded-full flex items-center justify-center shadow-card pulse-health">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-secondary rounded-full flex items-center justify-center shadow-card">
              <Shield className="w-10 h-10 text-secondary-foreground" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto text-background">
          <path
            fill="currentColor"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;