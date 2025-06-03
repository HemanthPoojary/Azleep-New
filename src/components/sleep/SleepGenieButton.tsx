import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import SleepGenieDialog from './SleepGenieDialog';

interface SleepGenieButtonProps extends ButtonProps {
  label?: string;
}

const SleepGenieButton: React.FC<SleepGenieButtonProps> = ({ 
  label = "Talk to AI Sleep Genie", 
  className,
  ...props 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline"
        size="lg"
        onClick={() => setIsDialogOpen(true)}
        className={className}
        {...props}
      >
        <Mic className="h-6 w-6 mr-4 text-azleep-primary" />
        <span className="text-lg">{label}</span>
      </Button>
      
      <SleepGenieDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export default SleepGenieButton;
