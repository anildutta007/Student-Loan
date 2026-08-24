# Technical Architecture - Monthly Repayment Calculator

## Technology Stack Recommendation

### Frontend
- **Framework:** React with TypeScript
- **UI Library:** Material-UI or Tailwind CSS (for responsive design)
- **Charting:** Recharts or Chart.js (for the 4 graphs)
- **State Management:** React Context API or Redux
- **Forms:** React Hook Form

### Backend (Optional - for now can be client-side only)
- **Language:** Node.js/Express or Python/Flask
- **Database:** None required for MVP (calculations done client-side)

### Deployment
- **Hosting:** Vercel, Netlify, or AWS
- **HTTPS:** Required
- **CDN:** For assets and performance

---

## Project Structure

```
Student-Loan/
├── public/
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   ├── Onboarding/
│   │   │   ├── OnboardingForm.tsx
│   │   │   ├── StatusQuestion.tsx
│   │   │   ├── YearsQuestion.tsx
│   │   │   └── MaintenanceQuestion.tsx
│   │   │
│   │   ├── Summary/
│   │   │   ├── LoanSummary.tsx
│   │   │   └── LoanBreakdown.tsx
│   │   │
│   │   ├── Scenarios/
│   │   │   ├── ScenarioComparison.tsx
│   │   │   ├── PaymentChart.tsx
│   │   │   ├── TimelineChart.tsx
│   │   │   ├── TotalPaidChart.tsx
│   │   │   ├── BalanceChart.tsx
│   │   │   └── ComparisonTable.tsx
│   │   │
│   │   ├── Results/
│   │   │   ├── ResultsSummary.tsx
│   │   │   ├── KeyInsights.tsx
│   │   │   └── ActionButtons.tsx
│   │   │
│   │   └── Common/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       └── Select.tsx
│   │
│   ├── hooks/
│   │   ├── useCalculations.ts
│   │   ├── useFormState.ts
│   │   └── useResponsive.ts
│   │
│   ├── utils/
│   │   ├── calculations.ts      # Core calculation logic
│   │   ├── constants.ts          # UK loan system constants
│   │   ├── formatters.ts         # Number/currency formatting
│   │   ├── validators.ts         # Input validation
│   │   └── exportPDF.ts          # PDF export functionality
│   │
│   ├── types/
│   │   ├── index.ts             # TypeScript interfaces
│   │   └── loan.ts              # Loan-specific types
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── responsive.css
│   │
│   ├── pages/
│   │   ├── index.tsx            # Landing page
│   │   ├── calculator.tsx        # Calculator flow
│   │   ├── about.tsx             # About/FAQ
│   │   └── 404.tsx              # Not found
│   │
│   ├── App.tsx
│   └── index.tsx
│
├── tests/
│   ├── unit/
│   │   └── calculations.test.ts
│   ├── integration/
│   │   └── calculator-flow.test.ts
│   └── e2e/
│       └── calculator.e2e.ts
│
├── docs/                        # Already created
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.js          # If using Tailwind
└── README.md
```

---

## Core Calculation Engine

### Main Calculation Functions

