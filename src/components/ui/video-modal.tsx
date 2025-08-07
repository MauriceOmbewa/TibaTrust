import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';
import { useState } from 'react';

interface VideoModalProps {
  trigger: React.ReactNode;
  videoUrl?: string;
  title?: string;
}

export const VideoModal = ({ trigger, videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", title = "How BimaBora Works" }: VideoModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 bg-black">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="aspect-video">
            <iframe
              src={videoUrl}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};