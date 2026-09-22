import React from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  onReset?: () => void
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, onReset }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
              📚 {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-xs sm:text-sm text-gray-600 truncate">{subtitle}</p>
            )}
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="ml-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
              title="Start over"
            >
              🔄 <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
