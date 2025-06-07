import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ElevenLabsVoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId?: string;
  title?: string;
}

const DEFAULT_AGENT_ID = "agent_01jx21rsq8e8yre3fnt3k6g23j";

const ElevenLabsVoiceDialog: React.FC<ElevenLabsVoiceDialogProps> = ({ open, onOpenChange, agentId = DEFAULT_AGENT_ID, title = 'AI Voice Assistant' }) => {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && widgetRef.current) {
      // Remove any previous widget
      widgetRef.current.innerHTML = '';
      // Create the widget element
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', DEFAULT_AGENT_ID);
      widget.style.width = '100%';
      widget.style.minHeight = '400px';
      widgetRef.current.appendChild(widget);
      // Add the script if not already present
      if (!document.getElementById('elevenlabs-convai-script')) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
        script.async = true;
        script.type = 'text/javascript';
        script.id = 'elevenlabs-convai-script';
        document.body.appendChild(script);
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-br from-[#232946] via-[#3f51b5]/40 to-[#1a1a2e] rounded-2xl shadow-2xl border-none p-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins text-white mb-2 text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <div ref={widgetRef} className="w-full min-h-[400px] flex items-center justify-center bg-white/10 rounded-xl shadow-glow backdrop-blur-md" />
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default ElevenLabsVoiceDialog; 