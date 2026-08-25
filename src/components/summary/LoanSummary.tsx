import React from 'react'
import type { UserInput } from '@types/index'
import { UK_LOAN_SYSTEM, LIVING_SITUATION_OPTIONS } from '@utils/constants'
import { formatCurrency } from '@utils/calculations'
import Button from '@components/common/Button'
import Card from '@components/common/Card'

interface LoanSummaryProps {
  userInput: UserInput
  totalLoan: number
  loading?: boolean
  onConfirm: () => void
  onBack: () => void
}

const LoanSummary: React.FC<LoanSummaryProps> = ({
  userInput,
  totalLoan,
  loading = false,
  onConfirm,
  onBack,
}) => {
  const annualTuition = UK_LOAN_SYSTEM.TUITION_FEE_ANNUAL
  const annualMaintenance = userInput.annualMaintenanceActual ?? 0

  const tuitionTotal = annualTuition * userInput.yearsOfStudy
  const maintenanceTotal = annualMaintenance * userInput.yearsOfStudy
  const subtotal = tuitionTotal + maintenanceTotal
  const finalTotal = Math.max(0, subtotal - (userInput.parentalContribution ?? 0))

  // Get living situation label
  const livingLabel = LIVING_SITUATION_OPTIONS.find(
    opt => opt.value === userInput.livingSituation
  )?.label || 'Unknown'

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          STEP 2 OF 4: Loan Summary
        </h2>
        <p className="text-gray-600">
          Review your estimated loan amount for 2026/27
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
            <p className="text-lg font-bold text-gray-900 mt-1">{livingLabel}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase font-semibold">Household Income</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(userInput.householdIncome)}</p>
          </div>
        </div>

        {/* Total Loan Box */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 mb-2">Total Loan Amount Needed</p>
          <p className="text-4xl font-bold text-blue-900">
            {formatCurrency(finalTotal)}
          </p>
        </div>

        {/* Breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Breakdown</h3>
          <div className="space-y-3">
            {/* Tuition */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Tuition Fees</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(annualTuition)}/year × {userInput.yearsOfStudy} years
                </p>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(tuitionTotal)}
              </p>
            </div>

            {/* Maintenance */}
            <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Maintenance Allowance</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(annualMaintenance)}/year × {userInput.yearsOfStudy} years
                </p>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(maintenanceTotal)}
              </p>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg font-semibold">
              <p>Subtotal (before parental contribution)</p>
              <p>{formatCurrency(subtotal)}</p>
            </div>

            {/* Parental Contribution */}
            {(userInput.parentalContribution ?? 0) > 0 && (
              <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Parental Contribution</p>
                  <p className="text-sm text-gray-600">Reducing loan amount</p>
                </div>
                <p className="text-lg font-semibold text-purple-900">
                  -{formatCurrency(userInput.parentalContribution)}
                </p>
              </div>
            )}

            {/* Total Loan */}
            <div className="flex justify-between items-center p-4 bg-blue-900 text-white rounded-lg font-semibold text-lg">
              <p>Total Loan Needed</p>
              <p>{formatCurrency(finalTotal)}</p>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ 2026/27 System:</strong> The UK student loan covers tuition (£9,250/year) and eligible maintenance allowance based on your living situation and household income.
          </p>
          <p className="text-sm text-blue-900">
            <strong>Interest:</strong> 4.5% RPI applies during study AND after graduation. Your loan will be forgiven after 40 years.
          </p>
          <p className="text-sm text-blue-900">
            <strong>Maintenance Taper:</strong> Your eligible allowance reduces gradually if household income exceeds £25,000, with a guaranteed minimum floor.
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
            onClick={onConfirm}
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
