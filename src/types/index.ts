/**
 * User Input Types
 */
export type StudentStatus = 'new';

export type LivingSituation = 'at-home' | 'away-london' | 'away-other';

export interface MaintenanceLimit {
  maximum: number;
  minimum: number;
}

export interface UserInput {
  status: StudentStatus;
  yearsOfStudy: number;
  livingSituation: LivingSituation;
  householdIncome: number; // User's family income
  parentalContribution: number; // Amount parent is putting upfront
  annualTuition?: number;
  annualMaintenanceMax?: number;
  annualMaintenanceActual?: number;
}

/**
 * Loan Calculation Types
 */
export interface LoanInput {
  yearsOfStudy: number;
  annualTuition: number;
  annualMaintenanceActual: number;
  parentalContribution: number;
}

export interface SalaryScenario {
  name: 'A' | 'B' | 'C' | 'D';
  label: string;
  startingSalary: number;
  annualIncrement: number;
  color: string;
}

/**
 * Repayment Timeline Data
 */
export interface YearData {
  year: number;
  salary: number;
  monthlyPayment: number;
  totalPaid: number;
  loanBalance: number;
  interestCharged: number;
  cumulativeInterest: number;
}

/**
 * Repayment Calculation Output
 */
export interface RepaymentOutput {
  scenario: 'A' | 'B' | 'C' | 'D';
  label: string;
  startingSalary: number;
  firstYearMonthlyPayment: number;
  peakMonthlyPayment: number;
  yearsToRepayment: number;
  totalAmountPaid: number;
  interestPaid: number;
  repaymentTimeline: YearData[];
  color: string;
}

/**
 * Calculator State
 */
export interface CalculatorState {
  step: 1 | 2 | 3 | 4;
  userInput: UserInput | null;
  totalLoan: number | null;
  results: RepaymentOutput[] | null;
  loading: boolean;
  error: string | null;
}

/**
 * Form State
 */
export interface FormState {
  status: StudentStatus | null;
  yearsOfStudy: number | null;
  livingSituation: LivingSituation | null;
  householdIncome: number | null;
  parentalContribution: number | null;
}

/**
 * Chart Data Types
 */
export interface ChartPaymentData {
  year: number;
  [key: string]: number; // 'A', 'B', 'C', 'D' scenario values
}

export interface ChartBalanceData {
  year: number;
  [key: string]: number; // 'A', 'B', 'C', 'D' scenario values
}
