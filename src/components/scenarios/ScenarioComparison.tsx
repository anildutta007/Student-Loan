import React from 'react'
import type { RepaymentOutput, UserInput } from '@types/index'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import { formatCurrency, formatCurrencyDecimal } from '@utils/calculations'
import InterestBreakdownChart from '@components/charts/InterestBreakdownChart'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ScenarioComparisonProps {
  results: RepaymentOutput[]
  fullLoanResults?: RepaymentOutput[] | null
  totalLoan: number
  userInput: UserInput
  loading?: boolean
  onNext: () => void
  onBack: () => void
}

const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  results,
  fullLoanResults,
  totalLoan,
  userInput,
  loading = false,
  onNext,
  onBack,
}) => {
  const hasParentalContribution = (userInput.parentalContribution ?? 0) > 0

  // Prepare data for payments over time chart
  const paymentsChartData = React.useMemo(() => {
    if (!results[0]?.repaymentTimeline) return []

    const data: any[] = []
    const maxYears = Math.max(...results.map(r => r.repaymentTimeline.length))

    for (let i = 1; i <= maxYears; i++) {
      const point: any = { year: i }

      // Add with contribution lines
      results.forEach((result) => {
        const yearData = result.repaymentTimeline.find(y => y.year === i)
        if (yearData) {
          point[`Student ${result.scenario}`] = yearData.monthlyPayment
        }
      })

      // Add without contribution lines if applicable
      if (hasParentalContribution && fullLoanResults) {
        fullLoanResults.forEach((result) => {
          const yearData = result.repaymentTimeline.find(y => y.year === i)
          if (yearData) {
            point[`Student ${result.scenario} (Full Loan)`] = yearData.monthlyPayment
          }
        })
      }

      data.push(point)
    }
    return data
  }, [results, fullLoanResults, hasParentalContribution])

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          STEP 2 OF 3: Scenario Comparison
        </h2>
        <p className="text-gray-600">
          Compare all scenarios: with and without parental contribution
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
        <p className="text-sm text-blue-900 font-medium">Total Loan Needed: {formatCurrency(totalLoan)}</p>
        <p className="text-sm text-blue-900 mt-1">
          All scenarios assume 5% annual salary growth and UK student loan Plan 2 repayment terms
        </p>
      </div>

      {/* TABLE 1: Without Contribution */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Table 1: Without Parental Contribution (Full Loan)</h3>
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-yellow-100 border-b-2 border-gray-300">
                <th className="text-left p-3 font-bold text-gray-900 border-r border-gray-300">Scenario</th>
                <th className="text-right p-3 font-bold text-gray-900 border-r border-gray-300">Starting Salary</th>
                <th className="text-right p-3 font-bold text-gray-900 border-r border-gray-300">Years</th>
                <th className="text-right p-3 font-bold text-gray-900 border-r border-gray-300">Interest Paid</th>
                <th className="text-right p-3 font-bold text-gray-900">Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => {
                const fullLoanResult = fullLoanResults?.[idx]
                return (
                  <tr key={result.scenario} className="border-b border-gray-200 hover:bg-yellow-50">
                    <td className="p-3 font-bold text-gray-900 border-r border-gray-300">Student {result.scenario}</td>
                    <td className="text-right p-3 text-gray-700 border-r border-gray-300 font-semibold">{formatCurrency(result.startingSalary)}</td>
                    <td className="text-right p-3 text-gray-700 border-r border-gray-300 font-semibold">{fullLoanResult?.yearsToRepayment || '-'}</td>
                    <td className="text-right p-3 text-gray-700 border-r border-gray-300">{formatCurrency(fullLoanResult?.interestPaid || 0)}</td>
                    <td className="text-right p-3 text-gray-700 font-semibold">{formatCurrency(fullLoanResult?.totalAmountPaid || 0)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE 2: With Contribution (only if applicable) */}
      {hasParentalContribution && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Table 2: With Parental Contribution (£{userInput.parentalContribution?.toLocaleString()}) - Pay vs Invest Analysis</h3>
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-100 border-b-2 border-gray-300">
                  <th className="text-left p-3 font-bold text-gray-900 border-r border-gray-300">Scenario</th>
                  <th className="text-right p-3 font-bold text-gray-900 border-r border-gray-300">Years</th>
                  <th className="text-right p-3 font-bold text-gray-900 border-r border-gray-300">Interest Paid</th>
                  <th className="text-right p-3 font-bold text-gray-900 border-r border-gray-300">Total Paid</th>
                  <th className="text-right p-3 font-bold text-gray-900 bg-green-100 border-r border-gray-300">Interest Saved</th>
                  <th className="text-right p-3 font-bold text-gray-900 bg-green-100 border-r border-gray-300">Invest @ 3%</th>
                  <th className="text-right p-3 font-bold text-gray-900 bg-green-100 border-r border-gray-300">Invest @ 4%</th>
                  <th className="text-right p-3 font-bold text-gray-900 bg-green-100 border-r border-gray-300">Invest @ 5%</th>
                  <th className="text-right p-3 font-bold text-gray-900 bg-purple-100">Better Option</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => {
                  const fullLoanResult = fullLoanResults?.[idx]
                  const investmentYears = fullLoanResult?.yearsToRepayment || result.yearsToRepayment
                  const contribution = userInput.parentalContribution || 0
                  const invGrowth3 = contribution * Math.pow(1.03, investmentYears)
                  const invGrowth4 = contribution * Math.pow(1.04, investmentYears)
                  const invGrowth5 = contribution * Math.pow(1.05, investmentYears)

                  // Interest saved by paying upfront
                  const interestSaved = (fullLoanResult?.interestPaid || 0) - result.interestPaid

                  // Compare: is it better to pay upfront or invest?
                  const payUpfrontBenefit = interestSaved - invGrowth4 // Using 4% as default comparison
                  const betterOption = payUpfrontBenefit > 0 ? `Pay upfront (+£${Math.round(payUpfrontBenefit).toLocaleString()})` : `Invest at 4% (+£${Math.round(Math.abs(payUpfrontBenefit)).toLocaleString()})`

                  return (
                    <tr key={result.scenario} className="border-b border-gray-200 hover:bg-blue-50">
                      <td className="p-3 font-bold text-gray-900 border-r border-gray-300">Student {result.scenario}</td>
                      <td className="text-right p-3 text-gray-700 border-r border-gray-300 font-semibold">{result.yearsToRepayment}</td>
                      <td className="text-right p-3 text-gray-700 border-r border-gray-300">{formatCurrency(result.interestPaid)}</td>
                      <td className="text-right p-3 text-gray-700 border-r border-gray-300 font-semibold">{formatCurrency(result.totalAmountPaid)}</td>
                      <td className="text-right p-3 text-gray-700 bg-green-50 border-r border-gray-300 font-bold text-green-900">{formatCurrency(Math.round(interestSaved))}</td>
                      <td className="text-right p-3 text-gray-700 bg-green-50 border-r border-gray-300 text-xs">{formatCurrency(Math.round(invGrowth3))}</td>
                      <td className="text-right p-3 text-gray-700 bg-green-50 border-r border-gray-300 text-xs font-semibold">{formatCurrency(Math.round(invGrowth4))}</td>
                      <td className="text-right p-3 text-gray-700 bg-green-50 border-r border-gray-300 text-xs">{formatCurrency(Math.round(invGrowth5))}</td>
                      <td className={`text-right p-3 border-r border-gray-300 font-semibold ${payUpfrontBenefit > 0 ? 'bg-purple-100 text-purple-900' : 'bg-amber-100 text-amber-900'}`}>
                        {betterOption}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Explanation */}
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-900 font-semibold mb-2">💡 How to Read Table 2:</p>
            <ul className="text-sm text-purple-900 space-y-1 ml-4 list-disc">
              <li><strong>Interest Saved:</strong> How much less you'll pay in interest by paying upfront</li>
              <li><strong>Invest @ 3%/4%/5%:</strong> How much your £{userInput.parentalContribution?.toLocaleString()} would grow if invested instead</li>
              <li><strong>Better Option:</strong> Shows which strategy wins and by how much</li>
            </ul>
          </div>
        </div>
      )}

      {/* Charts Section - Only 2 Charts */}
      <div className="space-y-8 mt-8">
        {/* 1. Interest vs Principal Comparison */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔀 Interest vs Principal Comparison (All Students)</h3>
          <div className="h-96">
            <InterestBreakdownChart
              results={results}
              totalLoan={totalLoan + (hasParentalContribution ? (userInput.parentalContribution || 0) : 0)}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Shows how much of total payment is principal (loan amount) vs interest charged. Higher earners pay more interest due to longer repayment time.
          </p>
        </div>

        {/* 2. Monthly Payments Over Years */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Monthly Payments Over Years</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={paymentsChartData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Monthly Payment (£)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => formatCurrencyDecimal(value as number)} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />

              {/* With Contribution Lines (solid) */}
              {results.map((result) => (
                <Line
                  key={`with-${result.scenario}`}
                  type="monotone"
                  dataKey={`Student ${result.scenario}`}
                  stroke={result.color}
                  dot={false}
                  strokeWidth={2}
                />
              ))}

              {/* Without Contribution Lines (dashed) - shows extra years */}
              {hasParentalContribution && fullLoanResults && fullLoanResults.map((result) => (
                <Line
                  key={`without-${result.scenario}`}
                  type="monotone"
                  dataKey={`Student ${result.scenario} (Full Loan)`}
                  stroke={result.color}
                  dot={false}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  opacity={0.6}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-3">
            Shows monthly payments increasing with salary growth (5% annually).
            {hasParentalContribution && ' Dashed lines show higher payments needed when no contribution is made.'}
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-8 mb-6">
        <h3 className="font-semibold text-green-900 mb-3">💡 Key Insights</h3>
        <ul className="text-sm text-green-900 space-y-2">
          <li>
            <strong>Comparison:</strong> Table 1 shows costs WITHOUT contribution; Table 2 shows the impact WITH contribution
          </li>
          <li>
            <strong>Pay vs Invest:</strong> Table 2's "Better Option" column tells you if paying upfront saves more money than investing
          </li>
          <li>
            <strong>Payment Progression:</strong> Higher salaries lead to faster repayment and financial freedom sooner
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
          View Dynamic Analysis →
        </Button>
      </div>
    </Card>
  )
}

export default ScenarioComparison
