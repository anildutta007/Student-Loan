import React, { useState, useEffect } from 'react'
import type { CalculatorState } from '@types/index'
import { useCalculations } from '@hooks/useCalculations'
import Header from '@components/layout/Header'
import OnboardingForm from '@components/onboarding/OnboardingForm'
import LoanSummary from '@components/summary/LoanSummary'
import ScenarioComparison from '@components/scenarios/ScenarioComparison'
import ResultsSummary from '@components/results/ResultsSummary'
import ProgressBar from '@components/common/ProgressBar'
import FeedbackButton from '@components/feedback/FeedbackButton'

function App() {
  const {
    step,
    userInput,
    totalLoan,
    results,
    loading,
    error,
    submitStep1,
    submitStep2,
    submitStep3,
    reset,
    goBack,
  } = useCalculations()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Student Loan Calculator"
        subtitle="Understand your child's monthly repayment after graduation"
        onReset={reset}
      />

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <ProgressBar currentStep={step} totalSteps={4} />
        </div>
      </div>

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
        {step === 1 && (
          <OnboardingForm
            onSubmit={submitStep1}
            loading={loading}
          />
        )}

        {step === 2 && userInput && (
          <LoanSummary
            userInput={userInput}
            totalLoan={totalLoan}
            loading={loading}
            onConfirm={submitStep2}
            onBack={goBack}
          />
        )}

        {step === 3 && results && userInput && (
          <ScenarioComparison
            results={results}
            totalLoan={totalLoan}
            userInput={userInput}
            loading={loading}
            onNext={submitStep3}
            onBack={goBack}
          />
        )}

        {step === 4 && results && userInput && (
          <ResultsSummary
            results={results}
            totalLoan={totalLoan}
            userInput={userInput}
            onBack={goBack}
            onReset={reset}
          />
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
      <FeedbackButton recipientEmail="anil dutta007@gmail.com" />
    </div>
  )
}

export default App
