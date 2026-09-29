import React from 'react'

interface TipButtonProps {
  onClick: () => void
}

const TipButton: React.FC<TipButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors min-h-touch"
      title="Support this app with a tip"
    >
      💝 Tip
    </button>
  )
}

export default TipButton
