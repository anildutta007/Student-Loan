import React from 'react'
import Card from '@components/common/Card'
import Button from '@components/common/Button'

interface InformationPageProps {
  onBack: () => void
}

const InformationPage: React.FC<InformationPageProps> = ({ onBack }) => {
  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📋 Information & System Assumptions
        </h2>
        <p className="text-gray-600">
          Understanding how the calculator works and the assumptions made
        </p>
      </div>

      <div className="space-y-8">
        {/* How Repayment Works */}
        <section>
          <h3 className="text-xl font-semibold text-blue-900 mb-4">How Repayment Works</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <div>
              <p className="font-semibold text-blue-900">Repayment Threshold</p>
              <p className="text-gray-700">£25,000 - No repayment if salary is below this amount</p>
            </div>
            <div>
              <p className="font-semibold text-blue-900">Repayment Rate</p>
              <p className="text-gray-700">9% of income earned ABOVE £25,000 threshold</p>
            </div>
            <div>
              <p className="font-semibold text-blue-900">Interest During Study</p>
              <p className="text-gray-700">Interest accrues on the loan WHILE the student is at university (not just after graduation)</p>
            </div>
            <div>
              <p className="font-semibold text-blue-900">Interest Rate</p>
              <p className="text-gray-700">
                <strong>4.5% RPI (for this calculator demonstration)</strong>
                <br />
                <span className="text-sm">⚠️ Important: This rate may be higher or lower in future years depending on actual inflation rates</span>
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-900">Loan Forgiveness</p>
              <p className="text-gray-700">Any remaining balance is forgiven after 40 years</p>
            </div>
          </div>
        </section>

        {/* Maintenance Allowance Calculation */}
        <section>
          <h3 className="text-xl font-semibold text-green-900 mb-4">Maintenance Allowance Calculation</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <p className="text-gray-700">
              Your eligible maintenance allowance depends on two factors:
            </p>
            <div>
              <p className="font-semibold text-green-900">1. Living Situation</p>
              <ul className="text-gray-700 space-y-1 ml-4 list-disc">
                <li><strong>Living at home:</strong> Maximum £9,118/year</li>
                <li><strong>Away from home (outside London):</strong> Maximum £10,830/year</li>
                <li><strong>Away from home (in London):</strong> Maximum £14,135/year</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-green-900">2. Household Income Taper</p>
              <p className="text-gray-700">
                Your eligible allowance reduces gradually if household income exceeds £25,000, with a guaranteed minimum floor.
                For every £6.36 of income above £25,000, the allowance reduces by £1, but a minimum amount is always guaranteed.
              </p>
            </div>
          </div>
        </section>

        {/* System Assumptions */}
        <section>
          <h3 className="text-xl font-semibold text-purple-900 mb-4">System Assumptions</h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">Annual Tuition Fee (2026-27)</p>
              <p className="font-bold text-purple-900">£9,535</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">Repayment Threshold</p>
              <p className="font-bold text-purple-900">£25,000</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">Repayment Rate</p>
              <p className="font-bold text-purple-900">9% of income above threshold</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">Interest Rate (Example)</p>
              <p className="font-bold text-purple-900">4.5% RPI</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">Annual Salary Growth</p>
              <p className="font-bold text-purple-900">5%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">Loan Forgiveness Period</p>
              <p className="font-bold text-purple-900">40 years</p>
            </div>
          </div>
        </section>

        {/* Scenarios Explained */}
        <section>
          <h3 className="text-xl font-semibold text-orange-900 mb-4">Salary Scenarios</h3>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              The calculator shows 4 different starting salary scenarios to help you understand various career paths:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="font-bold text-orange-900">Student A:</span>
                <span className="text-gray-700">£30,000 starting salary - typical graduate entry level</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-900">Student B:</span>
                <span className="text-gray-700">£40,000 starting salary - above average graduate role</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-900">Student C:</span>
                <span className="text-gray-700">£50,000 starting salary - strong graduate position</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-900">Student D:</span>
                <span className="text-gray-700">£60,000 starting salary - high-earning graduate role</span>
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Each scenario assumes consistent 5% annual salary growth throughout the repayment period.
            </p>
          </div>
        </section>

        {/* Useful Resources */}
        <section>
          <h3 className="text-xl font-semibold text-cyan-900 mb-4">Useful Resources</h3>
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 space-y-3">
            <a
              href="https://www.gov.uk/student-finance-england"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-white border border-cyan-200 rounded hover:bg-cyan-100 transition-colors"
            >
              <p className="font-semibold text-cyan-900">Student Finance England (Official)</p>
              <p className="text-sm text-gray-600">Official government website for student finance information</p>
            </a>
            <a
              href="https://www.slc.co.uk/borrowers/repayment/how-repayment-works.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-white border border-cyan-200 rounded hover:bg-cyan-100 transition-colors"
            >
              <p className="font-semibold text-cyan-900">SLC - How Repayment Works</p>
              <p className="text-sm text-gray-600">Detailed information on loan repayment from Student Loans Company</p>
            </a>
            <a
              href="https://www.gov.uk/guidance/plan-2-student-loans-overview"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-white border border-cyan-200 rounded hover:bg-cyan-100 transition-colors"
            >
              <p className="font-semibold text-cyan-900">Plan 2 Student Loans Overview</p>
              <p className="text-sm text-gray-600">Government guidance on Plan 2 student loans system</p>
            </a>
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
            <p className="font-semibold text-yellow-900 mb-2">⚠️ Important Disclaimer</p>
            <p className="text-gray-700">
              This calculator provides estimates based on 2026-27 UK student loan system information.
              Actual repayment amounts may vary due to changes in interest rates, salary progression,
              and government policy changes. Always check Student Finance England for the most up-to-date
              information before making financial decisions.
            </p>
          </div>
        </section>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Button
          variant="secondary"
          onClick={onBack}
          size="lg"
        >
          ← Back to Calculator
        </Button>
      </div>
    </Card>
  )
}

export default InformationPage
