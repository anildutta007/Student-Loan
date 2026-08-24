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

interface InterestAccrualChartProps {
  results: RepaymentOutput[]
  title?: string
}

interface ChartDataPoint {
  year: number
  [key: string]: number
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="text-sm font-semibold text-gray-900">
          Year {payload[0].payload.year}
        </p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value as number)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const InterestAccrualChart: React.FC<InterestAccrualChartProps> = ({
  results,
  title = 'Cumulative Interest Accrued Over Time',
}) => {
  // Calculate cumulative interest for each scenario
  const chartData: ChartDataPoint[] = []
  const maxYears = Math.max(...results.map(r => r.repaymentTimeline.length))

  for (let year = 1; year <= maxYears; year++) {
    const point: ChartDataPoint = { year }

    results.forEach(result => {
      const yearData = result.repaymentTimeline.find(y => y.year === year)
      if (yearData) {
        // Calculate cumulative interest: total paid - original loan (rough estimate)
        const cumulativeInterest = Math.max(0, yearData.totalPaid - (result.repaymentTimeline[0]?.loanBalance || 0))
        point[result.scenario] = cumulativeInterest
      }
    })

    if (chartData.length === 0 || year % 2 === 0 || year === maxYears) {
      chartData.push(point)
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis
            label={{ value: 'Cumulative Interest (£)', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {results.map(result => (
            <Line
              key={result.scenario}
              type="monotone"
              dataKey={result.scenario}
              stroke={result.color}
              name={`Student ${result.scenario}`}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-600 mt-2">
        💡 Shows how much interest accumulates over the repayment period for each scenario
      </p>
    </div>
  )
}

export default InterestAccrualChart
