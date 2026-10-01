# Multi-Plan Student Loan Calculator System

## Overview

The calculator now supports a flexible, configuration-driven system for handling multiple UK student loan plans. This allows it to work with Plan 1, Plan 2, Plan 4, and Plan 5 students.

## Architecture

### 1. **Plan Configurations** (`src/utils/planConfigurations.ts`)

Central configuration system with all plan-specific parameters:

```typescript
export interface PlanConfig {
  id: 'plan-1' | 'plan-2' | 'plan-4' | 'plan-5'
  name: string
  label: string
  description: string
  tuitionFeeAnnual: number
  maxTuitionLoan: number
  repaymentThreshold: number
  repaymentRate: number
  interestRateStudying: number
  interestRatePostGraduation: number
  maxRepaymentYears: number
  gracePeriodYears: number
  maintenanceIncomeThreshold: number
  maintenanceTaperDivisor: number
  // ... UI/messaging fields
}
```

**Benefits:**
- All plan parameters in one place
- Easy to add new plans
- No hardcoded values scattered in calculation logic
- Versioning and historical tracking

### 2. **Flexible Calculation Engine** (`src/utils/flexibleCalculations.ts`)

Generic calculation functions that accept a `planId` parameter:

```typescript
// Example functions:
calculateMaintenanceAllowanceByPlan(income, livingSituation, planId)
calculateMonthlyPaymentByPlan(salary, planId)
calculateInterestByPlan(balance, planId, isStudying)
buildRepaymentTimelineByPlan(loan, salary, increment, planId, yearsOfStudy)
calculateAllScenariosByPlan(loanAmount, planId, yearsOfStudy, scenarios)
```

**Benefits:**
- Single calculation logic for all plans
- Plan rules injected via configuration
- Consistent, testable calculations
- Easy to add plan-specific logic

### 3. **Plan Selection Component** (`src/components/onboarding/PlanSelector.tsx`)

User-friendly plan selector with:
- Visual plan cards showing key differences
- Plan finder by university start year
- Plan descriptions and warnings
- Key metrics at a glance (threshold, rate, forgiveness)

**User Flow:**
1. Select plan directly from grid, OR
2. Use "Plan Finder" to identify plan by start year
3. Continue to calculator with selected plan

### 4. **Enhanced Hook** (`src/hooks/useCalculationsMultiPlan.ts`)

New state management hook that:
- Starts at Step 0 (plan selection)
- Stores selected plan ID
- Uses flexible calculations
- Tracks plan selection in analytics

**State:**
```typescript
{
  step: 0 | 1 | 2 | 3,
  selectedPlanId: string | null,
  userInput: UserInput | null,
  // ... rest of calculator state
}
```

### 5. **Updated App Component** (`src/AppMultiPlan.tsx`)

New application component that:
- Integrates plan selector as Step 0
- Conditionally shows/hides UI based on step
- Tracks plan selection in analytics
- Maintains all existing features

## Supported Plans

### Plan 5 (2026+)
- Tuition: £9,535/year
- Repayment threshold: £25,000
- Repayment rate: 9%
- Interest: RPI-only (4.5% for 2026/27)
- Forgiveness: 40 years

### Plan 4 (2016-2020)
- Tuition: £9,250/year
- Repayment threshold: £25,000
- Repayment rate: 9%
- Interest: RPI + 3% = 6% (fixed)
- Forgiveness: 30 years

### Plan 2 (2012-2015)
- Tuition: £9,000/year
- Repayment threshold: £21,000
- Repayment rate: 9%
- Interest: RPI + up to 3% (variable)
- Forgiveness: 30 years

### Plan 1 (Pre-2012)
- Tuition: £3,375/year
- Repayment threshold: £17,495
- Repayment rate: 9%
- Interest: 4.4% post-graduation (no interest while studying)
- Forgiveness: 25 years

## How to Add a New Plan

1. **Update `planConfigurations.ts`:**
```typescript
export const PLAN_CONFIGS = {
  // ... existing plans
  'plan-new': {
    id: 'plan-new',
    name: 'Plan New',
    label: 'Plan New (2024+)',
    // ... fill in all parameters
  }
}
```

2. **Update maintenance limits:**
```typescript
'plan-new': {
  'at-home': { maximum: X, minimum: Y },
  'away-london': { maximum: X, minimum: Y },
  'away-other': { maximum: X, minimum: Y },
}
```

