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
import { formatCurrencyDecimal } from '@utils/calculations'

interface PaymentChartProps {
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
            {entry.name}: {formatCurrencyDecimal(entry.value as number)}/mo
          </p>
        ))}
      </div>
    )
  }
  return null
}

const PaymentChart: React.FC<PaymentChartProps> = ({
  results,
  title = 'Monthly Payment Over Time',
}) => {
  // Prepare data for chart - take every 2 years to avoid crowding
  const chartData: ChartDataPoint[] = []
  const maxYears = Math.max(...results.map(r => r.repaymentTimeline.length))

  for (let year = 1; year <= maxYears; year += 2) {
    const point: ChartDataPoint = { year }
    results.forEach(result => {
      const yearData = result.repaymentTimeline.find(y => y.year === year)
      if (yearData) {
        point[result.scenario] = yearData.monthlyPayment
      }
    })
    chartData.push(point)
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
            label={{ value: 'Monthly Payment (£)', angle: -90, position: 'insideLeft' }}
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
        💡 Shows monthly payment increasing with salary growth (5% annually)
      </p>
    </div>
  )
}

export default PaymentChart
