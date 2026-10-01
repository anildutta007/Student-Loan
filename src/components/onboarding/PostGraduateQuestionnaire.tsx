import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { getPlanConfig } from '@utils/planConfigurations'
import Button from '@components/common/Button'
import Card from '@components/common/Card'

interface PostGraduateInput {
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'part-time'
  yearsEmployed?: number
  currentLoanBalance: number
  currentAnnualSalary: number
  currentAge: number
}

interface PostGraduateQuestionnaireProps {
  planId: string
  onSubmit: (data: PostGraduateInput) => void
  loading?: boolean
}

export default function PostGraduateQuestionnaire({
  planId,
  onSubmit,
  loading = false,
}: PostGraduateQuestionnaireProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PostGraduateInput>({
    defaultValues: {
      employmentStatus: 'employed',
      yearsEmployed: 5,
      currentLoanBalance: 0,
      currentAnnualSalary: 30000,
      currentAge: 25,
    },
  })

  const plan = getPlanConfig(planId)
  const currentAge = watch('currentAge')
  const loanBalance = watch('currentLoanBalance')
  const salary = watch('currentAnnualSalary')
  const employmentStatus = watch('employmentStatus')
  const yearsEmployed = watch('yearsEmployed')

  // Calculate current monthly payment
  const monthlyPayment = useMemo(() => {
    if (!plan || salary <= plan.repaymentThreshold) return 0
    const repayableIncome = salary - plan.repaymentThreshold
    const annualRepayment = repayableIncome * plan.repaymentRate
    return Math.round(annualRepayment / 12)
  }, [plan, salary])

  // Calculate annual interest
  const annualInterest = useMemo(() => {
    if (!plan || loanBalance <= 0) return 0
    const rate = plan.interestRatePostGraduation
    return Math.round(loanBalance * rate)
  }, [plan, loanBalance])

  // Calculate monthly interest
  const monthlyInterest = useMemo(() => {
    return Math.round(annualInterest / 12)
  }, [annualInterest])

  // Calculate net monthly payment (towards principal)
  const monthlyPrincipal = useMemo(() => {
    return Math.max(0, monthlyPayment - monthlyInterest)
  }, [monthlyPayment, monthlyInterest])

  // Calculate forgiveness age
  const forgillnessAge = useMemo(() => {
    if (!plan) return 0
    return currentAge + plan.maxRepaymentYears
  }, [plan, currentAge])

  // Calculate if loan will be paid off or forgiven first
  const repaymentProjection = useMemo(() => {
    if (!plan || monthlyPayment === 0) {
      return {
        status: 'no-repayment',
        message: 'No repayment required - salary below threshold',
        yearsRemaining: plan?.maxRepaymentYears || 0,
      }
    }

    if (monthlyPrincipal <= 0) {
      return {
        status: 'interest-only',
        message: 'Payment covers interest but not principal',
        yearsRemaining: plan?.maxRepaymentYears || 0,
      }
    }

    const monthsToPayoff = Math.ceil(loanBalance / monthlyPrincipal)
    const yearsToPayoff = monthsToPayoff / 12
    const ageAtPayoff = currentAge + yearsToPayoff

    if (yearsToPayoff < (plan?.maxRepaymentYears || 0)) {
      return {
        status: 'payoff',
        message: `Loan will be fully paid off by age ${Math.round(ageAtPayoff)}`,
        yearsRemaining: yearsToPayoff,
      }
    } else {
      return {
        status: 'forgiven',
        message: `Loan will be forgiven at age ${forgillnessAge} (${plan?.maxRepaymentYears} year limit)`,
        yearsRemaining: plan?.maxRepaymentYears || 0,
      }
    }
  }, [plan, monthlyPayment, monthlyPrincipal, loanBalance, currentAge, forgillnessAge])

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          REPAYMENT ANALYSIS: Your Current Situation
        </h2>
        <p className="text-gray-600">
          Understand your current loan repayment and interest calculations
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Employment Status */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2 sm:mb-3">
            Employment Status
          </label>
          <select
            {...register('employmentStatus', {
              required: 'Please select your employment status',
            })}
            className="w-full px-3 sm:px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-touch"
          >
            <option value="employed">Employed (Full-time)</option>
            <option value="part-time">Employed (Part-time)</option>
            <option value="self-employed">Self-Employed</option>
            <option value="unemployed">Unemployed / Not Working</option>
          </select>
          {errors.employmentStatus && (
            <p className="mt-2 text-xs text-red-600">{errors.employmentStatus.message}</p>
          )}
        </div>

        {/* Years Employed */}
        {employmentStatus !== 'unemployed' && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2 sm:mb-3">
              How many years have you been {employmentStatus === 'self-employed' ? 'self-employed' : 'employed'}?
            </label>
            <input
              type="number"
              min="0"
              max="50"
              step="0.5"
              {...register('yearsEmployed', {
                valueAsNumber: true,
                min: { value: 0, message: 'Cannot be negative' }
              })}
              className="w-full px-3 sm:px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-touch"
              placeholder="e.g., 5"
            />
            {errors.yearsEmployed && (
              <p className="mt-2 text-xs text-red-600">{errors.yearsEmployed.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">This helps us estimate salary growth</p>
          </div>
        )}

        {/* Current Loan Balance */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2 sm:mb-3">
            Current Loan Balance Remaining
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 sm:top-3 text-gray-600 text-sm">£</span>
            <input
              type="number"
              min="0"
              step="1000"
              {...register('currentLoanBalance', {
                required: 'Please enter current loan balance',
                valueAsNumber: true,
                min: { value: 0, message: 'Balance cannot be negative' }
              })}
              className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-touch"
              placeholder="e.g., 25000"
            />
          </div>
          {errors.currentLoanBalance && (
            <p className="mt-2 text-xs text-red-600">{errors.currentLoanBalance.message}</p>
          )}
        </div>

        {/* Current Annual Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2 sm:mb-3">
            Current Annual Salary
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 sm:top-3 text-gray-600 text-sm">£</span>
            <input
              type="number"
              min="0"
              step="1000"
              {...register('currentAnnualSalary', {
                required: 'Please enter current salary',
                valueAsNumber: true,
                min: { value: 0, message: 'Salary cannot be negative' }
              })}
              className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-touch"
              placeholder="e.g., 35000"
            />
          </div>
          {errors.currentAnnualSalary && (
            <p className="mt-2 text-xs text-red-600">{errors.currentAnnualSalary.message}</p>
          )}
        </div>

        {/* Current Age */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2 sm:mb-3">
            Your Current Age
          </label>
          <input
            type="number"
            min="18"
            max="100"
            {...register('currentAge', {
              required: 'Please enter your age',
              valueAsNumber: true,
              min: { value: 18, message: 'Must be 18 or older' }
            })}
            className="w-full px-3 sm:px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-touch"
            placeholder="e.g., 28"
          />
          {errors.currentAge && (
            <p className="mt-2 text-xs text-red-600">{errors.currentAge.message}</p>
          )}
        </div>

        {/* Analysis Box */}
        <div className="border-t-2 border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Current Repayment Analysis</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Monthly Payment */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600 font-semibold uppercase mb-2">Monthly Repayment</p>
              <p className="text-3xl font-bold text-blue-900">£{monthlyPayment.toLocaleString()}</p>
              {monthlyPayment === 0 && (
                <p className="text-xs text-blue-700 mt-2">Salary below threshold of £{plan?.repaymentThreshold.toLocaleString()}</p>
              )}
            </div>

            {/* Interest vs Principal */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-xs text-orange-600 font-semibold uppercase mb-2">Interest Breakdown (Monthly)</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Interest:</span>
                  <span className="font-semibold text-orange-900">£{monthlyInterest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Principal:</span>
                  <span className="font-semibold text-green-900">£{monthlyPrincipal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Current Loan Balance</p>
                <p className="text-xs text-gray-600">Amount still owed</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">£{loanBalance.toLocaleString()}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Annual Interest Accrued</p>
                <p className="text-xs text-gray-600">Interest rate: {(plan?.interestRatePostGraduation ? plan.interestRatePostGraduation * 100 : 0).toFixed(1)}%</p>
              </div>
              <p className="text-lg font-semibold text-red-900">£{annualInterest.toLocaleString()}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Annual Principal Repaid</p>
                <p className="text-xs text-gray-600">After interest (if paying)</p>
              </div>
              <p className="text-lg font-semibold text-green-900">£{(monthlyPrincipal * 12).toLocaleString()}</p>
            </div>
          </div>

          {/* Repayment Projection */}
          <div className={`p-4 rounded-lg border-2 ${
            repaymentProjection.status === 'payoff'
              ? 'bg-green-50 border-green-200'
              : repaymentProjection.status === 'forgiven'
              ? 'bg-blue-50 border-blue-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <p className={`text-sm font-semibold mb-2 ${
              repaymentProjection.status === 'payoff'
                ? 'text-green-900'
                : repaymentProjection.status === 'forgiven'
                ? 'text-blue-900'
                : 'text-yellow-900'
            }`}>
              📊 Repayment Projection
            </p>
            <p className={`text-base font-bold ${
              repaymentProjection.status === 'payoff'
                ? 'text-green-900'
                : repaymentProjection.status === 'forgiven'
                ? 'text-blue-900'
                : 'text-yellow-900'
            }`}>
              {repaymentProjection.message}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Maximum repayment period: {plan?.maxRepaymentYears} years (until age {forgillnessAge})
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 mb-2">
            <strong>ℹ️ How This Works:</strong>
          </p>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Your salary determines monthly repayment (9% of income above threshold)</li>
            <li>Interest accrues monthly based on your current balance</li>
            <li>Loan is forgiven after {plan?.maxRepaymentYears} years if not paid off</li>
            <li>Interest is included in your monthly repayment</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button
            type="submit"
            loading={loading}
            size="lg"
          >
            View Full Repayment Timeline →
          </Button>
        </div>
      </form>
    </Card>
  )
}
