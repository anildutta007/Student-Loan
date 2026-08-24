# Development Guide - Student Loan Calculator

This guide covers everything you need to know to develop, test, and deploy the Student Loan Calculator.

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Setup

```bash
# Navigate to project directory
cd Student-Loan

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Building for Production

```bash
# Build the app
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── charts/              # Recharts visualizations
│   │   ├── PaymentChart.tsx
│   │   ├── TimelineChart.tsx
│   │   ├── TotalPaidChart.tsx
│   │   └── BalanceChart.tsx
│   ├── common/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ProgressBar.tsx
│   ├── layout/              # Layout components
│   │   └── Header.tsx
│   ├── onboarding/          # Step 1 components
│   │   └── OnboardingForm.tsx
│   ├── summary/             # Step 2 components
│   │   └── LoanSummary.tsx
│   ├── scenarios/           # Step 3 components
│   │   └── ScenarioComparison.tsx
│   └── results/             # Step 4 components
│       └── ResultsSummary.tsx
├── hooks/
│   └── useCalculations.ts   # Calculator state management
├── utils/
│   ├── calculations.ts      # Core calculation logic
│   ├── calculations.test.ts # Unit tests
│   └── constants.ts         # UK loan system constants
├── types/
│   └── index.ts             # TypeScript interfaces
├── styles/
│   └── globals.css          # Global styles
├── App.tsx                  # Main app component
└── main.tsx                 # React entry point
```

---

## Key Features Implemented

### ✅ Step 1: Onboarding Form
- Radio buttons for student status (new/current)
- Dropdown for years of study (1-5)
- Radio buttons for maintenance allowance options
- Form validation with error messages
- Helpful tooltips and descriptions

### ✅ Step 2: Loan Summary
- Display total loan calculation
- Breakdown by tuition, living, maintenance
- Informational warnings about estimates
- Confirmation before proceeding

### ✅ Step 3: Scenario Comparison
- Comparison table showing all 4 scenarios
- 4 interactive Recharts visualizations:
  - Monthly payment over time (line chart)
  - Repayment timeline (horizontal bar chart)
  - Total amount paid (bar chart)
  - Loan balance decline (line chart)
- Key insights section

### ✅ Step 4: Results Summary
- Summary statistics
- Detailed scenario breakdown
- Key insights and comparisons
- Next steps guidance
- Useful resources links
- Print functionality

---

## Calculation Logic

### Core Formulas

**Total Loan:**
```
Total = (Annual Tuition + Annual Living + Maintenance) × Years
```

**Monthly Payment:**
```
If Salary > £27,750:
  Repayable = Salary - £27,750
  Monthly = (Repayable × 9%) ÷ 12
Else:
  Monthly = £0
