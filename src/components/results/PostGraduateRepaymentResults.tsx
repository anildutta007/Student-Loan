import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import type { PostGraduateRepaymentResult } from '@utils/postGraduateCalculations'
import { getPlanConfig } from '@utils/planConfigurations'
import Button from '@components/common/Button'
import Card from '@components/common/Card'

interface PostGraduateRepaymentResultsProps {
  result: PostGraduateRepaymentResult
  planId: string
  onExport?: () => void
  onBack: () => void
  onReset: () => void
}

export default function PostGraduateRepaymentResults({
  result,
  planId,
  onExport,
  onBack,
  onReset,
}: PostGraduateRepaymentResultsProps) {
  const plan = getPlanConfig(planId)

  const interestData = [
    { name: 'Interest', value: result.interestPercentage, color: '#ef4444' },
    { name: 'Principal', value: result.principalPercentage, color: '#10b981' },
  ]

  const chartData = result.repaymentTimeline.slice(0, 20).map(year => ({
    year: year.year,
    interest: year.interestCharged,
    principal: year.monthlyPayment > 0 ? Math.max(0, year.monthlyPayment * 12 - year.interestCharged) : 0,
    balance: year.loanBalance,
  }))

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Repayment Status</h2>
        </div>

        <div className={`p-6 rounded-lg border-2 text-center ${
          result.projection.status === 'payoff'
            ? 'bg-green-50 border-green-200'
            : result.projection.status === 'forgiven'
            ? 'bg-blue-50 border-blue-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={`text-2xl font-bold mb-2 ${
            result.projection.status === 'payoff'
              ? 'text-green-900'
              : result.projection.status === 'forgiven'
              ? 'text-blue-900'
              : 'text-yellow-900'
          }`}>
            {result.projection.status === 'payoff'
              ? '✅ Loan Will Be Paid Off'
              : result.projection.status === 'forgiven'
              ? '📋 Loan Will Be Forgiven'
              : '⚠️ ' + (result.projection.status === 'no-repayment' ? 'No Repayment Required' : 'Interest Only - No Principal Reduction')}
          </p>

          <p className="text-lg font-semibold text-gray-700 mb-4">
            {result.projection.status === 'payoff'
              ? `In ${Math.round(result.projection.yearsRemaining)} years (by age ${Math.round(result.projection.ageAtCompletion)})`
              : `After ${result.projection.yearsRemaining} years (age ${Math.round(result.projection.ageAtCompletion)})`}
          </p>

          {result.projection.totalInterestRemaining > 0 && (
            <p className="text-base text-gray-600">
              Total interest remaining: <strong>£{result.projection.totalInterestRemaining.toLocaleString()}</strong>
            </p>
          )}
        </div>
      </Card>

      {/* Key Metrics */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Current Payment Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Monthly Payment */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 font-semibold uppercase mb-2">Monthly Payment</p>
            <p className="text-3xl font-bold text-blue-900">£{result.monthlyPayment.toLocaleString()}</p>
            {result.monthlyPayment === 0 && (
              <p className="text-xs text-blue-700 mt-2">Below repayment threshold</p>
            )}
          </div>

          {/* Monthly Interest */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600 font-semibold uppercase mb-2">Monthly Interest</p>
            <p className="text-3xl font-bold text-red-900">£{result.monthlyInterest.toLocaleString()}</p>
            <p className="text-xs text-red-700 mt-2">{result.interestPercentage}% of payment</p>
          </div>

          {/* Monthly Principal */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-600 font-semibold uppercase mb-2">Monthly Principal</p>
            <p className="text-3xl font-bold text-green-900">£{result.monthlyPrincipal.toLocaleString()}</p>
            <p className="text-xs text-green-700 mt-2">{result.principalPercentage}% of payment</p>
          </div>
        </div>

        {/* Interest vs Principal Pie Chart */}
        {result.monthlyPayment > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Where Your Payment Goes</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={interestData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {interestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Current Situation Summary */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Current Situation</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Current Age</span>
            <span className="font-bold text-gray-900">{result.currentAge} years</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Employment Status</span>
            <span className="font-bold text-gray-900 capitalize">{result.employmentStatus}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Years Employed</span>
            <span className="font-bold text-gray-900">{result.yearsEmployed} years</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-gray-700">Projected Salary Growth</span>
            <span className="font-bold text-blue-900">{(result.salaryGrowthRate * 100).toFixed(1)}% annually</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Current Annual Salary</span>
            <span className="font-bold text-gray-900">£{result.currentSalary.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Loan Balance Remaining</span>
            <span className="font-bold text-gray-900">£{result.currentLoanBalance.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Repayment Threshold</span>
            <span className="font-bold text-gray-900">£{plan?.repaymentThreshold.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Interest Rate (Post-Graduation)</span>
            <span className="font-bold text-gray-900">{(plan?.interestRatePostGraduation ? plan.interestRatePostGraduation * 100 : 0).toFixed(1)}%</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Forgiveness Age (Loan Ends)</span>
            <span className="font-bold text-gray-900">{result.currentAge + plan?.maxRepaymentYears!} years</span>
          </div>
        </div>
      </Card>

      {/* Repayment Timeline Chart */}
      {result.repaymentTimeline.length > 0 && (
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Loan Balance Over Time</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: 'Loan Balance (£)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value: any) => ['£' + value.toLocaleString(), 'Balance']}
              />
              <Bar dataKey="balance" fill="#3b82f6" name="Loan Balance" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Annual Payment Breakdown */}
      {result.repaymentTimeline.length > 0 && (
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Annual Payment Breakdown (Next 10 Years)</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: 'Amount (£)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value: any) => '£' + value.toLocaleString()} />
              <Legend />
              <Bar dataKey="interest" fill="#ef4444" name="Interest" />
              <Bar dataKey="principal" fill="#10b981" name="Principal" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Info Box */}
      <Card>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 mb-2">
            <strong>💡 Understanding Your Repayment:</strong>
          </p>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Your monthly payment is 9% of salary above the repayment threshold</li>
            <li>Interest accrues monthly on your remaining balance</li>
            <li>Part of your payment covers interest, part covers principal</li>
            <li>Loan is forgiven after {plan?.maxRepaymentYears} years if not fully paid</li>
            <li>As salary increases, your repayment increases</li>
          </ul>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-between pt-4 border-t border-gray-200">
        <Button
          onClick={onBack}
          variant="secondary"
        >
          ← Back
        </Button>

        <div className="flex gap-3">
          {onExport && (
            <Button
              onClick={onExport}
              variant="secondary"
            >
              📥 Export
            </Button>
          )}

          <Button
            onClick={onReset}
          >
            🔄 Start Over
          </Button>
        </div>
      </div>
    </div>
  )
}
