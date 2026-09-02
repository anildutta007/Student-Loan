import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { UserInput, LivingSituation } from '@types/index'
import { LIVING_SITUATION_OPTIONS } from '@utils/constants'
import { calculateMaintenanceAllowance, formatCurrency } from '@utils/calculations'
import { UK_LOAN_SYSTEM } from '@utils/constants'
import Button from '@components/common/Button'
import Card from '@components/common/Card'

interface CombinedOnboardingProps {
  onSubmit: (data: UserInput) => void
  loading?: boolean
}

const CombinedOnboarding: React.FC<CombinedOnboardingProps> = ({ onSubmit, loading = false }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<UserInput>({
    defaultValues: {
      status: 'new',
      yearsOfStudy: 3,
      livingSituation: 'away-other',
      householdIncome: 30000,
      parentalContribution: 0,
    },
  })

  const [parentalContribution, setParentalContribution] = useState(0)
  const livingSituation = watch('livingSituation') as LivingSituation
  const householdIncome = watch('householdIncome')
  const yearsOfStudy = watch('yearsOfStudy')

  // Calculate maintenance allowance based on inputs
  const calculatedMaintenance = useMemo(() => {
    if (!householdIncome || householdIncome < 0) return 0
    return calculateMaintenanceAllowance(householdIncome, livingSituation)
  }, [householdIncome, livingSituation])

  // Calculate loan amounts
  const annualTuition = UK_LOAN_SYSTEM.TUITION_FEE_ANNUAL
  const annualMaintenance = calculatedMaintenance
  const maxLoanAvailable = (annualTuition + annualMaintenance) * yearsOfStudy
  const tuitionTotal = annualTuition * yearsOfStudy
  const maintenanceTotal = annualMaintenance * yearsOfStudy
  const subtotal = tuitionTotal + maintenanceTotal
  const finalTotal = Math.max(0, subtotal - parentalContribution)

  // Get living situation label
  const livingLabel = LIVING_SITUATION_OPTIONS.find(
    opt => opt.value === livingSituation
  )?.label || 'Unknown'

  const handleFormSubmit = (data: UserInput) => {
    const updatedInput: UserInput = {
      ...data,
      parentalContribution,
      annualMaintenanceActual: calculatedMaintenance,
    }
    onSubmit(updatedInput)
  }

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          STEP 1 OF 3: Your Child's Education & Loan Summary
        </h2>
        <p className="text-gray-600">
          Provide your details to calculate the total loan needed
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Line 1: Years of Study & Household Income */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Years of Study */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              How many years will they study?
            </label>
            <div className="flex gap-2">
              {[3, 4].map((year) => (
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
                  <span className="ml-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-400 cursor-pointer">
                    {year} years
                  </span>
                </label>
              ))}
            </div>
            {errors.yearsOfStudy && (
              <p className="mt-2 text-sm text-red-600">{errors.yearsOfStudy.message}</p>
            )}
          </div>

          {/* Household Income */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              What is your household income?
            </label>
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
        </div>

        {/* Line 2: Living Situation - All options on one horizontal line */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Where will your child be living while studying?
          </label>
          <div className="space-y-2 md:space-y-0 md:flex md:gap-2 md:flex-wrap">
            {LIVING_SITUATION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors md:flex-1 md:min-w-fit"
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('livingSituation', { required: 'Please select living situation' })}
                  className="w-4 h-4"
                />
                <span className="ml-2 text-sm">
                  <p className="font-medium text-gray-900">{option.label.split(' - ')[0]}</p>
                  <p className="text-xs text-gray-600">Max {option.description}</p>
                </span>
              </label>
            ))}
          </div>
          {errors.livingSituation && (
            <p className="mt-2 text-sm text-red-600">{errors.livingSituation.message}</p>
          )}
        </div>

        {/* Line 3: Parental Contribution */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            💰 Your Parental Contribution
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-600">£</span>
            <input
              type="number"
              min="0"
              step="500"
              value={parentalContribution}
              onChange={(e) => setParentalContribution(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">Maximum available: {formatCurrency(maxLoanAvailable)}</p>
        </div>

        {/* Loan Summary Section */}
        <div className="border-t-2 border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>

          {/* Key Figures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Max Loan Available */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-semibold uppercase mb-2">Max Loan Available</p>
              <p className="text-3xl font-bold text-blue-900">{formatCurrency(maxLoanAvailable)}</p>
              <p className="text-xs text-blue-800 mt-2">Tuition + Maintenance (before contribution)</p>
            </div>

            {/* Total Loan Needed */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900 font-semibold uppercase mb-2">Total Loan Needed</p>
              <p className="text-3xl font-bold text-green-900">{formatCurrency(finalTotal)}</p>
              <p className="text-xs text-green-800 mt-2">After your contribution</p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Tuition Fees (2026/27)</p>
                <p className="text-sm text-gray-600">{formatCurrency(annualTuition)}/year × {yearsOfStudy} years</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(tuitionTotal)}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Maintenance Allowance (eligible)</p>
                <p className="text-sm text-gray-600">{formatCurrency(annualMaintenance)}/year × {yearsOfStudy} years</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(maintenanceTotal)}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-100 border border-gray-300 rounded-lg font-semibold">
              <p className="text-gray-900">Subtotal (Max Loan)</p>
              <p className="text-gray-900">{formatCurrency(subtotal)}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-gray-900">Your Contribution</p>
              <p className="text-lg font-semibold text-purple-900">{formatCurrency(parentalContribution)}</p>
            </div>

            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold text-lg">
              <p>Final Loan Amount Needed</p>
              <p className="text-2xl">{formatCurrency(finalTotal)}</p>
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ Note:</strong> We calculate the total loan amount based on tuition fees (£{formatCurrency(annualTuition)}/year for 2026-27) plus your eligible maintenance allowance, minus your parental contribution. Then we'll show you 4 salary scenarios with expected monthly repayment amounts.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={loading}
            size="lg"
          >
            Next: Compare Scenarios →
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default CombinedOnboarding
