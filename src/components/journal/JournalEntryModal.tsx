
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { BookOpen, Headphones, MessageCircle, Mic, ImageIcon } from 'lucide-react';

// Mood options for journal entry
const moodOptions = [
  { name: "Peaceful", color: "bg-blue-500" },
  { name: "Grateful", color: "bg-green-500" },
  { name: "Happy", color: "bg-yellow-500" },
  { name: "Reflective", color: "bg-purple-500" },
  { name: "Anxious", color: "bg-amber-500" },
  { name: "Tired", color: "bg-red-500" },
  { name: "Sad", color: "bg-indigo-500" },
];

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JournalEntryModal: React.FC<JournalEntryModalProps> = ({ isOpen, onClose }) => {
  const [entryType, setEntryType] = useState<'text' | 'voice' | 'image'>('text');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSave = () => {
    if (!content.trim()) {
      toast("Please add some content to your journal entry");
      return;
    }
    
    if (!selectedMood) {
      toast("Please select your mood");
      return;
    }
    
    // Here we would save the entry to a database
    toast("Journal entry saved successfully!");
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setContent('');
    setTitle('');
    setSelectedMood(null);
    setEntryType('text');
    setIsRecording(false);
  };
  
  const toggleRecording = () => {
    // In a real app, this would connect to the device's microphone
    setIsRecording(!isRecording);
    
    // Simulate recording for demo
    if (!isRecording) {
      toast("Recording started");
    } else {
      toast("Recording saved");
      setContent("This is a voice memo entry that would be transcribed from your recording.");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-azleep-dark border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">New Journal Entry</DialogTitle>
        </DialogHeader>
        
        {/* Entry Type Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={entryType === 'text' ? 'default' : 'outline'}
            className={entryType === 'text' ? 'bg-azleep-primary' : 'border-white/20 text-white'}
            onClick={() => setEntryType('text')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Text
          </Button>
          <Button
            variant={entryType === 'voice' ? 'default' : 'outline'}
            className={entryType === 'voice' ? 'bg-azleep-primary' : 'border-white/20 text-white'}
            onClick={() => setEntryType('voice')}
          >
            <Headphones className="mr-2 h-4 w-4" />
            Voice
          </Button>
          <Button
            variant={entryType === 'image' ? 'default' : 'outline'}
            className={entryType === 'image' ? 'bg-azleep-primary' : 'border-white/20 text-white'}
            onClick={() => setEntryType('image')}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Image
          </Button>
        </div>
        
        {/* Title Input */}
        <div className="mb-4">
          <Label htmlFor="title" className="text-white">Entry Title (optional)</Label>
          <Input
            id="title"
            placeholder="Give your entry a title"
            className="bg-white/5 border-white/10 text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        {/* Content Input based on type */}
        <div className="mb-4">
          <Label className="text-white">
            {entryType === 'text' ? 'Your Thoughts' : 
             entryType === 'voice' ? 'Voice Memo' : 'Image & Caption'}
          </Label>
          
          {entryType === 'text' && (
            <Textarea
              placeholder="Write your thoughts, reflections, or experiences..."
              className="min-h-[180px] bg-white/5 border-white/10 text-white"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
          
          {entryType === 'voice' && (
            <div className="bg-white/5 border border-white/10 rounded-md p-4 text-center">
              <Button
                onClick={toggleRecording}
                className={`text-white ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-azleep-primary hover:bg-azleep-primary/80'} mx-auto mb-3`}
              >
                <Mic className="mr-2 h-4 w-4" />
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              
              {isRecording ? (
                <div className="flex justify-center items-center gap-2">
                  <span className="inline-block w-2 h-8 bg-red-500 animate-pulse"></span>
                  <span className="inline-block w-2 h-5 bg-red-500 animate-pulse delay-100"></span>
                  <span className="inline-block w-2 h-12 bg-red-500 animate-pulse delay-200"></span>
                  <span className="inline-block w-2 h-7 bg-red-500 animate-pulse delay-300"></span>
                  <span className="inline-block w-2 h-10 bg-red-500 animate-pulse delay-100"></span>
                </div>
              ) : content ? (
                <div className="text-left">
                  <p className="text-white">{content}</p>
                </div>
              ) : (
                <p className="text-white/50">Your voice memo will appear here after recording</p>
              )}
            </div>
          )}
          
          {entryType === 'image' && (
            <Card className="bg-white/5 border-white/10 overflow-hidden">
              <div className="flex justify-center p-8 border-b border-white/10 bg-white/5">
                <div className="flex flex-col items-center text-white/50">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <p>Drop image here or click to upload</p>
                  <Button variant="outline" className="mt-2 border-white/20 text-white">
                    Upload Image
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="Write a caption for your image..."
                className="min-h-[100px] bg-white/5 border-0 text-white"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Card>
          )}
        </div>
        
        {/* Mood Selection */}
        <div>
          <Label className="text-white mb-2 block">How are you feeling?</Label>
          <div className="flex flex-wrap gap-2">
            {moodOptions.map((mood) => (
              <button
                key={mood.name}
                onClick={() => setSelectedMood(mood.name)}
                className={`px-3 py-1 rounded-full text-sm transition-all
                  ${selectedMood === mood.name 
                    ? `${mood.color} text-white` 
                    : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {mood.name}
              </button>
            ))}
          </div>
        </div>
        
        <Separator className="bg-white/20 my-4" />
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-azleep-primary hover:bg-azleep-primary/80"
          >
            Save Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
