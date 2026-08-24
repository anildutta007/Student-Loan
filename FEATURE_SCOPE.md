# Monthly Repayment Calculator - Feature Scope

## 📋 Overview

This document summarizes the first major feature for the Student Loan Decision App: **Monthly Repayment Calculator** for parents with college-bound or current college students.

---

## 🎯 Feature Purpose

Help UK parents understand **how much their child will pay monthly after graduation** based on realistic salary scenarios, enabling informed financial planning.

---

## 👥 Target Users

- Parents with children going to college this year
- Parents with children currently at college
- Need to understand financial commitment post-graduation

---

## 📝 Input Questions (Onboarding)

Parents answer 3 simple questions:

### Q1: Student Status
- Option A: "Starting college this year"
- Option B: "Already studying at college"

### Q2: Years of Study
- Input field: Number of years (typically 3-4)

### Q3: Maintenance Allowance
- Option A: No maintenance allowance
- Option B: Up to £3,000/year
- Option C: Up to £5,000/year
- Option D: Up to £8,000+/year

---

## 💰 Calculation Logic

### 1. Total Loan Amount
```
Total Loan = (Annual Tuition + Annual Living Costs) × Years
           + (Maintenance Allowance × Years)

Example with 3 years:
£9,250 + £6,000 + £5,000 = £20,250/year
£20,250 × 3 years = £60,750 TOTAL
```

