/**
 * Post-Graduate Repayment Calculations
 * For students already in repayment (Plan 2, Plan 4)
 */

import type { YearData } from '@types/index'
import { getPlanConfig } from './planConfigurations'

export interface PostGraduateRepaymentResult {
  currentAge: number
  currentLoanBalance: number
  currentSalary: number
  employmentStatus: string
  yearsEmployed: number
  salaryGrowthRate: number
  monthlyPayment: number
  monthlyInterest: number
  monthlyPrincipal: number
  annualInterest: number
  annualPrincipal: number
  interestPercentage: number
  principalPercentage: number
  repaymentTimeline: YearData[]
  projection: {
    status: 'payoff' | 'forgiven' | 'no-repayment' | 'interest-only'
    yearsRemaining: number
    ageAtCompletion: number
    totalInterestRemaining: number
    totalAmountRemaining: number
  }
}

/**
 * Determine salary growth rate based on experience level
 */
function calculateSalaryGrowthRate(employmentStatus: string, yearsEmployed: number): number {
  // Early career (0-3 years): Higher growth potential
  if (yearsEmployed <= 3) {
    return 0.05  // 5% annual growth
  }
  // Mid career (3-10 years): Moderate growth
  if (yearsEmployed <= 10) {
    return 0.04  // 4% annual growth
  }
  // Established (10+ years): Steady growth
  if (yearsEmployed <= 20) {
    return 0.03  // 3% annual growth
  }
  // Late career (20+ years): Minimal growth
  return 0.02  // 2% annual growth
}

/**
 * Calculate post-graduate repayment analysis
 */
export function calculatePostGraduateRepayment(
  currentAge: number,
  currentLoanBalance: number,
  currentSalary: number,
  planId: string,
  employmentStatus: string = 'employed',
  yearsEmployed: number = 5
): PostGraduateRepaymentResult {
  const plan = getPlanConfig(planId)
  if (!plan) {
    throw new Error('Invalid plan configuration')
  }

  // Calculate current monthly payment
  const monthlyPayment = calculateMonthlyPaymentForSalary(currentSalary, plan)

  // Calculate current monthly interest
  const monthlyInterest = Math.round((currentLoanBalance * plan.interestRatePostGraduation) / 12)

  // Calculate monthly principal
  const monthlyPrincipal = Math.max(0, monthlyPayment - monthlyInterest)

  // Calculate annual figures
  const annualPayment = monthlyPayment * 12
  const annualInterest = monthlyInterest * 12
  const annualPrincipal = monthlyPrincipal * 12

  // Calculate percentages
  const totalMonthlyAmount = monthlyPayment > 0 ? monthlyPayment : monthlyInterest
  const interestPercentage = totalMonthlyAmount > 0
    ? Math.round((monthlyInterest / totalMonthlyAmount) * 100)
    : 0
  const principalPercentage = 100 - interestPercentage

  // Calculate salary growth based on employment experience
  const salaryGrowthRate = calculateSalaryGrowthRate(employmentStatus, yearsEmployed)

  // Build repayment timeline
  const timeline = buildPostGraduateTimeline(
    currentAge,
    currentLoanBalance,
    currentSalary,
    monthlyPayment,
    planId,
    salaryGrowthRate
  )

  // Calculate projection
  const projection = calculateRepaymentProjection(
    currentAge,
    currentLoanBalance,
    monthlyPayment,
    monthlyInterest,
    plan,
    timeline
  )

  return {
    currentAge,
    currentLoanBalance,
    currentSalary,
    employmentStatus,
    yearsEmployed,
    salaryGrowthRate,
    monthlyPayment,
    monthlyInterest,
    monthlyPrincipal,
    annualInterest,
    annualPrincipal,
    interestPercentage,
    principalPercentage,
    repaymentTimeline: timeline,
    projection,
  }
}

/**
 * Calculate monthly payment for a given salary
 */
function calculateMonthlyPaymentForSalary(annualSalary: number, plan: any): number {
  if (annualSalary <= plan.repaymentThreshold) {
    return 0
  }

  const repayableIncome = annualSalary - plan.repaymentThreshold
  const annualRepayment = repayableIncome * plan.repaymentRate
  return Math.round(annualRepayment / 12)
}

/**
 * Build year-by-year repayment timeline
 */
