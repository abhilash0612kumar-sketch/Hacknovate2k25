import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start">
      <div className="bg-white dark:bg-slate-700 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-600">
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;