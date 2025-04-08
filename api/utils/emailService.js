// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendStatusNotification = async (toEmail, requestDetails) => {
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
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
};