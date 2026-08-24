# UI Wireframe - Monthly Repayment Calculator

## Page Flow

```
Landing Page
    ↓
[Select: New Student / Graduated Student]
    ↓ (New Student Path)
Page 1: Onboarding Questions
    ↓
Page 2: Review Loan Summary
    ↓
Page 3: View Scenario Comparisons (4 Graphs)
    ↓
Page 4: Results & Export
```

---

## Page 1: Onboarding Questions

### Desktop Layout (1200px+)
```
┌────────────────────────────────────────────────────┐
│  📚 Student Loan Calculator                        │
├────────────────────────────────────────────────────┤
│                                                    │
│  STEP 1 OF 4: Your Child's Education             │
│                                                    │
│  Question 1: What is your child's status?        │
│  ┌─────────────────────────────────────────────┐ │
│  │ ○ Starting college this year                │ │
│  │ ○ Already studying at college               │ │
│  └─────────────────────────────────────────────┘ │
│                                                    │
│  Question 2: How many years of study?            │
│  ┌────────────┐                                   │
│  │ 3 years  ▼ │  [Typical: 3-4 years for UK]   │
│  └────────────┘                                   │
│                                                    │
│  Question 3: Maintenance Allowance               │
│  (Additional money for living costs)              │
│                                                    │
│  ┌─────────────────────────────────────────────┐ │
│  │ ○ No maintenance allowance                   │ │
│  │ ○ Yes - up to £3,000/year                    │ │
│  │ ○ Yes - up to £5,000/year                    │ │
│  │ ○ Yes - up to £8,000+/year                   │ │
│  └─────────────────────────────────────────────┘ │
│                                                    │
│  [Back]  [Next: Review Costs] →                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Mobile Layout (375px)
```
┌──────────────────────────┐
│  📚 Student Loan       ✕ │
│     Calculator           │
├──────────────────────────┤
│                          │
│ STEP 1 OF 4:            │
│ Your Child's            │
│ Education               │
│                          │
│ ┌──────────────────────┐│
│ │ ○ Starting college   ││
│ │   this year          ││
│ │ ○ Already studying   ││
│ │   at college         ││
│ └──────────────────────┘│
│                          │
│ Years of study:         │
│ ┌──────────┐            │
│ │ 3 years▼ │            │
│ └──────────┘            │
│                          │
│ Maintenance:            │
│ ┌──────────────────────┐│
│ │ ○ None              ││
│ │ ○ £3,000/year       ││
│ │ ○ £5,000/year       ││
│ │ ○ £8,000+/year      ││
│ └──────────────────────┘│
│                          │
│  [Next] →               │
│                          │
└──────────────────────────┘
```

---

## Page 2: Review Loan Summary

### Desktop
```
┌─────────────────────────────────────────────────────────┐
│  📚 Student Loan Calculator                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  STEP 2 OF 4: Loan Summary                             │
│                                                         │
│  Your child will be borrowing approximately:           │
│                                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │ TOTAL LOAN AMOUNT:  £60,750                        │ │
│  │                                                    │ │
│  │ Breakdown:                                         │ │
│  │ • Tuition fees:         £27,750  (£9,250 × 3)     │ │
│  │ • Accommodation:        £18,000  (£6,000 × 3)     │ │
│  │ • Maintenance allowance: £15,000  (£5,000 × 3)    │ │
│  │                         ───────                    │ │
│  │ • TOTAL:                £60,750                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  ℹ️  Note: These figures are based on:                 │
│  - Standard England tuition (£9,250/year)              │
│  - Average accommodation costs                         │
│  - Current maintenance allowance rates                 │
│                                                         │
│  ⚠️  This is an estimate. Actual costs may vary.        │
│  [Adjust costs manually?]                              │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐
│  │ □ I understand these are estimates               │ │
│  └─────────────────────────────────────────────────────┘
│                                                         │
│  [Back]  [Next: View Scenarios] →                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Page 3: Scenario Comparisons - 4 Graphs

