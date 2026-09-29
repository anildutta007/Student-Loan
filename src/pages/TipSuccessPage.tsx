import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Card from '@components/common/Card'
import Button from '@components/common/Button'

const TipSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank You!
          </h1>
          <p className="text-gray-600 mb-4">
            Your generous tip helps us keep this calculator free and improving it every day.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800">
              <strong>Payment ID:</strong> {sessionId?.slice(0, 20)}...
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-900">What's next?</h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li>✅ Your payment is secure and confirmed</li>
            <li>✅ A receipt will be sent to your email</li>
            <li>✅ You've helped support education</li>
          </ul>
        </div>

        <Button
          onClick={() => navigate('/')}
          className="w-full"
          size="lg"
        >
          Back to Calculator
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          Questions? Contact us at support@studentloancalc.com
        </p>
      </Card>
    </div>
  )
}

export default TipSuccessPage