3. That's it! No changes needed to calculation logic.

## Data Flow

```
User Input
    ↓
Step 0: Plan Selection (submitPlanSelection)
    ↓
Step 1: User Details (submitStep1)
    → calculateMaintenanceAllowanceByPlan(planId)
    → calculateAllScenariosByPlan(planId)
    ↓
Step 2: Scenario Comparison (submitStep2)
    ↓
Step 3: Results & Export
    ↓
Export (unchanged)
```

## Plan-Specific Features

### Maintenance Allowance Calculation
- Different maximum/minimum amounts per plan
- Different income thresholds per plan
- Different taper rates per plan

### Interest Calculations
- Separate rates for studying vs. post-graduation
- Plan 1: No interest while studying
- Plan 2-5: Variable or fixed rates

### Repayment Timeline
- Uses plan-specific threshold
- Uses plan-specific repayment rate
- Stops after plan-specific forgiveness period

### UI Elements
- Plan-specific info boxes in results
- Warning messages where applicable
- Plan name displayed throughout

## Analytics Tracking

New events:
```typescript
ReactGA.event("plan_selected", {
  plan_id: selectedPlanId,
  plan_name: plan?.name,
})

// Existing events updated to include plan:
"calculator_step_2_view" // now includes plan: selectedPlanId
"calculator_step_3_view" // now includes plan: selectedPlanId
"calculator_form_submitted" // now includes plan: selectedPlanId
```

## Testing Scenarios

### Test Case 1: Plan 5 Student (2026 start)
- Input: Start year 2026
- Expected: Plan 5 selected
- Verify: Threshold £25k, rate 9%, interest 4.5%

### Test Case 2: Plan 4 Student (2018 start)
- Input: Start year 2018
- Expected: Plan 4 selected
- Verify: Threshold £25k, rate 9%, interest 6%

### Test Case 3: Plan 2 Student (2013 start)
- Input: Start year 2013
- Expected: Plan 2 selected
- Verify: Threshold £21k, rate 9%, interest variable

### Test Case 4: Maintenance Allowance Difference
- Same income and living situation
- Calculate with Plan 1, Plan 2, Plan 4, Plan 5
- Verify: Different allowance amounts

## Migration Guide

### For Current Users:
1. Current `App.tsx` still works (uses Plan 5 only)
2. New `AppMultiPlan.tsx` with full multi-plan support
3. To enable: Update `main.tsx` to import `AppMultiPlan` instead of `App`

### To Migrate:
```typescript
// In main.tsx or index.tsx
- import App from './App'
+ import App from './AppMultiPlan'
```

## Benefits

✅ **Scalability**: Add new plans without code changes
✅ **Maintainability**: All plan logic in one place
✅ **Flexibility**: Easy to update plan parameters
✅ **Consistency**: Same calculation logic for all plans
✅ **User Choice**: Users select their specific plan
✅ **Accuracy**: Plan-specific rules applied correctly
✅ **Analytics**: Track which plans users select
✅ **Historical**: Support for legacy plans

## Future Enhancements

1. **Plan Comparison**: Show side-by-side comparisons
2. **Policy Changes**: Version plan configurations by year
3. **Projections**: What-if scenarios across plans
4. **Historical Data**: Show how policy changed over time
5. **Regional Variations**: Support regional rate differences
6. **Student Union**: Handle partner loans/other schemes

## Files Changed/Created

- ✅ `src/utils/planConfigurations.ts` (NEW)
- ✅ `src/utils/flexibleCalculations.ts` (NEW)
- ✅ `src/components/onboarding/PlanSelector.tsx` (NEW)
- ✅ `src/hooks/useCalculationsMultiPlan.ts` (NEW)
- ✅ `src/AppMultiPlan.tsx` (NEW)
- ✅ `src/types/index.ts` (UPDATED)
- ✅ `MULTI_PLAN_SYSTEM.md` (THIS FILE)

## Rollback Plan

If issues arise:
1. Keep `App.tsx` and old hooks intact
2. Users on old flow are unaffected
3. Simply don't deploy `AppMultiPlan.tsx`
4. No database migrations needed

## Questions?

Refer to:
- Plan configurations: `src/utils/planConfigurations.ts`
- Calculation logic: `src/utils/flexibleCalculations.ts`
- Component examples: `src/components/onboarding/PlanSelector.tsx`
