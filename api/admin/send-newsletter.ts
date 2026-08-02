import { kv } from '@vercel/kv';
import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { subject, htmlContent } = req.body;

  if (!subject || !htmlContent) {
    return res.status(400).json({ message: 'Subject and HTML content are required' });
  }

  try {
    // 1. Fetch all subscribers from Vercel KV
    const leads: any[] = await kv.lrange('leads', 0, -1);
    
    if (!leads || leads.length === 0) {
      return res.status(400).json({ message: 'No subscribers found to send to' });
    }

    // Extract unique emails
    const emails = [...new Set(leads.map(lead => lead.email).filter(Boolean))];

    if (emails.length === 0) {
      return res.status(400).json({ message: 'No valid email addresses found' });
    }

    // 2. Setup Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Send email using BCC so subscribers don't see each other's emails
    // We send TO the admin email, and BCC all subscribers.
    const mailOptions = {
      from: `"Estate.Lab" <${process.env.EMAIL_USER}>`,
      replyTo: "osman@asimetrilab.com",
      to: process.env.EMAIL_USER, // Send to self
      bcc: emails, // BCC all subscribers
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; background-color: #FAF8F4; font-family: 'Inter', Arial, Helvetica, sans-serif; color: #1F2937; }
            .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .header { background-color: #0F4C5C; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-family: 'Playfair Display', serif; color: #D4B483; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
            .content { padding: 30px 0; line-height: 1.6; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E8DCCB; text-align: center; font-size: 12px; color: #6B7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Estate.Lab</h1>
            </div>
            <div class="content">
              ${htmlContent}
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Estate.Lab. All rights reserved.</p>
              <p>You received this email because you are subscribed to our newsletter.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      message: 'Newsletter sent successfully!', 
      recipientCount: emails.length 
    });

  } catch (error: any) {
    console.error('Error sending newsletter:', error);
    return res.status(500).json({ 
      message: 'Failed to send newsletter', 
      error: error?.message || String(error) 
    });
  }
}
