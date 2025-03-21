'use client';

import React, { useState, useEffect } from 'react';
import BentoGrid from './BentoGrid';

interface MonthlyData {
  income: string;
  spend: string;
}

interface DataQuestionnaireProps {
  onClose: () => void;
  initialData?: {
    currency?: string;
    savingsGoal?: {
      name: string;
      target: string;
    };
    monthlyData: Record<string, MonthlyData>;
  } | null;
}

interface SavedData {
  currency: string;
  savingsGoal: {
    name: string;
    target: string;
  };
  monthlyData: Record<string, MonthlyData>;
}

export default function DataQuestionnaire({ onClose, initialData }: DataQuestionnaireProps) {
  const [showVisualization, setShowVisualization] = useState(!!initialData);
  const [currency, setCurrency] = useState(initialData?.currency || 'USD');
  const [savingsGoal, setSavingsGoal] = useState(initialData?.savingsGoal || {
    name: '',
    target: ''
  });
  const [monthlyData, setMonthlyData] = useState<Record<string, MonthlyData>>(() => {
    if (initialData?.monthlyData) {
      return initialData.monthlyData;
    }
    return {
      January: { income: '', spend: '' },
      February: { income: '', spend: '' },
      March: { income: '', spend: '' },
      April: { income: '', spend: '' },
      May: { income: '', spend: '' },
      June: { income: '', spend: '' },
      July: { income: '', spend: '' },
      August: { income: '', spend: '' },
      September: { income: '', spend: '' },
      October: { income: '', spend: '' },
      November: { income: '', spend: '' },
      December: { income: '', spend: '' },
    };
  });

  const commonCurrencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'
  ];

  const handleInputChange = (month: string, field: 'income' | 'spend', value: string) => {
    setMonthlyData(prev => ({
      ...prev,
      [month]: {
        ...prev[month],
        [field]: value
      }
    }));
  };

  const calculateTotals = () => {
    const totalIncome = Object.values(monthlyData).reduce((sum, data) => 
      sum + (Number(data.income) || 0), 0);
    const totalSpend = Object.values(monthlyData).reduce((sum, data) => 
      sum + (Number(data.spend) || 0), 0);
    return { totalIncome, totalSpend };
  };

  const handleSaveData = () => {
    // Save all data including currency and savings goal
    const fullData: SavedData = {
      currency,
      savingsGoal,
      monthlyData
    };

    // Convert to JSON string
    const jsonContent = JSON.stringify(fullData, null, 2);

    // Create JSON file
    const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
    const jsonLink = document.createElement('a');
    const jsonUrl = URL.createObjectURL(jsonBlob);
    jsonLink.setAttribute('href', jsonUrl);
    jsonLink.setAttribute('download', 'financial_data_2025.json');
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);

    // Also save CSV for compatibility
    const csvContent = [
      'Month,Income,Spending',
      ...Object.entries(monthlyData).map(([month, data]) => 
        `${month},${data.income || '0'},${data.spend || '0'}`
      ),
      '',
      `Currency,${currency}`,
      `Savings Goal Name,${savingsGoal.name}`,
      `Savings Goal Target,${savingsGoal.target}`,
      '',
      `Totals,${calculateTotals().totalIncome},${calculateTotals().totalSpend}`
    ].join('\n');

    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvLink = document.createElement('a');
    const csvUrl = URL.createObjectURL(csvBlob);
    csvLink.setAttribute('href', csvUrl);
    csvLink.setAttribute('download', 'financial_data_2025.csv');
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
  };

  const getRecentTransactions = () => {
    const transactions = [];
    const months = Object.keys(monthlyData);
    const currentMonth = new Date().getMonth();
    
    for (let i = 0; i < 3; i++) {
      const month = months[currentMonth - i] || months[months.length - 1 - i];
      const data = monthlyData[month];
      if (data.spend && Number(data.spend) > 0) {
        transactions.push({
          name: `Monthly Expenses - ${month}`,
          amount: Number(data.spend),
          date: `${month} 2025`
        });
      }
    }
    return transactions;
  };

  const getBentoGridData = () => {
    const { totalIncome, totalSpend } = calculateTotals();
    const balance = totalIncome - totalSpend;
    return {
      income: totalIncome,
      spending: totalSpend,
      balance: balance,
      currency,
      recentTransactions: getRecentTransactions(),
      savingsGoal: savingsGoal.name && savingsGoal.target ? {
        current: balance,
        target: Number(savingsGoal.target),
        name: savingsGoal.name
      } : undefined
    };
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-zinc-900">Enter Monthly Data for 2025</h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700"
          >
            ✕
          </button>
        </div>

        {!showVisualization ? (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Select Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 rounded bg-zinc-100 text-zinc-900 border border-amber-600"
              >
                {commonCurrencies.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Savings Goal (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Goal Name"
                  value={savingsGoal.name}
                  onChange={(e) => setSavingsGoal(prev => ({ ...prev, name: e.target.value }))}
                  className="p-2 rounded bg-zinc-100 text-zinc-900 border border-amber-600"
                />
                <input
                  type="number"
                  placeholder="Target Amount"
                  value={savingsGoal.target}
                  onChange={(e) => setSavingsGoal(prev => ({ ...prev, target: e.target.value }))}
                  className="p-2 rounded bg-zinc-100 text-zinc-900 border border-amber-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b text-zinc-900">Month</th>
                    <th className="text-left p-2 border-b text-zinc-900">Income</th>
                    <th className="text-left p-2 border-b text-zinc-900">Spending</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(monthlyData).map(([month, data]) => (
                    <tr key={month}>
                      <td className="p-2 border-b text-zinc-900">{month}</td>
                      <td className="p-2 border-b">
                        <input
                          type="number"
                          value={data.income}
                          onChange={(e) => handleInputChange(month, 'income', e.target.value)}
                          className="w-full p-2 rounded bg-zinc-100 text-zinc-900 border border-amber-600"
                          placeholder="0"
                        />
                      </td>
                      <td className="p-2 border-b">
                        <input
                          type="number"
                          value={data.spend}
                          onChange={(e) => handleInputChange(month, 'spend', e.target.value)}
                          className="w-full p-2 rounded bg-zinc-100 text-zinc-900 border border-amber-600"
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleSaveData}
                className="px-6 py-2 rounded-lg bg-zinc-100 border border-amber-600 text-zinc-900 hover:bg-zinc-200"
              >
                Save Data
              </button>
              <button
                onClick={() => setShowVisualization(true)}
                className="px-6 py-2 rounded-lg bg-zinc-100 border border-amber-600 text-zinc-900 hover:bg-zinc-200"
              >
                Visualise Data
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <BentoGrid data={getBentoGridData()} />
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowVisualization(false)}
                className="px-6 py-2 rounded-lg bg-zinc-100 border border-amber-600 text-zinc-900 hover:bg-zinc-200"
              >
                Back to Data
              </button>
              <button
                onClick={handleSaveData}
                className="px-6 py-2 rounded-lg bg-zinc-100 border border-amber-600 text-zinc-900 hover:bg-zinc-200"
              >
                Save Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 