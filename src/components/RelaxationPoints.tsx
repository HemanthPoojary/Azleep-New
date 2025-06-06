import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Sparkles, Moon, Music, Brain } from 'lucide-react';

interface RelaxationPointsProps {
  points: number;
  className?: string;
}

const getRelaxationLevel = (points: number) => {
  if (points >= 80) return { label: 'Zen Master', color: '#4CAF50', icon: Sparkles };
  if (points >= 60) return { label: 'Peace Seeker', color: '#3f51b5', icon: Brain };
  if (points >= 40) return { label: 'Calm Explorer', color: '#FFA726', icon: Moon };
  return { label: 'Beginning Journey', color: '#ff6b6b', icon: Music };
};

const RelaxationPoints: React.FC<RelaxationPointsProps> = ({ points, className }) => {
  const { label, color, icon: Icon } = getRelaxationLevel(points);
  
  return (
    <div className={`sleep-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-azleep-text">Relaxation Journey</h3>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      
      <div className="flex items-center gap-8">
        <div className="w-32 h-32">
          <CircularProgressbar
            value={points}
            maxValue={100}
            text={`${points}`}
            styles={buildStyles({
              rotation: 0.25,
              strokeLinecap: 'round',
              textSize: '20px',
              pathTransitionDuration: 0.5,
              pathColor: color,
              textColor: '#e8eaf6',
              trailColor: 'rgba(255,255,255,0.1)',
              backgroundColor: '#3e98c7',
            })}
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h4 className="text-lg font-medium text-azleep-text">{label}</h4>
            <p className="text-sm text-gray-400">
              {points < 40 && "Just starting your relaxation journey. Keep going!"}
              {points >= 40 && points < 60 && "Making great progress in finding your calm."}
              {points >= 60 && points < 80 && "You're becoming more mindful each day."}
              {points >= 80 && "You've mastered the art of relaxation!"}
            </p>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-azleep-text">How to earn more points:</h5>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Complete sleep tracking (+5 points)</li>
              <li>• Listen to sleep casts (+3 points)</li>
              <li>• Practice mindfulness (+2 points)</li>
              <li>• Maintain regular sleep schedule (+10 points/week)</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Next milestone:</span>
          <span className="text-azleep-text">
            {points < 40 && "Calm Explorer (40 points)"}
            {points >= 40 && points < 60 && "Peace Seeker (60 points)"}
            {points >= 60 && points < 80 && "Zen Master (80 points)"}
            {points >= 80 && "You've reached the highest level!"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RelaxationPoints; 