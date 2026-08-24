import type {
  LoanInput,
  SalaryScenario,
  RepaymentOutput,
  YearData,
} from '@types/index'
import { UK_LOAN_SYSTEM, MAX_REPAYMENT_YEARS } from './constants'

/**
 * Calculate total loan amount based on costs and years of study
 */
export function calculateTotalLoan(input: LoanInput): number {
  const annualCost =
    input.annualTuition +
    input.annualLiving +
    input.maintenanceAllowance

  return annualCost * input.yearsOfStudy
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
 */
export function buildRepaymentTimeline(
  totalLoan: number,
  scenario: SalaryScenario
): YearData[] {
  const timeline: YearData[] = []
  let currentBalance = totalLoan
  let cumulativePaid = 0
  const INTEREST_RATE = UK_LOAN_SYSTEM.INTEREST_RATE // RPI + 3% = ~6%

  for (let year = 1; year <= MAX_REPAYMENT_YEARS; year++) {
    const salary = calculateSalary(scenario, year)
    const monthlyPayment = calculateMonthlyPayment(salary)
    const annualPayment = monthlyPayment * 12

    // Calculate interest on current balance (charged at start of year)
    const interestCharged = currentBalance * INTEREST_RATE

    // Add interest to balance
    currentBalance += interestCharged

    // Deduct payment from balance
    const newBalance = currentBalance - annualPayment
    currentBalance = Math.max(0, newBalance)

    // Track cumulative paid
    cumulativePaid += Math.min(annualPayment, currentBalance + annualPayment)

    timeline.push({
      year,
      salary: Math.round(salary),
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPaid: Math.round(cumulativePaid),
      loanBalance: Math.round(currentBalance),
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
  scenario: SalaryScenario
): RepaymentOutput {
  const timeline = buildRepaymentTimeline(totalLoan, scenario)

  // Find when loan is paid off
  let yearsToRepayment = MAX_REPAYMENT_YEARS
  let totalAmountPaid = 0

  for (const yearData of timeline) {
    totalAmountPaid = yearData.totalPaid
    if (yearData.loanBalance === 0) {
      yearsToRepayment = yearData.year
      break
    }
  }

  // Calculate interest (total paid - original loan)
  // Note: Can be negative if forgiven early
  const interestPaid = totalAmountPaid - totalLoan

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

  return scenarios.map(scenario => calculateScenario(totalLoan, scenario))
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

  if (input.annualLiving < 0) {
    errors.push('Annual living costs cannot be negative')
  }

  if (input.maintenanceAllowance < 0) {
    errors.push('Maintenance allowance cannot be negative')
  }

  return errors
}
