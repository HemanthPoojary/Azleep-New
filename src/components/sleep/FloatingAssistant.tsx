import React from 'react';

const FloatingAssistant = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-full shadow-lg p-3">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">AI</span>
        </div>
      </div>
    </div>
  );
};

export default FloatingAssistant; 