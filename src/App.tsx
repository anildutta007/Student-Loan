import React, { useState } from 'react'
import type { CalculatorState } from '@types/index'
import { useCalculations } from '@hooks/useCalculations'
import Header from '@components/layout/Header'
import CombinedOnboarding from '@components/onboarding/CombinedOnboarding'
import ScenarioComparison from '@components/scenarios/ScenarioComparison'
import ResultsSummary from '@components/results/ResultsSummary'
import InformationPage from '@components/information/InformationPage'
import ProgressBar from '@components/common/ProgressBar'
import FeedbackButton from '@components/feedback/FeedbackButton'

function App() {
  const [showInformation, setShowInformation] = useState(false)

  const {
    step,
    userInput,
    totalLoan,
    results,
    fullLoanResults,
    loading,
    error,
    submitStep1,
    submitStep2,
    submitStep3,
    reset,
    goBack,
  } = useCalculations()

  const handleBackFromInfo = () => {
    setShowInformation(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Student Loan Calculator"
        subtitle="Understand your child's monthly repayment after graduation"
        onReset={reset}
      />

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 py-4">
            <button
              onClick={() => setShowInformation(false)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                !showInformation
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Calculator
            </button>
            <button
              onClick={() => setShowInformation(true)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                showInformation
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Information & Assumptions
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar - Only show for calculator, not information */}
      {!showInformation && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <ProgressBar currentStep={step} totalSteps={3} />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-900">
              <strong>Error:</strong> {error}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {showInformation ? (
          <InformationPage onBack={handleBackFromInfo} />
        ) : (
          <>
            {step === 1 && (
              <CombinedOnboarding
                onSubmit={submitStep1}
                loading={loading}
              />
            )}

            {step === 2 && results && userInput && (
              <ScenarioComparison
                results={results}
                fullLoanResults={fullLoanResults}
                totalLoan={totalLoan}
                userInput={userInput}
                loading={loading}
                onNext={submitStep3}
                onBack={goBack}
              />
            )}

            {step === 3 && results && userInput && (
              <ResultsSummary
                results={results}
                fullLoanResults={fullLoanResults}
                totalLoan={totalLoan}
                userInput={userInput}
                onBack={goBack}
                onReset={reset}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600 text-center">
            This calculator is based on UK student loan system (Plan 2) and provides estimates only.
            <br />
            Always check official Student Finance England for accurate information.
          </p>
          <div className="mt-4 text-center">
            <a
              href="https://www.gov.uk/student-finance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Visit Student Finance Official Website →
            </a>
          </div>
        </div>
      </footer>

      {/* Feedback Button */}
      <FeedbackButton recipientEmail="anildutta007@gmail.com" />
    </div>
  )
}

export default App
