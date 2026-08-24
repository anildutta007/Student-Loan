import React from 'react'
import { STEP_TITLES } from '@utils/constants'

interface ProgressBarProps {
  currentStep: 1 | 2 | 3 | 4
  totalSteps?: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps = 4 }) => {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div>
      {/* Progress indicators */}
      <div className="flex justify-between mb-4">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = (index + 1) as 1 | 2 | 3 | 4
          const isActive = stepNum === currentStep
          const isCompleted = stepNum < currentStep

          return (
            <div key={stepNum} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all mb-2 ${
                  isActive
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                    : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              <p className="text-xs sm:text-sm font-medium text-center text-gray-700">
                {STEP_TITLES[stepNum]}
              </p>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
