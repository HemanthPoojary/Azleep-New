
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { BookOpen, Heart, Star, RefreshCcw } from 'lucide-react';

// Prompt categories
const promptCategories = [
  { id: 'sleep', name: 'Sleep', color: 'from-blue-800 to-purple-700' },
  { id: 'gratitude', name: 'Gratitude', color: 'from-amber-600 to-yellow-500' },
  { id: 'reflect', name: 'Reflection', color: 'from-green-700 to-emerald-500' },
  { id: 'dream', name: 'Dreams', color: 'from-purple-800 to-indigo-600' },
];

// Prompts by category
const promptsByCategory = {
  sleep: [
    "How did you sleep last night? What factors do you think affected your sleep quality?",
    "What relaxation techniques worked best for you before bedtime?",
    "Describe your ideal sleep environment. How close is your current setup to this ideal?",
    "What thoughts typically run through your mind as you're trying to fall asleep?",
  ],
  gratitude: [
    "List three things that brought you joy today, no matter how small.",
    "Who made a positive difference in your day today, and how?",
    "What bodily comfort or physical ability are you grateful for today?",
    "What challenge are you currently facing that you can find something to be grateful for?",
  ],
  reflect: [
    "What was the most meaningful moment of your day?",
    "What lesson did you learn today that you want to remember?",
    "What would you have done differently today if given another chance?",
    "How did your actions today align with your values and goals?",
  ],
  dream: [
    "Describe a recent dream that stood out to you. How did it make you feel?",
    "What recurring dreams have you noticed in your life?",
    "If you could design your dream tonight, what would happen in it?",
    "How have your dreams been influencing your waking thoughts lately?",
  ],
};

export const JournalPrompts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [savedResponses, setSavedResponses] = useState<Array<{prompt: string, response: string, date: string}>>([]);
  
  const selectPrompt = (category: string) => {
    const prompts = promptsByCategory[category as keyof typeof promptsByCategory];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setSelectedCategory(category);
    setCurrentPrompt(randomPrompt);
    setResponse('');
  };
  
  const getNewPrompt = () => {
    if (selectedCategory) {
      const prompts = promptsByCategory[selectedCategory as keyof typeof promptsByCategory];
      let randomPrompt;
      do {
        randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      } while (randomPrompt === currentPrompt && prompts.length > 1);
      setCurrentPrompt(randomPrompt);
      setResponse('');
    }
  };
  
  const saveResponse = () => {
    if (!response.trim() || !currentPrompt) {
      toast("Please write a response first");
      return;
    }
    
    const newSavedResponse = {
      prompt: currentPrompt,
      response: response,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    
    setSavedResponses([newSavedResponse, ...savedResponses]);
    setResponse('');
    setCurrentPrompt(null);
    setSelectedCategory(null);
    toast("Your reflection has been saved");
  };
  
  return (
    <div className="space-y-6">
      {!currentPrompt ? (
        <>
          <h3 className="text-xl font-medium text-white mb-4">Choose a prompt category</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {promptCategories.map((category) => (
              <button 
                key={category.id}
                onClick={() => selectPrompt(category.id)}
                className={`p-4 rounded-xl bg-gradient-to-br ${category.color} text-white text-center hover:opacity-90 transition-all transform hover:scale-105`}
              >
                <h4 className="font-medium">{category.name}</h4>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-azleep-primary" />
              <h3 className="text-xl font-medium text-white">{promptCategories.find(c => c.id === selectedCategory)?.name} Prompt</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={getNewPrompt} 
              className="text-gray-300 hover:text-white"
            >
              <RefreshCcw className="h-4 w-4 mr-1" /> New Prompt
            </Button>
          </div>
          
          <Card className="border-none bg-white/20 backdrop-blur-sm">
            <CardContent className="p-4">
              <p className="text-white font-medium">{currentPrompt}</p>
            </CardContent>
          </Card>
          
          <Textarea
            placeholder="Write your reflection here..."
            className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-white/50 resize-none"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          
          <div className="flex justify-end">
            <Button onClick={saveResponse} className="bg-azleep-primary hover:bg-azleep-primary/80">
              Save Reflection
            </Button>
          </div>
        </div>
      )}
      
      {/* Recent saved entries */}
      {savedResponses.length > 0 && !currentPrompt && (
        <div className="mt-8">
          <h3 className="text-xl font-medium text-white mb-4">Recent Reflections</h3>
          <div className="space-y-4">
            {savedResponses.map((item, index) => (
              <Card 
                key={index} 
                className="backdrop-blur-sm bg-white/5 border-white/10 text-white"
              >
                <CardContent className="p-4">
                  <p className="text-sm text-gray-300 mb-1">{item.date}</p>
                  <p className="text-white/90 italic mb-3">"{item.prompt}"</p>
                  <p>{item.response}</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
