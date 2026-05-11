'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader2, ArrowRight } from 'lucide-react';

type PaymentStatus = 'paid' | 'failed' | 'expired' | 'open';

interface PaymentStatusProps {
  status: PaymentStatus;
  amount?: number;
  currency?: string;
  transactionId?: string;
  message?: string;
}

export function PaymentStatus({
  status,
  amount = 99.99,
  currency = 'USD',
  transactionId,
  message,
}: PaymentStatusProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return {
          icon: CheckCircle,
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully',
          accentColor: '#10b981',
          bgGradient: 'from-emerald-500 to-teal-600',
          cardBg: 'bg-emerald-50 dark:bg-emerald-950',
          borderColor: 'border-emerald-200 dark:border-emerald-800',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          buttonColor: 'bg-emerald-600 hover:bg-emerald-700 active:scale-95',
          detailBg: 'bg-emerald-50 dark:bg-emerald-900/30',
        };
      case 'failed':
        return {
          icon: XCircle,
          title: 'Payment Failed',
          description: 'Your payment could not be processed',
          accentColor: '#ef4444',
          bgGradient: 'from-red-500 to-rose-600',
          cardBg: 'bg-red-50 dark:bg-red-950',
          borderColor: 'border-red-200 dark:border-red-800',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonColor: 'bg-red-600 hover:bg-red-700 active:scale-95',
          detailBg: 'bg-red-50 dark:bg-red-900/30',
        };
      case 'expired':
        return {
          icon: Clock,
          title: 'Payment Expired',
          description: 'Your payment session has expired',
          accentColor: '#f59e0b',
          bgGradient: 'from-amber-500 to-orange-600',
          cardBg: 'bg-amber-50 dark:bg-amber-950',
          borderColor: 'border-amber-200 dark:border-amber-800',
          iconColor: 'text-amber-600 dark:text-amber-400',
          buttonColor: 'bg-amber-600 hover:bg-amber-700 active:scale-95',
          detailBg: 'bg-amber-50 dark:bg-amber-900/30',
        };
      case 'open':
        return {
          icon: Loader2,
          title: 'Processing Payment',
          description: 'Your payment is being processed',
          accentColor: '#3b82f6',
          bgGradient: 'from-blue-500 to-indigo-600',
          cardBg: 'bg-blue-50 dark:bg-blue-950',
          borderColor: 'border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-600 dark:text-blue-400',
          buttonColor: 'bg-blue-600 hover:bg-blue-700 active:scale-95',
          detailBg: 'bg-blue-50 dark:bg-blue-900/30',
        };
      default:
        return {
          icon: Clock,
          title: 'Unknown Status',
          description: 'Unable to determine payment status',
          accentColor: '#6b7280',
          bgGradient: 'from-gray-500 to-slate-600',
          cardBg: 'bg-gray-50 dark:bg-gray-950',
          borderColor: 'border-gray-200 dark:border-gray-800',
          iconColor: 'text-gray-600 dark:text-gray-400',
          buttonColor: 'bg-gray-600 hover:bg-gray-700 active:scale-95',
          detailBg: 'bg-gray-50 dark:bg-gray-900/30',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  const isAnimated = status === 'open';

  return (
    <div
      className={`relative w-full max-w-md mx-auto transition-all duration-700 transform ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br rounded-2xl blur-2xl opacity-20 animate-pulse"
        style={{
          background: `linear-gradient(135deg, ${config.accentColor}40, ${config.accentColor}20)`,
        }}
      />

      {/* Main card */}
      <div className={`relative overflow-hidden rounded-2xl shadow-2xl ${config.cardBg} border-2 ${config.borderColor} backdrop-blur-sm`}>
        {/* Top gradient banner */}
        <div className={`h-2 bg-gradient-to-r ${config.bgGradient}`} />

        <div className="p-8">
          {/* Icon with animation */}
          <div className={`flex justify-center mb-8 ${isVisible ? 'animate-in fade-in zoom-in' : ''}`}
            style={{ animationDuration: '0.6s', animationDelay: '0.1s' }}>
            <div className="relative">
              {/* Pulsing ring background */}
              <div className={`absolute inset-0 rounded-full ${config.iconColor} opacity-20 ${isAnimated ? 'animate-pulse' : 'scale-0'}`}
                style={{ animation: isAnimated ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' }}
              />
              <Icon
                className={`w-24 h-24 ${config.iconColor} relative z-10 ${isAnimated ? 'animate-spin' : ''} transition-transform`}
                strokeWidth={1.5}
                style={{
                  animationDuration: isAnimated ? '2s' : '0s',
                  filter: 'drop-shadow(0 0 12px rgba(0,0,0,0.1))',
                }}
              />
            </div>
          </div>

          {/* Title */}
          <h2 className={`text-3xl font-bold text-center text-gray-900 dark:text-white mb-2 ${isVisible ? 'animate-in fade-in slide-in-from-up' : ''}`}
            style={{ animationDuration: '0.6s', animationDelay: '0.2s' }}>
            {config.title}
          </h2>

          {/* Description */}
          <p className={`text-center text-gray-600 dark:text-gray-300 mb-8 text-sm leading-relaxed ${isVisible ? 'animate-in fade-in' : ''}`}
            style={{ animationDuration: '0.6s', animationDelay: '0.3s' }}>
            {message || config.description}
          </p>

          {/* Amount card */}
          {amount && (
            <div className={`${config.detailBg} rounded-xl p-6 mb-6 border border-opacity-50 ${config.borderColor} transition-transform hover:scale-102 ${isVisible ? 'animate-in fade-in slide-in-from-up' : ''}`}
              style={{ animationDuration: '0.6s', animationDelay: '0.4s' }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 font-semibold">
                Amount Charged
              </p>
              <p className="text-4xl font-bold text-center"
                style={{ color: config.accentColor }}>
                {currency} {amount.toFixed(2)}
              </p>
            </div>
          )}

          {/* Transaction ID */}
          {transactionId && (
            <div className={`${config.detailBg} rounded-xl p-4 mb-6 border border-opacity-50 ${config.borderColor} transition-all hover:shadow-md ${isVisible ? 'animate-in fade-in slide-in-from-up' : ''}`}
              style={{ animationDuration: '0.6s', animationDelay: '0.5s' }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 font-semibold">
                Transaction ID
              </p>
              <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all font-medium">
                {transactionId}
              </p>
            </div>
          )}

          {/* Status-specific message */}
          {status === 'open' && (
            <div className={`${config.detailBg} rounded-xl p-5 mb-8 border border-opacity-50 ${config.borderColor} backdrop-blur-sm ${isVisible ? 'animate-in fade-in slide-in-from-up' : ''}`}
              style={{ animationDuration: '0.6s', animationDelay: '0.6s' }}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Loader2 className={`w-5 h-5 ${config.iconColor} animate-spin`} />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Please wait while we process your payment. <span className="font-semibold">Do not close this page</span> or refresh your browser. This usually takes a few seconds.
                </p>
              </div>
            </div>
          )}

          {status === 'paid' && (
            <div className={`${config.detailBg} rounded-xl p-5 mb-8 border border-opacity-50 ${config.borderColor} ${isVisible ? 'animate-in fade-in slide-in-from-up' : ''}`}
              style={{ animationDuration: '0.6s', animationDelay: '0.6s' }}>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 text-center leading-relaxed">
                ✓ Thank you for your payment. You will receive a confirmation email shortly.
              </p>
            </div>
          )}

          {status === 'failed' && (
            <div className={`${config.detailBg} rounded-xl p-5 mb-8 border border-opacity-50 ${config.borderColor} ${isVisible ? 'animate-in fade-in slide-in-from-up' : ''}`}
              style={{ animationDuration: '0.6s', animationDelay: '0.6s' }}>
              <p className="text-sm text-red-700 dark:text-red-300 text-center leading-relaxed">
                Please try again or contact support if the problem persists.
              </p>
            </div>
          )}

          {status === 'expired' && (
            <div className={`${config.detailBg} rounded-xl p-5 mb-8 border border-opacity-50 ${config.borderColor} ${isVisible ? 'animate-in fade-in slide-in-from-up' : ''}`}
              style={{ animationDuration: '0.6s', animationDelay: '0.6s' }}>
              <p className="text-sm text-amber-700 dark:text-amber-300 text-center leading-relaxed">
                Please initiate a new payment to complete your transaction.
              </p>
            </div>
          )}

          {/* Action Button */}
          <button
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-white shadow-lg hover:shadow-xl ${config.buttonColor} flex items-center justify-center gap-2 group ${isVisible ? 'animate-in fade-in slide-in-from-up' : ''}`}
            style={{ animationDuration: '0.6s', animationDelay: '0.7s' }}
            onClick={() => {
              if (status === 'open') {
                window.location.reload();
              } else if (status === 'failed' || status === 'expired') {
                window.history.back();
              }
            }}
          >
            {status === 'open' && (
              <>
                <span>Processing...</span>
              </>
            )}
            {status === 'paid' && (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            {status === 'failed' && <span>Try Again</span>}
            {status === 'expired' && <span>New Payment</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
