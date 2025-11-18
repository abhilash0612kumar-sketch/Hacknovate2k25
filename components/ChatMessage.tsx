import React, { useState } from 'react';
import type { Message, SummaryData } from '../types';
import { Role } from '../types';

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
  isInitialMessage?: boolean;
  onOptionSelect?: (optionText: string) => void;
}

const renderFormattedText = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={index} className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
  });
};

const SummaryDisplay: React.FC<{ summary: SummaryData }> = ({ summary }) => {
  const [activeTab, setActiveTab] = useState<keyof SummaryData>('prognosis');

  const TABS: { key: keyof SummaryData; label: string; }[] = [
    { key: 'prognosis', label: 'Prognosis' },
    { key: 'medication', label: 'Medication' },
    { key: 'diet', label: 'Diet' },
  ];

  const renderContent = () => {
    const data = summary[activeTab];
    const details = Object.entries(data).map(([key, value]) => {
      if (key === 'disclaimer' || key === 'criticalFinding') return null;
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      return (
        <div key={key} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100 sm:mt-0 sm:col-span-2">{value as string}</dd>
        </div>
      );
    }).filter(Boolean);

    return (
      <div className="p-4">
        {summary.prognosis.criticalFinding && activeTab === 'prognosis' && (
             <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <h3 className="font-medium">Critical Finding</h3>
                <p className="mt-1">{summary.prognosis.criticalFinding}</p>
            </div>
        )}
        {activeTab === 'medication' && 'disclaimer' in data && (
          <p className="text-xs text-yellow-800 dark:text-yellow-300 mb-4 p-3 bg-yellow-50 dark:bg-slate-700 border-l-4 border-yellow-400 rounded-md">
            {data.disclaimer}
          </p>
        )}
        <dl className="divide-y divide-slate-200 dark:divide-slate-700">{details}</dl>
      </div>
    );
  };

  return (
    <div className="mt-4 self-start w-full max-w-xl space-y-2">
       <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500'
              }`}
            >
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-b-lg border border-slate-200 dark:border-slate-700">{renderContent()}</div>
      <p className="mt-4 text-xs font-bold text-slate-600 dark:text-slate-400 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
        **IMPORTANT**: I am an AI assistant, not a medical professional. This information is for educational purposes and not a substitute for professional medical advice. Always consult a qualified health provider.
      </p>
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage, isInitialMessage, onOptionSelect }) => {
  const isUser = message.role === Role.USER;
  const showOptions = !isUser && isLastMessage && message.options && message.options.length > 0;
  const showSummary = !isUser && isLastMessage && message.summary;
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const handleSingleOptionClick = (optionText: string) => {
    if (onOptionSelect) {
      onOptionSelect(optionText);
    }
  };
  
  const handleMultiSelectToggle = (optionText: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(optionText)
        ? prev.filter(s => s !== optionText)
        : [...prev, optionText]
    );
  };

  const handleMultiSelectSubmit = () => {
    if (onOptionSelect && selectedSymptoms.length > 0) {
      onOptionSelect(selectedSymptoms.join(', '));
    }
  };


  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`max-w-md lg:max-w-lg px-4 py-3 rounded-xl text-base ${
              isUser
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600'
            }`}
          >
            {isUser ? <p className="whitespace-pre-wrap">{message.text}</p> : renderFormattedText(message.text)}
            {isUser && message.imageUrl && (
              <img 
                src={message.imageUrl} 
                alt="User uploaded content" 
                className="mt-2 rounded-lg max-w-full h-auto"
              />
            )}
          </div>

          {showOptions && (
            <div className={`mt-3 self-start w-full max-w-xl ${isInitialMessage ? '' : 'grid grid-cols-2 sm:grid-cols-3 gap-3'}`}>
              {isInitialMessage ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {message.options?.map((option, index) => {
                      const isSelected = selectedSymptoms.includes(option.text);
                      return (
                        <button
                          key={index}
                          onClick={() => handleMultiSelectToggle(option.text)}
                          className={`relative text-center p-3 text-sm font-medium border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 flex flex-col items-center justify-center space-y-2
                            ${isSelected
                              ? 'bg-blue-600 text-white border-transparent'
                              : 'text-slate-700 bg-white hover:bg-slate-50 border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600'}`
                          }
                        >
                          <span>{option.text}</span>
                           {isSelected && (
                                <div className="absolute top-1 right-1 bg-white text-blue-600 rounded-full w-4 h-4 flex items-center justify-center">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                </div>
                            )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSymptoms.length > 0 && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleMultiSelectSubmit}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </>
              ) : (
                message.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSingleOptionClick(option.text)}
                    className="text-center p-3 text-sm font-medium text-blue-800 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-blue-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    {option.text}
                  </button>
                ))
              )}
            </div>
          )}

          {showSummary && message.summary && <SummaryDisplay summary={message.summary} />}
      </div>
    </div>
  );
};

export default ChatMessage;