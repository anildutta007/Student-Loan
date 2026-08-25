import React from 'react'
import type { RepaymentOutput, UserInput } from '@types/index'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import { formatCurrency, formatCurrencyDecimal } from '@utils/calculations'
import { exportScenariosToExcel } from '@utils/exportToExcel'

interface ResultsSummaryProps {
  results: RepaymentOutput[]
  totalLoan: number
  userInput: UserInput
  onReset: () => void
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  results,
  totalLoan,
  userInput,
  onReset,
}) => {
  const fastestRepayment = results.reduce((min, curr) =>
    curr.yearsToRepayment < min.yearsToRepayment ? curr : min
  )

  const lowestCost = results.reduce((min, curr) =>
    curr.totalAmountPaid < min.totalAmountPaid ? curr : min
  )

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          STEP 4 OF 4: Your Results
        </h2>
        <p className="text-gray-600">
          Summary of your child's expected loan repayment scenarios
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900 font-medium uppercase tracking-wide">Total Loan</p>
          <p className="text-2xl font-bold text-blue-900 mt-2">{formatCurrency(totalLoan)}</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
          <p className="text-xs text-green-900 font-medium uppercase tracking-wide">
            Fastest Payoff
          </p>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {fastestRepayment.yearsToRepayment} years
          </p>
          <p className="text-xs text-green-800 mt-1">Student {fastestRepayment.scenario}</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
        <h3 className="font-semibold text-purple-900 mb-3">📊 Key Insights</h3>
        <ul className="space-y-2 text-sm text-purple-900">
          <li className="flex gap-2">
            <span>✓</span>
            <span>
              <strong>Repayment Timeline:</strong> Ranges from {fastestRepayment.yearsToRepayment} years (Student {fastestRepayment.scenario}) to {results.reduce((max, curr) =>
                curr.yearsToRepayment > max.yearsToRepayment ? curr : max
              ).yearsToRepayment} years (Student {results.reduce((max, curr) =>
                curr.yearsToRepayment > max.yearsToRepayment ? curr : max
              ).scenario})
            </span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>
              <strong>Monthly Payments:</strong> Start from {formatCurrencyDecimal(
                Math.min(...results.map(r => r.firstYearMonthlyPayment))
              )}/month to {formatCurrencyDecimal(
                Math.max(...results.map(r => r.firstYearMonthlyPayment))
              )}/month
            </span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>
              <strong>Lifetime Cost:</strong> Total repayment ranges from {formatCurrency(
                lowestCost.totalAmountPaid
              )} to {formatCurrency(
                Math.max(...results.map(r => r.totalAmountPaid))
              )}
            </span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>
              <strong>Career Impact:</strong> Higher starting salaries lead to faster loan repayment and financial freedom sooner
            </span>
          </li>
        </ul>
      </div>

      {/* Detailed Results Table */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Detailed Scenario Breakdown</h3>
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.scenario}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              style={{ borderLeftColor: result.color, borderLeftWidth: '4px' }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{result.label}</h4>
                  <p className="text-sm text-gray-600">
                    Starting Salary: {formatCurrency(result.startingSalary)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                <div>
                  <p className="text-gray-600">Year 1 Payment</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrencyDecimal(result.firstYearMonthlyPayment)}/mo
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Years to Repay</p>
                  <p className="font-semibold text-gray-900">{result.yearsToRepayment} yrs</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Paid</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(result.totalAmountPaid)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Interest</p>
                  <p className="font-semibold text-gray-900">
                    {result.interestPaid > 0 ? '+' : ''}{formatCurrency(result.interestPaid)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
        <h3 className="font-semibold text-amber-900 mb-2">📋 Next Steps</h3>
        <ol className="text-sm text-amber-900 space-y-1 list-decimal list-inside">
          <li>Share these results with your child</li>
          <li>Discuss realistic career expectations and salary progression</li>
          <li>Consider if parental contribution can reduce the loan needed</li>
          <li>Review actual university costs and adjust if needed</li>
          <li>Visit Student Finance England for official guidance</li>
        </ol>
      </div>

      {/* Resources */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">🔗 Useful Resources</h3>
        <ul className="text-sm text-blue-900 space-y-1">
          <li>
            <a
              href="https://www.gov.uk/student-finance-england"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-700"
            >
              Student Finance England (Official)
            </a>
          </li>
          <li>
            <a
              href="https://www.slc.co.uk/borrowers/repayment/how-repayment-works.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-700"
            >
              Student Loans Company - How Repayment Works
            </a>
          </li>
          <li>
            <a
              href="https://www.gov.uk/guidance/plan-2-student-loans-overview"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-700"
            >
              Plan 2 Student Loans Overview
            </a>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button
          variant="secondary"
          onClick={() => exportScenariosToExcel(results, totalLoan, userInput)}
          size="lg"
        >
          📊 Export to Excel
        </Button>
        <Button
          variant="secondary"
          onClick={onReset}
          size="lg"
        >
          🔄 Try Another
        </Button>
        <Button
          variant="primary"
          onClick={() => window.print()}
          size="lg"
        >
          🖨️ Print
        </Button>
      </div>
    </Card>
  )
}

export default ResultsSummary
