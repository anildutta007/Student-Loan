# Feature: College Student Monthly Repayment Calculator

## Overview
This feature helps parents of college-bound or current college students understand how much their children will need to pay monthly after graduation. Parents input basic information about their child's education and see realistic repayment scenarios based on different starting salaries.

## User Story
**As a parent,** I want to understand how much my child will pay monthly after graduation,
**So that** I can plan financially and understand the impact of student loans on their future.

---

## Input Questions (Onboarding)

### Question 1: Current Status
**"What is your child's current educational status?"**
- Option A: "Starting college this year" (new student)
- Option B: "Already in college" (current student)
- Determines baseline for calculation

### Question 2: Years of Study
**"How many years will your child study?"** (for new students)
OR **"How many years have they been studying?"** (for current students)
- Input: Number (typically 3-4 years for UK)
- If already studying: remaining years + completed years

### Question 3: Maintenance Allowance
**"Will your child receive a maintenance allowance?"**
- Option A: "No maintenance allowance"
- Option B: "Yes, up to £3,000/year"
- Option C: "Yes, up to £5,000/year"
- Option D: "Yes, up to £8,000+/year"
- Impact: Increases total loan debt (additional borrowing needed)

### Question 4: University Fees & Costs
**"What are the annual costs?"**
- Tuition fees: £9,250/year (standard England)
- Accommodation: £100-200/week
- Living expenses: £50-100/week
- Total annual: ~£15,000-20,000/year
- *Can use preset values or custom input*

---

## Calculation Logic

### Step 1: Calculate Total Loan Amount
```
Total Loan = (Annual Tuition + Annual Living Costs) × Years of Study
           + (Annual Maintenance Allowance × Years of Study)

Example:
- Tuition: £9,250
- Living: £6,000
- Maintenance: £3,000
- Duration: 3 years

Total Loan = (£9,250 + £6,000 + £3,000) × 3 = £54,750
```

### Step 2: Apply Student Loan Repayment Rules (Plan 2)
**Key assumptions:**
- Repayment starts: When graduate earns > £27,750/year
- Interest rate: RPI + 3% during study + during grace period
- Repayment period: 40 years from first repayment
- Monthly payment: 9% of income above £27,750 threshold

### Step 3: For Each Salary Scenario

**Calculate Annual Repayment:**
```
If Annual Salary > £27,750:
  Repayable Income = Salary - £27,750
  Annual Repayment = Repayable Income × 9%
  Monthly Repayment = Annual Repayment ÷ 12
```

**Calculate Timeline & Total Paid:**
```
Track:
- Monthly payment amount
- Years to full repayment
- Total amount paid over lifetime
- Interest paid
- Forgiveness date (40 years from first payment)
```

---

## Output: Four Scenario Graphs

### Graph Dataset Structure

#### Scenario A: Conservative Earner
- **Starting Salary:** £30,000
- **Annual Increment:** 5%
- **Career Progression:** Modest growth
- **Monthly Payment (Year 1):** £18.75
- **Years to Repayment:** [Calculated]
- **Total Amount Paid:** [Calculated]

#### Scenario B: Moderate Earner
- **Starting Salary:** £40,000
- **Annual Increment:** 5%
- **Career Progression:** Steady growth
- **Monthly Payment (Year 1):** £93.75
- **Years to Repayment:** [Calculated]
- **Total Amount Paid:** [Calculated]

#### Scenario C: Higher Earner
- **Starting Salary:** £50,000
- **Annual Increment:** 5%
- **Career Progression:** Strong growth
- **Monthly Payment (Year 1):** £168.75
- **Years to Repayment:** [Calculated]
- **Total Amount Paid:** [Calculated]

#### Scenario D: Premium Earner
- **Starting Salary:** £60,000
- **Annual Increment:** 5%
- **Career Progression:** Accelerated growth
- **Monthly Payment (Year 1):** £243.75
- **Years to Repayment:** [Calculated]
- **Total Amount Paid:** [Calculated]

---

## Visualization: Graph Specifications

### Graph 1: Monthly Payment Over Time
**Type:** Line chart
**X-axis:** Years (0-40)
**Y-axis:** Monthly Payment Amount (£)
**Lines:** 4 lines (A, B, C, D)
**Purpose:** Show how monthly payments increase with salary growth

```
Graph Example:
£300 |         __D
     |        /
£250 |      /    __C
     |    /    /
£200 |  /    /    __B
     |/    /    /
£150 |    /    /    __A
     |  /    /    /
£100 |/    /    /
     |    /    /
 £50 |  /    /
     |/    /
  £0 |____/________________
     0    5   10   15   20+
```

