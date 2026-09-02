import React from 'react'
import type { RepaymentOutput, UserInput } from '@types/index'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import { formatCurrency, formatCurrencyDecimal } from '@utils/calculations'
import PaymentChart from '@components/charts/PaymentChart'
import TotalPaidChart from '@components/charts/TotalPaidChart'
import BalanceChart from '@components/charts/BalanceChart'
import InterestBreakdownChart from '@components/charts/InterestBreakdownChart'

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
          STEP 3 OF 4: Scenario Comparison
        </h2>
        <p className="text-gray-600">
          See how monthly payments differ based on different starting salaries
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
        <p className="text-sm text-blue-900 font-medium">Total Loan Needed: {formatCurrency(totalLoan)}</p>
        <p className="text-sm text-blue-900 mt-1">
          All scenarios assume 5% annual salary growth and UK student loan Plan 2 repayment terms
        </p>
      </div>

      {/* Scenario Summary Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-y border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900">Scenario</th>
              <th className="text-right p-3 font-semibold text-gray-900">Starting Salary</th>
              <th className="text-right p-3 font-semibold text-gray-900">Year 1 Monthly Payment</th>
              <th className="text-right p-3 font-semibold text-gray-900">Years to Repay</th>
              <th className="text-right p-3 font-semibold text-gray-900">Total Amount Paid</th>
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
                  {formatCurrencyDecimal(result.firstYearMonthlyPayment)}
                </td>
                <td className="text-right p-3 text-gray-700 font-semibold">
                  {result.yearsToRepayment} years
                </td>
                <td className="text-right p-3 text-gray-700 font-semibold">
                  {formatCurrency(result.totalAmountPaid)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4 Key Charts */}
      <div className="space-y-8">
        {/* 1. Monthly Payment Over Time */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Monthly Payment Over Time</h3>
          <div className="h-96">
            <PaymentChart results={results} />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Shows how monthly payments increase with salary growth (5% annually). Higher starting salaries lead to higher payments but faster loan repayment.
          </p>
        </div>

        {/* 2. Total Amount Paid */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Total Amount Paid by Scenario</h3>
          <div className="h-96">
            <TotalPaidChart results={results} />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Total repayment over the entire loan term including all interest. Higher earners pay more in total due to longer higher payments.
          </p>
        </div>

        {/* 3. Interest vs Principal Comparison */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔀 Interest vs Principal Comparison</h3>
          <div className="h-96">
            <InterestBreakdownChart results={results} totalLoan={totalLoan} />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Stacked breakdown showing the principal (original loan) vs interest charged on each scenario. Higher interest is paid when repayment takes longer.
          </p>
        </div>

        {/* 4. Loan Balance Over Time */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📉 Loan Balance Over Time</h3>
          <div className="h-96">
            <BalanceChart results={results} />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Shows how the outstanding loan balance decreases over time as payments are made. Loan is forgiven if unpaid after 40 years.
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-8 mb-6">
        <h3 className="font-semibold text-green-900 mb-3">💡 Key Insights</h3>
        <ul className="text-sm text-green-900 space-y-2">
          <li>
            <strong>Fastest payoff:</strong> Student {fastestRepayment.scenario} in {fastestRepayment.yearsToRepayment} years
          </li>
          <li>
            <strong>Lowest lifetime cost:</strong> {formatCurrency(lowestCost.totalAmountPaid)} (Student {lowestCost.scenario})
          </li>
          <li>
            <strong>Monthly payments scale with salary:</strong> Each scenario assumes consistent 5% annual salary growth after graduation
          </li>
          <li>
            <strong>Career impact:</strong> Higher starting salaries lead to faster loan repayment and greater long-term financial freedom
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
          View Results & Comparison →
        </Button>
      </div>
    </Card>
  )
}

export default ScenarioComparison
