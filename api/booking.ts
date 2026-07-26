import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { firstName, lastName, email, whatsapp, date, time, propertyType, notes } = req.body;

  // We expect EMAIL_USER and EMAIL_PASS to be set in the environment (.env.local for dev, Vercel for prod)
  // Since we don't know the exact host for asimetrilab.com, we will assume standard SMTP.
  // If it's Google Workspace, Host is smtp.gmail.com. If Hostinger, smtp.hostinger.com.
  // We will configure a generic transporter that should work for most cPanel/Titan/Hostinger setups.
  // If you know your specific SMTP host (e.g. smtp.gmail.com or mail.asimetrilab.com), please update `host`.
  
  // NOTE: A common default host for custom domains is mail.domain.com or smtp.domain.com
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com', // Change this to your provider's SMTP server if needed
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const mailOptions = {
      from: `"Osman (Estate.Lab)" <${process.env.EMAIL_USER}>`, // The authenticated account
      replyTo: "osman@asimetrilab.com", // Replies go to Osman
      to: email, // Sending confirmation to the user who filled the form
      subject: `Estate.Lab - Booking Confirmation for ${firstName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1F2937;">
          <h2 style="color: #0F4C5C;">Begin Your Journey Home</h2>
          <p>Hi ${firstName} ${lastName},</p>
          <p>Thank you for booking a viewing with Estate.Lab. Here are your booking details:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
            <li><strong>Collection:</strong> ${propertyType || 'General Consultation'}</li>
            <li><strong>WhatsApp:</strong> ${whatsapp}</li>
          </ul>
          ${notes ? `<p><strong>Additional Notes:</strong> ${notes}</p>` : ''}
          <p style="margin-top: 30px;">We will contact you shortly to confirm your viewing schedule.</p>
          <p>Best regards,<br/>Osman<br/><strong>Estate.Lab Property Advisor</strong></p>
        </div>
      `,
    };

    // Send confirmation to the client
    await transporter.sendMail(mailOptions);

    // Send notification to Osman
    const adminMailOptions = {
      from: `"Estate.Lab System" <${process.env.EMAIL_USER}>`,
      replyTo: email, // If Osman hits reply, it goes to the client
      to: "osman@asimetrilab.com", // Notify Osman
      subject: `New Viewing Request: ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1F2937;">
          <h2 style="color: #0F4C5C;">New Booking Received</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Property Type:</strong> ${propertyType}</p>
          <p><strong>Notes:</strong> ${notes || 'None'}</p>
        </div>
      `,
    };
    
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: 'Booking successful' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error });
  }
}
