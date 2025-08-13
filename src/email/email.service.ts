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
      subject: 'Email Doğrulama - E-Ticaret',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Merhaba ${firstName}!</h2>
          <p>E-Ticaret hesabınızı doğrulamak için aşağıdaki butona tıklayın:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Email Adresimi Doğrula
            </a>
          </div>
          <p>Veya aşağıdaki linki tarayıcınıza kopyalayın:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>Bu link 24 saat geçerlidir.</p>
          <p>Eğer bu işlemi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Bu email otomatik olarak gönderilmiştir.</p>
        </div>
      `,
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
      subject: 'Şifre Sıfırlama - E-Ticaret',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Merhaba ${firstName}!</h2>
          <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Şifremi Sıfırla
            </a>
          </div>
          <p>Veya aşağıdaki linki tarayıcınıza kopyalayın:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>Bu link 1 saat geçerlidir.</p>
          <p>Eğer bu işlemi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Bu email otomatik olarak gönderilmiştir.</p>
        </div>
      `,
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
