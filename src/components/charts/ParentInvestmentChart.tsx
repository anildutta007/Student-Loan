import React from 'react'
import {
  LineChart,
  Line,
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
  loanCost: number
  investment3: number
  investment4: number
  investment5: number
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
        <p className="text-sm font-semibold text-gray-900 mb-2">{data.scenario}</p>
        <p className="text-sm text-red-700">
          Loan Cost: {formatCurrency(data.loanCost)}
        </p>
        <p className="text-sm text-blue-600">
          3% Return: {formatCurrency(payload[0].value as number)}
        </p>
        {payload.length > 1 && (
          <>
            <p className="text-sm text-green-600">
              4% Return: {formatCurrency(payload[1].value as number)}
            </p>
            <p className="text-sm text-purple-600">
              5% Return: {formatCurrency(payload[2].value as number)}
            </p>
          </>
        )}
      </div>
    )
  }
  return null
}

const ParentInvestmentChart: React.FC<ParentInvestmentChartProps> = ({
  results,
  totalLoan,
  title = 'Parent Investment Comparison (Multiple Growth Rates)',
}) => {
  const chartData: ChartDataPoint[] = results.map(result => {
    const repaymentYears = result.yearsToRepayment

    // Calculate investment values at different growth rates
    const investment3 = totalLoan * Math.pow(1.03, repaymentYears)
    const investment4 = totalLoan * Math.pow(1.04, repaymentYears)
    const investment5 = totalLoan * Math.pow(1.05, repaymentYears)

    return {
      scenario: `Student ${result.scenario}`,
      loanCost: result.totalAmountPaid,
      investment3: Math.round(investment3),
      investment4: Math.round(investment4),
      investment5: Math.round(investment5),
    }
  })

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="scenario" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="loanCost"
            stroke="#ef4444"
            strokeWidth={3}
            name="Total Loan Cost"
            dot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="investment3"
            stroke="#3b82f6"
            strokeWidth={2}
            name="3% Annual Return"
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="investment4"
            stroke="#10b981"
            strokeWidth={2}
            name="4% Annual Return"
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="investment5"
            stroke="#a855f7"
            strokeWidth={2}
            name="5% Annual Return"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-600 mt-2">
        💡 <strong>Scenario:</strong> Compare loan cost vs investment growth at different annual returns (3%, 4%, 5%). Thicker red line = actual loan cost. Higher return rates show better investment potential.
      </p>
    </div>
  )
}

export default ParentInvestmentChart
