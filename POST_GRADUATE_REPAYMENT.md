# Post-Graduate Repayment Analysis Feature

## Overview

For Plan 2 and Plan 4 students who have already graduated and are in the repayment phase, the calculator now offers a specialized analysis mode that shows:

- Current monthly repayment and interest breakdown
- How much of each payment goes to interest vs. principal
- Year-by-year repayment timeline
- When the loan will be fully paid off or forgiven
- Visual charts showing loan balance over time and interest/principal split

## How It Works

### User Flow

1. **Plan Selection**: User selects Plan 2 or Plan 4
2. **Status Check**: App asks "Are you still studying or already in repayment?"
3. **Questionnaire**: For graduated students, they answer:
   - Current loan balance remaining
   - Current annual salary
   - Current age
4. **Analysis**: System shows detailed repayment breakdown

### For Studying Students (Plan 2/4)
- Original calculator flow applies
- Projects loan needed for remaining years of study

### For Graduated Students (Plan 2/4)
- **PostGraduateQuestionnaire** component
- **PostGraduateRepaymentResults** component
- Specialized calculations via `postGraduateCalculations.ts`

## Key Metrics Shown

### Current Payment Breakdown
- **Monthly Repayment**: Total payment (9% of income above threshold)
- **Monthly Interest**: Interest portion (accrues on remaining balance)
- **Monthly Principal**: Amount reducing the debt

### Analysis Cards
- Current loan balance
- Annual interest accrued (based on interest rate)
- Annual principal repaid
- Interest rate for the plan
- Forgiveness age (when loan ends)

### Projection
Four possible outcomes:

1. **No Repayment**: Salary below threshold, no payment required
2. **Interest-Only**: Payment doesn't exceed interest, loan grows
3. **Payoff**: Loan will be fully paid off before forgiveness period
4. **Forgiven**: Loan forgiven after maximum repayment period (25-40 years)

## Calculations

### Monthly Payment
```
If salary ≤ threshold: £0
If salary > threshold: (salary - threshold) × 9% ÷ 12
```

### Monthly Interest
```
Monthly Interest = loan balance × annual interest rate ÷ 12
```

### Principal Reduction
```
Principal = Monthly Payment - Monthly Interest
```

### Repayment Timeline
- Projects year-by-year loan balance
- Accounts for salary growth (default 3% per year)
- Stops when loan is paid off OR forgiveness age is reached
- Tracks cumulative interest paid

## Plan-Specific Parameters

| Plan | Threshold | Rate | Interest | Forgiveness |
|------|-----------|------|----------|-------------|
| Plan 2 | £21,000 | 9% | RPI + 3% (variable) | 30 years |
| Plan 4 | £25,000 | 9% | Fixed 6% | 30 years |

## Visual Components

### Charts
1. **Pie Chart**: Interest vs. Principal split in monthly payment
2. **Balance Chart**: Loan balance over next 20 years
3. **Payment Breakdown**: Annual interest and principal breakdown

### Key Metrics Cards
- Color-coded: Blue (payment), Red (interest), Green (principal)
- Shows percentages for easy understanding
- Large numbers for quick reference

## Example Scenarios

### Scenario 1: Plan 4 - Payoff Before Forgiveness
```
Current Age: 28
Loan Balance: £25,000
Salary: £35,000

Threshold: £25,000
Payment: (£35,000 - £25,000) × 9% / 12 = £75/month
Interest Rate: 6%
Monthly Interest: £125
Monthly Principal: -£50 (not reducing debt!)

Status: Interest-Only - payment doesn't cover interest
```

### Scenario 2: Plan 2 - Good Income Path
```
Current Age: 25
Loan Balance: £18,000
Salary: £50,000

Threshold: £21,000
Payment: (£50,000 - £21,000) × 9% / 12 = £217.50/month
Interest Rate: RPI + 3%
Monthly Interest: ~£113
Monthly Principal: ~£104

Status: Payoff in ~14 years (age 39)
```

### Scenario 3: Plan 4 - Near Forgiveness
```
Current Age: 50
Loan Balance: £15,000
Salary: £40,000

Threshold: £25,000
Payment: (£40,000 - £25,000) × 9% / 12 = £112.50/month
Interest Rate: 6%

Status: Will be forgiven at age 80
(only 30 years remaining, not enough to repay)
```

## File Structure

```
src/
├── components/
│   ├── onboarding/
│   │   └── PostGraduateQuestionnaire.tsx  (form for current details)
│   └── results/
│       └── PostGraduateRepaymentResults.tsx  (results display)
├── utils/
│   └── postGraduateCalculations.ts  (calculation logic)
└── types/
    └── (updated for post-graduate flows)
```

## Integration Points

### PlanSelector.tsx
- Added status choice for Plan 2 & Plan 4
- Passes `isPostGraduate` flag to app

### AppMultiPlan.tsx (to be updated)
- New step: PostGraduateQuestionnaire (if applicable)
- New results: PostGraduateRepaymentResults
- Route based on plan selection and student status

## User Benefits

✅ **Clarity**: Understand exactly where money goes (interest vs principal)
✅ **Projections**: Know when loan will be paid off or forgiven
✅ **Interest Awareness**: See the impact of interest on repayment
✅ **Planning**: Helps with salary growth and additional payment decisions
✅ **Comparisons**: Can adjust salary/balance to see scenarios

## Technical Considerations

### Interest Calculation
- Uses post-graduation interest rates from plan config
- Monthly accrual on remaining balance
- Impacts timeline significantly

### Salary Growth
- Default: 3% annual growth
- Can be adjusted in calculations
- More realistic than flat salary

### Forgiveness
- Based on plan-specific maxRepaymentYears
- Age-based (current age + years)
- Stops calculation at that point

## Future Enhancements

1. **Multiple Scenarios**: Adjust salary/payment to see outcomes
2. **Extra Payments**: Simulate additional payments
3. **Rate Changes**: Show impact of interest rate changes
4. **Refinancing**: Compare impact of refinancing options
5. **Salary Scenarios**: A, B, C, D earnings paths (like pre-grad)
6. **Export**: PDF/CSV with full timeline

## Testing Checklist

- [ ] Plan 2 student - current studying
- [ ] Plan 2 student - graduated, low income
- [ ] Plan 2 student - graduated, high income  
- [ ] Plan 4 student - current studying
- [ ] Plan 4 student - graduated, near threshold
- [ ] Plan 4 student - graduated, well-paid
- [ ] Interest vs principal breakdown displays correctly
- [ ] Charts render without errors
- [ ] Forgiveness age calculated correctly
- [ ] Export functionality works
