export default async function handler(req: any, res: any) {
  // Returns env var status (NOT the actual values) for diagnosis
  res.status(200).json({
    EMAIL_USER_SET: !!process.env.EMAIL_USER,
    EMAIL_PASS_SET: !!process.env.EMAIL_PASS,
    EMAIL_USER_PREVIEW: process.env.EMAIL_USER ? process.env.EMAIL_USER.slice(0, 4) + '****' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  });
}
