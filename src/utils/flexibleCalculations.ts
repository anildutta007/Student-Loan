/**
 * Flexible Student Loan Calculation Engine
 * Works with any plan configuration
 */

import type { RepaymentOutput, YearData, UserInput } from '@types/index'
import { getPlanConfig } from './planConfigurations'

/**
 * Calculate maintenance allowance based on household income and plan
 */
export function calculateMaintenanceAllowanceByPlan(
  householdIncome: number,
  livingSituation: 'at-home' | 'away-london' | 'away-other',
  planId: string
): number {
  const plan = getPlanConfig(planId)
  if (!plan) return 0

  const maintenanceLimits = getMaintenanceLimitsByPlan(planId, livingSituation)
  if (!maintenanceLimits) return 0

  const { maximum, minimum } = maintenanceLimits

  // No maintenance loan if household income is too high
  if (householdIncome > plan.maintenanceIncomeThreshold * 10) {
    return minimum
  }

  // Calculate taper
  if (householdIncome <= plan.maintenanceIncomeThreshold) {
    return maximum
  }

  const excessIncome = householdIncome - plan.maintenanceIncomeThreshold
  const reduction = excessIncome / plan.maintenanceTaperDivisor
  const allowance = Math.max(minimum, maximum - reduction)

  return Math.round(allowance)
}

/**
 * Get maintenance limits for a specific plan and living situation
 */
export function getMaintenanceLimitsByPlan(
  planId: string,
  livingSituation: 'at-home' | 'away-london' | 'away-other'
) {
  const PLAN_MAINTENANCE_LIMITS = {
    'plan-1': {
      'at-home': { maximum: 2500, minimum: 1500 },
      'away-london': { maximum: 4400, minimum: 3000 },
      'away-other': { maximum: 3500, minimum: 2400 },
    },
    'plan-2': {
      'at-home': { maximum: 3750, minimum: 1500 },
      'away-london': { maximum: 7751, minimum: 3900 },
      'away-other': { maximum: 5500, minimum: 3000 },
    },
    'plan-4': {
      'at-home': { maximum: 8200, minimum: 3650 },
      'away-london': { maximum: 13863, minimum: 7360 },
      'away-other': { maximum: 10282, minimum: 4903 },
    },
    'plan-5': {
      'at-home': { maximum: 9118, minimum: 4013 },
      'away-london': { maximum: 14135, minimum: 7039 },
      'away-other': { maximum: 10830, minimum: 5048 },
    },
  }

  return PLAN_MAINTENANCE_LIMITS[planId as keyof typeof PLAN_MAINTENANCE_LIMITS]?.[livingSituation] || null
}

/**
 * Calculate monthly repayment for a given salary using plan-specific config
 */
export function calculateMonthlyPaymentByPlan(
  annualSalary: number,
  planId: string
): number {
  const plan = getPlanConfig(planId)
  if (!plan) return 0

  // No repayment if salary is below threshold
  if (annualSalary <= plan.repaymentThreshold) {
    return 0
  }

  const repayableIncome = annualSalary - plan.repaymentThreshold
  const annualRepayment = repayableIncome * plan.repaymentRate
  const monthlyPayment = annualRepayment / 12

  return Math.round(monthlyPayment)
}

/**
 * Calculate interest accrued for a year using plan-specific rate
 */
export function calculateInterestByPlan(
  loanBalance: number,
  planId: string,
  isStudying: boolean
): number {
  const plan = getPlanConfig(planId)
  if (!plan || loanBalance <= 0) return 0

  const rate = isStudying ? plan.interestRateStudying : plan.interestRatePostGraduation
  return loanBalance * rate
}

/**
 * Build full repayment timeline using plan-specific logic
 */
