import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Heart } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80" />
      <div className="relative text-center text-primary-foreground">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-highlight rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-9xl font-bold mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            The healthcare page you're looking for doesn't exist. Let's get you back to caring for your health.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-white text-primary hover:bg-highlight">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="text-primary-foreground border-primary-foreground hover:bg-white/10"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
