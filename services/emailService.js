import transporter from '../config/mailer.js';

export const sendContactEmail = async ({ name, email, subject, message, ipAddress, browser, time }) => {
  const adminEmail = process.env.ADMIN_RECEIVER_EMAIL || process.env.ADMIN_EMAIL || 'kartiksoni543@gmail.com';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0f0715; color: #ffffff; padding: 30px; border-radius: 12px;">
      <h2 style="color: #a855f7; border-bottom: 2px solid #a855f7; padding-bottom: 10px;">New Portfolio Contact Inquiry</h2>
      <p>You have received a new contact message from your portfolio website.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; color: #e2e8f0;">
        <tr>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3); font-weight: bold; width: 140px;">Sender Name:</td>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3);">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3); font-weight: bold;">Sender Email:</td>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3);"><a href="mailto:${email}" style="color: #c084fc;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3); font-weight: bold;">Subject:</td>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3);">${subject}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3); font-weight: bold;">Message:</td>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3); white-space: pre-line;">${message}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3); font-weight: bold;">Time:</td>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3);">${time || new Date().toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3); font-weight: bold;">IP Address:</td>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3);">${ipAddress}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3); font-weight: bold;">Browser:</td>
          <td style="padding: 10px; border: 1px solid rgba(168,85,247,0.3);">${browser}</td>
        </tr>
      </table>
      
      <p style="margin-top: 25px; font-size: 12px; color: #94a3b8;">
        This email was automatically dispatched by your Node.js Portfolio Server.
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"Kartik Soni Portfolio" <${process.env.EMAIL_USER || adminEmail}>`,
    to: adminEmail,
    subject: `[Portfolio Inquiry] ${subject} - ${name}`,
    html: htmlContent
  };

  return await transporter.sendMail(mailOptions);
};
