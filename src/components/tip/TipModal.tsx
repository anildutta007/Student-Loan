import React, { useState } from 'react';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TipModal({ isOpen, onClose }: TipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDonate = async (amount: number) => {
    setLoading(true);
    setSelectedAmount(amount);

    try {
      // Open Monzo payment link
      const monzoLink = `https://monzo.me/anildutta?amount=${amount}`;
      window.open(monzoLink, '_blank');

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSelectedAmount(null);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error opening payment link:', error);
      setLoading(false);
      setSelectedAmount(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">💝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Support the Developer</h2>
          <p className="text-gray-600 text-sm">
            If you find this calculator helpful, please consider a small donation to support ongoing development.
          </p>
        </div>

        {/* Donation Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* £1 Option */}
          <button
            onClick={() => handleDonate(1)}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedAmount === 1
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-400'
            } ${loading && selectedAmount === 1 ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <div className="text-3xl mb-2">☕</div>
            <div className="text-xl font-bold text-gray-900">£1</div>
            <div className="text-xs text-gray-500 mt-1">Coffee</div>
            {loading && selectedAmount === 1 && (
              <div className="mt-2 animate-spin">
                <div className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </button>

          {/* £2 Option */}
          <button
            onClick={() => handleDonate(2)}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedAmount === 2
                ? 'border-orange-600 bg-orange-50'
                : 'border-gray-200 hover:border-orange-400'
            } ${loading && selectedAmount === 2 ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <div className="text-3xl mb-2">🍕</div>
            <div className="text-xl font-bold text-gray-900">£2</div>
            <div className="text-xs text-gray-500 mt-1">Pizza slice</div>
            {loading && selectedAmount === 2 && (
              <div className="mt-2 animate-spin">
                <div className="inline-block w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </button>
        </div>

        {/* Payment Method Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-900">
            <strong>💳 Payment Methods:</strong> Monzo, Bank Transfer, Card Payments
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="w-full py-2 text-center text-gray-600 hover:text-gray-900 font-medium transition-colors disabled:opacity-50"
        >
          Maybe later
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Your support helps maintain and improve this calculator
        </p>
      </div>
    </div>
  );
}
