import { Loader2, Heart } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading = ({ size = 'md', text = 'Loading...' }: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <Heart className={`${sizeClasses[size]} absolute inset-0 text-highlight animate-pulse`} />
      </div>
      <p className="mt-4 text-muted-foreground">{text}</p>
    </div>
  );
};