/**
 * UK Student Loan Plan Configurations
 * Flexible system supporting multiple student loan plans
 * Sources: UK Government Student Finance & Student Loans Company
 */

export interface PlanConfig {
  id: 'plan-1' | 'plan-2' | 'plan-4' | 'plan-5'
  name: string
  label: string
  description: string
  yearStarted: number
  yearEnded: number | null
  active: boolean

  // Financial parameters
  tuitionFeeAnnual: number
  maxTuitionLoan: number
  maintenanceLoanAvailable: boolean

  // Repayment parameters
  repaymentThreshold: number
  repaymentRate: number
  interestRateStudying: number
  interestRatePostGraduation: number

  // Forgiveness & timeline
  maxRepaymentYears: number
  gracePeriodYears: number

  // Maintenance allowance parameters
  maintenanceIncomeThreshold: number
  maintenanceTaperDivisor: number

  // UI & messaging
  infoBoxTitle: string
  infoBoxContent: string
  warningMessage?: string
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  'plan-5': {
    id: 'plan-5',
    name: 'Plan 5',
    label: 'Plan 5 (2023+)',
    description: 'Current plan for students starting 1 August 2023 onwards (England & Wales)',
    yearStarted: 2023,
    yearEnded: null,
    active: true,

    tuitionFeeAnnual: 9535,
    maxTuitionLoan: 9535,
    maintenanceLoanAvailable: true,

    repaymentThreshold: 25000,
    repaymentRate: 0.09,
    interestRateStudying: 0.045,
    interestRatePostGraduation: 0.045,

    maxRepaymentYears: 40,
    gracePeriodYears: 0,

    maintenanceIncomeThreshold: 25000,
    maintenanceTaperDivisor: 6.36,

    infoBoxTitle: 'Plan 5 Details',
    infoBoxContent: 'Lower repayment threshold (£25k) with 9% repayment rate. RPI-only interest. Loans forgiven after 40 years.',
  },

  'plan-4': {
    id: 'plan-4',
    name: 'Plan 4',
    label: 'Plan 4 (Scotland only)',
    description: 'For students in Scotland. Not available for England/Wales students.',
    yearStarted: 2000,
    yearEnded: null,
    active: false,

    tuitionFeeAnnual: 9250,
    maxTuitionLoan: 9250,
    maintenanceLoanAvailable: true,

    repaymentThreshold: 33795,
    repaymentRate: 0.09,
    interestRateStudying: 0.06,
    interestRatePostGraduation: 0.06,

    maxRepaymentYears: 30,
    gracePeriodYears: 0,

    maintenanceIncomeThreshold: 25000,
    maintenanceTaperDivisor: 8.94,

    infoBoxTitle: 'Plan 4 (Scotland Only)',
    infoBoxContent: 'This plan is for students who applied to Student Awards Agency Scotland (SAAS) only. Not available for England/Wales students.',
    warningMessage: '⚠️ This plan is NOT available for England/Wales students. If you studied in England or Wales, please select Plan 1, 2, or 5.',
  },

  'plan-2': {
    id: 'plan-2',
    name: 'Plan 2',
    label: 'Plan 2 (2012-2023)',
    description: 'For students who started university between 1 September 2012 and 31 July 2023 (England & Wales)',
    yearStarted: 2012,
    yearEnded: 2023,
    active: false,

    tuitionFeeAnnual: 9000,
    maxTuitionLoan: 9000,
    maintenanceLoanAvailable: true,

    repaymentThreshold: 29385,
    repaymentRate: 0.09,
    interestRateStudying: 0.04,
    interestRatePostGraduation: 0.06,

    maxRepaymentYears: 30,
    gracePeriodYears: 0,

    maintenanceIncomeThreshold: 25000,
    maintenanceTaperDivisor: 8.94,

    infoBoxTitle: 'Plan 2 Details',
    infoBoxContent: 'Lowest tuition cap (£9k). Variable interest rate (RPI + up to 3%). Lower repayment threshold (£21k). Loans forgiven after 30 years.',
    warningMessage: 'Variable interest rates apply. Current rates may differ. Check Student Finance England for latest information.',
  },

  'plan-1': {
    id: 'plan-1',
    name: 'Plan 1',
    label: 'Plan 1 (Pre-2012)',
    description: 'For students who started university before 2012',
    yearStarted: 1998,
    yearEnded: 2011,
    active: false,

    tuitionFeeAnnual: 3375,
    maxTuitionLoan: 3375,
    maintenanceLoanAvailable: true,

    repaymentThreshold: 26900,
    repaymentRate: 0.09,
    interestRateStudying: 0,
    interestRatePostGraduation: 0.044,

    maxRepaymentYears: 25,
    gracePeriodYears: 0,

    maintenanceIncomeThreshold: 25000,
    maintenanceTaperDivisor: 7.7,

    infoBoxTitle: 'Plan 1 Details',
    infoBoxContent: 'Original student loan scheme. Lower tuition fees (£3,375). No interest while studying. Higher repayment threshold (£17,495). Loans forgiven after 25 years.',
    warningMessage: 'This is a legacy plan. If you started before 2012, check Student Finance England for your specific terms.',
  },
}

export const ALL_PLANS = Object.values(PLAN_CONFIGS)
export const ACTIVE_PLANS = ALL_PLANS.filter(p => p.active)
export const HISTORICAL_PLANS = ALL_PLANS.filter(p => !p.active)

/**
 * Get plan by ID
 */
export function getPlanConfig(planId: string): PlanConfig | null {
  return PLAN_CONFIGS[planId] || null
}

/**
 * Find plan by university start year
 */
export function getPlanByYear(year: number): PlanConfig | null {
  return ALL_PLANS.find(p => year >= p.yearStarted && (p.yearEnded === null || year <= p.yearEnded)) || null
}

/**
 * Get all available plans for selection
 */
export function getAvailablePlans(): PlanConfig[] {
  return ALL_PLANS.sort((a, b) => b.yearStarted - a.yearStarted)
}

/**
 * Maintenance allowance configuration by plan
 */
export const PLAN_MAINTENANCE_LIMITS = {
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

export type PlanId = keyof typeof PLAN_CONFIGS
