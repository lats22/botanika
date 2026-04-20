const express = require('express')
const axios = require('axios')
const router = express.Router()

const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN

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
    } else {
      // Log to console if LINE token not configured
      console.log('Contact form submission (LINE Notify not configured):')
      console.log(lineMessage)
    }

    res.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('Contact form error:', error.message)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

module.exports = router