```typescript
// calculations.ts

interface LoanInput {
  yearsOfStudy: number;
  annualTuition: number;
  annualLiving: number;
  maintenanceAllowance: number;
}

interface SalaryScenario {
  name: string;                  // 'A', 'B', 'C', 'D'
  startingSalary: number;
  annualIncrement: number;       // 0.05 for 5%
}

interface RepaymentOutput {
  scenario: string;
  startingSalary: number;
  firstYearMonthlyPayment: number;
  peakMonthlyPayment: number;
  yearsToRepayment: number;
  totalAmountPaid: number;
  interestPaid: number;
  repaymentTimeline: YearData[];
}

interface YearData {
  year: number;
  salary: number;
  monthlyPayment: number;
  totalPaid: number;
  loanBalance: number;
}

// Main calculation function
function calculateRepaymentScenarios(
  loanInput: LoanInput,
  scenarios: SalaryScenario[]
): RepaymentOutput[] {
  
  // 1. Calculate total loan amount
  const totalLoan = calculateTotalLoan(loanInput);
  
  // 2. For each scenario, calculate timeline
  return scenarios.map(scenario => 
    calculateScenario(totalLoan, scenario)
  );
}

function calculateTotalLoan(input: LoanInput): number {
  return (
    (input.annualTuition + input.annualLiving + input.maintenanceAllowance) *
    input.yearsOfStudy
  );
}

function calculateScenario(
  totalLoan: number,
  scenario: SalaryScenario
): RepaymentOutput {
  
  const THRESHOLD = 27750;           // 2024 level
  const REPAYMENT_RATE = 0.09;       // 9%
  const MAX_YEARS = 40;              // Forgiveness
  
  let currentBalance = totalLoan;
  let totalPaid = 0;
  let yearsToRepay = 0;
  const timeline: YearData[] = [];
  
  for (let year = 1; year <= MAX_YEARS; year++) {
    const salary = calculateSalary(scenario, year);
    
    if (salary <= THRESHOLD) {
      timeline.push({
        year,
        salary,
        monthlyPayment: 0,
        totalPaid: 0,
        loanBalance: currentBalance
      });
      continue;
    }
    
    const annualRepayment = (salary - THRESHOLD) * REPAYMENT_RATE;
    const monthlyPayment = annualRepayment / 12;
    
    currentBalance -= annualRepayment;
    
    if (currentBalance <= 0) {
      yearsToRepay = year;
      currentBalance = 0;
      totalPaid += annualRepayment + currentBalance;
      timeline.push({
        year,
        salary,
        monthlyPayment,
        totalPaid,
        loanBalance: 0
      });
      break;
    }
    
    totalPaid += annualRepayment;
    timeline.push({
      year,
      salary,
      monthlyPayment,
      totalPaid,
      loanBalance: currentBalance
    });
  }
  
  // If not repaid by year 40, balance forgiven
  if (yearsToRepay === 0) {
    yearsToRepay = MAX_YEARS;
  }
  
  return {
    scenario: scenario.name,
    startingSalary: scenario.startingSalary,
    firstYearMonthlyPayment: calculateMonthlyPayment(scenario.startingSalary),
    peakMonthlyPayment: Math.max(...timeline.map(y => y.monthlyPayment)),
    yearsToRepayment: yearsToRepay,
    totalAmountPaid: totalPaid,
    interestPaid: totalPaid - totalLoan,
    repaymentTimeline: timeline
  };
}

function calculateSalary(scenario: SalaryScenario, year: number): number {
  return scenario.startingSalary * Math.pow(1 + scenario.annualIncrement, year - 1);
}

function calculateMonthlyPayment(salary: number): number {
  const THRESHOLD = 27750;
  const REPAYMENT_RATE = 0.09;
  
  if (salary <= THRESHOLD) return 0;
  return ((salary - THRESHOLD) * REPAYMENT_RATE) / 12;
}
```

---

## Data Flow

```
┌─────────────────────────────────────┐
│   User Input (3 Questions)          │
│   - Status                          │
│   - Years of Study                  │
│   - Maintenance Allowance           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Calculate Total Loan Amount        │
│  Tuition + Living + Maintenance     │
│  × Years = Total                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  For Each Salary Scenario (A-D):    │
│  - Calculate yearly salary growth   │
│  - Calculate yearly repayment       │
│  - Build 40-year timeline           │
│  - Determine payoff year            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Generate Graph Data                │
│  - Monthly payments over time       │
│  - Repayment timeline               │
│  - Total amount paid                │
│  - Loan balance over time           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Display Results                    │
│  - Render 4 graphs                  │
│  - Show comparison table            │
│  - Display key insights             │
└─────────────────────────────────────┘
```

---

## Component Breakdown

### OnboardingForm Component
**Purpose:** Collect 3 input questions
**Props:** 
- `onComplete: (data: UserInput) => void`

**State:**
- `status: 'new' | 'current'`
- `yearsOfStudy: number`
- `maintenanceAllowance: number`

**Features:**
- Form validation
- Progress indicator
- Previous/Next navigation
- Helpful tooltips

### ScenarioComparison Component
**Purpose:** Display all 4 scenarios and graphs
**Props:**
- `data: RepaymentOutput[]`
- `totalLoan: number`

**Children:**
- PaymentChart
- TimelineChart
- TotalPaidChart
- BalanceChart
- ComparisonTable

### PaymentChart Component
**Purpose:** Line chart showing monthly payments over time
**Libraries:** Recharts
**Data:** `repaymentTimeline` with `year` and `monthlyPayment`
**Customization:** Interactive tooltips, scenario highlighting

### Comparison Table Component
**Purpose:** Show side-by-side scenario comparison
**Data Points:**
- Starting Salary
- Year 1 Payment
- Peak Payment
- Years to Repayment
- Total Amount Paid

---

## Constants & Configuration

