import React, { useState, useRef } from 'react';
import { AppMode } from '../types';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendFile: (file: File) => void;
  isLoading: boolean;
  mode: AppMode;
}

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a1 1 0 00-1.39 1.39L4.43 12l-2.42 7.01a1 1 0 001.39 1.39z" />
    </svg>
);

const AttachmentIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
);

const ClearIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.707 12.293a1 1 0 01-1.414 1.414L12 13.414l-2.293 2.293a1 1 0 01-1.414-1.414L10.586 12 8.293 9.707a1 1 0 011.414-1.414L12 10.586l2.293-2.293a1 1 0 011.414 1.414L13.414 12l2.293 2.293z" clipRule="evenodd" />
    </svg>
);


const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onSendFile, isLoading, mode }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const placeholderText =
    mode === AppMode.LAB_ANALYZER
      ? 'Paste report, type, or attach PDF...'
      : 'Describe your symptoms...';
      
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setInputValue('');
      } else {
        alert('Please select a PDF file.');
      }
    }
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const clearFile = () => {
    setSelectedFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (selectedFile) {
        onSendFile(selectedFile);
        clearFile();
    } else if (inputValue.trim()) {
        onSendMessage(inputValue);
        setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf"
        disabled={isLoading}
      />
      {mode === AppMode.LAB_ANALYZER && (
         <button
          type="button"
          onClick={triggerFileSelect}
          disabled={isLoading}
          className="p-2 text-slate-400 hover:text-sky-500 disabled:text-slate-300 dark:disabled:text-slate-600 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Attach PDF report"
        >
          <AttachmentIcon className="w-6 h-6"/>
        </button>
      )}
      <div className="flex-1 relative">
         <input
          type="text"
          value={selectedFile ? `File: ${selectedFile.name}` : inputValue}
          onChange={(e) => !selectedFile && setInputValue(e.target.value)}
          placeholder={placeholderText}
          className="w-full py-2.5 px-4 pr-12 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-shadow"
          disabled={isLoading || !!selectedFile}
        />
        {selectedFile && (
           <button
            type="button"
            onClick={clearFile}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Clear selected file"
          >
            <ClearIcon className="w-5 h-5"/>
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || (!inputValue.trim() && !selectedFile)}
        className="bg-sky-500 text-white rounded-full p-3 hover:bg-sky-600 disabled:bg-sky-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 flex-shrink-0"
        aria-label="Send message"
      >
        <SendIcon className="w-5 h-5"/>
      </button>
    </form>
  );
};

export default ChatInput;
