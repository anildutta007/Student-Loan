import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import type { RepaymentOutput } from '@types/index'
import { formatCurrency } from '@utils/calculations'

interface ParentInvestmentChartProps {
  results: RepaymentOutput[]
  totalLoan: number
  title?: string
}

interface ChartDataPoint {
  scenario: string
  originalLoan: number
  loanCost: number
  investmentValue: number
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const investmentGain = data.investmentValue - data.originalLoan
    return (
      <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
        <p className="text-sm font-semibold text-gray-900 mb-2">{data.scenario}</p>
        <p className="text-sm text-blue-700">
          Original Loan: {formatCurrency(data.originalLoan)}
        </p>
        <p className="text-sm text-red-700">
          Total Loan Cost: {formatCurrency(data.loanCost)}
        </p>
        <p className="text-sm text-green-700">
          Investment Value (3%/year): {formatCurrency(data.investmentValue)}
        </p>
        <p className="text-sm text-green-600 font-semibold mt-2">
          Investment Gain: {formatCurrency(investmentGain)}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          If parent invested instead of student borrowing...
        </p>
      </div>
    )
  }
  return null
}

const ParentInvestmentChart: React.FC<ParentInvestmentChartProps> = ({
  results,
  totalLoan,
  title = 'Parent Investment Comparison (3% Annual Return)',
}) => {
  const INVESTMENT_RETURN = 0.03 // 3% annual return

  const chartData: ChartDataPoint[] = results.map(result => {
    const repaymentYears = result.yearsToRepayment
    // Calculate investment value if £ was invested at 3% annually
    const investmentValue = totalLoan * Math.pow(1 + INVESTMENT_RETURN, repaymentYears)

    return {
      scenario: `Student ${result.scenario}`,
      originalLoan: totalLoan,
      loanCost: result.totalAmountPaid,
      investmentValue: Math.round(investmentValue),
    }
  })

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="scenario" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="originalLoan"
            fill="#3b82f6"
            name="Original Loan Amount"
          />
          <Bar
            dataKey="loanCost"
            fill="#ef4444"
            name="Total Loan Cost (Interest Included)"
          />
          <Bar
            dataKey="investmentValue"
            fill="#10b981"
            name="Investment Value (3% Annual Return)"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-600 mt-2">
        💡 <strong>Scenario:</strong> If parent had the full loan amount upfront, what if they invested it at 3% annually instead of student borrowing? This shows the opportunity cost and investment growth potential.
      </p>
    </div>
  )
}

export default ParentInvestmentChart
