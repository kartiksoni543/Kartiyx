import Message from '../models/Message.js';
import { sendContactEmail } from '../services/emailService.js';

export const handleContactSubmit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (Name, Email, Subject, Message) are required.'
      });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';
    const submissionTime = new Date().toLocaleString();

    // 1. Save message to MongoDB
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
      ipAddress: clientIp,
      browser: userAgent
    });

    // 2. Dispatch email notification asynchronously (don't crash if SMTP app pass is unconfigured)
    sendContactEmail({
      name,
      email,
      subject,
      message,
      ipAddress: clientIp,
      browser: userAgent,
      time: submissionTime
    }).catch(err => {
      console.error('[Nodemailer Email Warning]: Could not send Gmail alert:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: {
        id: newMessage._id,
        name: newMessage.name,
        email: newMessage.email,
        createdAt: newMessage.createdAt
      }
    });
  } catch (error) {
    console.error('[Contact Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message. Please try again later.'
    });
  }
};
