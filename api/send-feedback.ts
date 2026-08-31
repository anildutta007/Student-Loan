// This is a Vercel serverless function for handling feedback emails
// To make this work, you need to set up an email service (SendGrid, Resend, or similar)

interface FeedbackRequest {
  name: string
  email: string
  feedback: string
  timestamp: string
  recipientEmail: string
}

// Example using Resend (recommended for Vercel)
// Install: npm install resend
// Set env var: RESEND_API_KEY=your_key_here

async function sendEmailWithResend(data: FeedbackRequest) {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Use onboarding@resend.dev for testing, or your verified domain
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    const result = await resend.emails.send({
      from: fromEmail,
      to: data.recipientEmail,
      replyTo: data.email || 'noreply@studentloancalculator.com',
      subject: `New Feedback from Student Loan Calculator`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>From:</strong> ${data.name || 'Anonymous'}</p>
        <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
        <p><strong>Time:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
        <hr />
        <p><strong>Feedback:</strong></p>
        <p>${data.feedback.replace(/\n/g, '<br>')}</p>
      `,
    })

    return result
  } catch (error) {
    console.error('Resend error:', error)
    throw error
  }
}

// Alternative: Using SendGrid
async function sendEmailWithSendGrid(data: FeedbackRequest) {
  try {
    const sgMail = await import('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

    await sgMail.send({
      to: data.recipientEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@studentloancalculator.com',
      replyTo: data.email || 'noreply@studentloancalculator.com',
      subject: 'New Feedback from Student Loan Calculator',
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>From:</strong> ${data.name || 'Anonymous'}</p>
        <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
        <p><strong>Time:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
        <hr />
        <p><strong>Feedback:</strong></p>
        <p>${data.feedback.replace(/\n/g, '<br>')}</p>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('SendGrid error:', error)
    throw error
  }
}

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data: FeedbackRequest = req.body

    // Validate required fields
    if (!data.feedback?.trim()) {
      return res.status(400).json({ error: 'Feedback is required' })
    }

    if (!data.recipientEmail?.includes('@')) {
      return res.status(400).json({ error: 'Invalid recipient email' })
    }

    // Try Resend first (recommended)
    let result
    if (process.env.RESEND_API_KEY) {
      result = await sendEmailWithResend(data)
    } else if (process.env.SENDGRID_API_KEY) {
      result = await sendEmailWithSendGrid(data)
    } else {
      return res.status(500).json({
        error: 'Email service not configured. Please set RESEND_API_KEY or SENDGRID_API_KEY environment variable.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback sent successfully',
      result,
    })
  } catch (error) {
    console.error('Feedback API error:', error)
    return res.status(500).json({
      error: 'Failed to send feedback',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
