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

interface TimelineChartProps {
  results: RepaymentOutput[]
  title?: string
}

interface ChartDataPoint {
  scenario: string
  years: number
  age: number
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
          {data.years} years to repayment
        </p>
        <p className="text-xs text-gray-600">
          (Completes at age {data.age})
        </p>
      </div>
    )
  }
  return null
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  results,
  title = 'Time to Repay Loan',
}) => {
  const chartData: ChartDataPoint[] = results.map(result => ({
    scenario: `Student ${result.scenario}`,
    years: result.yearsToRepayment,
    age: 22 + result.yearsToRepayment, // Assume 22 when graduating
  }))

  // Color map for consistency
  const colorMap: { [key: string]: string } = {
    A: '#1f77b4',
    B: '#2ca02c',
    C: '#ff7f0e',
    D: '#d62728',
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" />
          <YAxis
            dataKey="scenario"
            type="category"
            stroke="#6b7280"
            width={140}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="years"
            fill="#3b82f6"
            radius={[0, 8, 8, 0]}
            label={{
              position: 'right',
              formatter: (value: number) => `${value} yrs`,
              offset: 10,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-600 mt-2">
        💡 Shows years needed to fully repay the loan. Higher salaries = faster payoff.
      </p>
    </div>
  )
}

export default TimelineChart