```

**Yearly Salary:**
```
Salary(year) = Starting Salary × (1 + Annual Increment)^(year-1)
```

### UK Student Loan System (Plan 2) Constants

- **Tuition Fee:** £9,250/year
- **Repayment Threshold:** £27,750/year
- **Repayment Rate:** 9% of income above threshold
- **Interest Rate:** RPI + 3% (~6%)
- **Forgiveness Period:** 40 years

All constants are defined in `src/utils/constants.ts`

---

## Development Workflow

### Adding a New Feature

1. **Create types** in `src/types/index.ts`
2. **Create utility functions** in `src/utils/`
3. **Create component** in appropriate `src/components/` folder
4. **Add tests** alongside the code
5. **Update App.tsx** if needed
6. **Test in browser** with `npm run dev`

### Adding a New Chart

1. Create component in `src/components/charts/`
2. Import Recharts components
3. Transform RepaymentOutput data for chart format
4. Add custom tooltip if needed
5. Import and use in ScenarioComparison.tsx
6. Test with sample data

### Styling

The project uses **Tailwind CSS** for styling:

```tsx
// Example: Tailwind utility classes
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  <p className="text-sm text-blue-900">Info text</p>
</div>
```

Color scheme:
- Primary: Blue (#1f77b4)
- Scenario A: Blue (#1f77b4)
- Scenario B: Green (#2ca02c)
- Scenario C: Orange (#ff7f0e)
- Scenario D: Red (#d62728)

---

## Testing

### Unit Tests (calculations.test.ts)

Currently testing:
- ✅ Total loan calculation
- ✅ Salary growth calculations
- ✅ Monthly payment calculations
- ✅ Full scenario calculations
- ✅ Scenario comparisons

To run:
```bash
npm test
```

### Manual Testing Checklist

- [ ] Form submission works
- [ ] Validation errors display correctly
- [ ] Charts render with data
- [ ] Charts are responsive (mobile/tablet/desktop)
- [ ] Navigation between steps works
- [ ] Reset button works
- [ ] Calculations match sample data
- [ ] Print functionality works

---

## Performance Optimization

### Current Optimizations

- Recharts uses `isAnimationActive` for smooth animations
- Charts use `ResponsiveContainer` for responsive sizing
- React.memo for expensive components (if needed)
- Code splitting via Vite

### Future Optimizations

- Lazy load charts on scroll
- Memoize calculation results
- Virtual scrolling for large datasets
- Service workers for offline support

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS 12+, Android 8+

---

## Accessibility

The app meets **WCAG 2.1 Level AA** standards:

- ✅ Keyboard navigation (Tab, Enter, Arrow keys)
- ✅ Screen reader friendly (semantic HTML, ARIA labels)
- ✅ High contrast colors
- ✅ Large readable fonts (16px minimum)
- ✅ Focus indicators

Test with:
```bash
# Keyboard only navigation
# Screen reader testing (NVDA, JAWS, VoiceOver)
# Color contrast checker
```

---

## Deployment

### Production Build

```bash
npm run build
```

Builds to `dist/` directory (~150KB gzipped)

### Deployment Options

#### Vercel (Recommended)
```bash
npm i -g vercel
vercel login
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
npm run build
git add dist
git commit -m "Deploy to GitHub Pages"
git push
```

### Environment Variables

Create `.env.production` for production:
```env
VITE_APP_ENV=production
VITE_ANALYTICS_ID=your-google-analytics-id
```

---

## Debugging

### Debug Mode

Add to `App.tsx`:
```tsx
console.log('Results:', results);
console.log('User Input:', userInput);
console.log('Total Loan:', totalLoan);
```

### React DevTools

Install browser extension for easier debugging:
- Chrome/Edge: [React DevTools](https://chrome.google.com/webstore)
- Firefox: [React DevTools](https://addons.mozilla.org/firefox)

### Network Issues

Check if calculations match official calculators:
- [Student Finance Calculator](https://www.gov.uk/student-finance)
- Verify repayment threshold and rate

---

## Future Enhancements

### Phase 2: Additional Features
- [ ] Support for Plan 5 loans
- [ ] International student scenarios
- [ ] Postgraduate loan support
- [ ] Parental contribution scenarios
- [ ] Multiple child scenarios
- [ ] Tax impact calculator
- [ ] Career progression simulator
- [ ] Export to PDF/Excel

### Phase 3: Advanced Features
- [ ] User accounts (login/save scenarios)
- [ ] Sharing scenarios via URL
- [ ] Comparison with other countries
- [ ] Financial advisor booking
- [ ] Mobile app (React Native)
- [ ] Dark mode support
- [ ] Multi-language support (Welsh, etc.)

---

## Troubleshooting

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Port Already in Use

```bash
# Change port in vite.config.ts
# Or kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

### Types Not Working

```bash
# Regenerate types
npm run type-check
```

---

## Resources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org/en-US/)
- [React Hook Form](https://react-hook-form.com/)
- [Student Finance Official](https://www.gov.uk/student-finance)

---

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and write tests
3. Commit with clear message: `git commit -m "Add feature X"`
4. Push to branch: `git push origin feature/my-feature`
5. Submit pull request

---

## License

MIT License - See LICENSE file

---

## Contact

For questions or issues, please open an issue in the git repository or contact the development team.

**Status:** MVP Development in Progress ✨

Last updated: 2026-08-24