### Desktop Layout (Full Width)
```
┌──────────────────────────────────────────────────────────────────┐
│  📚 Student Loan Calculator                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STEP 3 OF 4: Scenario Comparison                               │
│                                                                  │
│  Total Loan: £60,750  |  Years of Study: 3  |  Maintenance: £5k │
│                                                                  │
│  How much will your child pay monthly after graduation?         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GRAPH 1: Monthly Payment Over Time (Years 1-25)                │
│                                                                  │
│  £400│                                                ___D      │
│  £350│                                            ___/           │
│  £300│                                        ___/               │
│  £250│                                    ___/  C                │
│  £200│                                ___/                       │
│  £150│                            ___/    B                      │
│  £100│                        ___/                               │
│  £50 │                    ___/ A                                 │
│    £0└────────────────────────────────────────────────────────  │
│        0    5   10   15   20   25 years                          │
│                                                                  │
│  ■ Student A (£30k)  ■ Student B (£40k)                         │
│  ■ Student C (£50k)  ■ Student D (£60k)                         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GRAPH 2: Time to Repay Loan                                    │
│                                                                  │
│  Student D │██████████│ 12 years (age 34)                       │
│  Student C │████████████│ 15 years (age 37)                     │
│  Student B │████████████████│ 20 years (age 42)                 │
│  Student A │████████████████████│ 25 years (age 47)             │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GRAPH 3: Total Amount Paid                                     │
│                                                                  │
│  £70k│                                                           │
│  £60k│ ██████  ███████  ████████  █████████                     │
│  £50k│ ██████  ███████  ████████  █████████                     │
│  £40k│ ██████  ███████  ████████  █████████                     │
│  £30k│ ██████  ███████  ████████  █████████                     │
│  £20k│ ██████  ███████  ████████  █████████                     │
│  £10k│ ██████  ███████  ████████  █████████                     │
│    £0└─────────────────────────────────────────────────────────  │
│       A £45k  B £52k  C £58k  D £64k                            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GRAPH 4: Loan Balance Over Time                                │
│                                                                  │
│  £70k│████████████████████ A                                    │
│  £60k│████████████████████                                      │
│  £50k│████████████████────                                      │
│  £40k│████████████────────                                      │
│  £30k│████████────────────          ▼ B                         │
│  £20k│████────────────────                                      │
│  £10k│────────────────────               ▼ C ▼ D               │
│    £0└────────────────────────────────────────────────────────  │
│        0    5   10   15   20   25 years                          │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Scroll down for detailed comparison table]                    │
│                                                                  │
│  [Back]  [View Summary Table] →                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (Stacked)
```
┌──────────────────────────────┐
│ 📚 Scenario Comparison     ✕ │
├──────────────────────────────┤
│ Loan: £60,750 | 3 years     │
│                              │
│ GRAPH 1: Monthly Payment     │
│ ┌──────────────────────────┐ │
│ │                      D   │ │
│ │                    /     │ │
│ │                  C       │ │
│ │                /         │ │
│ │              B           │ │
│ │            /             │ │
│ │          A               │ │
│ │        /                 │ │
│ │__________________________ │ │
│ │ 0   5  10  15  20  25   │ │
│ └──────────────────────────┘ │
│                              │
│ GRAPH 2: Time to Repay       │
│ ┌──────────────────────────┐ │
│ │ D: 12 years            │ │
│ │ C: 15 years            │ │
│ │ B: 20 years            │ │
│ │ A: 25 years            │ │
│ └──────────────────────────┘ │
│                              │
│ GRAPH 3: Total Paid          │
│ ┌──────────────────────────┐ │
│ │ D: £64,000              │ │
│ │ C: £58,000              │ │
│ │ B: £52,000              │ │
│ │ A: £45,000              │ │
│ └──────────────────────────┘ │
│                              │
│ GRAPH 4: Loan Balance        │
│ ┌──────────────────────────┐ │
│ │  Declines over 25 yrs   │ │
│ │  A: slowest             │ │
│ │  D: fastest (12 yrs)    │ │
│ └──────────────────────────┘ │
│                              │
│  [See Table] →               │
└──────────────────────────────┘
```

---

## Page 3b: Detailed Comparison Table

```
┌───────────────────────────────────────────────────────────────┐
│  DETAILED SCENARIO COMPARISON                                 │
├───────────────┬──────────┬──────────┬──────────┬──────────────┤
│ Scenario      │ Student A│ Student B│ Student C│ Student D    │
├───────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Starting Sal. │ £30,000  │ £40,000  │ £50,000  │ £60,000      │
│ Annual Growth │ 5%       │ 5%       │ 5%       │ 5%           │
├───────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Year 1 Payment│ £16.88/mo│ £91.88/mo│£166.88/mo│ £241.88/mo   │
│ Year 1 Total  │ £202.56  │ £1,102.50│ £2,002.50│ £2,902.50    │
├───────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Peak Payment  │ £87.50/mo│ £225+/mo │ £375+/mo │ £450+/mo     │
│ (Year 30+)    │          │          │          │              │
├───────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Years to      │ 25 years │ 20 years │ 15 years │ 12 years     │
│ Repay Loan    │ (age 47) │ (age 42) │ (age 37) │ (age 34)     │
├───────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Total Amount  │ £45,000  │ £52,000  │ £58,000  │ £64,000      │
│ Paid Over     │          │          │          │              │
│ Lifetime      │          │          │          │              │
├───────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Interest      │ Forgiven │ Forgiven │ Forgiven │ Interest+    │
│ (40-yr rule)  │ before   │ before   │ before   │ included     │
│               │ 40 years │ 40 years │ 40 years │              │
└───────────────┴──────────┴──────────┴──────────┴──────────────┘

