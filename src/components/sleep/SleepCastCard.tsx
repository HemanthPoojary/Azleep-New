
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';

export interface SleepCastProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  imageSrc?: string;
  onPlay: () => void;
}

const SleepCastCard = ({
  title,
  description,
  duration,
  category,
  imageSrc,
  onPlay,
}: SleepCastProps) => {
  return (
    <div className="sleep-card group hover:-translate-y-1 h-full flex flex-col">
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-azleep-accent/20 px-3 py-1 text-xs font-medium text-azleep-accent">
          {category}
        </span>
        <span className="text-sm text-muted-foreground">{duration}</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-azleep-text">{title}</h3>
      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground flex-grow">
        {description}
      </p>
      <Button 
        onClick={onPlay} 
        variant="secondary" 
        className="w-full gap-2 bg-azleep-accent/80 text-white hover:bg-azleep-accent"
      >
        <PlayIcon className="h-4 w-4" /> Play Sleep Cast
      </Button>
    </div>
  );
};

export default SleepCastCard;
