import type { SalaryScenario } from '@types/index'

/**
 * UK Student Loan System Constants (Plan 2)
 * Based on 2024 rates
 */
export const UK_LOAN_SYSTEM = {
  TUITION_FEE_ANNUAL: 9250,           // Standard England fee
  REPAYMENT_THRESHOLD: 27750,         // 2024 level (indexed annually)
  REPAYMENT_RATE: 0.09,               // 9%
  INTEREST_RATE: 0.06,                // RPI + 3% (assume 6%)
  MAX_REPAYMENT_YEARS: 40,            // Forgiveness after 40 years
  GRACE_PERIOD_YEARS: 0,              // No grace period
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
 * Accommodation cost estimates
 */
export const ACCOMMODATION_ESTIMATES = {
  LOW: 5000,      // ~£96/week
  MID: 6000,      // ~£115/week
  HIGH: 7000,     // ~£135/week
} as const

/**
 * Living expense estimates
 */
export const LIVING_EXPENSE_ESTIMATES = {
  LOW: 4000,      // ~£77/week
  MID: 5000,      // ~£96/week
  HIGH: 6000,     // ~£115/week
} as const

/**
 * Maintenance allowance brackets (2024)
 */
export const MAINTENANCE_ALLOWANCE_OPTIONS = [
  { value: 0, label: 'No maintenance allowance', description: '' },
  { value: 3000, label: 'Up to £3,000/year', description: 'Household income £25,000-£42,875' },
  { value: 5000, label: 'Up to £5,000/year', description: 'Household income £0-£25,000' },
  { value: 8116, label: 'Maximum £8,116/year', description: 'Full amount (rare)' },
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
