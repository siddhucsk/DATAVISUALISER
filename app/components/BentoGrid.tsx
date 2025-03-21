'use client';

import React from 'react';

interface BentoGridProps {
  data: {
    income: number;
    spending: number;
    balance: number;
    currency: string;
    recentTransactions: Array<{
      name: string;
      amount: number;
      date: string;
    }>;
    savingsGoal?: {
      current: number;
      target: number;
      name: string;
    };
  };
}

export default function BentoGrid({ data }: BentoGridProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculatePercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
      {/* Statistics Card */}
      <div className="bg-zinc-100 rounded-2xl p-4 shadow-sm border border-amber-600">
        <h3 className="text-xl font-bold text-zinc-900 mb-4">Statistics</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-zinc-500">Expenses</p>
            <p className="text-base font-medium text-zinc-900">{formatCurrency(data.spending)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Income</p>
            <p className="text-base font-medium text-zinc-900">{formatCurrency(data.income)}</p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-zinc-100 rounded-2xl p-4 shadow-sm border border-amber-600">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xl font-bold text-zinc-900">Balance</p>
            <p className="text-xl font-medium text-zinc-900 mt-2">{formatCurrency(data.balance)}</p>
          </div>
          <div className="bg-white rounded-full p-2 border border-amber-600">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Savings Goal Card */}
      {data.savingsGoal && (
        <div className="bg-zinc-100 rounded-2xl p-4 shadow-sm border border-amber-600">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xl font-bold text-zinc-900">{data.savingsGoal.name}</p>
            <span className="text-xs text-zinc-500">
              {calculatePercentage(data.savingsGoal.current, data.savingsGoal.target)}% Complete
            </span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-zinc-200 rounded-full h-1.5">
              <div 
                className="bg-amber-600 h-1.5 rounded-full" 
                style={{ 
                  width: `${calculatePercentage(data.savingsGoal.current, data.savingsGoal.target)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
              <span>{formatCurrency(data.savingsGoal.current)}</span>
              <span>{formatCurrency(data.savingsGoal.target)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions Card */}
      <div className="col-span-3 bg-zinc-100 rounded-2xl p-4 shadow-sm border border-amber-600">
        <h3 className="text-xl font-bold text-zinc-900 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {data.recentTransactions.map((transaction, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-zinc-900">{transaction.name}</p>
                <p className="text-xs text-zinc-500">{transaction.date}</p>
              </div>
              <p className="text-sm font-medium text-zinc-900">{formatCurrency(transaction.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 