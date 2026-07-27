import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // 1. Send Welcome Email to Subscriber
    const subscriberMailOptions = {
      from: `"Estate.Lab" <${process.env.EMAIL_USER}>`,
      replyTo: "osman@asimetrilab.com",
      to: email,
      subject: \`Welcome to the Estate.Lab Newsletter\`,
      html: \`<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Welcome to Estate.Lab</title>
    
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
        Thank you for subscribing to our newsletter! You are now on the exclusive list.
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
                                Welcome to Estate.Lab
                            </h2>
                            <p class="mobile-text" style="margin: 0 0 20px 0;">Thank you for subscribing to our newsletter!</p>
                            <p class="mobile-text" style="margin: 0 0 20px 0;">
                                You are now on the exclusive list to receive early updates on new property launches, architectural insights, and special offers.
                            </p>
                            <p class="mobile-text" style="margin: 0 0 30px 0;">We look forward to sharing our journey with you.</p>
                            <p class="mobile-text" style="margin: 0 0 5px 0;">Best regards,</p>
                            <p style="margin: 0; font-family: 'Inter', Arial, Helvetica, sans-serif;">
                                <strong style="font-size: 16px; color: #1F2937;">The Estate.Lab Team</strong>
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
                                &copy; \${new Date().getFullYear()} <a href="https://estatelab-prototype.vercel.app/" style="color: #0F4C5C; text-decoration: none; font-weight: bold;">Estate.Lab</a>. All rights reserved.<br>
                                Crafting spaces that transcend ordinary living.<br><br>
                                <a href="https://estatelab-prototype.vercel.app/" style="color: #6B7280; text-decoration: underline;">Unsubscribe from this list</a>
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
</html>\`,
    };

    await transporter.sendMail(subscriberMailOptions);

    // 2. Send Notification to Admin (Osman)
    const adminMailOptions = {
      from: `"Estate.Lab System" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: "osman@asimetrilab.com",
      subject: `New Newsletter Subscriber!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1F2937;">
          <h2 style="color: #0F4C5C;">New Subscriber Alert</h2>
          <p>A new user has subscribed to the newsletter!</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      `,
    };
    
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: 'Subscription successful' });
  } catch (error: any) {
    console.error('Error sending subscription email:', error);
    res.status(500).json({ message: 'Error subscribing', error: error?.message || String(error) });
  }
}
