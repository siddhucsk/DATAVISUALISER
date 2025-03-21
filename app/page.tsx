'use client';

import React, { useState, useEffect, useRef } from 'react';
import DataQuestionnaire from './components/DataQuestionnaire';

interface ImportedData {
  currency: string;
  savingsGoal: {
    name: string;
    target: string;
  };
  monthlyData: Record<string, { income: string; spend: string }>;
}

export default function Home() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedData, setImportedData] = useState<ImportedData | null>(null);

  const handleFileImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        // Try to parse as JSON first
        const jsonData = JSON.parse(text) as ImportedData;
        setImportedData(jsonData);
      } catch {
        // If JSON parsing fails, try CSV format
        const lines = text.split('\n');
        const monthlyData: Record<string, { income: string; spend: string }> = {};
        let currency = 'USD';
        let savingsGoal = {
          name: '',
          target: ''
        };
        
        lines.forEach(line => {
          if (!line.trim()) return;
          
          const [key, value1, value2] = line.split(',').map(v => v?.trim());
          
          if (key === 'Currency') {
            currency = value1 || 'USD';
          } else if (key === 'Savings Goal Name') {
            savingsGoal.name = value1 || '';
          } else if (key === 'Savings Goal Target') {
            savingsGoal.target = value1 || '';
          } else if (key && !key.startsWith('Month') && !key.startsWith('Totals') && value1 && value2) {
            monthlyData[key] = {
              income: value1,
              spend: value2
            };
          }
        });
        
        setImportedData({
          currency,
          savingsGoal,
          monthlyData
        });
      }
      setShowQuestionnaire(true);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuestionnaire(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-8 bg-gray-100">
      <input
        type="file"
        ref={fileInputRef}
        accept=".json,.csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileImport(file);
        }}
      />
      <div className="w-full flex justify-end mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 rounded-lg border bg-white text-zinc-900 border-gray-200 placeholder-zinc-400"
          />
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-900"
          >
            ⌘/
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center gap-8">
        <h1 className="text-7xl font-light text-zinc-900">Welcome</h1>
        <p className="text-2xl text-zinc-900">How would you like to visualise your data?</p>
        
        <div className="flex gap-8 mt-8">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-gray-200 text-zinc-900 transition-colors hover:bg-gray-50"
          >
            <span>Insert file</span>
            <span className="text-sm text-zinc-500">⌘I</span>
          </button>
          <button 
            onClick={() => setShowQuestionnaire(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-gray-200 text-zinc-900 transition-colors hover:bg-gray-50"
          >
            <span>Enter Data</span>
            <span className="text-sm text-zinc-500">⌘K</span>
          </button>
        </div>
      </div>

      {showQuestionnaire && (
        <DataQuestionnaire 
          onClose={() => {
            setShowQuestionnaire(false);
            setImportedData(null);
          }} 
          initialData={importedData}
        />
      )}
    </div>
  );
}
