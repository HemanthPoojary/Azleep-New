import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import EnhancedSleepGenieDialog from './EnhancedSleepGenieDialog';

const FloatingAssistant = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-azleep-primary rounded-full shadow-lg hover:bg-azleep-primary/90 transition-colors duration-200 group"
        >
          <Mic className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
          <span className="sr-only">Open Sleep Genie</span>
          
          {/* Ripple effect when not in dialog */}
          <div className="absolute -inset-1 bg-azleep-primary/30 rounded-full animate-ping" />
          <div className="absolute -inset-2 bg-azleep-primary/20 rounded-full animate-ping" style={{ animationDelay: "0.2s" }} />
        </button>
      </motion.div>

      <EnhancedSleepGenieDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export default FloatingAssistant; 