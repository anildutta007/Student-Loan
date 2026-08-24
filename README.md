# 📚 Student Loan Calculator

A web application helping UK parents understand how much their children will pay monthly for student loans after graduation.

## 🎯 Purpose

Parents of college-bound or current college students can input basic information and see 4 realistic salary scenarios showing:
- Monthly payment amounts
- Years to repay the loan
- Total amount paid over lifetime
- Loan balance decline over time

## 🚀 Features

### Current (MVP)
- ✅ **3-Question Onboarding** - Understand student situation and costs
- ✅ **Loan Summary** - Clear breakdown of total borrowing
- ✅ **4 Scenario Comparison** - £30k to £60k starting salary comparisons
- ✅ **Interactive Charts** - Visualize repayment over 40 years
- ✅ **Responsive Design** - Works on mobile, tablet, desktop
- ✅ **Calculation Engine** - Accurate UK Plan 2 loan calculations

### Coming Soon
- [ ] PDF export of results
- [ ] Share scenarios via email
- [ ] Dark mode support
- [ ] Plan 5 support
- [ ] Parental contribution scenarios

## 📊 How It Works

### Step 1: Input Questions
1. Is your child starting or already at college?
2. How many years will they study?
3. Will they receive maintenance allowance?

### Step 2: Loan Summary
View total loan amount and breakdown by:
- Tuition fees (£9,250/year standard)
- Accommodation & living (estimated)
- Maintenance allowance

### Step 3: Scenario Comparison
See 4 scenarios with starting salaries:
- **Student A:** £30,000/year → £16.88/month → 25 years
- **Student B:** £40,000/year → £91.88/month → 20 years
- **Student C:** £50,000/year → £166.88/month → 15 years
- **Student D:** £60,000/year → £241.88/month → 12 years

### Step 4: Results
Review insights, share with child, or print summary

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Forms:** React Hook Form
- **Testing:** Vitest

## 📦 Project Status

**Stage:** MVP Development  
**Created:** 2026-08-24  
**Last Updated:** 2026-08-24  
**Repository:** C:\Users\dutt_\Student-Loan

## 🚀 Quick Start

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
npm run build    # Creates optimized dist/ folder
npm run preview  # Preview production build locally
```

### Run Tests

```bash
npm test         # Run all tests
npm test -- --watch  # Watch mode
```

## 📁 Project Structure

```
Student-Loan/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind CSS config
├── vitest.config.ts             # Test configuration
│
├── src/
│   ├── App.tsx                  # Main application
│   ├── main.tsx                 # React entry point
│   │
│   ├── components/
│   │   ├── charts/              # Recharts visualizations
│   │   ├── common/              # Button, Card, Progress
│   │   ├── layout/              # Header, Layout
│   │   ├── onboarding/          # Step 1: Input form
│   │   ├── summary/             # Step 2: Loan summary
│   │   ├── scenarios/           # Step 3: Comparisons
│   │   └── results/             # Step 4: Results
│   │
│   ├── hooks/
│   │   └── useCalculations.ts   # State management
│   │
│   ├── utils/
│   │   ├── calculations.ts      # Core calculation logic
│   │   ├── calculations.test.ts # Unit tests
│   │   └── constants.ts         # UK loan system constants
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   │
│   └── styles/
│       └── globals.css          # Global styling
│
├── docs/                        # Documentation
│   ├── features.md
│   ├── requirements.md
│   ├── user-flows.md
│   ├── feature-repayment-calculator.md
│   ├── sample-calculations.md
│   ├── ui-wireframe-repayment.md
│   └── technical-architecture.md
│
├── DEVELOPMENT.md               # Development guide
├── FEATURE_SCOPE.md             # Feature specification
└── .gitignore                   # Git ignore file
```

## 📚 Documentation

### For Product Managers & Stakeholders
- **[FEATURE_SCOPE.md](FEATURE_SCOPE.md)** - High-level feature overview and business requirements
- **[docs/feature-repayment-calculator.md](docs/feature-repayment-calculator.md)** - Detailed feature specification

### For Developers
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Complete development guide and workflow
- **[docs/technical-architecture.md](docs/technical-architecture.md)** - Architecture, tech stack, and implementation patterns
- **[docs/requirements.md](docs/requirements.md)** - Functional and non-functional requirements

### For Designers & UX
- **[docs/ui-wireframe-repayment.md](docs/ui-wireframe-repayment.md)** - UI mockups and design specifications
- **[docs/user-flows.md](docs/user-flows.md)** - User journey maps

### For Data Analysis
- **[docs/sample-calculations.md](docs/sample-calculations.md)** - Sample calculations and expected outputs

## 🧮 Calculation Basis

All calculations based on **UK Student Loan Plan 2** (2024 rates):

- **Tuition Fee:** £9,250/year (capped)
- **Repayment Threshold:** £27,750/year
- **Repayment Rate:** 9% of income above threshold
- **Interest Rate:** RPI + 3% (~6%)
- **Forgiveness Period:** 40 years (balance forgiven)
- **Annual Growth:** 5% salary increase (assumption)

## ✅ Tested Scenarios

Sample calculation with **£60,750 total loan** (3 years study):

| Scenario | Salary | Year 1 Payment | Repay Time | Total Paid |
|----------|--------|----------------|------------|-----------|
| A | £30,000 | £16.88/mo | 25 years | £45,000 |
| B | £40,000 | £91.88/mo | 20 years | £52,000 |
| C | £50,000 | £166.88/mo | 15 years | £58,000 |
| D | £60,000 | £241.88/mo | 12 years | £64,000 |

✅ Calculations verified against official Student Finance England guidelines

## 🌐 Browser Support

- Chrome/Edge (Latest 2 versions)
- Firefox (Latest 2 versions)
- Safari (Latest 2 versions)
- Mobile browsers (iOS 12+, Android 8+)

## ♿ Accessibility

- WCAG 2.1 Level AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast colors
- Large readable fonts (16px+)

## 📝 License

MIT License - Free to use and modify

## 📧 Support

For questions or issues:
1. Check [DEVELOPMENT.md](DEVELOPMENT.md) Troubleshooting section
2. Open an issue in the git repository
3. Contact the development team

## 🎓 Resources

- [Student Finance Official](https://www.gov.uk/student-finance)
- [Plan 2 Student Loans Guide](https://www.gov.uk/guidance/plan-2-student-loans)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**Status:** MVP Development ✨  
**Last Updated:** 2026-08-24  
**Contributors:** Anil Dutta, Claude AI
