
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface CTAFooterProps {
  appUrl: string;
}

const CTAFooter: React.FC<CTAFooterProps> = ({ appUrl }) => {
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

  return (
    <section className="py-16 px-4 md:px-8 bg-[#1a1a2e] text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Transform Your Sleep Today
        </h2>
        
        <div className="max-w-md mx-auto mb-12">
          <form onSubmit={handleEmailSubmit} className="flex flex-col md:flex-row gap-2">
            <input 
              type="email" 
              value={emailInput} 
              onChange={e => setEmailInput(e.target.value)} 
              placeholder="Enter your email" 
              className="flex-grow px-4 py-3 rounded-md text-gray-800 focus:ring-2 focus:ring-[#8E44AD] focus:outline-none" 
              required 
            />
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-6 py-3 bg-[#8E44AD] hover:bg-[#9B59B6] text-white rounded-md transition-colors"
            >
              {isSubmitting ? 'Sending...' : isSuccess ? 'Sent!' : 'Get Updates'}
            </Button>
          </form>
          
          {/* Hidden Zapier webhook URL input for admin/development */}
          <div className="mt-2 text-xs text-gray-500">
            <details>
              <summary>Admin</summary>
              <input 
                type="text" 
                value={webhookUrl} 
                onChange={e => setWebhookUrl(e.target.value)} 
                placeholder="Zapier webhook URL" 
                className="mt-2 w-full px-3 py-2 text-xs rounded border border-gray-600 bg-gray-800 text-gray-200" 
              />
              <p className="mt-1 text-xs text-gray-500">Set your Zapier webhook URL here to enable email capture</p>
            </details>
          </div>
        </div>
        
        <Link to={appUrl}>
          <Button size="lg" className="mb-12 text-lg h-12 px-10 bg-[#8E44AD] hover:bg-[#9B59B6] shadow-md">
            Access Azleep Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTAFooter;
