import { kv } from '@vercel/kv';
import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { firstName, lastName, email, whatsapp, date, time, propertyType, notes } = req.body;

  // Format Property Type
  const propertyTypeMap: Record<string, string> = {
    'starter': 'Starter Collection (Type 45 & 60)',
    'family': 'Family Collection (Type 70 & 80)',
    'signature': 'Signature Collection (Type 90 & 120)',
    'undecided': 'General Consultation'
  };
  const displayPropertyType = propertyTypeMap[propertyType] || propertyType || 'General Consultation';

  // Format Date (e.g., 2026-07-25 to 25th July 2026)
  let formattedDate = date;
  if (date) {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const getOrdinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    const month = dateObj.toLocaleString('en-US', { month: 'long' });
    const year = dateObj.getFullYear();
    formattedDate = `${getOrdinal(day)} ${month} ${year}`;
  }

  // Format Time (e.g., 18:22 to 06:22 PM)
  let formattedTime = time;
  if (time && time.includes(':')) {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    formattedTime = `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  }

  try {
    // Save to Vercel KV
    const newBooking = {
      id: Date.now().toString(),
      name: `${firstName} ${lastName}`,
      email,
      phone: whatsapp,
      property: displayPropertyType,
      date,
      time,
      status: 'Pending',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };
    
    await kv.lpush('bookings', newBooking);
  } catch (kvError) {
    console.error('Error saving to KV:', kvError);
    // We continue with the email even if KV fails for some reason
  }

  // We expect EMAIL_USER and EMAIL_PASS to be set in the environment (.env.local for dev, Vercel for prod)
  // Since we don't know the exact host for asimetrilab.com, we will assume standard SMTP.
  // If it's Google Workspace, Host is smtp.gmail.com. If Hostinger, smtp.hostinger.com.
  // We will configure a generic transporter that should work for most cPanel/Titan/Hostinger setups.
  // If you know your specific SMTP host (e.g. smtp.gmail.com or mail.asimetrilab.com), please update `host`.
  
  // NOTE: A common default host for custom domains is mail.domain.com or smtp.domain.com
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com', // Defaulting to Gmail as specified in environment
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
      subject: `Estate.Lab | Your Private Viewing Request is Received`,
      html: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Your Viewing Request with Estate.Lab</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #FAF8F4; }
        :root { color-scheme: light dark; supported-color-schemes: light dark; }
        .hover-btn:hover { opacity: 0.9; }
        @media screen and (max-width: 600px) {
            .mobile-padding { padding: 30px 20px !important; }
            .mobile-header { font-size: 24px !important; }
            .mobile-text { font-size: 15px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F4; font-family: 'Inter', Arial, Helvetica, sans-serif;">
    <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #FAF8F4; opacity: 0;">
        We have received your interest and are currently reviewing your requested schedule for a private viewing.
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F4; table-layout: fixed;">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" class="mobile-padding" style="padding: 40px; background-color: #0F4C5C;">
                            <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 700; color: #D4B483; letter-spacing: 2px; text-transform: uppercase;">
                                Estate.Lab
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="mobile-padding" style="padding: 50px 40px; color: #1F2937; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6;">
                            <h2 class="mobile-header" style="margin-top: 0; margin-bottom: 24px; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 700; color: #0F4C5C;">
                                Viewing Request Received
                            </h2>
                            <p class="mobile-text" style="margin: 0 0 20px 0;">Dear ${firstName},</p>
                            <p class="mobile-text" style="margin: 0 0 20px 0;">Thank you for requesting a private viewing with Estate.Lab.</p>
                            <p class="mobile-text" style="margin: 0 0 20px 0;">
                                We have received your interest in the <strong>${displayPropertyType}</strong> and are currently reviewing your requested schedule for <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong>.
                            </p>
                            <p class="mobile-text" style="margin: 0 0 30px 0;">
                                At Estate.Lab, we believe in crafting spaces that transcend ordinary living, and we are thrilled to guide you on your journey home. I will personally review your preferences and reach out to you shortly via WhatsApp at <strong>${whatsapp}</strong> to finalize the details of our consultation.
                            </p>
                            <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0;">
                                <tr>
                                    <td align="center" bgcolor="#0F4C5C" style="border-radius: 4px;">
                                        <a href="https://estatelab-prototype.vercel.app/" target="_blank" class="hover-btn" style="display: inline-block; padding: 14px 28px; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">
                                            Explore Estate.Lab
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p class="mobile-text" style="margin: 0 0 24px 0;">If you have any immediate questions or need to reschedule before we connect, please feel free to reply directly to this email.</p>
                            <p class="mobile-text" style="margin: 0 0 5px 0;">Warm regards,</p>
                            <p style="margin: 0; font-family: 'Inter', Arial, Helvetica, sans-serif;">
                                <strong style="font-size: 16px; color: #1F2937;">Osman</strong><br>
                                <span style="font-size: 14px; color: #0F4C5C;">Property Advisor</span><br>
                                <span style="font-size: 14px; color: #0F4C5C;">Estate.Lab</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0; margin: 0;">
                            <hr style="border: none; border-top: 1px solid #E8DCCB; margin: 0; width: 100%;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" class="mobile-padding" style="padding: 30px 40px; background-color: #FAF8F4;">
                            <p style="margin: 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.6; color: #1F2937;">
                                &copy; 2026 <a href="https://estatelab-prototype.vercel.app/" style="color: #0F4C5C; text-decoration: none; font-weight: bold;">Estate.Lab</a>. All rights reserved.<br>
                                Crafting spaces that transcend ordinary living.
                            </p>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td></tr></table>
                <![endif]-->
            </td>
        </tr>
    </table>
</body>
</html>`,
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
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Property Type:</strong> ${displayPropertyType}</p>
          <p><strong>Notes:</strong> ${notes || 'None'}</p>
        </div>
      `,
    };
    
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: 'Booking successful' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error: error?.message || String(error) });
  }
}
