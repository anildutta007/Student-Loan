import * as XLSX from 'xlsx'
import type { RepaymentOutput, UserInput } from '@types/index'
import { formatCurrency } from './calculations'
import { UK_LOAN_SYSTEM } from './constants'

interface ExcelScenarioData {
  Year: number
  Salary: string
  'Repayable Income': string
  'Monthly Payment': string
  'Annual Payment': string
  'Cumulative Paid': string
  'Loan Balance': string
}

/**
 * Export all scenarios to Excel file
 */
export function exportScenariosToExcel(
  results: RepaymentOutput[],
  totalLoan: number,
  userInput: UserInput
): void {
  // Create workbook
  const wb = XLSX.utils.book_new()

  // Add summary sheet
  addSummarySheet(wb, results, totalLoan, userInput)

  // Add detailed sheets for each scenario
  results.forEach((result) => {
    addScenarioSheet(wb, result, userInput)
  })

  // Save file
  const fileName = `Student-Loan-Calculator-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fileName)
}

/**
 * Add summary sheet to workbook
 */
function addSummarySheet(
  wb: XLSX.WorkBook,
  results: RepaymentOutput[],
  totalLoan: number,
  userInput: UserInput
): void {
  const summaryData: any[] = [
    ['STUDENT LOAN CALCULATOR - SUMMARY (2026-27)'],
    [],
    ['Loan Input Information'],
    ['Total Loan Amount', formatCurrency(totalLoan)],
    ['Years of Study', userInput.yearsOfStudy],
    ['Maintenance Allowance', formatCurrency(userInput.annualMaintenanceActual || 0)],
    ['Annual Tuition Fee', formatCurrency(UK_LOAN_SYSTEM.TUITION_FEE_ANNUAL)],
    ['Parental Contribution', formatCurrency(userInput.parentalContribution || 0)],
    [],
    ['Scenario Comparison'],
    [
      'Scenario',
      'Starting Salary',
      'Year 1 Monthly Payment',
      'Peak Monthly Payment',
      'Years to Repayment',
      'Total Amount Paid',
      'Interest Paid',
    ],
  ]

  // Add scenario summary rows
  results.forEach((result) => {
    summaryData.push([
      `Student ${result.scenario}`,
      formatCurrency(result.startingSalary),
      formatCurrency(result.firstYearMonthlyPayment),
      formatCurrency(result.peakMonthlyPayment),
      `${result.yearsToRepayment} years`,
      formatCurrency(result.totalAmountPaid),
      formatCurrency(result.interestPaid),
    ])
  })

  summaryData.push([])
  summaryData.push(['UK Student Loan Information (Plan 2 - 2026-27)'])
  summaryData.push(['Repayment Threshold', formatCurrency(UK_LOAN_SYSTEM.REPAYMENT_THRESHOLD)])
  summaryData.push(['Repayment Rate', '9% of income above threshold'])
  summaryData.push(['Interest Rate', `${(UK_LOAN_SYSTEM.INTEREST_RATE * 100).toFixed(1)}% RPI`])
  summaryData.push(['Interest During Study', 'Yes - accrues on loan balance'])
  summaryData.push(['Forgiveness Period', '40 years'])

  const ws = XLSX.utils.aoa_to_sheet(summaryData)

  // Format column widths
  ws['!cols'] = [
    { wch: 20 },
    { wch: 18 },
    { wch: 22 },
    { wch: 22 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Summary')
}

/**
 * Add detailed scenario sheet to workbook
 */
function addScenarioSheet(
  wb: XLSX.WorkBook,
  result: RepaymentOutput,
  userInput: UserInput
): void {
  const sheetData: any[] = [
    [`Scenario ${result.scenario}: ${result.label}`],
    [],
    ['Starting Salary', formatCurrency(result.startingSalary)],
    ['Annual Salary Growth', '5%'],
    [],
  ]

  // ==================== STUDY PERIOD SECTION ====================
  sheetData.push(['LOAN ACCUMULATION DURING STUDY PERIOD'])
  sheetData.push([
    'Year of Study',
    'Annual Fees (Tuition + Maintenance)',
    'Interest Accrued on Loan',
    'Total Loan Balance at Year End',
  ])

  // Calculate study period accumulation
  let studyLoanBalance = 0
  let studyPeriodInterest = 0
  const STUDY_INTEREST_RATE = UK_LOAN_SYSTEM.INTEREST_DURING_STUDY
  const annualFees = UK_LOAN_SYSTEM.TUITION_FEE_ANNUAL + userInput.annualMaintenanceActual

  for (let year = 1; year <= userInput.yearsOfStudy; year++) {
    // Interest is charged on the balance at the start of the year
    const interestCharged = studyLoanBalance * STUDY_INTEREST_RATE
    studyPeriodInterest += interestCharged

    // Add fees and interest to the balance
    studyLoanBalance += annualFees + interestCharged

    sheetData.push([
      year,
      formatCurrency(annualFees),
      formatCurrency(Math.round(interestCharged)),
      formatCurrency(Math.round(studyLoanBalance)),
    ])
  }

  sheetData.push([])
  sheetData.push(['Total Loan at Graduation (including interest)', formatCurrency(Math.round(studyLoanBalance))])
  sheetData.push(['Total Interest Accrued During Study', formatCurrency(Math.round(studyPeriodInterest))])
  sheetData.push([])

  // ==================== REPAYMENT SCHEDULE SECTION ====================
  sheetData.push(['REPAYMENT SCHEDULE (After Graduation)'])
  sheetData.push([
    'Year',
    'Salary',
    'Repayable Income',
    'Annual Payment',
    'Monthly Payment',
    `Interest Charged (${(UK_LOAN_SYSTEM.INTEREST_RATE * 100).toFixed(1)}%)`,
    'Cumulative Paid',
    'Loan Balance',
    'Interest Rate %',
  ])

  // Add repayment timeline - only include years AFTER graduation
  const REPAYMENT_THRESHOLD = UK_LOAN_SYSTEM.REPAYMENT_THRESHOLD
  const INTEREST_RATE = UK_LOAN_SYSTEM.INTEREST_RATE

  result.repaymentTimeline.forEach((yearData) => {
    const isStudyYear = yearData.year <= userInput.yearsOfStudy

    // Only show years AFTER graduation
    if (!isStudyYear) {
      const repayableIncome = Math.max(0, yearData.salary - REPAYMENT_THRESHOLD)
      const annualPayment = yearData.monthlyPayment * 12
      const yearPostGrad = yearData.year - userInput.yearsOfStudy

      sheetData.push([
        yearPostGrad,
        formatCurrency(yearData.salary),
        formatCurrency(repayableIncome),
        formatCurrency(annualPayment),
        formatCurrency(yearData.monthlyPayment),
        formatCurrency(yearData.interestCharged),
        formatCurrency(yearData.totalPaid),
        formatCurrency(yearData.loanBalance),
        `${(INTEREST_RATE * 100).toFixed(1)}%`,
      ])
    }
  })

  // Add summary rows
  sheetData.push([])
  sheetData.push(['REPAYMENT SUMMARY'])
  sheetData.push(['Years to Full Repayment (after graduation)', result.yearsToRepayment - userInput.yearsOfStudy])
  sheetData.push(['Total Amount Paid', formatCurrency(result.totalAmountPaid)])
  sheetData.push(['Interest Paid (During Repayment)', formatCurrency(result.interestPaid)])
  sheetData.push(['Interest Accrued (During Study)', formatCurrency(Math.round(studyPeriodInterest))])
  sheetData.push(['Total Interest (Study + Repayment)', formatCurrency(Math.round(result.interestPaid + studyPeriodInterest))])

  const ws = XLSX.utils.aoa_to_sheet(sheetData)

  // Format column widths
  ws['!cols'] = [
    { wch: 12 },   // Year
    { wch: 18 },   // Salary / Annual Fees
    { wch: 18 },   // Repayable Income / Interest Accrued
    { wch: 16 },   // Annual Payment / Total Loan Balance
    { wch: 16 },   // Monthly Payment
    { wch: 18 },   // Interest Charged
    { wch: 16 },   // Cumulative Paid
    { wch: 16 },   // Loan Balance
    { wch: 14 },   // Interest Rate %
  ]

  // Format number columns
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = 1; C <= 8; ++C) {
      const cellAddress = XLSX.utils.encode_col(C) + XLSX.utils.encode_row(R)
      const cell = ws[cellAddress]
      if (cell && typeof cell.v === 'number') {
        cell.z = '#,##0.00'
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, `Scenario ${result.scenario}`)
}
