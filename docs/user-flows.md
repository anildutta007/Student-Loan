# User Flows

## User Path 1: New Student (College-bound)

### Happy Path:
1. User lands on app
2. Selects "New Student Going to College"
3. Answers onboarding questions:
   - University cost (tuition + accommodation)
   - Available family savings
   - Expected salary after graduation
   - Preferred loan amount
4. App calculates:
   - Total loan needed
   - Monthly repayment estimate
   - Interest costs
5. Compares scenarios:
   - Scenario A: Take full loan
   - Scenario B: Family contribution + partial loan
   - Scenario C: Work + reduced loan
6. User views results and saves/exports comparison
7. Optional: Download PDF report

### Key Inputs:
- University fees
- Living expenses
- Available family funds
- Career expectations
- Risk tolerance

### Key Outputs:
- Loan requirement
- Monthly repayment amount
- Total interest cost
- Break-even analysis
- Financial impact visualization

---

## User Path 2: Graduated Student (Working, with existing loans)

### Happy Path:
1. User lands on app
2. Selects "Graduated - Considering Repayment"
3. Inputs existing loan information:
   - Current loan balance
   - Interest rate
   - Repayment plan (Plan 1/2/5)
   - Current/expected salary
4. Defines repayment goal:
   - Pay off in X years
   - Standard timeline
   - Minimum payments
5. App calculates:
   - Time to full repayment
   - Interest saved by early repayment
   - Monthly budget impact
6. Compares scenarios:
   - Continue minimum payments
   - Pay extra £X per month
   - Lump sum payment option
7. User views financial impact and recommendations

### Key Inputs:
- Current loan balance
- Interest rate/repayment plan
- Current salary
- Additional income available
- Career trajectory

### Key Outputs:
- Payoff timeline
- Interest savings
- Monthly contribution needed
- Lifetime financial impact
- Recommended strategy

---

## Navigation Flow

```
Landing Page
    ├── New Student Path
    │   ├── Onboarding Questions
    │   ├── Loan Calculator
    │   ├── Scenario Comparison
    │   └── Results & Export
    │
    └── Graduated Student Path
        ├── Current Loan Info
        ├── Repayment Calculator
        ├── Strategy Comparison
        └── Results & Recommendations
```

---

## Key Decision Points

1. **Initial Selection**: Which user category?
2. **Financial Input**: How much detail to provide?
3. **Scenario Preference**: Which scenario to explore further?
4. **Action**: Export results, share, or use for planning?
