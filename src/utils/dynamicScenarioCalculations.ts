import type { UserInput, RepaymentOutput, YearData } from '@types/index'
import { UK_LOAN_SYSTEM, MAX_REPAYMENT_YEARS } from './constants'

interface DynamicScenarioInput {
  totalLoan: number
  yearsOfStudy: number
  startingSalary: number
  annualIncrement: number
  interestRate: number
  parentalContribution: number
}

/**
 * Calculate salary for a given year with custom interest rate
 */
function calculateDynamicSalary(
  startingSalary: number,
  annualIncrement: number,
  yearsPostGraduation: number
): number {
  return startingSalary * Math.pow(1 + annualIncrement, yearsPostGraduation - 1)
}

/**
 * Calculate monthly payment with custom salary
 */
function calculateDynamicMonthlyPayment(salary: number): number {
  const { REPAYMENT_THRESHOLD, REPAYMENT_RATE } = UK_LOAN_SYSTEM

  if (salary <= REPAYMENT_THRESHOLD) {
    return 0
  }

  const repayableIncome = salary - REPAYMENT_THRESHOLD
  const annualRepayment = repayableIncome * REPAYMENT_RATE
  return annualRepayment / 12
}

/**
 * Build dynamic repayment timeline with custom inputs
 */
export function buildDynamicRepaymentTimeline(
  input: DynamicScenarioInput
): YearData[] {
  const timeline: YearData[] = []
  let currentBalance = input.totalLoan - input.parentalContribution
  let cumulativePaid = 0
  let cumulativeInterest = 0
  const STUDY_INTEREST_RATE = UK_LOAN_SYSTEM.INTEREST_DURING_STUDY

  for (let year = 1; year <= MAX_REPAYMENT_YEARS; year++) {
    const isStillStudying = year <= input.yearsOfStudy

    // Calculate interest on current balance
    const interestCharged = currentBalance * input.interestRate
    cumulativeInterest += interestCharged

    // Add interest to balance
    currentBalance += interestCharged

    // Calculate salary and payment (only after graduation)
    let salary = 0
    let monthlyPayment = 0
    let annualPayment = 0

    if (!isStillStudying) {
      const yearsPostGraduation = year - input.yearsOfStudy
      salary = calculateDynamicSalary(input.startingSalary, 0.05, yearsPostGraduation)
      monthlyPayment = calculateDynamicMonthlyPayment(salary)
      annualPayment = monthlyPayment * 12
    }

    // Deduct payment from balance (only after graduation)
    currentBalance -= annualPayment
    currentBalance = Math.max(0, currentBalance)

    // Track cumulative paid
    if (annualPayment > 0) {
      cumulativePaid += annualPayment
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
 * Calculate full loan scenario (no parental contribution)
 */
export function buildDynamicFullLoanTimeline(
  input: DynamicScenarioInput
): YearData[] {
  return buildDynamicRepaymentTimeline({
    ...input,
    parentalContribution: 0,
  })
}

/**
 * Generate investment projection data
 */
export function generateInvestmentProjection(
  contribution: number,
  yearsToRepay: number,
  rates: number[] = [0.03, 0.04, 0.05]
): { year: number; [key: string]: number }[] {
  const data: { year: number; [key: string]: number }[] = []

  for (let year = 1; year <= yearsToRepay; year++) {
    const point: { year: number; [key: string]: number } = { year }

    rates.forEach((rate) => {
      const growthValue = contribution * Math.pow(1 + rate, year)
      point[`${(rate * 100).toFixed(0)}% Growth`] = Math.round(growthValue)
    })

    data.push(point)
  }

  return data
}

/**
 * Calculate repayment metrics
 */
export function calculateRepaymentMetrics(timeline: YearData[]) {
  const lastYear = timeline[timeline.length - 1]

  return {
    yearsToRepayment: timeline.length,
    totalAmountPaid: lastYear?.totalPaid || 0,
    totalInterestPaid: lastYear?.cumulativeInterest || 0,
    firstYearMonthlyPayment: timeline.find(y => y.year > 3)?.monthlyPayment || 0,
  }
}
