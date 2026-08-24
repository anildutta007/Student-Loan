import React from 'react'
import type { RepaymentOutput, UserInput } from '@types/index'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import { formatCurrency, formatCurrencyDecimal } from '@utils/calculations'
import PaymentChart from '@components/charts/PaymentChart'
import TimelineChart from '@components/charts/TimelineChart'
import TotalPaidChart from '@components/charts/TotalPaidChart'
import BalanceChart from '@components/charts/BalanceChart'
import InterestAccrualChart from '@components/charts/InterestAccrualChart'
import InterestBreakdownChart from '@components/charts/InterestBreakdownChart'
import InterestImpactChart from '@components/charts/InterestImpactChart'
import ParentInvestmentChart from '@components/charts/ParentInvestmentChart'

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

      {/* Charts - Repayment Overview */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Repayment Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <PaymentChart results={results} />
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <TimelineChart results={results} />
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <TotalPaidChart results={results} />
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <BalanceChart results={results} />
          </div>
        </div>
      </div>

      {/* Charts - Interest Analysis */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Interest Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <InterestAccrualChart results={results} />
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <InterestBreakdownChart results={results} totalLoan={totalLoan} />
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg md:col-span-2">
            <InterestImpactChart results={results} totalLoan={totalLoan} />
          </div>
        </div>
      </div>

      {/* Parent Investment Comparison */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💼 Parent Investment Scenario</h3>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <ParentInvestmentChart results={results} totalLoan={totalLoan} />
        </div>

        {/* Detailed Comparison Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-y border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-900">Scenario</th>
                <th className="text-right p-3 font-semibold text-gray-900">Original Loan</th>
                <th className="text-right p-3 font-semibold text-gray-900">Years to Repay</th>
                <th className="text-right p-3 font-semibold text-gray-900">Total Loan Cost</th>
                <th className="text-right p-3 font-semibold text-gray-900">Investment Value (3%)</th>
                <th className="text-right p-3 font-semibold text-gray-900">Investment Gain</th>
                <th className="text-right p-3 font-semibold text-gray-900">Difference</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const investmentValue = totalLoan * Math.pow(1.03, result.yearsToRepayment)
                const investmentGain = investmentValue - totalLoan
                const difference = investmentValue - result.totalAmountPaid

                return (
                  <tr
                    key={result.scenario}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-medium text-gray-900">
                      Student {result.scenario}
                    </td>
                    <td className="text-right p-3 text-gray-700">
                      {formatCurrency(totalLoan)}
                    </td>
                    <td className="text-right p-3 text-gray-700">
                      {result.yearsToRepayment} years
                    </td>
                    <td className="text-right p-3 text-red-700 font-semibold">
                      {formatCurrency(result.totalAmountPaid)}
                    </td>
                    <td className="text-right p-3 text-green-700 font-semibold">
                      {formatCurrency(Math.round(investmentValue))}
                    </td>
                    <td className="text-right p-3 text-green-600 font-semibold">
                      {formatCurrency(Math.round(investmentGain))}
                    </td>
                    <td className="text-right p-3 font-semibold"
                      style={{
                        color: difference > 0 ? '#059669' : '#dc2626'
                      }}>
                      {formatCurrency(Math.round(difference))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Explanation */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-semibold mb-2">📊 How to Read This:</p>
          <ul className="text-sm text-blue-900 space-y-1 ml-4 list-disc">
            <li><strong>Original Loan:</strong> Amount needed for college</li>
            <li><strong>Total Loan Cost:</strong> What student actually pays back (includes interest)</li>
            <li><strong>Investment Value:</strong> If parent had invested the money at 3% annually instead</li>
            <li><strong>Investment Gain:</strong> Growth from 3% returns over repayment period</li>
            <li><strong>Difference:</strong> How much MORE the investment would be worth vs loan cost</li>
            <li><strong>Positive difference:</strong> Investment would have been more valuable than taking the loan</li>
          </ul>
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
