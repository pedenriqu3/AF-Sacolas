import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser || "AF Sacolas <no-reply@af-sacolas.local>";

function createTransporter() {
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string): Promise<void> {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[password-reset] Email de recuperação para ${to}: ${resetUrl}`);
    return;
  }

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject: "Redefinição de senha AF Sacolas",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="color: #0c0069;">Olá, ${name}!</h2>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta na AF Sacolas.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <p><a href="${resetUrl}" style="display:inline-block;background:#0c0069;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700;">Redefinir senha</a></p>
        <p>Se você não solicitou isso, pode ignorar este e-mail.</p>
      </div>
    `,
  });
}