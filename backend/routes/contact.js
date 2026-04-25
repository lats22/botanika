const express = require('express')
const axios = require('axios')
const nodemailer = require('nodemailer')
const router = express.Router()

const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

// Create nodemailer transporter for Gmail
const createEmailTransporter = () => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    return null
  }
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  })
}

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    // Format message for LINE
    const lineMessage = `
🌿 New Botanika Contact Form

👤 Name: ${name}
📧 Email: ${email}
📞 Phone: ${phone || 'Not provided'}

💬 Message:
${message}

---
Sent from botanikamassage.com
    `.trim()

    // Send to LINE Notify if token is configured
    if (LINE_NOTIFY_TOKEN) {
      await axios.post(
        'https://notify-api.line.me/api/notify',
        `message=${encodeURIComponent(lineMessage)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`
          }
        }
      )
      console.log('LINE Notify sent successfully')
    } else {
      // Log to console if LINE token not configured
      console.log('Contact form submission (LINE Notify not configured):')
      console.log(lineMessage)
    }

    // Send email notification
    const transporter = createEmailTransporter()
    if (transporter) {
      try {
        const emailContent = `New contact form submission:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Message: ${message}

---
Sent from botanikamassage.com`

        await transporter.sendMail({
          from: EMAIL_USER,
          to: 'botanika.thailand2@gmail.com',
          subject: 'New Contact Form - Botanika Website',
          text: emailContent
        })
        console.log('Email sent successfully to botanika.thailand2@gmail.com')
      } catch (emailError) {
        // Log email error but don't fail the whole request
        console.error('Failed to send email notification:', emailError.message)
      }
    } else {
      console.log('Email notification skipped (EMAIL_USER or EMAIL_PASS not configured)')
    }

    res.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('Contact form error:', error.message)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

module.exports = router
