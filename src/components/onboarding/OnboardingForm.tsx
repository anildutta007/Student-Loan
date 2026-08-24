import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { UserInput, StudentStatus } from '@types/index'
import { YEARS_OF_STUDY_OPTIONS, MAINTENANCE_ALLOWANCE_OPTIONS } from '@utils/constants'
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
      maintenanceAllowance: 5000,
    },
  })

  const status = watch('status')

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
        {/* Question 1: Status */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            What is your child's current educational status?
          </label>
          <div className="space-y-3">
            {[
              { value: 'new' as const, label: 'Starting college this year', description: 'New student beginning their studies' },
              { value: 'current' as const, label: 'Already studying at college', description: 'Currently enrolled and studying' },
            ].map((option) => (
              <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  value={option.value}
                  {...register('status', { required: 'Please select an option' })}
                  className="mt-1 w-4 h-4"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.status && (
            <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* Question 2: Years of Study */}
        <div>
          <label htmlFor="years" className="block text-sm font-medium text-gray-900 mb-3">
            How many years {status === 'new' ? 'will' : 'have'} {status === 'new' ? 'they' : 'they'} study?
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

        {/* Question 3: Maintenance Allowance */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Will your child receive a maintenance allowance?
          </label>
          <p className="text-sm text-gray-600 mb-3">
            (Additional money for living expenses, based on household income)
          </p>
          <div className="space-y-2">
            {MAINTENANCE_ALLOWANCE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  value={option.value}
                  {...register('maintenanceAllowance', {
                    required: 'Please select an option',
                    valueAsNumber: true
                  })}
                  className="mt-1 w-4 h-4"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-900">{option.label}</p>
                  {option.description && (
                    <p className="text-sm text-gray-600">{option.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
          {errors.maintenanceAllowance && (
            <p className="mt-2 text-sm text-red-600">{errors.maintenanceAllowance.message}</p>
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            ℹ️ <strong>Note:</strong> These questions help us calculate your child's total loan amount. We'll then show you 4 salary scenarios with expected monthly payments.
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
