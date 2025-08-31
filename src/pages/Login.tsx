import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Loader2, Wallet } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useState, useEffect } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isLoggedIn) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80" />
      
      <div className="w-full max-w-md space-y-8 relative">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-highlight rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">TibaTrust</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-primary-foreground">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Sign in to access your healthcare account
          </p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-card border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-foreground mb-2">
                Email or Phone Number
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-primary-foreground placeholder-primary-foreground/50 focus:border-highlight focus:ring-1 focus:ring-highlight"
                placeholder="Enter your email or phone"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-primary-foreground placeholder-primary-foreground/50 focus:border-highlight focus:ring-1 focus:ring-highlight"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-highlight"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-primary-foreground/80">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-highlight hover:text-highlight/80">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <div>
              <Button 
                type="submit" 
                className="w-full bg-white text-primary hover:bg-highlight hover:text-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-primary-foreground/80">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <Link to="/blockchain-login">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet (Blockchain)
                </Button>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-white/20 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-primary-foreground hover:bg-white/20"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-white/20 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-primary-foreground hover:bg-white/20"
                >
                  M-Pesa
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-primary-foreground/80">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-highlight hover:text-highlight/80">
              Sign up now
            </Link>
          </p>
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

export default Login;