```typescript
// constants.ts

export const UK_LOAN_SYSTEM = {
  TUITION_FEE_ANNUAL: 9250,           // England standard
  REPAYMENT_THRESHOLD: 27750,         // 2024 level (indexed)
  REPAYMENT_RATE: 0.09,               // 9%
  INTEREST_RATE: 0.06,                // RPI + 3% (assume 6%)
  MAX_REPAYMENT_YEARS: 40,            // Forgiveness after
  GRACE_PERIOD_YEARS: 0,              // No grace period
};

export const DEFAULT_SCENARIOS = [
  {
    name: 'A',
    label: 'Conservative Earner',
    startingSalary: 30000,
    annualIncrement: 0.05,
    color: '#1f77b4'  // Blue
  },
  {
    name: 'B',
    label: 'Moderate Earner',
    startingSalary: 40000,
    annualIncrement: 0.05,
    color: '#2ca02c'  // Green
  },
  {
    name: 'C',
    label: 'Higher Earner',
    startingSalary: 50000,
    annualIncrement: 0.05,
    color: '#ff7f0e'  // Orange
  },
  {
    name: 'D',
    label: 'Premium Earner',
    startingSalary: 60000,
    annualIncrement: 0.05,
    color: '#d62728'  // Red
  }
];

export const ACCOMMODATION_ESTIMATES = {
  LOW: 5000,      // £96/week
  MID: 6000,      // £115/week
  HIGH: 7000,     // £135/week
};

export const LIVING_EXPENSE_ESTIMATES = {
  LOW: 4000,
  MID: 5000,
  HIGH: 6000,
};
```

---

## Testing Strategy

### Unit Tests
```typescript
// tests/unit/calculations.test.ts

describe('Loan Calculations', () => {
  
  test('calculateTotalLoan returns correct sum', () => {
    const input = {
      yearsOfStudy: 3,
      annualTuition: 9250,
      annualLiving: 6000,
      maintenanceAllowance: 5000,
    };
    expect(calculateTotalLoan(input)).toBe(60750);
  });
  
  test('calculateMonthlyPayment for salary below threshold returns 0', () => {
    expect(calculateMonthlyPayment(25000)).toBe(0);
  });
  
  test('calculateMonthlyPayment for £30k salary', () => {
    const payment = calculateMonthlyPayment(30000);
    expect(payment).toBeCloseTo(16.88, 2);  // £16.88
  });
  
  // More tests...
});
```

### Integration Tests
```typescript
// tests/integration/calculator-flow.test.ts

describe('Calculator Flow', () => {
  
  test('Complete flow from input to results', () => {
    const loanInput = {
      yearsOfStudy: 3,
      annualTuition: 9250,
      annualLiving: 6000,
      maintenanceAllowance: 5000,
    };
    
    const results = calculateRepaymentScenarios(loanInput, DEFAULT_SCENARIOS);
    
    expect(results).toHaveLength(4);
    expect(results[0].yearsToRepayment).toBeGreaterThan(0);
    expect(results[3].yearsToRepayment).toBeLessThan(results[0].yearsToRepayment);
  });
});
```

### E2E Tests
```typescript
// tests/e2e/calculator.e2e.ts

describe('Calculator E2E', () => {
  
  test('User can complete full calculator flow', () => {
    cy.visit('/calculator');
    
    // Answer questions
    cy.get('[data-testid="status-new"]').click();
    cy.get('[data-testid="years"]').type('3');
    cy.get('[data-testid="maintenance-5k"]').click();
    
    // Next to summary
    cy.get('[data-testid="next-btn"]').click();
    cy.contains('£60,750').should('be.visible');
    
    // Next to results
    cy.get('[data-testid="next-btn"]').click();
    cy.get('[data-testid="chart-payment"]').should('be.visible');
    cy.get('[data-testid="chart-timeline"]').should('be.visible');
    cy.get('[data-testid="chart-total"]').should('be.visible');
    cy.get('[data-testid="chart-balance"]').should('be.visible');
  });
});
```

---

## Performance Considerations

### Optimization Strategies
1. **Memoization:** Use `useMemo` for calculation results
2. **Lazy Loading:** Load chart libraries on demand
3. **Code Splitting:** Separate pages into chunks
4. **Responsive Images:** Optimize graph rendering for mobile

### Target Metrics
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3s

---

## Security Considerations

1. **Input Validation:** Validate all user inputs on client side
2. **No PII Storage:** Don't store personal data
3. **HTTPS:** Enforce HTTPS for all traffic
4. **Content Security Policy:** Implement CSP headers
5. **Rate Limiting:** If backend, implement rate limiting on calculations

---

## Deployment Configuration

### Environment Variables
```env
REACT_APP_ENV=production
REACT_APP_SITE_NAME=Student Loan Decision App
REACT_APP_ANALYTICS_ID=xxx
```

### CI/CD Pipeline
```yaml
# GitHub Actions example
- Run tests
- Build production bundle
- Run lighthouse audit
- Deploy to Vercel/Netlify
```

---

## Future Extensibility

Design decisions to support future features:
- Modular calculation functions (easy to add Plan 5, etc.)
- Pluggable graph libraries (easy to switch charting)
- Configuration-driven scenarios (add custom salary paths)
- Export formats (PDF, CSV, Excel)
- Parental contribution scenarios
- Tax implications calculator
