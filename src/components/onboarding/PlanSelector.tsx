import React, { useState } from 'react'
import { getAvailablePlans, getPlanByYear } from '@utils/planConfigurations'
import Button from '@components/common/Button'
import Card from '@components/common/Card'

interface PlanSelectorProps {
  onSelectPlan: (planId: string, isPostGraduate?: boolean) => void
  loading?: boolean
}

export default function PlanSelector({ onSelectPlan, loading = false }: PlanSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [useYearFinder, setUseYearFinder] = useState(false)
  const [startYear, setStartYear] = useState<number | ''>('')
  const [studentStatus, setStudentStatus] = useState<'current' | 'graduated' | null>(null)

  const plans = getAvailablePlans()
  const isPostGraduatePlan = selectedPlan === 'plan-2' || selectedPlan === 'plan-4'

  const handleYearSelect = () => {
    if (startYear && typeof startYear === 'number') {
      const plan = getPlanByYear(startYear)
      if (plan) {
        setSelectedPlan(plan.id)
      }
    }
  }

  const handleContinue = () => {
    if (selectedPlan) {
      if (isPostGraduatePlan) {
        if (!studentStatus) {
          alert('Please select whether you are currently studying or already repaying')
          return
        }
        onSelectPlan(selectedPlan, studentStatus === 'graduated')
      } else {
        onSelectPlan(selectedPlan)
      }
    }
  }

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Step 1: Select Your Loan Plan</h2>
        <p className="text-gray-600">
          Different student loan plans apply depending on when you started university. Choose yours below.
        </p>
      </div>

      {/* Plan Finder by Year */}
      {!useYearFinder ? (
        <>
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 mb-3">
              <strong>💡 Not sure which plan you're on?</strong>
            </p>
            <button
              onClick={() => setUseYearFinder(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Find my plan by university start year →
            </button>
          </div>

          {/* Plan Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPlan === plan.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{plan.label}</h3>
                  {selectedPlan === plan.id && (
                    <span className="text-blue-600 text-xl">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{plan.description}</p>

                <div className="space-y-2 text-xs text-gray-700">
                  <div>
                    <span className="font-medium">Repayment threshold:</span> £{plan.repaymentThreshold.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Repayment rate:</span> {(plan.repaymentRate * 100).toFixed(0)}%
                  </div>
                  <div>
                    <span className="font-medium">Forgiveness:</span> {plan.maxRepaymentYears} years
                  </div>
                </div>

                {plan.warningMessage && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                    ⚠️ {plan.warningMessage}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Student Status Selection for Plan 2 & 4 */}
          {isPostGraduatePlan && (
            <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Are you still studying?</h3>

              <div className="space-y-3">
                <button
                  onClick={() => setStudentStatus('current')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    studentStatus === 'current'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-400 bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      studentStatus === 'current' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                      {studentStatus === 'current' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Currently Studying</p>
                      <p className="text-xs text-gray-600">I'm still at university or haven't started repayment</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setStudentStatus('graduated')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    studentStatus === 'graduated'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-400 bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      studentStatus === 'graduated' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                      {studentStatus === 'graduated' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Already Graduated</p>
                      <p className="text-xs text-gray-600">I've finished university and am in repayment</p>
                    </div>
                  </div>
                </button>
              </div>

              {studentStatus === 'graduated' && (
                <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                  <p className="text-sm text-blue-900">
                    ✓ You'll see an analysis of your current repayment, interest breakdown, and when your loan will be paid off or forgiven.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Year Finder View */
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <button
            onClick={() => setUseYearFinder(false)}
            className="mb-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to plan selection
          </button>

          <h3 className="text-lg font-bold text-gray-900 mb-4">What year did you start university?</h3>

          <input
            type="number"
            min="1998"
            max={new Date().getFullYear()}
            value={startYear}
            onChange={(e) => setStartYear(e.target.value ? parseInt(e.target.value) : '')}
            placeholder="e.g., 2020"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-lg"
          />

          {startYear && (
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              {typeof startYear === 'number' && getPlanByYear(startYear) && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Based on {startYear}, you're likely on:</p>
                  <p className="text-lg font-bold text-blue-600">{getPlanByYear(startYear)?.label}</p>
                  <button
                    onClick={handleYearSelect}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    Select this plan →
                  </button>
                </div>
              )}
              {typeof startYear === 'number' && !getPlanByYear(startYear) && (
                <p className="text-sm text-orange-600">
                  No plan found for {startYear}. Please check the year or select directly above.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button
          onClick={handleContinue}
          disabled={!selectedPlan || loading}
          loading={loading}
          size="lg"
        >
          Continue →
        </Button>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <strong>ℹ️ Why different plans?</strong> The UK government changed student loan rules multiple times. Each plan has different tuition fees, interest rates, repayment thresholds, and forgiveness periods. We support all plans so you can see your specific situation.
        </p>
      </div>
    </Card>
  )
}
