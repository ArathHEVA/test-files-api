import nodemailer from "nodemailer";
import env from "../config/env.js";

let transporter;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: env.SMTP_FROM,
    to, subject, text, html
  });
  return info;
}
