import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { VerificationEmail } from "@/lib/mailer/templates/VerificationEmail"
import { PasswordResetEmail } from "@/lib/mailer/templates/PasswordResetEmail"
import { getEnvVar } from "@/lib/getEnvVar"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

const transporter = nodemailer.createTransport({
  host: getEnvVar("SMTP_HOST"),
  port: parseInt(getEnvVar("SMTP_PORT")),
  secure: getEnvVar("SMTP_SECURE") === "true",
  auth: {
    user: getEnvVar("SMTP_USER"),
    pass: getEnvVar("SMTP_PASS"),
  },
});

export const mailerService = {
  async sendEmail({ to, subject, html, text }: EmailOptions): Promise<void> {
    try {
      await transporter.sendMail({
        from: getEnvVar("SMTP_FROM") || getEnvVar("SMTP_USER"),
        to,
        subject,
        html,
        text,
      })
    } catch (error) {
      console.error("Failed to send email:", error)
      throw new Error("Failed to send email")
    }
  },

  async sendVerificationEmail(
    email: string,
    name: string,
    verificationToken: string
  ): Promise<void> {
    const verificationUrl = `${getEnvVar("NEXTAUTH_URL")}/api/auth/verify-email?token=${encodeURIComponent(
      verificationToken
    )}`

    const html = await render(
      VerificationEmail({
        name,
        email,
        verificationUrl,
      })
    )

    const text = await render(
      VerificationEmail({
        name,
        email,
        verificationUrl,
      }),
      { plainText: true }
    )

    await this.sendEmail({
      to: email,
      subject: "Verify your email address - ShearCraft Booking",
      html,
      text,
    })
  },

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = `${getEnvVar("NEXTAUTH_URL")}/reset-password?token=${encodeURIComponent(
      resetToken
    )}`

    const html = await render(
      PasswordResetEmail({
        name,
        email,
        resetUrl,
      })
    )

    const text = await render(
      PasswordResetEmail({
        name,
        email,
        resetUrl,
      }),
      { plainText: true }
    )

    await this.sendEmail({
      to: email,
      subject: "Reset your password - ShearCraft Booking",
      html,
      text,
    })
  },
}
