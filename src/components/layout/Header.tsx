import React from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  onReset?: () => void
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, onReset }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              📚 {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="ml-4 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Start over"
            >
              🔄 Reset
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
