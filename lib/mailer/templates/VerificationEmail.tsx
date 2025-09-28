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

interface VerificationEmailProps {
  name: string;
  email: string;
  verificationUrl: string;
}

export const VerificationEmail = ({
  name,
  email,
  verificationUrl,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Verify your email address to complete your ShearCraft Booking registration
    </Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={logo}>ShearCraft Booking</Heading>
          <Heading style={title}>Verify Your Email Address</Heading>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {name},</Text>

          <Text style={paragraph}>
            Thank you for signing up with ShearCraft Booking! To complete your
            registration and start booking appointments, please verify your email
            address by clicking the button below:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              Verify Email Address
            </Button>
          </Section>

          <Text style={paragraph}>
            If the button doesn&apos;t work, you can also copy and paste this link
            into your browser:
          </Text>

          <Text style={linkText}>
            <Link href={verificationUrl} style={link}>
              {verificationUrl}
            </Link>
          </Text>

          {/* Warning */}
          <Section style={warning}>
            <Text style={warningText}>
              <strong>Important:</strong> This verification link will expire in 24
              hours for security reasons. If you don&apos;t verify your email within
              this time, you&apos;ll need to request a new verification email.
            </Text>
          </Section>

          <Text style={paragraph}>Once verified, you&apos;ll be able to:</Text>
          <ul style={list}>
            <li style={listItem}>
              Book appointments with our professional stylists
            </li>
            <li style={listItem}>Manage your bookings online</li>
            <li style={listItem}>Receive appointment reminders</li>
            <li style={listItem}>Access exclusive offers and promotions</li>
          </ul>
        </Section>

        {/* Footer */}
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            If you didn&apos;t create an account with ShearCraft Booking, please
            ignore this email.
          </Text>
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
  backgroundColor: "#f8f9fa",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const logo = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#000",
  marginBottom: "10px",
  margin: "0",
};

const title = {
  fontSize: "28px",
  fontWeight: "600",
  color: "#000",
  marginBottom: "20px",
  margin: "0",
};

const content = {
  marginBottom: "30px",
};

const greeting = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#333",
  margin: "0 0 16px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#333",
  margin: "0 0 16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "20px 0",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 30px",
  border: "none",
  cursor: "pointer",
};

const linkText = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#007bff",
  margin: "0 0 16px 0",
  wordBreak: "break-all" as const,
};

const link = {
  color: "#007bff",
  textDecoration: "underline",
};

const warning = {
  backgroundColor: "#fff3cd",
  border: "1px solid #ffeaa7",
  borderRadius: "4px",
  padding: "15px",
  margin: "20px 0",
};

const warningText = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#856404",
  margin: "0",
};

const list = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#333",
  margin: "0 0 16px 0",
  paddingLeft: "20px",
};

const listItem = {
  margin: "0 0 8px 0",
};

const hr = {
  borderColor: "#e9ecef",
  margin: "40px 0 20px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#6c757d",
  margin: "0 0 8px 0",
};

export default VerificationEmail;
