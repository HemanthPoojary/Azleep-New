import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ElevenLabsVoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId?: string;
  title?: string;
}

const ElevenLabsVoiceDialog: React.FC<ElevenLabsVoiceDialogProps> = ({ open, onOpenChange, agentId = 'agent_01jx21rsq8e8yre3fnt3k6g23j', title = 'AI Voice Assistant' }) => {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && widgetRef.current) {
      // Remove any previous widget
      widgetRef.current.innerHTML = '';
      // Create the widget element
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', agentId);
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
  }, [open, agentId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div ref={widgetRef} className="w-full min-h-[400px]" />
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default ElevenLabsVoiceDialog; 