LOAN INFO:
Total Loan Amount: £60,750
Repayment Threshold: £27,750/year
Repayment Rate: 9% of income above threshold
Maximum Period: 40 years (after which balance forgiven)
```

---

## Page 4: Results & Export

```
┌────────────────────────────────────────────────────────┐
│  📚 Student Loan Calculator                            │
├────────────────────────────────────────────────────────┤
│                                                        │
│  STEP 4 OF 4: Results Summary                          │
│                                                        │
│  ✅ Your Analysis is Complete!                        │
│                                                        │
│  ┌────────────────────────────────────────────────────┐
│  │ KEY FINDINGS:                                     │
│  │                                                  │
│  │ 💡 Student D (£60k salary) repays the loan in   │
│  │    12 years, 13 years faster than Student A.    │
│  │                                                  │
│  │ 💡 Even Student A's payments are manageable at   │
│  │    just £16.88/month in year 1.                 │
│  │                                                  │
│  │ 💡 Higher starting salaries = faster payoff &   │
│  │    debt-free before major life events.          │
│  │                                                  │
│  │ 📊 Total loan of £60,750 ranges from £45k      │
│  │    (Student A) to £64k (Student D) paid over   │
│  │    their working lives.                         │
│  └────────────────────────────────────────────────────┘
│                                                        │
│  ACTIONS:                                             │
│                                                        │
│  [ 📥 Download PDF Report ]                          │
│  [ 🔗 Share with Child ]                             │
│  [ 📋 Print This Summary ]                           │
│  [ 🔄 Try Different Scenario ]                       │
│  [ 🏠 Back to Home ]                                 │
│                                                        │
├────────────────────────────────────────────────────────┤
│  NEXT STEPS:                                          │
│                                                        │
│  1. Share these results with your child               │
│  2. Discuss career expectations and salary paths      │
│  3. Compare with "What if no loan?" scenario          │
│  4. Consider parental contribution options            │
│  5. Review government student finance resources       │
│                                                        │
│  [Explore Other Features] →                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Key Design Features

### Color Coding for Scenarios
```
Student A (£30k):   Blue    - Conservative, longest payoff
Student B (£40k):   Green   - Moderate, balanced
Student C (£50k):   Orange  - Higher earner, faster payoff
Student D (£60k):   Red     - Premium earner, fastest payoff
```

### Interactive Elements
- [ ] Hover over graphs to see exact values
- [ ] Adjust salary/years to update calculations live
- [ ] Toggle between students to highlight one line
- [ ] Click legend items to show/hide scenarios

### Accessibility
- [ ] Large, readable fonts (16px minimum)
- [ ] High contrast colors (WCAG AA compliant)
- [ ] Alt text for all images/graphs
- [ ] Keyboard navigation support
- [ ] Mobile-friendly touch targets

### Loading States
- Graphs animate in smoothly
- Show loading spinner during calculation
- Progressive disclosure (show one graph at a time on mobile)

---

## Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | <600px | Single column, stacked graphs |
| Tablet | 600-1024px | 2-column grid for graphs |
| Desktop | >1024px | 4 graphs visible, full details |
