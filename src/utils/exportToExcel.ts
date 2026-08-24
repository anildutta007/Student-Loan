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
    addScenarioSheet(wb, result)
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
    ['STUDENT LOAN CALCULATOR - SUMMARY'],
    [],
    ['Loan Input Information'],
    ['Total Loan Amount', formatCurrency(totalLoan)],
    ['Years of Study', userInput.yearsOfStudy],
    ['Maintenance Allowance', formatCurrency(userInput.maintenanceAllowance)],
    ['Annual Tuition Fee', formatCurrency(9250)],
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
  summaryData.push(['UK Student Loan Information'])
  summaryData.push(['Repayment Threshold', formatCurrency(UK_LOAN_SYSTEM.REPAYMENT_THRESHOLD)])
  summaryData.push(['Repayment Rate', '9% of income above threshold'])
  summaryData.push(['Interest Rate', 'RPI + 3%'])
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
  result: RepaymentOutput
): void {
  const sheetData: any[] = [
    [`Scenario ${result.scenario}: ${result.label}`],
    [],
    ['Starting Salary', formatCurrency(result.startingSalary)],
    ['Annual Salary Growth', '5%'],
    ['Total Loan Amount', formatCurrency(result.repaymentTimeline[0]?.loanBalance || 0)],
    [],
    [
      'Year',
      'Salary',
      'Repayable Income',
      'Annual Payment',
      'Monthly Payment',
      'Cumulative Paid',
      'Loan Balance',
      'Interest %',
    ],
  ]

  // Add timeline data
  const REPAYMENT_THRESHOLD = UK_LOAN_SYSTEM.REPAYMENT_THRESHOLD
  const REPAYMENT_RATE = UK_LOAN_SYSTEM.REPAYMENT_RATE

  result.repaymentTimeline.forEach((yearData) => {
    const repayableIncome = Math.max(0, yearData.salary - REPAYMENT_THRESHOLD)
    const annualPayment = yearData.monthlyPayment * 12
    const interestPercent = REPAYMENT_RATE * 100

    sheetData.push([
      yearData.year,
      formatCurrency(yearData.salary),
      formatCurrency(repayableIncome),
      formatCurrency(annualPayment),
      formatCurrency(yearData.monthlyPayment),
      formatCurrency(yearData.totalPaid),
      formatCurrency(yearData.loanBalance),
      `${interestPercent.toFixed(1)}%`,
    ])
  })

  // Add summary rows
  sheetData.push([])
  sheetData.push(['REPAYMENT SUMMARY'])
  sheetData.push(['Years to Full Repayment', result.yearsToRepayment])
  sheetData.push(['Total Amount Paid', formatCurrency(result.totalAmountPaid)])
  sheetData.push(['Interest Paid', formatCurrency(result.interestPaid)])

  const ws = XLSX.utils.aoa_to_sheet(sheetData)

  // Format column widths
  ws['!cols'] = [
    { wch: 8 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 12 },
  ]

  // Format number columns
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = 1; C <= 7; ++C) {
      const cellAddress = XLSX.utils.encode_col(C) + XLSX.utils.encode_row(R)
      const cell = ws[cellAddress]
      if (cell && typeof cell.v === 'number') {
        cell.z = '#,##0.00'
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, `Scenario ${result.scenario}`)
}
