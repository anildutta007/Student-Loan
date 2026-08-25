import type {
  LoanInput,
  SalaryScenario,
  RepaymentOutput,
  YearData,
  LivingSituation,
} from '@types/index'
import { UK_LOAN_SYSTEM, MAX_REPAYMENT_YEARS, MAINTENANCE_LIMITS } from './constants'

/**
 * Calculate maintenance allowance based on household income and living situation
 * Uses continuous taper: £1 reduction per ~£6.36 of income above £25,000
 * With guaranteed minimum floor
 */
export function calculateMaintenanceAllowance(
  householdIncome: number,
  livingSituation: LivingSituation
): number {
  const limits = MAINTENANCE_LIMITS[livingSituation]
  const { MAINTENANCE_INCOME_THRESHOLD, MAINTENANCE_TAPER_DIVISOR } = UK_LOAN_SYSTEM

  // If income is at or below threshold, get maximum
  if (householdIncome <= MAINTENANCE_INCOME_THRESHOLD) {
    return limits.maximum
  }

  // Apply continuous taper for income above threshold
  const incomeAboveThreshold = householdIncome - MAINTENANCE_INCOME_THRESHOLD
  const taperReduction = incomeAboveThreshold / MAINTENANCE_TAPER_DIVISOR
  const allowance = limits.maximum - taperReduction

  // Apply guaranteed minimum floor
  return Math.max(allowance, limits.minimum)
}

/**
 * Calculate total loan amount based on costs and years of study
 */
export function calculateTotalLoan(input: LoanInput): number {
  const annualCost = input.annualTuition + input.annualMaintenanceActual
  const totalStudyLoan = annualCost * input.yearsOfStudy

  // Apply parental contribution
  return Math.max(0, totalStudyLoan - input.parentalContribution)
}

/**
 * Calculate salary for a given year with annual increment
 */
export function calculateSalary(
  scenario: SalaryScenario,
  year: number
): number {
  return scenario.startingSalary *
    Math.pow(1 + scenario.annualIncrement, year - 1)
}

/**
 * Calculate monthly repayment for a given salary
 */
export function calculateMonthlyPayment(salary: number): number {
  const { REPAYMENT_THRESHOLD, REPAYMENT_RATE } = UK_LOAN_SYSTEM

  if (salary <= REPAYMENT_THRESHOLD) {
    return 0
  }

  const repayableIncome = salary - REPAYMENT_THRESHOLD
  const annualRepayment = repayableIncome * REPAYMENT_RATE
  return annualRepayment / 12
}

/**
 * Build repayment timeline for a scenario
 * Includes interest accrual during study period and after graduation
 */
export function buildRepaymentTimeline(
  totalLoan: number,
  scenario: SalaryScenario,
  yearsOfStudy: number
): YearData[] {
  const timeline: YearData[] = []
  let currentBalance = totalLoan
  let cumulativePaid = 0
  let cumulativeInterest = 0
  const REPAYMENT_INTEREST_RATE = UK_LOAN_SYSTEM.INTEREST_RATE // 4.5% (RPI)
  const STUDY_INTEREST_RATE = UK_LOAN_SYSTEM.INTEREST_DURING_STUDY // 4.5% (RPI) during study

  for (let year = 1; year <= MAX_REPAYMENT_YEARS; year++) {
    const salary = calculateSalary(scenario, year)
    const monthlyPayment = calculateMonthlyPayment(salary)
    const annualPayment = monthlyPayment * 12

    // Interest rate depends on whether still studying
    const isStillStudying = year <= yearsOfStudy
    const interestRate = isStillStudying ? STUDY_INTEREST_RATE : REPAYMENT_INTEREST_RATE

    // Calculate interest on current balance
    const interestCharged = currentBalance * interestRate
    cumulativeInterest += interestCharged

    // Add interest to balance
    currentBalance += interestCharged

    // Deduct payment from balance (only after graduation)
    const actualPayment = isStillStudying ? 0 : annualPayment
    currentBalance -= actualPayment
    currentBalance = Math.max(0, currentBalance)

    // Track cumulative paid
    if (actualPayment > 0) {
      cumulativePaid += actualPayment
    }

    timeline.push({
      year,
      salary: Math.round(salary),
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPaid: Math.round(cumulativePaid),
      loanBalance: Math.round(currentBalance),
      interestCharged: Math.round(interestCharged),
      cumulativeInterest: Math.round(cumulativeInterest),
    })

    // Stop tracking if loan is paid off
    if (currentBalance === 0) {
      break
    }
  }

  return timeline
}

/**
 * Calculate repayment scenario for a specific salary trajectory
 */
export function calculateScenario(
  totalLoan: number,
  scenario: SalaryScenario,
  yearsOfStudy: number
): RepaymentOutput {
  const timeline = buildRepaymentTimeline(totalLoan, scenario, yearsOfStudy)

  // Find when loan is paid off
  let yearsToRepayment = MAX_REPAYMENT_YEARS
  let totalAmountPaid = 0
  let interestPaid = 0

  for (const yearData of timeline) {
    totalAmountPaid = yearData.totalPaid
    interestPaid = yearData.cumulativeInterest
    if (yearData.loanBalance === 0) {
      yearsToRepayment = yearData.year
      break
    }
  }

  return {
    scenario: scenario.name,
    label: scenario.label,
    startingSalary: scenario.startingSalary,
    firstYearMonthlyPayment:
      Math.round(calculateMonthlyPayment(scenario.startingSalary) * 100) / 100,
    peakMonthlyPayment: Math.max(
      ...timeline.map(y => y.monthlyPayment)
    ),
    yearsToRepayment,
    totalAmountPaid,
    interestPaid,
    repaymentTimeline: timeline,
    color: scenario.color,
  }
}

/**
 * Calculate all scenarios
 */
export function calculateAllScenarios(
  loanInput: LoanInput,
  scenarios: SalaryScenario[]
): RepaymentOutput[] {
  const totalLoan = calculateTotalLoan(loanInput)

  return scenarios.map(scenario => calculateScenario(totalLoan, scenario, loanInput.yearsOfStudy))
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format currency with decimals (for monthly payments)
 */
export function formatCurrencyDecimal(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * Validate user input
 */
export function validateLoanInput(input: LoanInput): string[] {
  const errors: string[] = []

  if (input.yearsOfStudy < 1 || input.yearsOfStudy > 10) {
    errors.push('Years of study must be between 1 and 10')
  }

  if (input.annualTuition < 0) {
    errors.push('Annual tuition cannot be negative')
  }

  if (input.annualMaintenanceActual < 0) {
    errors.push('Maintenance allowance cannot be negative')
  }

  if (input.parentalContribution < 0) {
    errors.push('Parental contribution cannot be negative')
  }

  return errors
}
