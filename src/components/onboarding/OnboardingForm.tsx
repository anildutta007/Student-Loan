import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import type { UserInput, LivingSituation } from '@types/index'
import { YEARS_OF_STUDY_OPTIONS, LIVING_SITUATION_OPTIONS } from '@utils/constants'
import { calculateMaintenanceAllowance, formatCurrency } from '@utils/calculations'
import Button from '@components/common/Button'
import Card from '@components/common/Card'

interface OnboardingFormProps {
  onSubmit: (data: UserInput) => void
  loading?: boolean
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, loading = false }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<UserInput>({
    defaultValues: {
      status: 'new',
      yearsOfStudy: 3,
      livingSituation: 'away-other',
      householdIncome: 30000,
      parentalContribution: 0,
    },
  })

  const livingSituation = watch('livingSituation') as LivingSituation
  const householdIncome = watch('householdIncome')

  // Calculate maintenance allowance based on inputs
  const calculatedMaintenance = useMemo(() => {
    if (!householdIncome || householdIncome < 0) return 0
    return calculateMaintenanceAllowance(householdIncome, livingSituation)
  }, [householdIncome, livingSituation])

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          STEP 1 OF 4: Your Child's Education
        </h2>
        <p className="text-gray-600">
          Help us understand your child's educational situation
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Question 1: Years of Study */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            How many years will they study?
          </label>
          <div className="flex gap-2 flex-wrap">
            {YEARS_OF_STUDY_OPTIONS.map((year) => (
              <label key={year} className="flex items-center">
                <input
                  type="radio"
                  value={year}
                  {...register('yearsOfStudy', {
                    required: 'Please select years of study',
                    valueAsNumber: true
                  })}
                  className="w-4 h-4"
                />
                <span className="ml-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-400 cursor-pointer">
                  {year} year{year > 1 ? 's' : ''}
                </span>
              </label>
            ))}
          </div>
          {errors.yearsOfStudy && (
            <p className="mt-2 text-sm text-red-600">{errors.yearsOfStudy.message}</p>
          )}
        </div>

        {/* Question 2: Living Situation */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Where will your child be living while studying?
          </label>
          <div className="space-y-3">
            {LIVING_SITUATION_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  value={option.value}
                  {...register('livingSituation', { required: 'Please select living situation' })}
                  className="mt-1 w-4 h-4"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.livingSituation && (
            <p className="mt-2 text-sm text-red-600">{errors.livingSituation.message}</p>
          )}
        </div>

        {/* Question 3: Household Income */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            What is your household income?
          </label>
          <p className="text-sm text-gray-600 mb-3">
            This helps us calculate the maximum maintenance allowance your child is eligible for.
          </p>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-600">£</span>
            <input
              type="number"
              min="0"
              step="1000"
              {...register('householdIncome', {
                required: 'Please enter household income',
                valueAsNumber: true,
                min: { value: 0, message: 'Income cannot be negative' }
              })}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="30000"
            />
          </div>
          {errors.householdIncome && (
            <p className="mt-2 text-sm text-red-600">{errors.householdIncome.message}</p>
          )}
        </div>

        {/* Calculated Maintenance Display */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-900 font-medium">Eligible Maintenance Allowance</p>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {formatCurrency(calculatedMaintenance)}/year
          </p>
          <p className="text-xs text-green-800 mt-2">
            Based on {livingSituation === 'at-home' ? 'living at home' : livingSituation === 'away-london' ? 'living in London' : 'living away from home'} and household income of {formatCurrency(householdIncome)}
          </p>
        </div>

        {/* Question 4: Parental Contribution */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Will you be contributing any money upfront?
          </label>
          <p className="text-sm text-gray-600 mb-3">
            If you're putting money toward tuition/living costs, enter the amount here to reduce the loan needed.
          </p>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-600">£</span>
            <input
              type="number"
              min="0"
              step="500"
              {...register('parentalContribution', {
                valueAsNumber: true,
                min: { value: 0, message: 'Contribution cannot be negative' }
              })}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          {errors.parentalContribution && (
            <p className="mt-2 text-sm text-red-600">{errors.parentalContribution.message}</p>
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            ℹ️ <strong>Note:</strong> We'll calculate the total loan amount based on tuition fees (£9,250/year) plus your eligible maintenance allowance, minus any parental contribution. Then we'll show you 4 salary scenarios with expected monthly repayment amounts.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={loading}
            size="lg"
          >
            Next: Review Costs →
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default OnboardingForm