function buildPostGraduateTimeline(
  startAge: number,
  startLoanBalance: number,
  startSalary: number,
  monthlyPayment: number,
  planId: string,
  annualSalaryGrowth: number
): YearData[] {
  const plan = getPlanConfig(planId)
  if (!plan) return []

  const timeline: YearData[] = []
  let currentAge = startAge
  let loanBalance = startLoanBalance
  let currentSalary = startSalary
  let totalPaid = 0
  let cumulativeInterest = 0

  const startYear = new Date().getFullYear()
  const forgicvenessAge = startAge + plan.maxRepaymentYears

  for (let year = startYear; year < startYear + plan.maxRepaymentYears + 10; year++) {
    // Stop if loan is fully paid
    if (loanBalance <= 0 || currentAge >= forgicvenessAge) {
      if (loanBalance > 0) {
        // Final year showing loan forgiven
        timeline.push({
          year,
          salary: Math.round(currentSalary),
          monthlyPayment: 0,
          totalPaid: Math.round(totalPaid),
          loanBalance: 0,
          interestCharged: 0,
          cumulativeInterest: Math.round(cumulativeInterest),
        })
      }
      break
    }

    // Calculate salary for this year
    currentSalary = startSalary * Math.pow(1 + annualSalaryGrowth, year - startYear)

    // Calculate monthly payment for current salary
    const yearlyMonthlyPayment = calculateMonthlyPaymentForSalary(currentSalary, plan)
    const yearlyPayment = yearlyMonthlyPayment * 12

    // Calculate interest for this year
    const yearlyInterest = Math.round(loanBalance * plan.interestRatePostGraduation)
    cumulativeInterest += yearlyInterest

    // Update loan balance
    loanBalance = Math.max(0, loanBalance + yearlyInterest - yearlyPayment)
    totalPaid += yearlyPayment

    timeline.push({
      year,
      salary: Math.round(currentSalary),
      monthlyPayment: Math.round(yearlyMonthlyPayment),
      totalPaid: Math.round(totalPaid),
      loanBalance: Math.round(Math.max(0, loanBalance)),
      interestCharged: yearlyInterest,
      cumulativeInterest: Math.round(cumulativeInterest),
    })

    currentAge += 1
  }

  return timeline
}

/**
 * Calculate repayment projection
 */
function calculateRepaymentProjection(
  currentAge: number,
  currentLoanBalance: number,
  monthlyPayment: number,
  monthlyInterest: number,
  plan: any,
  timeline: YearData[]
): PostGraduateRepaymentResult['projection'] {
  const monthlyPrincipal = monthlyPayment - monthlyInterest
  const forgicvenessAge = currentAge + plan.maxRepaymentYears

  // No repayment required
  if (monthlyPayment === 0) {
    return {
      status: 'no-repayment',
      yearsRemaining: plan.maxRepaymentYears,
      ageAtCompletion: forgicvenessAge,
      totalInterestRemaining: Math.round(currentLoanBalance * plan.interestRatePostGraduation * plan.maxRepaymentYears),
      totalAmountRemaining: currentLoanBalance,
    }
  }

  // Interest-only (payment doesn't reduce principal)
  if (monthlyPrincipal <= 0) {
    return {
      status: 'interest-only',
      yearsRemaining: plan.maxRepaymentYears,
      ageAtCompletion: forgicvenessAge,
      totalInterestRemaining: Math.round(currentLoanBalance * plan.interestRatePostGraduation * plan.maxRepaymentYears),
      totalAmountRemaining: currentLoanBalance,
    }
  }

  // Find when loan is fully paid off
  const lastTimelineEntry = timeline[timeline.length - 1]
  const payoffYear = lastTimelineEntry.year - new Date().getFullYear()
  const yearsToPayoff = Math.max(0, payoffYear)
  const ageAtPayoff = currentAge + yearsToPayoff

  // Check if loan will be paid off before forgiveness
  if (yearsToPayoff < plan.maxRepaymentYears && lastTimelineEntry.loanBalance === 0) {
    const totalInterestRemaining = lastTimelineEntry.cumulativeInterest -
      (timeline.find(t => t.year === new Date().getFullYear() - 1)?.cumulativeInterest || 0)

    return {
      status: 'payoff',
      yearsRemaining: yearsToPayoff,
      ageAtCompletion: ageAtPayoff,
      totalInterestRemaining: Math.round(totalInterestRemaining),
      totalAmountRemaining: 0,
    }
  }

  // Loan will be forgiven
  const totalInterestToForgiveness = lastTimelineEntry.cumulativeInterest

  return {
    status: 'forgiven',
    yearsRemaining: plan.maxRepaymentYears,
    ageAtCompletion: forgicvenessAge,
    totalInterestRemaining: Math.round(totalInterestToForgiveness),
    totalAmountRemaining: lastTimelineEntry.loanBalance,
  }
}
