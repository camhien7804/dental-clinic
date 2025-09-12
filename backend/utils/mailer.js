// backend/utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "sandbox.smtp.mailtrap.io",
  port: process.env.MAIL_PORT || 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || '"Nha khoa OU" <clinic@example.com>',
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("❌ Error sending mail:", err);
    throw err;
  }
};