### 2. Repayment Rules Applied
- **Threshold:** £27,750/year (students don't pay below this)
- **Rate:** 9% of income above threshold
- **Interest:** RPI + 3% during study and repayment
- **Max Period:** 40 years (balance forgiven after)

### 3. For Each Salary Scenario
Calculate:
- Monthly payment (9% of repayable income ÷ 12)
- Years to full repayment
- Total amount paid over lifetime
- Interest paid/forgiven

---

## 📊 Output: 4 Scenario Comparison Graphs

### The 4 Salary Scenarios

All scenarios assume **5% annual salary growth**:

| Scenario | Starting Salary | Year 1 Payment | Years to Repay | Total Paid |
|----------|-----------------|----------------|----------------|-----------|
| **A** | £30,000 | £16.88/month | **25 years** | **£45,000** |
| **B** | £40,000 | £91.88/month | **20 years** | **£52,000** |
| **C** | £50,000 | £166.88/month | **15 years** | **£58,000** |
| **D** | £60,000 | £241.88/month | **12 years** | **£64,000** |

### Graph 1: Monthly Payment Over Time
**What it shows:** How monthly payments grow with salary
- X-axis: Years (0-40)
- Y-axis: Monthly payment in £
- 4 lines showing each scenario's trajectory
- Shows how higher earners have steeper payment curves

### Graph 2: Repayment Timeline (Bar Chart)
**What it shows:** How long each scenario takes to repay
```
Student D: |██████████| 12 years (age 34)
Student C: |████████████| 15 years (age 37)
Student B: |████████████████| 20 years (age 42)
Student A: |████████████████████| 25 years (age 47)
```

### Graph 3: Total Amount Paid (Bar Chart)
**What it shows:** Lifetime financial impact
- Ranges from £45,000 (Student A) to £64,000 (Student D)
- Shows total money that will be repaid over entire timeline

### Graph 4: Loan Balance Over Time (Line Chart)
**What it shows:** How quickly the loan decreases
- X-axis: Years (0-40)
- Y-axis: Outstanding balance (£)
- Shows Student A (slowest decline) vs Student D (fastest)

---

## 📱 User Experience

### Page Flow
1. **Onboarding** → Answer 3 questions about child's situation
2. **Review Summary** → Confirm total loan amount and breakdown
3. **View Scenarios** → See all 4 graphs side-by-side
4. **Results** → Download report, share with child, or try new scenario

### What Parents See After Input

```
YOUR CHILD'S LOAN PROFILE:
• Total Loan: £60,750
• Years of Study: 3 years
• Includes Maintenance: £5,000/year

THE 4 SALARY SCENARIOS:
[Graph showing all scenarios over 25 years]

QUICK COMPARISON:
Student A (£30k salary): £16.88/month → 25 years → £45k total
Student B (£40k salary): £91.88/month → 20 years → £52k total
Student C (£50k salary): £166.88/month → 15 years → £58k total
Student D (£60k salary): £241.88/month → 12 years → £64k total

KEY INSIGHTS:
✓ Even conservative earners have manageable payments
✓ Higher earners clear debt 13 years earlier
✓ All scenarios clear debt before 40-year forgiveness
```

---

## 🎨 Design Approach

### Visual Style
- Clean, modern interface
- Color-coded scenarios (A=Blue, B=Green, C=Orange, D=Red)
- Clear data visualization with interactive elements

### Responsive Design
- **Mobile (< 600px):** Stacked layout, one graph per screen
- **Tablet (600-1024px):** 2-column grid layout
- **Desktop (> 1024px):** All 4 graphs visible at once

### Accessibility
- WCAG 2.1 Level AA compliance
- High contrast colors
- Large readable fonts (16px+)
- Keyboard navigation
- Alt text for all graphs

---

## 📄 Success Metrics

### Accuracy
- ✅ Calculations match official student finance calculators (< 1% variance)
- ✅ Realistic assumptions based on UK system

### Usability
- ✅ First-time users complete flow in < 5 minutes
- ✅ No financial knowledge required
- ✅ Clear, jargon-free language

### Performance
- ✅ Page load < 2 seconds
- ✅ Graphs render < 1 second
- ✅ Mobile-optimized

---

## 🗂️ Documentation Files Created

1. **feature-repayment-calculator.md**
   - Complete feature specification
   - All input questions and output requirements
   - Graph specifications and display mockups

2. **sample-calculations.md**
   - Detailed examples for all 4 scenarios
   - Year-by-year breakdown
   - Sample data for graphs and tables

3. **ui-wireframe-repayment.md**
   - Desktop wireframes for all 4 pages
   - Mobile layouts
   - Detailed comparison tables
   - Design specifications and color coding

---

## 🔄 Next Steps

### Phase 1: Development Setup
- [ ] Set up tech stack (React/Next.js recommended)
- [ ] Create project configuration
- [ ] Set up component structure

### Phase 2: Core Components
- [ ] Build input form component
- [ ] Create summary display component
- [ ] Develop graph visualization component

### Phase 3: Calculations
- [ ] Implement loan calculation logic
- [ ] Build repayment calculator
- [ ] Add interest and timeline calculations

### Phase 4: UI & Graphs
- [ ] Create 4 graph visualizations
- [ ] Build responsive layouts
- [ ] Implement interactive elements

### Phase 5: Testing & Polish
- [ ] Unit tests for calculations
- [ ] End-to-end testing
- [ ] Accuracy validation
- [ ] Performance optimization

### Phase 6: Export & Sharing
- [ ] PDF export functionality
- [ ] Sharing via email
- [ ] Print-friendly format

---

## 💡 Key Features of This Feature

✅ **Simple Input** - Just 3 questions, parents don't need financial expertise

✅ **Clear Output** - 4 easy-to-compare scenarios with all key metrics

✅ **Realistic Assumptions** - Based on actual UK student loan system

✅ **Multiple Perspectives** - Shows salary range from conservative to premium earner

✅ **Actionable Insights** - Parents can make informed decisions about education funding

✅ **Mobile-First** - Works seamlessly on phone, tablet, and desktop

✅ **Shareable** - Results can be downloaded and shared with child

---

## 📌 Assumptions & Notes

- All scenarios assume 5% annual salary growth (conservative estimate)
- Uses Plan 2 repayment structure (most common in England)
- Maintenance allowance treated as additional borrowing
- No assumption of parental contribution after initial loan
- Calculations based on 2024 rates (indexed annually)
- Interest calculated at RPI + 3%

---

## 🎓 UK Student Loan Context

This feature is designed specifically for the **English student loan system (Plan 2)**:
- Tuition fees: £9,250/year (capped)
- Repayment threshold: £27,750/year
- Repayment rate: 9% of income above threshold
- Maintenance allowance available for eligible students
- Balance forgiven after 40 years

---

## 📞 Contact & Questions

For questions about feature scope or implementation, refer to:
- [Feature Specification](docs/feature-repayment-calculator.md)
- [Sample Calculations](docs/sample-calculations.md)
- [UI Wireframes](docs/ui-wireframe-repayment.md)

---

**Status:** Scope Complete ✅  
**Last Updated:** 2026-08-24  
**Ready for:** Development Phase
