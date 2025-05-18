
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import SleepGenieDialog from './SleepGenieDialog';

interface SleepGenieButtonProps extends ButtonProps {
  label?: string;
}

const SleepGenieButton: React.FC<SleepGenieButtonProps> = ({ 
  label = "Talk to Sleep Genie", 
  className,
  ...props 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        className={className}
        {...props}
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        {label}
      </Button>
      
      <SleepGenieDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export default SleepGenieButton;