export function buildRepaymentTimelineByPlan(
  initialLoanBalance: number,
  annualSalary: number,
  annualSalaryIncrement: number,
  planId: string,
  yearsOfStudy: number
): YearData[] {
  const plan = getPlanConfig(planId)
  if (!plan) return []

  const timeline: YearData[] = []
  let loanBalance = initialLoanBalance
  let cumulativeInterest = 0
  let totalPaid = 0
  let currentYear = new Date().getFullYear()
  const graduationYear = currentYear + yearsOfStudy

  for (let year = currentYear; year < currentYear + plan.maxRepaymentYears + yearsOfStudy; year++) {
    const isStudying = year < graduationYear
    const yearsSinceGraduation = year - graduationYear

    // Stop if loan is fully paid or forgiveness period reached
    if (loanBalance <= 0 || (!isStudying && yearsSinceGraduation >= plan.maxRepaymentYears)) {
      break
    }

    const salary = annualSalary * Math.pow(1 + annualSalaryIncrement, year - currentYear)
    const monthlyPayment = isStudying ? 0 : calculateMonthlyPaymentByPlan(salary, planId)
    const yearlyPayment = monthlyPayment * 12

    // Calculate interest
    const interest = calculateInterestByPlan(loanBalance, planId, isStudying)
    cumulativeInterest += interest

    // Update loan balance
    loanBalance = Math.max(0, loanBalance + interest - yearlyPayment)
    totalPaid += yearlyPayment

    timeline.push({
      year,
      salary: Math.round(salary),
      monthlyPayment: Math.round(monthlyPayment),
      totalPaid: Math.round(totalPaid),
      loanBalance: Math.round(loanBalance),
      interestCharged: Math.round(interest),
      cumulativeInterest: Math.round(cumulativeInterest),
    })
  }

  return timeline
}

/**
 * Calculate complete scenario using plan-specific config
 */
export function calculateScenarioByPlan(
  initialLoanBalance: number,
  scenarioName: 'A' | 'B' | 'C' | 'D',
  scenarioLabel: string,
  startingSalary: number,
  annualIncrement: number,
  planId: string,
  yearsOfStudy: number,
  scenarioColor: string
): RepaymentOutput {
  const timeline = buildRepaymentTimelineByPlan(
    initialLoanBalance,
    startingSalary,
    annualIncrement,
    planId,
    yearsOfStudy
  )

  if (timeline.length === 0) {
    return {
      scenario: scenarioName,
      label: scenarioLabel,
      startingSalary,
      firstYearMonthlyPayment: 0,
      peakMonthlyPayment: 0,
      yearsToRepayment: 0,
      totalAmountPaid: 0,
      interestPaid: 0,
      repaymentTimeline: [],
      color: scenarioColor,
    }
  }

  const peakMonthlyPayment = Math.max(...timeline.map(y => y.monthlyPayment))
  const totalAmountPaid = timeline[timeline.length - 1].totalPaid
  const interestPaid = timeline[timeline.length - 1].cumulativeInterest
  const repaymentStartIndex = timeline.findIndex(y => y.monthlyPayment > 0)
  const yearsToRepayment = repaymentStartIndex >= 0 ? timeline.length - repaymentStartIndex : 0

  return {
    scenario: scenarioName,
    label: scenarioLabel,
    startingSalary,
    firstYearMonthlyPayment: timeline[0].monthlyPayment,
    peakMonthlyPayment,
    yearsToRepayment,
    totalAmountPaid,
    interestPaid,
    repaymentTimeline: timeline,
    color: scenarioColor,
  }
}

/**
 * Calculate all scenarios for a loan amount
 */
export function calculateAllScenariosByPlan(
  loanAmount: number,
  planId: string,
  yearsOfStudy: number,
  scenarios: Array<{
    name: 'A' | 'B' | 'C' | 'D'
    label: string
    startingSalary: number
    annualIncrement: number
    color: string
  }>
): RepaymentOutput[] {
  return scenarios.map(scenario =>
    calculateScenarioByPlan(
      loanAmount,
      scenario.name,
      scenario.label,
      scenario.startingSalary,
      scenario.annualIncrement,
      planId,
      yearsOfStudy,
      scenario.color
    )
  )
}
