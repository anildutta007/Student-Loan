import React, { useState } from 'react'
import Button from '@components/common/Button'
import Card from '@components/common/Card'

interface TipModalProps {
  isOpen: boolean
  onClose: () => void
}

const TipModal: React.FC<TipModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const tipAmounts = [1, 2]

  const handleTipClick = async (amount: number) => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      })

      const { url } = await response.json()
      if (url) window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setLoading(false)
    }
  }

  const handleCustomTip = async () => {
    const amount = parseFloat(customAmount)
    if (amount < 1) {
      alert('Please enter at least £1')
      return
    }
    await handleTipClick(amount)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            💝 Support This App
          </h2>
          <p className="text-gray-600">
            Your tip helps keep this free calculator running and improving
          </p>
        </div>

        {/* Preset Amounts */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {tipAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleTipClick(amount)}
              disabled={loading}
              className={`p-4 rounded-lg border-2 transition-all font-semibold min-h-touch ${
                selectedAmount === amount
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-blue-300 text-gray-700'
              }`}
            >
              £{amount}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Custom amount (£)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-3 text-gray-600">£</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-touch"
              />
            </div>
            <Button
              onClick={handleCustomTip}
              disabled={!customAmount || loading}
              loading={loading}
            >
              Pay
            </Button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors min-h-touch"
        >
          Maybe later
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Secure payment powered by Stripe
        </p>
      </Card>
    </div>
  )
}

export default TipModal
