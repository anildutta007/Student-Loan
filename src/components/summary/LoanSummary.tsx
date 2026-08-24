import React from 'react'
import type { UserInput } from '@types/index'
import { UK_LOAN_SYSTEM, ACCOMMODATION_ESTIMATES } from '@utils/constants'
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
  const annualLiving = ACCOMMODATION_ESTIMATES.MID
  const annualMaintenance = userInput.maintenanceAllowance

  const tuitionTotal = annualTuition * userInput.yearsOfStudy
  const livingTotal = annualLiving * userInput.yearsOfStudy
  const maintenanceTotal = annualMaintenance * userInput.yearsOfStudy

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          STEP 2 OF 4: Loan Summary
        </h2>
        <p className="text-gray-600">
          Review the estimated total loan amount
        </p>
      </div>

      <div className="space-y-6">
        {/* Total Loan Box */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 mb-2">Total Loan Amount</p>
          <p className="text-4xl font-bold text-blue-900">
            {formatCurrency(totalLoan)}
          </p>
        </div>

        {/* Breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Tuition Fees</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(annualTuition)} × {userInput.yearsOfStudy} years
                </p>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(tuitionTotal)}
              </p>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Accommodation & Living</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(annualLiving)} × {userInput.yearsOfStudy} years
                </p>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(livingTotal)}
              </p>
            </div>

            {annualMaintenance > 0 && (
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Maintenance Allowance</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(annualMaintenance)} × {userInput.yearsOfStudy} years
                  </p>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(maintenanceTotal)}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center p-4 bg-blue-900 text-white rounded-lg font-semibold text-lg">
              <p>Total</p>
              <p>{formatCurrency(totalLoan)}</p>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            <strong>⚠️ Please Note:</strong> These are estimates based on standard England tuition fees and typical living costs. Actual costs may vary depending on:
          </p>
          <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc space-y-1">
            <li>Specific university and location</li>
            <li>Accommodation type (halls, private, home)</li>
            <li>Personal spending habits</li>
          </ul>
        </div>

        {/* Confirm Checkbox */}
        <label className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4"
            defaultChecked
          />
          <span className="ml-3 text-sm text-gray-700">
            I understand these are estimates and may need adjustment
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
