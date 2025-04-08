// utils/emailService.js
const nodemailer = require('nodemailer');

// Create a more robust email transport configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your specific email provider
  host: 'smtp.gmail.com', // Add explicit host for Gmail
  port: 587, // Standard secure SMTP port
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // This should be an app password for Gmail
  },
  tls: {
    rejectUnauthorized: false // Only use during development
  }
});

// Modified notification function with better error handling
exports.sendStatusNotification = async (toEmail, requestDetails) => {
  // Verify credentials before sending
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials not configured');
    throw new Error('Email credentials not configured');
  }

  const mailOptions = {
    from: `Uni-Ease Service <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Laundry Request #${requestDetails.id} Completed`,
    html: `
      <h2>Your laundry service is complete! 🎉</h2>
      <p>Details of completed request:</p>
      <ul>
        <li>Request ID: ${requestDetails.id}</li>
        <li>Items: ${requestDetails.items.length} pieces</li>
        <li>Completed at: ${new Date().toLocaleString()}</li>
      </ul>
      <p>Thank you for using our services!</p>
    `
  };

  try {
    // Verify connection to email server before sending
    const verifyResult = await transporter.verify();
    console.log('Transporter verification:', verifyResult);
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    throw error; // Re-throw to allow proper handling in the calling function
  }
};