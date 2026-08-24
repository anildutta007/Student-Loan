import { describe, it, expect } from 'vitest'
import {
  calculateTotalLoan,
  calculateSalary,
  calculateMonthlyPayment,
  calculateScenario,
} from './calculations'
import { DEFAULT_SCENARIOS, UK_LOAN_SYSTEM } from './constants'
import type { LoanInput, SalaryScenario } from '@types/index'

describe('Loan Calculations', () => {
  describe('calculateTotalLoan', () => {
    it('calculates total loan correctly', () => {
      const input: LoanInput = {
        yearsOfStudy: 3,
        annualTuition: 9250,
        annualLiving: 6000,
        maintenanceAllowance: 5000,
      }
      expect(calculateTotalLoan(input)).toBe(60750)
    })

    it('handles zero maintenance allowance', () => {
      const input: LoanInput = {
        yearsOfStudy: 3,
        annualTuition: 9250,
        annualLiving: 6000,
        maintenanceAllowance: 0,
      }
      expect(calculateTotalLoan(input)).toBe(45750)
    })

    it('handles single year of study', () => {
      const input: LoanInput = {
        yearsOfStudy: 1,
        annualTuition: 9250,
        annualLiving: 6000,
        maintenanceAllowance: 5000,
      }
      expect(calculateTotalLoan(input)).toBe(20250)
    })
  })

  describe('calculateSalary', () => {
    it('calculates initial salary correctly', () => {
      const scenario: SalaryScenario = {
        name: 'A',
        label: 'Test',
        startingSalary: 30000,
        annualIncrement: 0.05,
        color: '#000',
      }
      expect(calculateSalary(scenario, 1)).toBe(30000)
    })

    it('applies annual increment correctly', () => {
      const scenario: SalaryScenario = {
        name: 'A',
        label: 'Test',
        startingSalary: 30000,
        annualIncrement: 0.05,
        color: '#000',
      }
      // After 1 year: 30000 * (1.05)^0 = 30000
      expect(calculateSalary(scenario, 1)).toBe(30000)
      // After 2 years: 30000 * (1.05)^1 = 31500
      expect(calculateSalary(scenario, 2)).toBeCloseTo(31500, 0)
      // After 5 years: 30000 * (1.05)^4 = 36464.33
      expect(calculateSalary(scenario, 5)).toBeCloseTo(36464.33, 1)
    })
  })

  describe('calculateMonthlyPayment', () => {
    it('returns 0 for salary below threshold', () => {
      expect(calculateMonthlyPayment(20000)).toBe(0)
      expect(calculateMonthlyPayment(UK_LOAN_SYSTEM.REPAYMENT_THRESHOLD - 1000)).toBe(0)
    })

    it('calculates monthly payment correctly', () => {
      // Salary £30,000, threshold £27,750
      // Repayable: £2,250
      // Annual: £2,250 * 0.09 = £202.50
      // Monthly: £202.50 / 12 = £16.875
      expect(calculateMonthlyPayment(30000)).toBeCloseTo(16.88, 2)
    })

    it('calculates £40k salary payment correctly', () => {
      // Salary £40,000, threshold £27,750
      // Repayable: £12,250
      // Annual: £12,250 * 0.09 = £1,102.50
      // Monthly: £1,102.50 / 12 = £91.875
      expect(calculateMonthlyPayment(40000)).toBeCloseTo(91.88, 2)
    })

    it('calculates £60k salary payment correctly', () => {
      // Salary £60,000, threshold £27,750
      // Repayable: £32,250
      // Annual: £32,250 * 0.09 = £2,902.50
      // Monthly: £2,902.50 / 12 = £241.875
      expect(calculateMonthlyPayment(60000)).toBeCloseTo(241.88, 2)
    })
  })

  describe('calculateScenario', () => {
    it('returns correct scenario structure', () => {
      const scenario = DEFAULT_SCENARIOS[0] // Student A
      const result = calculateScenario(60750, scenario)

      expect(result).toHaveProperty('scenario', 'A')
      expect(result).toHaveProperty('startingSalary', 30000)
      expect(result).toHaveProperty('firstYearMonthlyPayment')
      expect(result).toHaveProperty('peakMonthlyPayment')
      expect(result).toHaveProperty('yearsToRepayment')
      expect(result).toHaveProperty('totalAmountPaid')
      expect(result).toHaveProperty('repaymentTimeline')
    })

    it('calculates scenario A (£30k) correctly', () => {
      const scenario = DEFAULT_SCENARIOS[0]
      const result = calculateScenario(60750, scenario)

      expect(result.firstYearMonthlyPayment).toBeCloseTo(16.88, 2)
      expect(result.yearsToRepayment).toBeGreaterThan(20)
      expect(result.yearsToRepayment).toBeLessThanOrEqual(40)
    })

    it('scenario D (£60k) repays faster than scenario A (£30k)', () => {
      const loan = 60750
      const scenarioA = calculateScenario(loan, DEFAULT_SCENARIOS[0])
      const scenarioD = calculateScenario(loan, DEFAULT_SCENARIOS[3])

      expect(scenarioD.yearsToRepayment).toBeLessThan(scenarioA.yearsToRepayment)
    })

    it('higher salary pays more total but finishes faster', () => {
      const loan = 60750
      const scenarioA = calculateScenario(loan, DEFAULT_SCENARIOS[0])
      const scenarioD = calculateScenario(loan, DEFAULT_SCENARIOS[3])

      expect(scenarioD.totalAmountPaid).toBeGreaterThan(scenarioA.totalAmountPaid)
      expect(scenarioD.yearsToRepayment).toBeLessThan(scenarioA.yearsToRepayment)
    })
  })
})
