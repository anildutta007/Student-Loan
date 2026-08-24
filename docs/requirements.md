# Functional Requirements

## User Stories

### New Student Journey (US1-US5)

**US1: User Selection**
- As a parent, I want to select that my child is a new student going to college
- So that I can get relevant loan decision guidance

**US2: College Cost Input**
- As a parent, I want to input my child's expected university costs
- So that the app can calculate required loan amounts

**US3: Financial Situation**
- As a parent, I want to share my family's financial situation
- So that the app can provide personalized scenarios

**US4: Scenario Comparison**
- As a parent, I want to compare different student loan scenarios
- So that I can make an informed decision

**US5: Results & Export**
- As a parent, I want to see and export my calculation results
- So that I can share or reference them later

---

### Graduated Student Journey (US6-US10)

**US6: Graduated Selection**
- As a working graduate, I want to indicate I'm considering loan repayment
- So that I can get relevant repayment guidance

**US7: Loan Details**
- As a borrower, I want to input my current loan details
- So that the app can calculate my repayment scenarios

**US8: Salary & Budget**
- As a borrower, I want to share my income and available budget
- So that I can see realistic repayment options

**US9: Repayment Comparison**
- As a borrower, I want to compare different repayment strategies
- So that I can choose the best financial path

**US10: Savings Analysis**
- As a borrower, I want to know how much interest I could save
- So that I can justify early repayment decisions

---

## Functional Requirements

### FR1: User Authentication
- [ ] Optional account creation for saving calculations
- [ ] Session storage for anonymous users

### FR2: Loan Calculator
- [ ] Calculate: Principal + Interest + Repayment timeline
- [ ] Support multiple repayment plans (Plan 1, 2, 5)
- [ ] Handle different interest rates
- [ ] Inflation adjustment (optional)

### FR3: Data Validation
- [ ] Validate all numeric inputs
- [ ] Provide helpful error messages
- [ ] Prevent invalid scenarios

### FR4: Scenario Generation
- [ ] Generate multiple comparison scenarios
- [ ] Store scenarios for comparison
- [ ] Allow custom scenario creation

### FR5: Visualization
- [ ] Chart for repayment timeline
- [ ] Comparison charts for scenarios
- [ ] Cost breakdown visuals
- [ ] Savings projections

### FR6: Export Functionality
- [ ] Export as PDF
- [ ] Share via email (optional)
- [ ] Print-friendly format

### FR7: Educational Content
- [ ] FAQ section
- [ ] UK student loan glossary
- [ ] Government policy information
- [ ] Links to official resources

---

## Non-Functional Requirements

### NFR1: Performance
- Page load time < 2 seconds
- Calculations < 1 second
- Responsive on all devices

### NFR2: Security
- HTTPS encryption
- No storage of sensitive personal data
- Privacy policy compliance (GDPR)

### NFR3: Accessibility
- WCAG 2.1 Level AA compliance
- Mobile-friendly design
- Keyboard navigation support

### NFR4: Reliability
- 99.5% uptime target
- Error tracking and reporting
- Graceful error handling

---

## Business Requirements

### BR1: UK Market Focus
- Use UK student loan system specifics
- Support GBP currency
- Reference UK government policies

### BR2: User Trust
- Accurate calculations
- Transparency in methodology
- Clear disclaimers
- Links to official sources

### BR3: Accessibility to Target Audience
- Simple, intuitive interface
- No financial knowledge required
- Multiple input methods
- Clear language (avoid jargon)

---

## Acceptance Criteria

### AC1: Calculator Accuracy
- Results match official student finance calculators
- Variations < 1%

### AC2: User Experience
- First-time users can complete flow in < 5 minutes
- No external help needed
- Clear navigation

### AC3: Mobile Support
- Works on iOS 12+
- Works on Android 8+
- Responsive layout
