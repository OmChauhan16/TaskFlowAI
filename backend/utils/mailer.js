// Backend: utils/mailer.js
import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
    // For Gmail
    if (process.env.EMAIL_SERVICE === 'gmail') {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD, // App Password for Gmail
            },
        });
    }

    // For other SMTP services
    // return nodemailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: Number(process.env.SMTP_PORT),
    //     secure: process.env.SMTP_SECURE === 'true', // true for 465
    //     auth: {
    //         user: process.env.SMTP_USER,
    //         pass: process.env.SMTP_PASSWORD,
    //     },
    // });
};

// Send OTP email
export const sendOTPEmail = async (email, name, otp) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.APP_NAME || 'TaskFlow AI'}" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verify Your Email - OTP Code',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #f9fafb;
            border-radius: 10px;
            padding: 30px;
            margin: 20px 0;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px 10px 0 0;
            color: white;
          }
          .otp-box {
            background: white;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
            margin: 10px 0;
          }
          .info-text {
            color: #666;
            font-size: 14px;
            margin: 15px 0;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📧 Email Verification</h1>
        </div>
        <div class="container">
          <h2>Hello ${name}! 👋</h2>
          <p>Thank you for registering with <strong>${process.env.APP_NAME || 'TaskFlow AI'}</strong>!</p>
          <p>To complete your registration, please use the following One-Time Password (OTP):</p>

          <div class="otp-box">
            <div class="info-text">Your OTP Code</div>
            <div class="otp-code">${otp}</div>
            <div class="info-text">Valid for 10 minutes</div>
          </div>

          <p>Enter this code in the registration form to verify your email address.</p>

          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul>
              <li>Never share this OTP with anyone</li>
              <li>This code expires in 10 minutes</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'TaskFlow AI'}</p>
        </div>
      </body>
      </html>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send OTP email');
    }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.APP_NAME || 'TaskFlow AI'}" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Welcome to TaskFlow AI! 🎉',
        html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <h1>🎉 Welcome to TaskFlow AI!</h1>
        <p>Hello ${name},</p>
        <p>Your account has been successfully created.</p>
        <a href="${process.env.CLIENT_URL}/dashboard">Get Started →</a>
      </body>
      </html>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent to:', email);
    } catch (error) {
        console.error('Welcome email error:', error);
    }
};