### Graph 2: Repayment Timeline
**Type:** Horizontal bar chart
**Categories:** A, B, C, D
**Bar Length:** Years until full repayment
**Color:** Green (shorter) to Red (longer)
**Purpose:** Compare how quickly each scenario pays off the loan

```
Student A: |████████████████████| 25 years
Student B: |████████████████| 20 years
Student C: |████████████| 15 years
Student D: |██████████| 12 years
```

### Graph 3: Total Amount Paid Comparison
**Type:** Bar chart
**Categories:** A, B, C, D
**Bar Height:** Total amount paid (£)
**Purpose:** Show lifetime financial impact

```
Example outputs:
Student A: £45,000 total paid
Student B: £52,000 total paid
Student C: £58,000 total paid
Student D: £64,000 total paid
```

### Graph 4: Loan Balance Over Time
**Type:** Line chart (declining)
**X-axis:** Years
**Y-axis:** Outstanding Loan Balance (£)
**Lines:** 4 lines (A, B, C, D)
**Purpose:** Visualize how quickly loan is paid down

```
£60k |________________________
     |
£50k |▼ Scenario C
     |\
£40k | \▼ Scenario D
     |  \
£30k |   \▼ Scenarios B & A
     |    \
£20k |     \___
     |         \___
£10k |             \_____
     |                   \_____
  £0 |________________________
     0    5   10   15   20+ years
```

---

## Display Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ MONTHLY REPAYMENT CALCULATOR - COLLEGE STUDENTS            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ LOAN SUMMARY                                               │
│ ├─ Years of Study: 3 years                                 │
│ ├─ Annual Costs: £15,250 (fees + living)                   │
│ ├─ Maintenance Allowance: £5,000/year                      │
│ └─ TOTAL LOAN AMOUNT: £60,750                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ COMPARISON SCENARIOS (Starting salary + 5% annual growth)  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ [Graph 1: Monthly Payment Over Time]                       │
│                                                              │
│ SCENARIO SUMMARY TABLE:                                    │
│ ┌─────────┬──────────┬─────────┬──────────┬───────────────┐
│ │ Student │ Starting │ Monthly │ Years to │ Total Amount  │
│ │         │ Salary   │ Payment │ Repay    │ Paid          │
│ ├─────────┼──────────┼─────────┼──────────┼───────────────┤
│ │ A       │ £30,000  │ £18.75  │ 25 yrs   │ £45,000       │
│ │ B       │ £40,000  │ £93.75  │ 20 yrs   │ £52,000       │
│ │ C       │ £50,000  │ £168.75 │ 15 yrs   │ £58,000       │
│ │ D       │ £60,000  │ £243.75 │ 12 yrs   │ £64,000       │
│ └─────────┴──────────┴─────────┴──────────┴───────────────┘
│                                                              │
│ [Graph 2: Repayment Timeline]     [Graph 3: Total Paid]   │
│                                                              │
│ [Graph 4: Loan Balance Over Time]                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ KEY INSIGHTS                                               │
│ • Student D repays in 12 years vs Student A's 25 years    │
│ • Even Student A's loan will be forgiven after 40 years   │
│ • Monthly payments scale with salary growth               │
│                                                              │
│ [Download Report] [Compare More] [Back]                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Metrics to Display

For each scenario, clearly show:

1. **First Year Monthly Payment** (When they start earning)
2. **Peak Monthly Payment** (If applicable)
3. **Total Years to Repayment** (How long until loan is paid off)
4. **Total Amount Paid Over Lifetime** (Including interest)
5. **Amount Saved by Early Completion** (vs. 40-year forgiveness)

---

## Assumptions & Notes

### UK Student Loan Specifics (Plan 2):
- Threshold: £27,750 (2024 level, indexed annually)
- Repayment Rate: 9% of income above threshold
- Interest: RPI + 3%
- Forgiveness: After 40 years
- Grace Period: None (interest accrues during study)

### Salary Growth:
- Fixed 5% annual increment for all scenarios
- Could be extended to variable growth rates

### Maintenance Allowance:
- Treated as additional borrowing (increases total loan)
- Not counted as parental contribution

---

## User Actions

After viewing the scenarios, users should be able to:
- [ ] Adjust starting salary or years of study to see updated graphs
- [ ] Download/export as PDF report
- [ ] Compare with other features (e.g., "what if no loan?")
- [ ] Share comparison with child
- [ ] Save for later reference

---

## Success Criteria

- ✅ Accurate calculations matching official student finance calculators
- ✅ Clear, easy-to-read graphs suitable for non-technical parents
- ✅ Responsive design (works on mobile/tablet/desktop)
- ✅ Load time < 2 seconds
- ✅ Users can complete task in < 5 minutes
