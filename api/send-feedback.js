// Vercel serverless function for sending feedback emails via Resend

export default async function handler(req, res) {
  console.log('API called - Method:', req.method);
  console.log('API called - Body:', req.body);
  console.log('API key exists:', !!process.env.RESEND_API_KEY);

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, feedback, timestamp, recipientEmail } = req.body;

    console.log('Received feedback from:', email || 'anonymous');

    // Validate required fields
    if (!feedback?.trim()) {
      return res.status(400).json({ error: 'Feedback is required' });
    }

    if (!recipientEmail?.includes('@')) {
      return res.status(400).json({ error: 'Invalid recipient email' });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Import Resend
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log('Sending email with Resend...');

    // Send email
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: recipientEmail,
      replyTo: email || 'noreply@studentloancalculator.com',
      subject: 'New Feedback from Student Loan Calculator',
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>From:</strong> ${name || 'Anonymous'}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
        <hr />
        <p><strong>Feedback:</strong></p>
        <p>${feedback.replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log('Email sent successfully:', result);

    return res.status(200).json({
      success: true,
      message: 'Feedback sent successfully',
      result,
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return res.status(500).json({
      error: 'Failed to send feedback',
      message: error?.message || error?.toString() || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
}
