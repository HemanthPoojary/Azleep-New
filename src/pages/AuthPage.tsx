import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import PageContainer from '@/components/layout/PageContainer';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/app/onboarding');
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    navigate('/app/onboarding');
  };

  return (
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Azleep</h1>
            <p className="text-gray-400">Sign in to start tracking your sleep and mood</p>
          </div>
          
          <AuthForm onSuccess={handleAuthSuccess} onlyLogin />
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Testing the app? Use the "Test Account" button for quick access.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AuthPage; 