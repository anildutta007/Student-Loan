import type { SalaryScenario, MaintenanceLimit, StudentLoanPlan } from '@types/index'

/**
 * UK Student Loan Plan 2 (Sept 2012 - July 2023)
 * Sources: UK Government Student Finance & Student Loans Company
 */
export const PLAN_2: Record<string, number | string> = {
  PLAN_NAME: 'Plan 2',
  TUITION_FEE_ANNUAL: 9250,           // Standard fee cap during Plan 2 era
  REPAYMENT_THRESHOLD: 27750,         // Plan 2 threshold
  REPAYMENT_RATE: 0.09,               // 9% of income above threshold
  INTEREST_RATE: 0.075,               // RPI + 3% (4.5% RPI + 3% = 7.5% for 2026/27 example)
  INTEREST_DURING_STUDY: 0.075,       // RPI + 3% while studying
  MAX_REPAYMENT_YEARS: 30,            // Forgiveness after 30 years
  GRACE_PERIOD_YEARS: 0,
  MAINTENANCE_INCOME_THRESHOLD: 25000,
  MAINTENANCE_TAPER_DIVISOR: 6.36,
} as const

/**
 * UK Student Loan Plan 5 (August 2023 onwards)
 * New terms with lower threshold and RPI-only interest
 * Sources: UK Government Student Finance & Student Loans Company
 */
export const PLAN_5: Record<string, number | string> = {
  PLAN_NAME: 'Plan 5',
  TUITION_FEE_ANNUAL: 9535,           // Standard fee (2026/27)
  REPAYMENT_THRESHOLD: 25000,         // Plan 5 reduced threshold
  REPAYMENT_RATE: 0.09,               // 9% of income above threshold
  INTEREST_RATE: 0.045,               // RPI only (4.5% for 2026/27)
  INTEREST_DURING_STUDY: 0.045,       // RPI only while studying
  MAX_REPAYMENT_YEARS: 40,            // Forgiveness after 40 years
  GRACE_PERIOD_YEARS: 0,
  MAINTENANCE_INCOME_THRESHOLD: 25000,
  MAINTENANCE_TAPER_DIVISOR: 6.36,
} as const

/**
 * Get plan config by name
 */
export const getPlanConfig = (planName: StudentLoanPlan): typeof PLAN_2 => {
  return planName === 'Plan 2' ? PLAN_2 : PLAN_5
}

/**
 * Default plan (Plan 5 for new students from August 2023)
 */
export const UK_LOAN_SYSTEM = PLAN_5

/**
 * Maximum years to track repayment (for calculations)
 */
export const MAX_REPAYMENT_YEARS = 40

/**
 * Default salary scenarios
 */
export const DEFAULT_SCENARIOS: SalaryScenario[] = [
  {
    name: 'A',
    label: 'Student A - Conservative Earner',
    startingSalary: 30000,
    annualIncrement: 0.05,
    color: '#1f77b4',  // Blue
  },
  {
    name: 'B',
    label: 'Student B - Moderate Earner',
    startingSalary: 40000,
    annualIncrement: 0.05,
    color: '#2ca02c',  // Green
  },
  {
    name: 'C',
    label: 'Student C - Higher Earner',
    startingSalary: 50000,
    annualIncrement: 0.05,
    color: '#ff7f0e',  // Orange
  },
  {
    name: 'D',
    label: 'Student D - Premium Earner',
    startingSalary: 60000,
    annualIncrement: 0.05,
    color: '#d62728',  // Red
  },
]

/**
 * Maintenance allowance limits by living situation (2026/27)
 * Continuous taper based on household income
 */
export const MAINTENANCE_LIMITS: Record<string, MaintenanceLimit> = {
  'at-home': {
    maximum: 9118,      // Income ≤ £25,000
    minimum: 4013,      // Guaranteed minimum (any income)
  },
  'away-london': {
    maximum: 14135,     // Income ≤ £25,000
    minimum: 7039,      // Guaranteed minimum (any income)
  },
  'away-other': {
    maximum: 10830,     // Income ≤ £25,000
    minimum: 5048,      // Guaranteed minimum (any income)
  },
} as const

/**
 * Living situation options
 */
export const LIVING_SITUATION_OPTIONS = [
  {
    value: 'at-home' as const,
    label: 'Living at home with parents',
    description: 'Maximum £9,118/year (if eligible)',
  },
  {
    value: 'away-other' as const,
    label: 'Away from home (outside London)',
    description: 'Maximum £10,830/year (if eligible)',
  },
  {
    value: 'away-london' as const,
    label: 'Away from home (in London)',
    description: 'Maximum £14,135/year (if eligible)',
  },
] as const

/**
 * Years of study options
 */
export const YEARS_OF_STUDY_OPTIONS = [1, 2, 3, 4, 5] as const

/**
 * Application flow step titles
 */
export const STEP_TITLES = {
  1: 'Your Child\'s Education',
  2: 'Loan Summary',
  3: 'Scenario Comparison',
  4: 'Results & Export',
} as const
