import React from 'react';
import { AppMode } from '../types';
import ThemeToggle from './ThemeToggle';

interface WelcomeScreenProps {
  onSelectMode: (mode: AppMode.SYMPTOM_CHECKER | AppMode.LAB_ANALYZER) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectMode, isDarkMode, toggleTheme }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full p-6 text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="absolute top-4 right-4">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">AI Health Bot</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
          How can I help you today?
        </p>
         <p className="text-xs mt-6 max-w-md mx-auto bg-yellow-50 dark:bg-slate-700 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-3 rounded-r-lg">
          This tool provides informational analysis and is not a substitute for professional medical advice.
        </p>
      </header>

      <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onSelectMode(AppMode.SYMPTOM_CHECKER)}
          className="p-6 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 text-left hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Symptom Checker</h2>
        </button>
        <button
          onClick={() => onSelectMode(AppMode.LAB_ANALYZER)}
          className="p-6 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 text-left hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Analyze Lab Report</h2>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;