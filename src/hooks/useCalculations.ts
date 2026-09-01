import { useState, useCallback } from 'react'
import type {
  LoanInput,
  RepaymentOutput,
  UserInput,
  LivingSituation,
} from '@types/index'
import {
  calculateAllScenarios,
  validateLoanInput,
  calculateMaintenanceAllowance,
  calculateTotalLoan,
} from '@utils/calculations'
import {
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
  const [fullLoanResults, setFullLoanResults] = useState<RepaymentOutput[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Process user input and move to next step
   */
  const submitStep1 = useCallback((input: UserInput) => {
    try {
      setError(null)
      // Ensure numeric values are actually numbers (HTML forms return strings)
      const calculatedMaintenance = calculateMaintenanceAllowance(
        typeof input.householdIncome === 'string' ? parseInt(input.householdIncome, 10) : input.householdIncome,
        input.livingSituation as LivingSituation
      )

      const normalizedInput: UserInput = {
        status: 'new',
        yearsOfStudy: typeof input.yearsOfStudy === 'string' ? parseInt(input.yearsOfStudy, 10) : input.yearsOfStudy,
        livingSituation: input.livingSituation as LivingSituation,
        householdIncome: typeof input.householdIncome === 'string' ? parseInt(input.householdIncome, 10) : input.householdIncome,
        parentalContribution: typeof input.parentalContribution === 'string' ? parseInt(input.parentalContribution, 10) : input.parentalContribution,
        annualTuition: UK_LOAN_SYSTEM.TUITION_FEE_ANNUAL,
        annualMaintenanceMax: undefined,
        annualMaintenanceActual: calculatedMaintenance,
      }
      setUserInput(normalizedInput)
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }, [])

  /**
   * Confirm loan summary with potential parental contribution update
   */
  const submitStep2 = useCallback((updatedInput?: UserInput) => {
    const inputToUse = updatedInput || userInput
    if (!inputToUse) return

    try {
      setLoading(true)
      setError(null)

      // Update userInput if it was modified on Step 2
      if (updatedInput) {
        setUserInput(updatedInput)
      }

      // Prepare loan input for calculations
      const loanInput: LoanInput = {
        yearsOfStudy: inputToUse.yearsOfStudy,
        annualTuition: inputToUse.annualTuition ?? UK_LOAN_SYSTEM.TUITION_FEE_ANNUAL,
        annualMaintenanceActual: inputToUse.annualMaintenanceActual ?? 0,
        parentalContribution: inputToUse.parentalContribution ?? 0,
      }

      // Validate input
      const validationErrors = validateLoanInput(loanInput)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0])
      }

      // Calculate total loan (includes parental contribution deduction)
      const total = calculateTotalLoan(loanInput)

      // Debug logging
      console.log('Loan Calculation Debug (2026/27):', {
        yearsOfStudy: loanInput.yearsOfStudy,
        annualTuition: loanInput.annualTuition,
        annualMaintenance: loanInput.annualMaintenanceActual,
        parentalContribution: loanInput.parentalContribution,
        annualCost: loanInput.annualTuition + loanInput.annualMaintenanceActual,
        totalBeforeContribution: (loanInput.annualTuition + loanInput.annualMaintenanceActual) * loanInput.yearsOfStudy,
        totalLoanNeeded: total,
        interestRate: UK_LOAN_SYSTEM.INTEREST_RATE,
      })

      setTotalLoan(total)

      // Calculate scenarios with parental contribution
      const calculatedResults = calculateAllScenarios(
        loanInput,
        DEFAULT_SCENARIOS
      )
      setResults(calculatedResults)

      // Also calculate scenarios with full loan (for comparison)
      if (loanInput.parentalContribution > 0) {
        const fullLoanInput: LoanInput = {
          ...loanInput,
          parentalContribution: 0,
        }
        const fullLoanCalculatedResults = calculateAllScenarios(
          fullLoanInput,
          DEFAULT_SCENARIOS
        )
        setFullLoanResults(fullLoanCalculatedResults)
      } else {
        setFullLoanResults(null)
      }

      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }, [])

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
    setFullLoanResults(null)
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
    fullLoanResults,
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
