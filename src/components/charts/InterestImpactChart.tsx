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
import { formatCurrency, formatPercentage } from '@utils/calculations'

interface InterestImpactChartProps {
  results: RepaymentOutput[]
  totalLoan: number
  title?: string
}

interface ChartDataPoint {
  scenario: string
  interestPercent: number
  interestAmount: number
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
          Interest as % of Total Paid: {data.interestPercent.toFixed(1)}%
        </p>
        <p className="text-sm text-gray-700">
          Interest Amount: {formatCurrency(data.interestAmount)}
        </p>
      </div>
    )
  }
  return null
}

const InterestImpactChart: React.FC<InterestImpactChartProps> = ({
  results,
  totalLoan,
  title = 'Interest Impact by Scenario',
}) => {
  const chartData: ChartDataPoint[] = results.map(result => ({
    scenario: `Student ${result.scenario}`,
    interestPercent: (
      (Math.max(0, result.totalAmountPaid - totalLoan) / result.totalAmountPaid) *
      100
    ),
    interestAmount: Math.max(0, result.totalAmountPaid - totalLoan),
  }))

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="scenario" stroke="#6b7280" />
          <YAxis
            yAxisId="left"
            stroke="#6b7280"
            label={{ value: 'Interest %', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#6b7280"
            label={{ value: 'Interest Amount (£)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            yAxisId="left"
            dataKey="interestPercent"
            fill="#ef4444"
            name="Interest % of Total"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-600 mt-2">
        💡 Shows what percentage of total payment is interest. Higher salary = lower interest %, faster payoff
      </p>
    </div>
  )
}

export default InterestImpactChart
