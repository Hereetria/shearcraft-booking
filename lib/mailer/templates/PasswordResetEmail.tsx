import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  name: string;
  email: string;
  resetUrl: string;
}

export const PasswordResetEmail = ({
  name,
  email,
  resetUrl,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your ShearCraft Booking password</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={logo}>ShearCraft Booking</Heading>
          <Heading style={title}>Reset Your Password</Heading>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {name},</Text>

          <Text style={paragraph}>
            We received a request to reset your password for your ShearCraft Booking
            account. If you didn&apos;t make this request, you can safely ignore this
            email.
          </Text>

          <Text style={paragraph}>
            To reset your password, click the button below:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>

          <Text style={paragraph}>
            If the button doesn&apos;t work, you can also copy and paste this link
            into your browser:
          </Text>

          <Text style={linkText}>
            <Link href={resetUrl} style={link}>
              {resetUrl}
            </Link>
          </Text>

          {/* Warning */}
          <Section style={warning}>
            <Text style={warningText}>
              <strong>Important:</strong> This password reset link will expire in 1
              hour for security reasons. If you don&apos;t reset your password within
              this time, you&apos;ll need to request a new reset link.
            </Text>
          </Section>

          <Text style={paragraph}>
            If you didn&apos;t request a password reset, please ignore this email.
            Your password will remain unchanged.
          </Text>
        </Section>

        {/* Footer */}
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>This email was sent to {email}</Text>
          <Text style={footerText}>
            © {new Date().getFullYear()} ShearCraft Booking. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  padding: "32px 24px 0",
};

const logo = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "0 0 8px",
};

const title = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 24px",
};

const content = {
  padding: "0 24px",
};

const greeting = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#1f2937",
  margin: "0 0 16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  margin: "0 0 16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#1f2937",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  border: "none",
};

const linkText = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#6b7280",
  wordBreak: "break-all" as const,
  margin: "16px 0",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};

const warning = {
  backgroundColor: "#fef3c7",
  border: "1px solid #f59e0b",
  borderRadius: "8px",
  padding: "16px",
  margin: "24px 0",
};

const warningText = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#92400e",
  margin: "0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  padding: "0 24px",
};

const footerText = {
  fontSize: "12px",
  lineHeight: "16px",
  color: "#6b7280",
  margin: "0 0 8px",
};

export default PasswordResetEmail;
