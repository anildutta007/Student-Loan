import React, { useMemo, useState } from 'react'
import type { RepaymentOutput, UserInput } from '@types/index'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import { formatCurrency, formatCurrencyDecimal } from '@utils/calculations'
import { exportScenariosToExcel } from '@utils/exportToExcel'
import {
  buildDynamicRepaymentTimeline,
  buildDynamicFullLoanTimeline,
  calculateRepaymentMetrics,
  generateInvestmentProjection,
} from '@utils/dynamicScenarioCalculations'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ResultsSummaryProps {
  results: RepaymentOutput[]
  fullLoanResults?: RepaymentOutput[] | null
  totalLoan: number
  userInput: UserInput
  onBack: () => void
  onReset: () => void
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  results,
  fullLoanResults,
  totalLoan,
  userInput,
  onBack,
  onReset,
}) => {
  // Dynamic analysis state
  const [customRpiRate, setCustomRpiRate] = useState(0.045) // 4.5% default
  const [customSalary, setCustomSalary] = useState(results[0]?.startingSalary || 30000)
  const [customContribution, setCustomContribution] = useState(userInput.parentalContribution || 0)

  const hasParentalContribution = (userInput.parentalContribution ?? 0) > 0

  // Calculate dynamic scenarios based on custom inputs
  const dynamicWithContribution = useMemo(() => {
    return buildDynamicRepaymentTimeline({
      totalLoan: totalLoan + (customContribution > 0 ? customContribution : 0),
      yearsOfStudy: userInput.yearsOfStudy,
      startingSalary: customSalary,
      annualIncrement: 0.05,
      interestRate: customRpiRate,
      parentalContribution: customContribution,
    })
  }, [totalLoan, userInput.yearsOfStudy, customSalary, customRpiRate, customContribution])

  const dynamicWithoutContribution = useMemo(() => {
    return buildDynamicFullLoanTimeline({
      totalLoan: totalLoan + (customContribution > 0 ? customContribution : 0),
      yearsOfStudy: userInput.yearsOfStudy,
      startingSalary: customSalary,
      annualIncrement: 0.05,
      interestRate: customRpiRate,
      parentalContribution: 0,
    })
  }, [totalLoan, userInput.yearsOfStudy, customSalary, customRpiRate])

  const dynamicMetricsWithContribution = useMemo(() =>
    calculateRepaymentMetrics(dynamicWithContribution),
    [dynamicWithContribution]
  )

  const dynamicMetricsWithoutContribution = useMemo(() =>
    calculateRepaymentMetrics(dynamicWithoutContribution),
    [dynamicWithoutContribution]
  )

  const investmentProjection = useMemo(() =>
    generateInvestmentProjection(customContribution, dynamicMetricsWithContribution.yearsToRepayment),
    [customContribution, dynamicMetricsWithContribution.yearsToRepayment]
  )

  // Calculate key metrics
  const reducedLoanFastest = results.reduce((min, curr) =>
    curr.yearsToRepayment < min.yearsToRepayment ? curr : min
  )

  const fullLoanFastest = fullLoanResults?.[0] ? fullLoanResults.reduce((min, curr) =>
    curr.yearsToRepayment < min.yearsToRepayment ? curr : min
  ) : null

  // Prepare comparison data for charts
  const monthlyPaymentData = useMemo(() => {
    if (!results[0]?.repaymentTimeline) return []

    const data: any[] = []
    const timeline = results[0].repaymentTimeline
    const fullTimeline = fullLoanResults?.[0]?.repaymentTimeline || []

    for (let i = 0; i < Math.min(timeline.length, 35); i++) {
      const point: any = {
        year: i + 1,
        'With Contribution': Math.round(timeline[i]?.monthlyPayment * 100) / 100,
      }
      if (hasParentalContribution && fullTimeline[i]) {
        point['Without Contribution'] = Math.round(fullTimeline[i].monthlyPayment * 100) / 100
      }
      data.push(point)
    }
    return data
  }, [results, fullLoanResults, hasParentalContribution])

  // Total Amount Paid comparison
  const totalAmountPaidData = useMemo(() => {
    const data: any[] = []
    results.forEach((result, idx) => {
      const fullResult = fullLoanResults?.[idx]
      const point: any = {
        scenario: `Student ${result.scenario}`,
        'With Contribution': result.totalAmountPaid,
      }
      if (hasParentalContribution && fullResult) {
        point['Without Contribution'] = fullResult.totalAmountPaid
        point['Savings'] = fullResult.totalAmountPaid - result.totalAmountPaid
      }
      data.push(point)
    })
    return data
  }, [results, fullLoanResults, hasParentalContribution])

  // Interest vs Principal comparison
  const interestPrincipalData = useMemo(() => {
    const data: any[] = []
    results.forEach((result, idx) => {
      const fullResult = fullLoanResults?.[idx]
      const principal = result.repaymentTimeline[0]?.loanBalance || totalLoan
      const interest = result.interestPaid

      const point: any = {
        scenario: `Student ${result.scenario}`,
        'Principal (Reduced)': principal,
        'Interest (Reduced)': interest,
      }

      if (hasParentalContribution && fullResult) {
        const fullPrincipal = fullResult.repaymentTimeline[0]?.loanBalance || (totalLoan + (userInput.parentalContribution || 0))
        const fullInterest = fullResult.interestPaid
        point['Principal (Full Loan)'] = fullPrincipal
        point['Interest (Full Loan)'] = fullInterest
      }
      data.push(point)
    })
    return data
  }, [results, fullLoanResults, hasParentalContribution, totalLoan, userInput.parentalContribution])

  // Loan Balance comparison - show all scenarios
  const loanBalanceData = useMemo(() => {
    if (!results[0]?.repaymentTimeline) return []

    const data: any[] = []
    const maxYears = Math.max(...results.map(r => r.repaymentTimeline.length))

    for (let i = 0; i < Math.min(maxYears, 35); i++) {
      const point: any = { year: i + 1 }

      // Add all scenarios (A, B, C, D)
      results.forEach((result) => {
        const yearData = result.repaymentTimeline[i]
        if (yearData) {
          point[`Student ${result.scenario}`] = Math.max(0, yearData.loanBalance || 0)
        }
      })

      // Add comparison with full loan if applicable
      if (hasParentalContribution) {
        fullLoanResults?.forEach((result) => {
          const yearData = result.repaymentTimeline[i]
          if (yearData) {
            point[`Student ${result.scenario} (Full Loan)`] = Math.max(0, yearData.loanBalance || 0)
          }
        })
      }

      data.push(point)
    }
    return data
  }, [results, fullLoanResults, hasParentalContribution])

  // Investment comparison (if parental contribution exists)
  const investmentData = useMemo(() => {
    if (!hasParentalContribution || !results[0]?.repaymentTimeline) return []

    const contribution = userInput.parentalContribution || 0
    const yearsToRepay = results[0].yearsToRepayment
    const data: any[] = []

    for (let year = 1; year <= yearsToRepay && year <= 40; year++) {
      const point: any = {
        year,
        'Loan Savings': contribution * (year / yearsToRepay),
        '3% Growth': contribution * Math.pow(1.03, year),
        '4% Growth': contribution * Math.pow(1.04, year),
        '5% Growth': contribution * Math.pow(1.05, year),
      }
      data.push(point)
    }
    return data
  }, [results, hasParentalContribution, userInput.parentalContribution])

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          STEP 4 OF 4: Your Results
        </h2>
        <p className="text-gray-600">
          {hasParentalContribution
            ? `Impact of your £${userInput.parentalContribution?.toLocaleString()} contribution`
            : 'Summary of your child\'s expected loan repayment scenarios'
          }
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900 font-medium uppercase tracking-wide">Loan (with contribution)</p>
          <p className="text-2xl font-bold text-blue-900 mt-2">{formatCurrency(totalLoan)}</p>
        </div>

        {hasParentalContribution && (
          <>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
              <p className="text-xs text-green-900 font-medium uppercase tracking-wide">Full Loan (no contribution)</p>
              <p className="text-2xl font-bold text-green-900 mt-2">
                {formatCurrency(totalLoan + (userInput.parentalContribution || 0))}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
              <p className="text-xs text-purple-900 font-medium uppercase tracking-wide">Your Contribution</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">
                {formatCurrency(userInput.parentalContribution || 0)}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-900 font-medium uppercase tracking-wide">Savings vs full loan</p>
              <p className="text-2xl font-bold text-amber-900 mt-2">
                {formatCurrency((fullLoanResults?.[0]?.totalAmountPaid || 0) - (results[0]?.totalAmountPaid || 0))}
              </p>
            </div>
          </>
        )}

        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
          <p className="text-xs text-green-900 font-medium uppercase tracking-wide">Fastest Payoff</p>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {reducedLoanFastest.yearsToRepayment} years
          </p>
          <p className="text-xs text-green-800 mt-1">Student {reducedLoanFastest.scenario}</p>
        </div>
      </div>

      {/* Dynamic Analysis Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-2 border-blue-300 rounded-lg mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">🎯 Custom Analysis - Your Scenario</h2>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* RPI Rate */}
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              Interest Rate (RPI %)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={customRpiRate * 100}
              onChange={(e) => setCustomRpiRate(parseFloat(e.target.value) / 100)}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-blue-800 mt-1">Current: {(customRpiRate * 100).toFixed(1)}%</p>
          </div>

          {/* Custom Salary */}
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              Your Starting Salary (£)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={customSalary}
              onChange={(e) => setCustomSalary(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-blue-800 mt-1">£{customSalary.toLocaleString()}</p>
          </div>

          {/* Custom Contribution */}
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              Your Contribution (£)
            </label>
            <input
              type="number"
              min="0"
              step="500"
              value={customContribution}
              onChange={(e) => setCustomContribution(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-blue-800 mt-1">£{customContribution.toLocaleString()}</p>
          </div>
        </div>

        {/* Analysis Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-200 border-y border-blue-300">
                <th className="text-left p-3 font-bold text-blue-900">Scenario</th>
                <th className="text-right p-3 font-bold text-blue-900">Loan Amount</th>
                <th className="text-right p-3 font-bold text-blue-900">Years to Repay</th>
                <th className="text-right p-3 font-bold text-blue-900">Year 1 Monthly</th>
                <th className="text-right p-3 font-bold text-blue-900">Total Paid</th>
                <th className="text-right p-3 font-bold text-blue-900">Total Interest</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-blue-200 bg-green-50 hover:bg-green-100">
                <td className="p-3 font-semibold text-blue-900">With Your Contribution</td>
                <td className="text-right p-3 text-green-700 font-semibold">
                  {formatCurrency(totalLoan)}
                </td>
                <td className="text-right p-3 text-green-700 font-semibold">
                  {dynamicMetricsWithContribution.yearsToRepayment}
                </td>
                <td className="text-right p-3 text-green-700">
                  {formatCurrencyDecimal(dynamicMetricsWithContribution.firstYearMonthlyPayment)}
                </td>
                <td className="text-right p-3 text-green-700 font-semibold">
                  {formatCurrency(dynamicMetricsWithContribution.totalAmountPaid)}
                </td>
                <td className="text-right p-3 text-green-700">
                  {formatCurrency(dynamicMetricsWithContribution.totalInterestPaid)}
                </td>
              </tr>
              <tr className="border-b border-blue-200 bg-red-50 hover:bg-red-100">
                <td className="p-3 font-semibold text-blue-900">Without Contribution (Full Loan)</td>
                <td className="text-right p-3 text-red-700 font-semibold">
                  {formatCurrency(totalLoan + customContribution)}
                </td>
                <td className="text-right p-3 text-red-700 font-semibold">
                  {dynamicMetricsWithoutContribution.yearsToRepayment}
                </td>
                <td className="text-right p-3 text-red-700">
                  {formatCurrencyDecimal(dynamicMetricsWithoutContribution.firstYearMonthlyPayment)}
                </td>
                <td className="text-right p-3 text-red-700 font-semibold">
                  {formatCurrency(dynamicMetricsWithoutContribution.totalAmountPaid)}
                </td>
                <td className="text-right p-3 text-red-700">
                  {formatCurrency(dynamicMetricsWithoutContribution.totalInterestPaid)}
                </td>
              </tr>
              {customContribution > 0 && (
                <tr className="bg-amber-50 hover:bg-amber-100 font-semibold text-blue-900">
                  <td className="p-3">💰 Your Savings</td>
                  <td className="text-right p-3">
                    {formatCurrency(customContribution)}
                  </td>
                  <td className="text-right p-3 text-amber-700">
                    -{dynamicMetricsWithoutContribution.yearsToRepayment - dynamicMetricsWithContribution.yearsToRepayment} yrs
                  </td>
                  <td className="text-right p-3"></td>
                  <td className="text-right p-3 text-amber-700">
                    {formatCurrency(
                      dynamicMetricsWithoutContribution.totalAmountPaid -
                      dynamicMetricsWithContribution.totalAmountPaid
                    )}
                  </td>
                  <td className="text-right p-3 text-amber-700">
                    {formatCurrency(
                      dynamicMetricsWithoutContribution.totalInterestPaid -
                      dynamicMetricsWithContribution.totalInterestPaid
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Investment Comparison */}
        {customContribution > 0 && (
          <div className="mt-4 p-4 bg-white border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-3">
              💡 If you invested £{customContribution.toLocaleString()} instead over {dynamicMetricsWithContribution.yearsToRepayment} years:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-800 uppercase font-semibold">At 3% Annual Return</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {formatCurrency(investmentProjection[investmentProjection.length - 1]?.['3% Growth'] || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800 uppercase font-semibold">At 4% Annual Return</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {formatCurrency(investmentProjection[investmentProjection.length - 1]?.['4% Growth'] || 0)}
                </p>
              </div>
              <div className="p-3 bg-cyan-50 rounded-lg">
                <p className="text-xs text-cyan-800 uppercase font-semibold">At 5% Annual Return</p>
                <p className="text-2xl font-bold text-cyan-900 mt-1">
                  {formatCurrency(investmentProjection[investmentProjection.length - 1]?.['5% Growth'] || 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* 1. Monthly Payment Over Time */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Monthly Payment Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyPaymentData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Monthly Payment (£)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => formatCurrencyDecimal(value as number)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="With Contribution"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
              />
              {hasParentalContribution && (
                <Line
                  type="monotone"
                  dataKey="Without Contribution"
                  stroke="#ef4444"
                  dot={false}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-3">
            Shows monthly payment increasing with salary growth (5% annually).
            {hasParentalContribution && ' Red dashed line shows impact of full loan without contribution.'}
          </p>
        </div>

        {/* 2. Total Amount Paid */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Total Amount Paid by Scenario</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={totalAmountPaidData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="scenario" />
              <YAxis label={{ value: 'Total Paid (£)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="With Contribution" fill="#3b82f6" />
              {hasParentalContribution && (
                <>
                  <Bar dataKey="Without Contribution" fill="#ef4444" />
                  <Bar dataKey="Savings" fill="#10b981" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-3">
            Total repayment over the entire loan term.
            {hasParentalContribution && ' Green bar shows how much less you\'ll pay with your contribution.'}
          </p>
        </div>

        {/* 3. Interest vs Principal Comparison */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔀 Interest vs Principal by Scenario</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interestPrincipalData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="scenario" />
              <YAxis label={{ value: 'Amount (£)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="Principal (Reduced)" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Interest (Reduced)" stackId="a" fill="#f59e0b" />
              {hasParentalContribution && (
                <>
                  <Bar dataKey="Principal (Full Loan)" stackId="b" fill="#93c5fd" />
                  <Bar dataKey="Interest (Full Loan)" stackId="b" fill="#fde047" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-3">
            Stacked view showing principal (loan amount) vs interest charged.
            {hasParentalContribution && ' Lighter colors show comparison with full loan.'}
          </p>
        </div>

        {/* 4. Loan Balance Over Time */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📉 Loan Balance Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={loanBalanceData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Outstanding Balance (£)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {/* With Contribution Lines */}
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
              {/* Without Contribution Lines (if applicable) */}
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
            Shows how the loan balance decreases over time as payments are made. Loan is forgiven if unpaid after 40 years.
            {hasParentalContribution && ' Dashed lines show comparison with full loan (without your contribution).'}
          </p>
        </div>

        {/* 5. Investment Comparison (if applicable) */}
        {hasParentalContribution && investmentData.length > 0 && (
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Your Contribution: Loan Savings vs Investment Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={investmentData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Amount (£)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Loan Savings"
                  stroke="#10b981"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="3% Growth"
                  stroke="#8b5cf6"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="4% Growth"
                  stroke="#3b82f6"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="5% Growth"
                  stroke="#06b6d4"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">
              Compares the loan interest savings (green line) against potential investment growth at different returns (3%, 4%, 5%).
              {investmentData[investmentData.length - 1] && (
                <>
                  <br />At year {investmentData[investmentData.length - 1].year}:
                  <br />• Loan savings: {formatCurrency(investmentData[investmentData.length - 1]['Loan Savings'])}
                  <br />• At 4% growth: {formatCurrency(investmentData[investmentData.length - 1]['4% Growth'])}
                  <br />• At 5% growth: {formatCurrency(investmentData[investmentData.length - 1]['5% Growth'])}
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Next Steps</h3>
        <ul className="text-sm text-blue-900 space-y-1">
          <li>• Review the scenarios to understand your child's repayment timeline</li>
          {hasParentalContribution && (
            <li>• See how your contribution reduces the loan burden and total interest paid</li>
          )}
          <li>• Use the Excel export for detailed year-by-year breakdown</li>
          <li>• Check Student Finance England for the latest information</li>
        </ul>
      </div>

      {/* Export and Navigation */}
      <div className="flex justify-between gap-3 mt-8">
        <Button
          variant="secondary"
          onClick={onBack}
        >
          ← Back
        </Button>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => exportScenariosToExcel(results, totalLoan, userInput)}
          >
            📥 Export to Excel
          </Button>
          <Button
            onClick={onReset}
            size="lg"
          >
            🔄 Try Another Scenario
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ResultsSummary
