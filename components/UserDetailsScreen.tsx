import React, { useState } from 'react';
import { Gender } from '../types';
import ThemeToggle from './ThemeToggle';

interface UserDetailsScreenProps {
  onSubmit: (age: number, gender: Gender) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const UserDetailsScreen: React.FC<UserDetailsScreenProps> = ({ onSubmit, isDarkMode, toggleTheme }) => {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError('Please enter a valid age (1-120).');
      return;
    }
    if (!gender) {
      setError('Please select a gender.');
      return;
    }
    setError('');
    onSubmit(ageNum, gender);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full p-6 text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="absolute top-4 right-4">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">About You</h1>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g., 35"
            className="w-full py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            min="1"
            max="120"
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left mb-2">Gender</label>
            <div className="grid grid-cols-3 gap-3">
                {(Object.values(Gender) as Gender[]).map((g) => (
                    <button
                        type="button"
                        key={g}
                        onClick={() => setGender(g)}
                        className={`p-3 text-sm font-medium border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
                            gender === g
                            ? 'bg-blue-600 text-white border-transparent'
                            : 'text-slate-700 bg-white hover:bg-slate-50 border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600'
                        }`}
                    >
                        {g}
                    </button>
                ))}
            </div>
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-2">
            <button
              type="submit"
              className="w-full px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={!age || !gender}
            >
              Continue
            </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetailsScreen;