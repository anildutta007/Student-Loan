import React, { useState } from 'react'
import Button from '@components/common/Button'

interface FeedbackButtonProps {
  recipientEmail?: string
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  recipientEmail = 'anildutta007@gmail.com'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Send feedback via email API
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          feedback,
          timestamp: new Date().toISOString(),
          recipientEmail,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send feedback')
      }

      setSubmitted(true)
      setFeedback('')
      setName('')
      setEmail('')

      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        setIsOpen(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send feedback')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 flex items-center gap-2"
          title="Send us your feedback"
        >
          <span className="text-xl">💬</span>
          <span className="hidden sm:inline text-sm font-medium">Feedback</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h3 className="font-semibold">Send us your feedback</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-blue-700 rounded p-1"
          >
            ✕
          </button>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="p-4 bg-green-50 border-b border-green-200">
            <p className="text-green-900 font-medium">✓ Thank you! Your feedback has been sent.</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-red-900 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        {!submitted && (
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your feedback *
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think, suggestions, or report issues..."
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !feedback.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default FeedbackButton
