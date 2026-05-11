'use client';
import { useState } from 'react';
import { PaymentStatus } from '../payment-success/[id]/components/payment-status';

export default function Home() {
  const [selectedStatus, setSelectedStatus] = useState<'paid' | 'failed' | 'expired' | 'open'>('open');

  const statuses: Array<'paid' | 'failed' | 'expired' | 'open'> = ['open', 'paid', 'failed', 'expired'];

  const statusInfo = {
    open: {
      label: 'Processing (Open)',
      icon: '⏳',
      description: 'Shows animated loader with spinning icon and processing message. User is instructed to wait and not close the page.',
      color: 'from-blue-500 to-indigo-600',
    },
    paid: {
      label: 'Payment Successful',
      icon: '✓',
      description: 'Displays success state with checkmark icon, confirmation message, and continue button for next steps.',
      color: 'from-emerald-500 to-teal-600',
    },
    failed: {
      label: 'Payment Failed',
      icon: '✕',
      description: 'Shows error state with warning icon, clear error message, and retry button for user action.',
      color: 'from-red-500 to-rose-600',
    },
    expired: {
      label: 'Payment Expired',
      icon: '⏰',
      description: 'Indicates expired session with clock icon and option to initiate a new payment.',
      color: 'from-amber-500 to-orange-600',
    },
  };

  const info = statusInfo[selectedStatus];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Select Status
                </h2>
                <div className="space-y-3 mb-8">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all text-left capitalize duration-200 ${
                        selectedStatus === status
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="mr-2">{statusInfo[status].icon}</span>
                      {statusInfo[status].label}
                    </button>
                  ))}
                </div>

                {/* Info */}
                <div className={`p-5 bg-gradient-to-br ${info.color} bg-opacity-10 dark:bg-opacity-20 border border-opacity-30 dark:border-opacity-30 rounded-xl`}>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span>{info.icon}</span>
                    {info.label}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {info.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 flex items-center justify-center min-h-[600px]">
            <div className="w-full">
              <PaymentStatus
                status={selectedStatus}
                amount={149.99}
                currency="USD"
                transactionId="TXN-2024-98765432"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
