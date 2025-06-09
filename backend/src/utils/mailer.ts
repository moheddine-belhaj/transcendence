import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Configure email transporter with better error handling
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('Error with mail transporter:', error);
  } else {
    console.log('Mail transporter is ready to send emails');
  }
});

interface SendVerificationEmailParams {
  email: string;
  name: string;
  verificationToken: string;
}

export async function sendVerificationEmail({
  email,
  name,
  verificationToken
}: SendVerificationEmailParams): Promise<void> {
  try {
    const verificationUrl = `${process.env.BASE_URL}/api/users/verify-email?token=${verificationToken}`;
    
    await transporter.sendMail({
      from:"Transcendence Team ",
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export function generateVerificationToken(): string {
  return uuidv4();
}