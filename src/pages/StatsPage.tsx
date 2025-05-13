
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { day: 'Mon', sleepHours: 6.5, stressLevel: 65 },
  { day: 'Tue', sleepHours: 7.2, stressLevel: 58 },
  { day: 'Wed', sleepHours: 6.8, stressLevel: 62 },
  { day: 'Thu', sleepHours: 7.5, stressLevel: 45 },
  { day: 'Fri', sleepHours: 8.1, stressLevel: 40 },
  { day: 'Sat', sleepHours: 7.8, stressLevel: 35 },
  { day: 'Sun', sleepHours: 7.0, stressLevel: 52 },
];

const StatsPage = () => {
  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azleep-text">Your Sleep Stats</h1>
        <p className="text-muted-foreground">Track your progress over time</p>
      </div>
      
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-azleep-text">Weekly Overview</h2>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" /> This Week
          </span>
        </div>
        
        <div className="sleep-card h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" tick={{ fill: '#e8eaf6' }} />
              <YAxis tick={{ fill: '#e8eaf6' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a2e', 
                  borderColor: '#3f51b5',
                  color: '#e8eaf6' 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="sleepHours" 
                name="Sleep (hours)"
                stroke="#3f51b5" 
                strokeWidth={2} 
                dot={{ fill: '#3f51b5', r: 4 }} 
              />
              <Line 
                type="monotone" 
                dataKey="stressLevel" 
                name="Stress Level"
                stroke="#6a11cb" 
                strokeWidth={2} 
                dot={{ fill: '#6a11cb', r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-azleep-text">Sleep Insights</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="sleep-card">
            <h3 className="mb-2 text-lg font-semibold text-azleep-text">Average Sleep</h3>
            <p className="text-3xl font-bold text-azleep-primary">7.2 hrs</p>
            <p className="mt-2 text-sm text-muted-foreground">
              5% improvement from last week
            </p>
          </div>
          
          <div className="sleep-card">
            <h3 className="mb-2 text-lg font-semibold text-azleep-text">Stress Reduction</h3>
            <p className="text-3xl font-bold text-azleep-accent">12%</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your voice patterns show decreased stress
            </p>
          </div>
          
          <div className="sleep-card col-span-2">
            <h3 className="mb-2 text-lg font-semibold text-azleep-text">Sleep Recommendation</h3>
            <p className="text-sm text-muted-foreground">
              Based on your patterns, try the "Night Forest Meditation" sleep cast 30 minutes before your target bedtime for optimal results.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default StatsPage;
