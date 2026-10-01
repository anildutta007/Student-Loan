import { useState, useCallback } from 'react'
import type {
  RepaymentOutput,
  UserInput,
  LivingSituation,
} from '@types/index'
import {
  calculateMaintenanceAllowanceByPlan,
  calculateAllScenariosByPlan,
} from '@utils/flexibleCalculations'
import {
  DEFAULT_SCENARIOS,
} from '@utils/constants'
import { getPlanConfig } from '@utils/planConfigurations'

/**
 * Enhanced custom hook supporting multiple student loan plans
 */
export function useCalculationsMultiPlan() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [userInput, setUserInput] = useState<UserInput | null>(null)
  const [totalLoan, setTotalLoan] = useState<number>(0)
  const [results, setResults] = useState<RepaymentOutput[] | null>(null)
  const [fullLoanResults, setFullLoanResults] = useState<RepaymentOutput[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Select a loan plan and move to step 1
   */
  const submitPlanSelection = useCallback((planId: string) => {
    try {
      const plan = getPlanConfig(planId)
      if (!plan) {
        throw new Error('Invalid plan selected')
      }
      setSelectedPlanId(planId)
      setStep(1)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }, [])

  /**
   * Process user input and calculate scenarios for selected plan
   */
  const submitStep1 = useCallback((input: UserInput) => {
    try {
      setLoading(true)
      setError(null)

      if (!selectedPlanId) {
        throw new Error('No plan selected')
      }

      const plan = getPlanConfig(selectedPlanId)
      if (!plan) {
        throw new Error('Invalid plan configuration')
      }

      // Ensure numeric values are actually numbers
      const householdIncome = typeof input.householdIncome === 'string'
        ? parseInt(input.householdIncome, 10)
        : input.householdIncome

      const yearsOfStudy = typeof input.yearsOfStudy === 'string'
        ? parseInt(input.yearsOfStudy, 10)
        : input.yearsOfStudy

      const parentalContribution = typeof input.parentalContribution === 'string'
        ? parseInt(input.parentalContribution, 10)
        : input.parentalContribution

      // Calculate maintenance for selected plan
      const calculatedMaintenance = calculateMaintenanceAllowanceByPlan(
        householdIncome,
        input.livingSituation as LivingSituation,
        selectedPlanId
      )

      const normalizedInput: UserInput = {
        status: 'new',
        yearsOfStudy,
        livingSituation: input.livingSituation as LivingSituation,
        householdIncome,
        parentalContribution,
        studentLoanPlan: selectedPlanId as any,
        annualTuition: plan.tuitionFeeAnnual,
        annualMaintenanceMax: undefined,
        annualMaintenanceActual: calculatedMaintenance,
      }

      setUserInput(normalizedInput)

      // Calculate total loan (tuition + maintenance - parental contribution)
      const annualCost = plan.tuitionFeeAnnual + calculatedMaintenance
      const totalBeforeContribution = annualCost * yearsOfStudy
      const total = Math.max(0, totalBeforeContribution - parentalContribution)

      setTotalLoan(total)

      // Calculate scenarios with parental contribution
      const calculatedResults = calculateAllScenariosByPlan(
        total,
        selectedPlanId,
        yearsOfStudy,
        DEFAULT_SCENARIOS
      )
      setResults(calculatedResults)

      // Also calculate scenarios with full loan (for comparison)
      if (parentalContribution > 0) {
        const fullLoanCalculatedResults = calculateAllScenariosByPlan(
          totalBeforeContribution,
          selectedPlanId,
          yearsOfStudy,
          DEFAULT_SCENARIOS
        )
        setFullLoanResults(fullLoanCalculatedResults)
      } else {
        setFullLoanResults(null)
      }

      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [selectedPlanId])

  /**
   * Move to scenario comparison
   */
  const submitStep2 = useCallback(() => {
    setStep(3)
  }, [])

  /**
   * Reset calculator to plan selection
   */
  const reset = useCallback(() => {
    setStep(0)
    setSelectedPlanId(null)
    setUserInput(null)
    setTotalLoan(0)
    setResults(null)
    setFullLoanResults(null)
    setError(null)
    setLoading(false)
  }, [])

  /**
   * Go back to previous step
   */
  const goBack = useCallback(() => {
    if (step > 0) {
      setStep((prev) => (prev - 1) as 0 | 1 | 2 | 3)
    }
  }, [step])

  return {
    // State
    step,
    selectedPlanId,
    userInput,
    totalLoan,
    results,
    fullLoanResults,
    loading,
    error,

    // Actions
    submitPlanSelection,
    submitStep1,
    submitStep2,
    reset,
    goBack,
  }
}
