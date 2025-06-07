import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ElevenLabsAgent } from './ElevenLabsAgent';

interface EnhancedSleepGenieDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EnhancedSleepGenieDialog: React.FC<EnhancedSleepGenieDialogProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-br from-[#232946] via-[#3f51b5]/40 to-[#1a1a2e] rounded-2xl shadow-2xl border-none p-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins text-white mb-2 text-center">Sleep Genie AI</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-full min-h-[400px] flex items-center justify-center bg-white/10 rounded-xl shadow-glow backdrop-blur-md">
            <ElevenLabsAgent agentId="agent_01jx21rsq8e8yre3fnt3k6g23j" className="w-full" />
          </div>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSleepGenieDialog; 