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
  Cell,
} from 'recharts'
import type { RepaymentOutput } from '@types/index'
import { formatCurrency } from '@utils/calculations'

interface InterestBreakdownChartProps {
  results: RepaymentOutput[]
  totalLoan: number
  title?: string
}

interface ChartDataPoint {
  scenario: string
  principal: number
  interest: number
  total: number
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
        <p className="text-sm text-gray-700">
          Principal (Original Loan): {formatCurrency(data.principal)}
        </p>
        <p className="text-sm text-gray-700">
          Interest Charged: {formatCurrency(data.interest)}
        </p>
        <p className="text-sm font-semibold text-gray-900 mt-2">
          Total Paid: {formatCurrency(data.total)}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Interest as % of total: {((data.interest / data.total) * 100).toFixed(1)}%
        </p>
      </div>
    )
  }
  return null
}

const InterestBreakdownChart: React.FC<InterestBreakdownChartProps> = ({
  results,
  totalLoan,
  title = 'Interest vs Principal Comparison',
}) => {
  const chartData: ChartDataPoint[] = results.map(result => ({
    scenario: `Student ${result.scenario}`,
    principal: totalLoan,
    interest: Math.max(0, result.totalAmountPaid - totalLoan),
    total: result.totalAmountPaid,
  }))

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="scenario" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="principal" stackId="a" fill="#3b82f6" name="Original Loan" />
          <Bar
            dataKey="interest"
            stackId="a"
            fill="#f97316"
            name="Interest Charged"
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-600 mt-2">
        💡 Stacked bar shows how much of total payment is principal vs interest. Higher interest = longer repayment time
      </p>
    </div>
  )
}

export default InterestBreakdownChart
