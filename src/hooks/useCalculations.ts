import { useState, useCallback } from 'react'
import type {
  LoanInput,
  RepaymentOutput,
  UserInput,
} from '@types/index'
import {
  calculateAllScenarios,
  validateLoanInput,
} from '@utils/calculations'
import {
  ACCOMMODATION_ESTIMATES,
  LIVING_EXPENSE_ESTIMATES,
  UK_LOAN_SYSTEM,
  DEFAULT_SCENARIOS,
} from '@utils/constants'

/**
 * Custom hook for managing calculator state and calculations
 */
export function useCalculations() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [userInput, setUserInput] = useState<UserInput | null>(null)
  const [totalLoan, setTotalLoan] = useState<number>(0)
  const [results, setResults] = useState<RepaymentOutput[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Process user input and move to next step
   */
  const submitStep1 = useCallback((input: UserInput) => {
    try {
      setError(null)
      // Ensure numeric values are actually numbers (HTML forms return strings)
      const normalizedInput: UserInput = {
        status: input.status,
        yearsOfStudy: typeof input.yearsOfStudy === 'string' ? parseInt(input.yearsOfStudy, 10) : input.yearsOfStudy,
        maintenanceAllowance: typeof input.maintenanceAllowance === 'string' ? parseInt(input.maintenanceAllowance, 10) : input.maintenanceAllowance,
      }
      setUserInput(normalizedInput)
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }, [])

  /**
   * Confirm loan summary and calculate scenarios
   */
  const submitStep2 = useCallback(() => {
    if (!userInput) return

    try {
      setLoading(true)
      setError(null)

      // Prepare loan input
      // UK student loan = Tuition + Maintenance Allowance (no accommodation)
      const loanInput: LoanInput = {
        yearsOfStudy: userInput.yearsOfStudy,
        annualTuition:
          userInput.annualTuition ?? UK_LOAN_SYSTEM.TUITION_FEE_ANNUAL,
        annualLiving: 0, // UK loan doesn't cover accommodation/living
        maintenanceAllowance: userInput.maintenanceAllowance,
      }

      // Validate input
      const validationErrors = validateLoanInput(loanInput)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0])
      }

      // Calculate total loan
      const annualCost = loanInput.annualTuition +
        loanInput.annualLiving +
        loanInput.maintenanceAllowance
      const total = annualCost * loanInput.yearsOfStudy

      // Debug logging
      console.log('Loan Calculation Debug:', {
        annualTuition: loanInput.annualTuition,
        annualLiving: loanInput.annualLiving,
        maintenanceAllowance: loanInput.maintenanceAllowance,
        yearsOfStudy: loanInput.yearsOfStudy,
        annualCost,
        total,
      })

      setTotalLoan(total)

      // Calculate all scenarios
      const calculatedResults = calculateAllScenarios(
        loanInput,
        DEFAULT_SCENARIOS
      )
      setResults(calculatedResults)

      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }, [userInput])

  /**
   * Move to results/export step
   */
  const submitStep3 = useCallback(() => {
    setStep(4)
  }, [])

  /**
   * Reset calculator
   */
  const reset = useCallback(() => {
    setStep(1)
    setUserInput(null)
    setTotalLoan(0)
    setResults(null)
    setError(null)
  }, [])

  /**
   * Go back to previous step
   */
  const goBack = useCallback(() => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)
    }
  }, [step])

  return {
    // State
    step,
    userInput,
    totalLoan,
    results,
    loading,
    error,

    // Actions
    submitStep1,
    submitStep2,
    submitStep3,
    reset,
    goBack,
  }
}
