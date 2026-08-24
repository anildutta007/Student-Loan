import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import type { RepaymentOutput } from '@types/index'
import { formatCurrency } from '@utils/calculations'

interface TotalPaidChartProps {
  results: RepaymentOutput[]
  title?: string
}

interface ChartDataPoint {
  scenario: string
  total: number
  color: string
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="text-sm font-semibold text-gray-900">
          {data.scenario}
        </p>
        <p className="text-sm text-gray-700">
          {formatCurrency(data.total)}
        </p>
      </div>
    )
  }
  return null
}

const TotalPaidChart: React.FC<TotalPaidChartProps> = ({
  results,
  title = 'Total Amount Paid',
}) => {
  const chartData: ChartDataPoint[] = results.map(result => ({
    scenario: `Student ${result.scenario}`,
    total: result.totalAmountPaid,
    color: result.color,
  }))

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="scenario"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="total"
            fill="#8b5cf6"
            radius={[8, 8, 0, 0]}
            label={{
              position: 'top',
              formatter: (value: number) => formatCurrency(value),
              offset: 10,
              fontSize: 12,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-600 mt-2">
        💡 Total repayment over the entire loan term. Higher earners pay more due to faster payoff of interest.
      </p>
    </div>
  )
}

export default TotalPaidChart
