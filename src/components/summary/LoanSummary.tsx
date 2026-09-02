import React, { useState } from 'react'
import type { UserInput } from '@types/index'
import { UK_LOAN_SYSTEM, LIVING_SITUATION_OPTIONS } from '@utils/constants'
import { formatCurrency } from '@utils/calculations'
import Button from '@components/common/Button'
import Card from '@components/common/Card'

interface LoanSummaryProps {
  userInput: UserInput
  totalLoan: number
  loading?: boolean
  onConfirm: (updatedInput: UserInput) => void
  onBack: () => void
}

const LoanSummary: React.FC<LoanSummaryProps> = ({
  userInput,
  totalLoan,
  loading = false,
  onConfirm,
  onBack,
}) => {
  const [parentalContribution, setParentalContribution] = useState(userInput.parentalContribution ?? 0)

  const annualTuition = UK_LOAN_SYSTEM.TUITION_FEE_ANNUAL
  const annualMaintenance = userInput.annualMaintenanceActual ?? 0
  const maxLoanAvailable = (annualTuition + annualMaintenance) * userInput.yearsOfStudy

  const tuitionTotal = annualTuition * userInput.yearsOfStudy
  const maintenanceTotal = annualMaintenance * userInput.yearsOfStudy
  const subtotal = tuitionTotal + maintenanceTotal
  const finalTotal = Math.max(0, subtotal - parentalContribution)


  const handleConfirm = () => {
    // Update userInput with new parental contribution and call onConfirm
    const updatedInput: UserInput = {
      ...userInput,
      parentalContribution,
    }
    onConfirm(updatedInput)
  }

  // Get living situation label
  const livingLabel = LIVING_SITUATION_OPTIONS.find(
    opt => opt.value === userInput.livingSituation
  )?.label || 'Unknown'

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          STEP 2 OF 4: Loan Summary & Parental Contribution
        </h2>
        <p className="text-gray-600">
          Review calculated loan costs and set parental contribution
        </p>
      </div>

      <div className="space-y-6">
        {/* Student Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase font-semibold">Years of Study</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{userInput.yearsOfStudy} years</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase font-semibold">Living Situation</p>
            <p className="text-sm font-bold text-gray-900 mt-1">{livingLabel}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase font-semibold">Household Income</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(userInput.householdIncome)}</p>
          </div>
        </div>

        {/* Key Figures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Max Loan Available */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-semibold uppercase mb-2">Max Loan Available</p>
            <p className="text-3xl font-bold text-blue-900">{formatCurrency(maxLoanAvailable)}</p>
            <p className="text-xs text-blue-800 mt-2">Tuition + Maintenance (before contribution)</p>
          </div>

          {/* Total Loan Needed */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
            <p className="text-sm text-green-900 font-semibold uppercase mb-2">Total Loan Needed</p>
            <p className="text-3xl font-bold text-green-900">{formatCurrency(finalTotal)}</p>
            <p className="text-xs text-green-800 mt-2">After your contribution</p>
          </div>
        </div>

        {/* Breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <div className="space-y-3">
            {/* Tuition (non-editable) */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Tuition Fees (2026/27)</p>
                <p className="text-sm text-gray-600">{formatCurrency(annualTuition)}/year × {userInput.yearsOfStudy} years</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(tuitionTotal)}</p>
            </div>

            {/* Maintenance (non-editable) */}
            <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Maintenance Allowance (eligible)</p>
                <p className="text-sm text-gray-600">{formatCurrency(annualMaintenance)}/year × {userInput.yearsOfStudy} years</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(maintenanceTotal)}</p>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center p-3 bg-gray-100 border border-gray-300 rounded-lg font-semibold">
              <p className="text-gray-900">Subtotal (Max Loan)</p>
              <p className="text-gray-900">{formatCurrency(subtotal)}</p>
            </div>

            {/* Parental Contribution (EDITABLE) */}
            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <label className="block text-sm font-semibold text-purple-900 mb-3">
                💰 Your Parental Contribution (Editable)
              </label>
              <div className="relative mb-3">
                <span className="absolute left-3 top-3 text-gray-600 text-lg">£</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  max={maxLoanAvailable}
                  value={parentalContribution}
                  onChange={(e) => setParentalContribution(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2 border border-purple-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-purple-800">
                Maximum available: {formatCurrency(maxLoanAvailable)}
              </p>
            </div>

            {/* Final Total */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold text-lg">
              <p>Final Loan Amount Needed</p>
              <p className="text-2xl">{formatCurrency(finalTotal)}</p>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ 2026/27 System:</strong> The UK student loan covers tuition (£{formatCurrency(annualTuition)}/year for 2026-27) and eligible maintenance allowance based on your living situation and household income.
          </p>
          <p className="text-sm text-blue-900">
            <strong>Interest:</strong> 4.5% RPI applies during study AND after graduation. Your loan will be forgiven after 40 years.
          </p>
          <p className="text-sm text-blue-900">
            <strong>Maintenance Taper:</strong> Your eligible allowance reduces gradually if household income exceeds £25,000, with a guaranteed minimum floor.
          </p>
          <p className="text-sm text-blue-900 mt-3">
            <strong>Useful Resources:</strong>
            <br />
            • <a href="https://www.gov.uk/student-finance-england" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Student Finance England (Official)</a>
            <br />
            • <a href="https://www.slc.co.uk/borrowers/repayment/how-repayment-works.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SLC - How Repayment Works</a>
            <br />
            • <a href="https://www.gov.uk/guidance/plan-2-student-loans-overview" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Plan 2 Student Loans Overview</a>
          </p>
        </div>

        {/* Confirm Checkbox */}
        <label className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4"
            defaultChecked
          />
          <span className="ml-3 text-sm text-gray-700">
            I understand these are estimates based on 2026/27 rates and may change
          </span>
        </label>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ How this works:</strong> The tuition fee (£{formatCurrency(annualTuition)}/year for 2026-27) and eligible maintenance allowance are calculated based on your situation. You can adjust your parental contribution to see how it reduces the loan amount needed. Investment potential shows what your contribution could grow to if invested at 4% annually over your study period.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3">
          <Button
            variant="secondary"
            onClick={onBack}
          >
            ← Back
          </Button>
          <Button
            loading={loading}
            onClick={handleConfirm}
            size="lg"
          >
            Next: View Scenarios →
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default LoanSummary
