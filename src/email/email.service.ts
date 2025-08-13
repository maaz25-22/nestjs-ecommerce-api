import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<boolean>('email.secure'),
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.pass'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string, firstName: string): Promise<void> {
    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/verify-email?token=${token}`;

    const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM') || 'noreply@ecommerce.com',
        to: email,
        subject: 'Email Verification - E-Commerce',
        html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
           <h2 style="color: #333;">Hi ${firstName}!</h2>
             <p>To verify your E-Commerce account, please click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify My Email Address
        </a>
      </div>
      <p>Or copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
      <p>This link will be valid for 24 hours.</p>
      <p>If you did not request this action, you can safely ignore this email.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">This email was sent automatically.</p>
      </div>`,
     };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send verification email to ${email}:`, error);
      throw new Error('Email gönderilemedi');
    }
  }

  async sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/reset-password?token=${token}`;

    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM') || 'noreply@ecommerce.com',
      to: email,
      subject: 'Password Reset - E-Commerce',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello ${firstName}!</h2>
        <p>To reset your password, please click the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset My Password
      </a>
     </div>
     <p>Or copy and paste the following link into your browser:</p>
     <p style="word-break: break-all; color: #666;">${resetUrl}</p>
     <p>This link will be valid for 1 hour.</p>
     <p>If you did not request this action, you can safely ignore this email.</p>
     <hr>
     <p style="color: #666; font-size: 12px;">This email was sent automatically.</p>
    </div>`
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send password reset email to ${email}:`, error);
      throw new Error('Email gönderilemedi');
    }
  }
}
