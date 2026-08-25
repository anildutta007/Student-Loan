import type { SalaryScenario, MaintenanceLimit } from '@types/index'

/**
 * UK Student Loan System Constants (Plan 2)
 * Based on 2026/27 rates
 */
export const UK_LOAN_SYSTEM = {
  TUITION_FEE_ANNUAL: 9250,           // Standard England fee
  REPAYMENT_THRESHOLD: 27750,         // 2024 level (indexed annually)
  REPAYMENT_RATE: 0.09,               // 9%
  INTEREST_RATE: 0.045,               // RPI (4.5% for 2026/27)
  INTEREST_DURING_STUDY: 0.045,       // Interest while studying (RPI)
  MAX_REPAYMENT_YEARS: 40,            // Forgiveness after 40 years
  GRACE_PERIOD_YEARS: 0,              // No grace period
  MAINTENANCE_INCOME_THRESHOLD: 25000, // Income threshold for maintenance taper
  MAINTENANCE_TAPER_DIVISOR: 6.36,    // ~£1 reduction per £6.36 of income above threshold
} as const

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
