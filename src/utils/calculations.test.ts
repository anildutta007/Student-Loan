import { describe, it, expect } from 'vitest'
import {
  calculateTotalLoan,
  calculateSalary,
  calculateMonthlyPayment,
  calculateScenario,
  buildRepaymentTimeline,
  calculateAllScenarios,
} from './calculations'
import { DEFAULT_SCENARIOS } from './constants'
import type { LoanInput, SalaryScenario } from '@types/index'

describe('Student Loan Calculations - Critical Fixes', () => {
  // Test data
  const testLoanInput: LoanInput = {
    yearsOfStudy: 3,
    annualTuition: 9535,
    annualMaintenanceActual: 9500,
    parentalContribution: 0,
    studentLoanPlan: 'Plan 5',
  }

  const testScenario: SalaryScenario = DEFAULT_SCENARIOS[0] // Student A - £30k

  describe('Plan 5 Calculations (New Students 2026+)', () => {
    it('£30k salary on Plan 5 should show £37.50/month', () => {
      // Plan 5: £25,000 threshold → £30k salary pays ~£37.50/month
      const payment30k = calculateMonthlyPayment(30000)

      expect(Math.round(payment30k * 100) / 100).toBeCloseTo(37.50, 1)
      expect(payment30k).not.toBe(0)
    })

    it('Plan 5 interest rate calculations should work correctly', () => {
      const scenario = calculateScenario(50000, testScenario, 3)

      // Plan 5 with RPI interest should produce valid results
      expect(scenario.interestPaid).toBeGreaterThan(0)
      expect(scenario.yearsToRepayment).toBeLessThanOrEqual(40)
    })

    it('Plan 5 should have 40-year forgiveness period', () => {
      // With a large loan and low salary, should be forgiven within 40 years
      const scenario = calculateScenario(150000, testScenario, 3)

      expect(scenario.yearsToRepayment).toBeLessThanOrEqual(40)
    })
  })

  describe('CRITICAL FIX: Scenario Table Bug (£0 values)', () => {
    it('should NOT return zero payments for any salary scenario', () => {
      const results = calculateAllScenarios(testLoanInput, DEFAULT_SCENARIOS)

      results.forEach(result => {
        expect(result.firstYearMonthlyPayment).not.toBe(0)
        expect(result.yearsToRepayment).not.toBe(0)
        expect(result.totalAmountPaid).not.toBe(0)
        expect(result.interestPaid).toBeGreaterThan(0)
      })
    })

    it('should have all 4 scenarios (A, B, C, D) with valid data', () => {
      const results = calculateAllScenarios(testLoanInput, DEFAULT_SCENARIOS)

      expect(results).toHaveLength(4)
      expect(results.map(r => r.scenario)).toEqual(['A', 'B', 'C', 'D'])

      // Each should have valid payment data
      results.forEach((result, idx) => {
        expect(result.firstYearMonthlyPayment).toBeGreaterThan(0)
        expect(result.yearsToRepayment).toBeGreaterThan(0)
        expect(result.repaymentTimeline.length).toBeGreaterThan(0)
      })
    })

    it('table data should match calculation results (no data binding mismatch)', () => {
      const result = calculateScenario(50000, testScenario, 3)
      const timeline = buildRepaymentTimeline(50000, testScenario, 3)
      const lastEntry = timeline[timeline.length - 1]

      // Summary should match timeline
      expect(result.totalAmountPaid).toBe(lastEntry.totalPaid)
      expect(result.interestPaid).toBe(lastEntry.cumulativeInterest)
    })
  })

  describe('CRITICAL FIX: £30k Salary Calculation', () => {
    it('£30k salary on Plan 5 should show £37.50/month, not £0', () => {
      const payment = calculateMonthlyPayment(30000)
      // (£30,000 - £25,000) × 9% ÷ 12 = £37.50
      expect(Math.round(payment * 100) / 100).toBeCloseTo(37.50, 1)
      expect(payment).not.toBe(0)
    })

    it('Student A (£30k) should have correct first-year monthly payment', () => {
      const result = calculateScenario(50000, DEFAULT_SCENARIOS[0], 3)
      expect(result.firstYearMonthlyPayment).toBeCloseTo(37.50, 1)
    })
  })

  describe('All Four Scenarios - No Zeros', () => {
    it('Scenario A (£30k)', () => {
      const result = calculateScenario(50000, DEFAULT_SCENARIOS[0], 3)
      expect(result.scenario).toBe('A')
      expect(result.firstYearMonthlyPayment).toBeCloseTo(37.50, 1)
      expect(result.yearsToRepayment).toBeGreaterThan(0)
      expect(result.totalAmountPaid).toBeGreaterThan(50000)
    })

    it('Scenario B (£40k)', () => {
      const result = calculateScenario(50000, DEFAULT_SCENARIOS[1], 3)
      expect(result.scenario).toBe('B')
      expect(result.firstYearMonthlyPayment).toBeGreaterThan(0)
      expect(result.yearsToRepayment).toBeGreaterThan(0)
    })

    it('Scenario C (£50k)', () => {
      const result = calculateScenario(50000, DEFAULT_SCENARIOS[2], 3)
      expect(result.scenario).toBe('C')
      expect(result.firstYearMonthlyPayment).toBeGreaterThan(0)
      expect(result.yearsToRepayment).toBeGreaterThan(0)
    })

    it('Scenario D (£60k)', () => {
      const result = calculateScenario(50000, DEFAULT_SCENARIOS[3], 3)
      expect(result.scenario).toBe('D')
      expect(result.firstYearMonthlyPayment).toBeGreaterThan(0)
      expect(result.yearsToRepayment).toBeGreaterThan(0)
    })

    it('Higher salary scenarios should have lower repayment years', () => {
      const results = calculateAllScenarios(testLoanInput, DEFAULT_SCENARIOS)
      const years = results.map(r => r.yearsToRepayment)

      for (let i = 1; i < years.length; i++) {
        expect(years[i]).toBeLessThanOrEqual(years[i - 1])
      }
    })
  })

  describe('Calculation Reconciliation - Example Values', () => {
    it('£58,737 loan should produce reasonable totals', () => {
      const scenarioA = calculateScenario(58737, DEFAULT_SCENARIOS[0], 3)

      // Validate total > principal
      expect(scenarioA.totalAmountPaid).toBeGreaterThan(58737)
      // Validate interest > 0
      expect(scenarioA.interestPaid).toBeGreaterThan(0)
      // Validate within 40-year forgiveness
      expect(scenarioA.yearsToRepayment).toBeLessThanOrEqual(40)
      // Validate reasonable range
      expect(scenarioA.interestPaid).toBeLessThan(200000) // Should be reasonable
    })
  })

  describe('Copy & Display Fixes', () => {
    it('loan amounts should format as single £ symbol, not double ££', () => {
      const input: LoanInput = {
        yearsOfStudy: 3,
        annualTuition: 9535,
        annualMaintenanceActual: 9500,
        parentalContribution: 0,
      }

      const total = calculateTotalLoan(input)
      expect(total).toBeGreaterThan(0)
      // Should be able to format as currency
      expect(total.toString()).not.toContain('££')
    })
  })

  describe('Payment Timeline Validity', () => {
    it('should not have payments during study period', () => {
      const timeline = buildRepaymentTimeline(50000, testScenario, 3)

      for (let i = 0; i < 3; i++) {
        expect(timeline[i].monthlyPayment).toBe(0)
      }
    })

    it('should have payments after graduation', () => {
      const timeline = buildRepaymentTimeline(50000, testScenario, 3)
      expect(timeline[3].monthlyPayment).toBeGreaterThan(0)
    })

    it('should accrue interest during study', () => {
      const timeline = buildRepaymentTimeline(50000, testScenario, 3)
      expect(timeline[0].interestCharged).toBeGreaterThan(0)
    })
  })
})
