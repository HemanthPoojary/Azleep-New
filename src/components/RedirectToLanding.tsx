
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const RedirectToLanding = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/landing');
    }, 5000); // Redirect after 5 seconds
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Redirecting to Landing Page</h2>
        <p className="mb-6">We're taking you to our new promotional landing page in a few seconds...</p>
        <div className="flex justify-center gap-4">
          <Button
            variant="default"
            onClick={() => navigate('/landing')}
          >
            Go Now
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Stay on Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
