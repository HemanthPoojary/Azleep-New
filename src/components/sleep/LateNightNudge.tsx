
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Bell } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const LateNightNudge = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleNudge = () => {
    setIsActive(!isActive);
    
    if (!isActive) {
      toast("Late Night Nudge activated. We'll remind you to sleep soon.", {
        icon: <Bell className="h-4 w-4" />,
      });
      
      // Simulate a nudge after 10 seconds for demo purposes
      setTimeout(() => {
        toast("It's getting late. Time to put down your phone and rest.", {
          icon: <Moon className="h-4 w-4" />,
          action: {
            label: "Sleep Now",
            onClick: () => console.log("User clicked sleep now")
          }
        });
      }, 10000);
    } else {
      toast("Late Night Nudge deactivated.");
    }
  };

  return (
    <div className="sleep-card">
      <div className="flex items-center justify-between">
        <h3 className="mb-2 text-lg font-semibold text-azleep-text">Late Night Nudge</h3>
        <Bell className={`h-5 w-5 ${isActive ? "text-azleep-accent" : "text-muted-foreground"}`} />
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Activate to receive gentle reminders when you should be sleeping
      </p>
      <Button
        onClick={toggleNudge}
        variant={isActive ? "default" : "outline"}
        className={`w-full ${isActive ? "bg-azleep-accent hover:bg-azleep-accent/90" : "border-azleep-accent/40 text-azleep-accent"}`}
      >
        {isActive ? "Deactivate Nudge" : "Activate Nudge"}
      </Button>
    </div>
  );
};

export default LateNightNudge;
