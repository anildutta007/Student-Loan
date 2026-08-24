import React from 'react'
import type { RepaymentOutput, UserInput } from '@types/index'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import { formatCurrency, formatCurrencyDecimal } from '@utils/calculations'

interface ScenarioComparisonProps {
  results: RepaymentOutput[]
  totalLoan: number
  userInput: UserInput
  loading?: boolean
  onNext: () => void
  onBack: () => void
}

const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  results,
  totalLoan,
  userInput,
  loading = false,
  onNext,
  onBack,
}) => {
  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          STEP 3 OF 4: Scenario Comparison
        </h2>
        <p className="text-gray-600">
          See how monthly payments differ based on different starting salaries
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
        <p className="text-sm text-blue-900 font-medium">Total Loan: {formatCurrency(totalLoan)}</p>
        <p className="text-sm text-blue-900 mt-1">
          All scenarios assume 5% annual salary growth and UK student loan Plan 2 repayment terms
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-y border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900">Scenario</th>
              <th className="text-right p-3 font-semibold text-gray-900">Starting Salary</th>
              <th className="text-right p-3 font-semibold text-gray-900">Year 1 Payment</th>
              <th className="text-right p-3 font-semibold text-gray-900">Years to Repay</th>
              <th className="text-right p-3 font-semibold text-gray-900">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr
                key={result.scenario}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: result.color }}
                    />
                    <span className="font-medium text-gray-900">{result.label}</span>
                  </div>
                </td>
                <td className="text-right p-3 text-gray-700">
                  {formatCurrency(result.startingSalary)}
                </td>
                <td className="text-right p-3 text-gray-700">
                  {formatCurrencyDecimal(result.firstYearMonthlyPayment)}/mo
                </td>
                <td className="text-right p-3 text-gray-700 font-semibold">
                  {result.yearsToRepayment} yrs
                </td>
                <td className="text-right p-3 text-gray-700 font-semibold">
                  {formatCurrency(result.totalAmountPaid)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-6 bg-gray-100 rounded-lg text-center text-gray-600">
          <p className="text-sm">📊 Chart 1: Monthly Payment Over Time</p>
          <p className="text-xs mt-2">(Graph component coming soon)</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg text-center text-gray-600">
          <p className="text-sm">📊 Chart 2: Repayment Timeline</p>
          <p className="text-xs mt-2">(Graph component coming soon)</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg text-center text-gray-600">
          <p className="text-sm">📊 Chart 3: Total Amount Paid</p>
          <p className="text-xs mt-2">(Graph component coming soon)</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg text-center text-gray-600">
          <p className="text-sm">📊 Chart 4: Loan Balance Over Time</p>
          <p className="text-xs mt-2">(Graph component coming soon)</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
        <h3 className="font-semibold text-green-900 mb-2">💡 Key Insights</h3>
        <ul className="text-sm text-green-900 space-y-1">
          <li>
            • <strong>Fastest payoff:</strong> Student {results.reduce((min, curr) =>
              curr.yearsToRepayment < min.yearsToRepayment ? curr : min
            ).scenario} in {results.reduce((min, curr) =>
              curr.yearsToRepayment < min.yearsToRepayment ? curr : min
            ).yearsToRepayment} years
          </li>
          <li>
            • <strong>Lowest lifetime cost:</strong> {formatCurrency(
              Math.min(...results.map(r => r.totalAmountPaid))
            )}
          </li>
          <li>
            • Monthly payments scale directly with salary growth at 5% annually
          </li>
        </ul>
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
          onClick={onNext}
          size="lg"
        >
          View Results →
        </Button>
      </div>
    </Card>
  )
}

export default ScenarioComparison
