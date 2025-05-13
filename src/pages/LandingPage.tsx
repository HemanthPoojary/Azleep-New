import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Music, Heart, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from '@/components/ui/sonner';

// App URL for all redirects
const APP_URL = "https://app.azleep.ai";
const LandingPage: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [webhookUrl, setWebhookUrl] = useState(''); // Store Zapier webhook URL

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSubmitting(true);

    // This is a placeholder for Zapier integration
    try {
      // If webhook URL is configured, send to Zapier
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          mode: "no-cors",
          body: JSON.stringify({
            email: emailInput,
            timestamp: new Date().toISOString(),
            source: "landing_page"
          })
        });
      }
      console.log("Email submitted:", emailInput);
      setIsSuccess(true);
      setEmailInput('');
      toast.success("Thanks for signing up!");
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting email:", error);
      toast.error("Failed to submit email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };
  return <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#2C3E50] to-[#8E44AD] p-6">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated stars background */}
          <div className="stars-container">
            {Array.from({
            length: 50
          }).map((_, i) => <div key={i} className="absolute rounded-full bg-white animate-pulse-slow" style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 2}s`
          }} />)}
            {/* Moon */}
            <div className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-200 opacity-80 top-10 right-10 shadow-lg"></div>
          </div>
        </div>
        
        <div className="container mx-auto text-center z-10 relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight font-sans">
            Sleep Better with Azleep's AI Web App
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Access AI-driven sleep solutions instantly in your browser.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href={APP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg h-12 px-8 w-full md:w-auto bg-white text-[#8E44AD] hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                Start Now
              </Button>
            </a>
            
            <Button onClick={toggleAudio} variant="outline" size="lg" className={`text-lg h-12 px-8 w-full md:w-auto border-white text-white hover:bg-white/10 ${isAudioPlaying ? 'bg-white/20' : ''}`}>
              {isAudioPlaying ? 'Stop' : 'Try a Mini Sleep Cast'}
            </Button>
            <audio ref={audioRef} src="https://placeholder-url.com/sleepcast-demo.mp3" onEnded={() => setIsAudioPlaying(false)} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-[#2C3E50] to-[#1a1a2e]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            What Azleep Offers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard icon={<Mic size={40} />} title="AI Sleep Genie" description="Your personal sleep coach that understands your needs and provides tailored guidance." />
            
            <FeatureCard icon={<Music size={40} />} title="Personalized Sleep Casts" description="Stories and soundscapes designed to help you fall asleep faster and sleep deeper." />
            
            <FeatureCard icon={<Heart size={40} />} title="Mood Tracking" description="Voice-based stress insights that help you understand your mental wellbeing patterns." />
            
            <FeatureCard icon={<Moon size={40} />} title="Late-Night Nudges" description="Gentle reminders to unwind and prepare for sleep at the right time." />
          </div>

          <div className="mt-16 bg-[#1e293b] rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">Hear AI Sleep Genie in action</h3>
            <div className="flex items-center justify-center">
              <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                <Button className="flex items-center gap-2">
                  <Mic size={18} />
                  Try it now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-[#1a1a2e] to-[#34323c]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Get Started in 3 Steps
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <StepCard number={1} title="Open Azleep Web App" description="No downloads required. Access instantly from any browser." image="https://placeholder-url.com/browser-mockup.jpg" />
            
            <StepCard number={2} title="Chat with AI Sleep Genie" description="Speak naturally and get personalized sleep guidance." image="https://placeholder-url.com/microphone-image.jpg" />
            
            <StepCard number={3} title="Rest Easy Tonight" description="Enjoy better sleep with AI-powered assistance." image="https://placeholder-url.com/starry-sky.jpg" />
          </div>
          
          <div className="flex justify-center mt-12">
            <a href={APP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#8E44AD] hover:bg-[#9B59B6]">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-[#34323c] to-[#2C3E50]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            User Feedback
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TestimonialCard quote="Azleep's voice coach is a game-changer! I've tried many sleep apps, but this is the first one that actually understands my sleep issues." author="Priya, 28" />
            
            <TestimonialCard quote="Sleep casts make bedtime relaxing. The Tamil folklore stories remind me of my childhood and help me drift off peacefully every night." author="Arjun, 34" />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 px-4 md:px-8 bg-[#1a1a2e] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Sleep Today
          </h2>
          
          <div className="max-w-md mx-auto mb-12">
            <form onSubmit={handleEmailSubmit} className="flex flex-col md:flex-row gap-2">
              <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="Enter your email" className="flex-grow px-4 py-3 rounded-md text-gray-800 focus:ring-2 focus:ring-[#8E44AD] focus:outline-none" required />
              <Button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-[#8E44AD] hover:bg-[#9B59B6] text-white rounded-md transition-colors">
                {isSubmitting ? 'Sending...' : isSuccess ? 'Sent!' : 'Get Updates'}
              </Button>
            </form>
            
            {/* Hidden Zapier webhook URL input for admin/development */}
            <div className="mt-2 text-xs text-gray-500">
              <details>
                <summary>Admin</summary>
                <input type="text" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="Zapier webhook URL" className="mt-2 w-full px-3 py-2 text-xs rounded border border-gray-600 bg-gray-800 text-gray-200" />
                <p className="mt-1 text-xs text-gray-500">Set your Zapier webhook URL here to enable email capture</p>
              </details>
            </div>
          </div>
          
          <a href={APP_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="mb-12 text-lg h-12 px-10 bg-[#8E44AD] hover:bg-[#9B59B6] shadow-md">
              Access Azleep Now
            </Button>
          </a>
          
          
        </div>
      </section>
    </div>;
};

// Component for feature cards
const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => <Card className="sleep-card hover-scale">
    <CardContent className="flex flex-col items-center text-center p-6">
      <div className="text-[#8E44AD] mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </CardContent>
  </Card>;

// Component for how it works steps
const StepCard = ({
  number,
  title,
  description,
  image
}: {
  number: number;
  title: string;
  description: string;
  image: string;
}) => <div className="flex-1 flex flex-col items-center animate-fade-in">
    <div className="w-16 h-16 rounded-full bg-[#8E44AD] flex items-center justify-center text-white text-2xl font-bold mb-4">
      {number}
    </div>
    <div className="rounded-xl overflow-hidden mb-4 w-full max-w-xs">
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
          {/* Placeholder for image */}
          <p className="text-gray-400">Image</p>
        </div>
      </AspectRatio>
    </div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-300 text-center">{description}</p>
  </div>;

// Component for testimonial cards
const TestimonialCard = ({
  quote,
  author
}: {
  quote: string;
  author: string;
}) => <Card className="sleep-card">
    <CardContent className="p-6">
      <blockquote className="text-gray-200 italic mb-4">"{quote}"</blockquote>
      <p className="text-[#9B59B6] font-semibold">– {author}</p>
    </CardContent>
  </Card>;

// Component for social buttons
const SocialButton = ({
  icon,
  url
}: {
  icon: string;
  url: string;
}) => <a href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#8E44AD] hover:bg-[#9B59B6] flex items-center justify-center transition-colors">
    {icon}
  </a>;
export default LandingPage;