import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import PageContainer from '@/components/layout/PageContainer';

const TestPage = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testSleepTracking = async () => {
    if (!user) {
      addResult("❌ Sleep Tracking: User not authenticated");
      return;
    }

    try {
      // Test inserting sleep data
      const { data, error } = await supabase
        .from('sleep_tracking')
        .insert({
          user_id: user.id,
          sleep_hours: 8,
          sleep_quality: 'Good',
          sleep_date: new Date().toISOString().split('T')[0],
          notes: 'Test sleep data'
        })
        .select();

      if (error) throw error;

      addResult("✅ Sleep Tracking: Data inserted successfully");
      console.log('Sleep data:', data);
    } catch (error) {
      addResult(`❌ Sleep Tracking: ${error.message}`);
      console.error('Sleep tracking error:', error);
    }
  };

  const testMoodTracking = async () => {
    if (!user) {
      addResult("❌ Mood Tracking: User not authenticated");
      return;
    }

    try {
      // Test inserting mood data
      const { data, error } = await supabase
        .from('mood_records')
        .insert({
          user_id: user.id,
          mood: 'Happy',
          stress_level: 3,
          notes: 'Test mood data'
        })
        .select();

      if (error) throw error;

      addResult("✅ Mood Tracking: Data inserted successfully");
      console.log('Mood data:', data);
    } catch (error) {
      addResult(`❌ Mood Tracking: ${error.message}`);
      console.error('Mood tracking error:', error);
    }
  };

  const testDataRetrieval = async () => {
    if (!user) {
      addResult("❌ Data Retrieval: User not authenticated");
      return;
    }

    try {
      // Test retrieving sleep data
      const { data: sleepData, error: sleepError } = await supabase
        .from('sleep_tracking')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (sleepError) throw sleepError;

      // Test retrieving mood data
      const { data: moodData, error: moodError } = await supabase
        .from('mood_records')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (moodError) throw moodError;

      addResult(`✅ Data Retrieval: Sleep records: ${sleepData?.length || 0}, Mood records: ${moodData?.length || 0}`);
    } catch (error) {
      addResult(`❌ Data Retrieval: ${error.message}`);
      console.error('Data retrieval error:', error);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Database Feature Tests</h1>
        
        {!user && (
          <Card className="bg-red-900/20 border-red-500/50 mb-6">
            <CardContent className="p-4">
              <p className="text-red-300">⚠️ Please sign in to test database features</p>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-azleep-dark/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Sleep Tracking Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Tests inserting sleep hours and quality data into the sleep_tracking table.
              </p>
              <Button 
                onClick={testSleepTracking}
                disabled={!user}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Test Sleep Tracking
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-azleep-dark/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Mood Tracking Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Tests inserting mood and stress level data into the mood_records table.
              </p>
              <Button 
                onClick={testMoodTracking}
                disabled={!user}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Test Mood Tracking
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Button 
            onClick={testDataRetrieval}
            disabled={!user}
            className="bg-green-600 hover:bg-green-700"
          >
            Test Data Retrieval
          </Button>

          <Button 
            onClick={clearResults}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Clear Results
          </Button>
        </div>

        <Card className="bg-azleep-dark/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-400">No tests run yet...</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="p-2 bg-black/20 rounded text-sm font-mono text-gray-200">
                    {result}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-azleep-primary/10 rounded-lg border border-azleep-primary/20">
          <h3 className="text-lg font-semibold text-white mb-2">Next Steps:</h3>
          <ul className="text-gray-300 space-y-1">
            <li>1. Test the features above</li>
            <li>2. Go to <strong>/app/dashboard</strong> to test sleep input dialog</li>
            <li>3. Go to <strong>/app/check-in</strong> to test mood selection</li>
            <li>4. Check that data appears in dashboard charts</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
};

export default TestPage; 