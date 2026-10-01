import React from 'react';

interface TipButtonProps {
  onClick: () => void;
}

export default function TipButton({ onClick }: TipButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition-colors border border-pink-200 hover:border-pink-300 min-h-touch min-w-touch"
      title="Support the developer with a tip"
    >
      💝 Tip
    </button>
  );
}
