import nodemailer from 'nodemailer';

const PROVIDER = process.env.EMAIL_PROVIDER || 'console';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

let transporter = null;
if (PROVIDER === 'smtp') {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

function buildVerificationEmail(user, token) {
  const link = `${FRONTEND_URL}/verify-email?token=${token}`;
  return {
    subject: 'Verify your DormScout account',
    text: `Hi ${user.name},\n\nVerify your email to activate your DormScout account:\n${link}\n\nThis link expires in 24 hours.\n\nIf you didn't create this account, you can ignore this email.`,
    html: `<p>Hi ${user.name},</p><p>Verify your email to activate your DormScout account:</p><p><a href="${link}">${link}</a></p><p>This link expires in 24 hours.</p><p>If you didn't create this account, you can ignore this email.</p>`,
    link,
  };
}

// Console mode never touches the network — it logs the link to the
// server terminal, which is enough to develop and test the whole flow
// without any email provider account. Switch EMAIL_PROVIDER=smtp in
// .env (with real SMTP_* credentials) to actually send email.
export async function sendVerificationEmail(user, token) {
  const { subject, text, html, link } = buildVerificationEmail(user, token);

  if (PROVIDER === 'console') {
    console.log('\n📧 [DEV EMAIL] Verification link for', user.email);
    console.log('   ' + link + '\n');
    return { delivered: false, mode: 'console', link };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"DormScout" <no-reply@dormscout.app>',
    to: user.email,
    subject,
    text,
    html,
  });
  return { delivered: true, mode: 'smtp' };
}
