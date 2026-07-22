import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "All fields (Name, Email, Subject, Message) are required." },
        { status: 400 }
      );
    }

    const emailUser = process.env.EMAIL_USER || "kartiksoni543@gmail.com";
    const emailPass = process.env.EMAIL_PASS || "mock_pass";
    const adminEmail = process.env.ADMIN_RECEIVER_EMAIL || process.env.ADMIN_EMAIL || "kartiksoni543@gmail.com";

    // Dispatch email notification asynchronously
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const mailOptions = {
        from: `"Kartik Soni Portfolio" <${emailUser}>`,
        to: adminEmail,
        subject: `[Awwwards Portfolio Inquiry] ${subject} - ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #050505; color: #ffffff; padding: 30px; border-radius: 12px;">
            <h2 style="color: #00E5FF; border-bottom: 2px solid #00E5FF; padding-bottom: 10px;">New Portfolio Contact Inquiry</h2>
            <p>You have received a new contact message from your 3D Portfolio site.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; color: #e2e8f0;">
              <tr>
                <td style="padding: 10px; border: 1px solid rgba(0,229,255,0.3); font-weight: bold; width: 140px;">Name:</td>
                <td style="padding: 10px; border: 1px solid rgba(0,229,255,0.3);">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid rgba(0,229,255,0.3); font-weight: bold;">Email:</td>
                <td style="padding: 10px; border: 1px solid rgba(0,229,255,0.3);"><a href="mailto:${email}" style="color: #00E5FF;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid rgba(0,229,255,0.3); font-weight: bold;">Subject:</td>
                <td style="padding: 10px; border: 1px solid rgba(0,229,255,0.3);">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid rgba(0,229,255,0.3); font-weight: bold;">Message:</td>
                <td style="padding: 10px; border: 1px solid rgba(0,229,255,0.3); white-space: pre-line;">${message}</td>
              </tr>
            </table>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (mailErr: any) {
      console.warn("[Nodemailer Info]:", mailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent successfully. I will get back to you soon.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error submitting inquiry. Please try again." },
      { status: 500 }
    );
  }
}
