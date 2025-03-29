import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { PRIVATE_EMAIL_USER, PRIVATE_EMAIL_PASS, PRIVATE_EMAIL_FROM } from '$env/static/private';

// First, let's test the environment variables
console.log('Email Configuration Check:', {
  hasUser: !!PRIVATE_EMAIL_USER,
  hasPass: !!PRIVATE_EMAIL_PASS,
  hasFrom: !!PRIVATE_EMAIL_FROM,
  userEmail: PRIVATE_EMAIL_USER, // Log the actual email for verification
});

// Add more detailed logging
console.log('Email Configuration:', {
    user: PRIVATE_EMAIL_USER,
    from: PRIVATE_EMAIL_FROM,
    hasPassword: !!PRIVATE_EMAIL_PASS
});

// Create transporter with the working configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: PRIVATE_EMAIL_USER,
        pass: PRIVATE_EMAIL_PASS
    }
});

// Store verification codes in memory
const verificationCodes = new Map();

export async function POST({ request }) {
    try {
        const { email, code } = await request.json();
        console.log('Sending verification code to:', email);

        // Store the code with timestamp
        verificationCodes.set(email, {
            code,
            timestamp: Date.now()
        });

        const mailOptions = {
            from: PRIVATE_EMAIL_FROM,
            to: email,
            subject: 'Verify Your IpsePay Account',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to IpsePay - Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f8fafc;">
    <table role="presentation" style="width: 100%; border: none; border-spacing: 0; background-color: #f8fafc; padding: 40px 20px;">
        <tr>
            <td align="center" style="padding: 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; border: none; border-spacing: 0; text-align: left; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    <!-- Modern Header -->
                    <tr>
                        <td style="padding: 48px 48px 40px; text-align: center; background: linear-gradient(to right, #605bff, #8b7aff);">
                            <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                                IPSE<span style="font-weight: 400;">PAY</span>
                            </h1>
                            <p style="margin: 16px 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.9);">
                                Secure Payment Solutions
                            </p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 48px;">
                            <div style="text-align: center; margin-bottom: 40px;">
                                <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #1e293b; letter-spacing: -0.5px;">
                                    Complete Your Verification
                                </h2>
                                <p style="margin: 0; font-size: 16px; line-height: 24px; color: #64748b;">
                                    Enter this verification code to get started with IpsePay
                                </p>
                            </div>

                            <!-- Modern Code Display -->
                            <div style="margin: 32px 0; padding: 32px; background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 12px; text-align: center;">
                                <p style="margin: 0 0 16px; text-transform: uppercase; font-size: 13px; font-weight: 600; letter-spacing: 2px; color: #64748b;">
                                    Your Verification Code
                                </p>
                                <div style="font-family: 'SF Mono', SFMono-Regular, Consolas, monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #605bff;">
                                    ${code}
                                </div>
                                <p style="margin: 16px 0 0; font-size: 14px; color: #94a3b8;">
                                    Code expires in 3 minutes
                                </p>
                            </div>

                            <!-- Security Notice -->
                            <div style="margin-top: 32px; padding: 24px; background-color: #f1f5f9; border-left: 4px solid #605bff; border-radius: 8px;">
                                <div style="display: flex; align-items: center;">
                                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #475569;">
                                        <strong style="color: #1e293b;">Security Notice:</strong><br>
                                        Never share this code with anyone. IpsePay representatives will never ask for your verification code.
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Modern Footer -->
                    <tr>
                        <td style="padding: 40px 48px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                            <table role="presentation" style="width: 100%; border: none; border-spacing: 0;">
                                <tr>
                                    <td style="padding: 0; text-align: center;">
                                        <div style="margin-bottom: 24px;">
                                            <a href="https://ipsepay.com/privacy" style="display: inline-block; padding: 8px 16px; color: #605bff; text-decoration: none; font-size: 14px; font-weight: 500;">Privacy</a>
                                            <a href="https://ipsepay.com/terms" style="display: inline-block; padding: 8px 16px; color: #605bff; text-decoration: none; font-size: 14px; font-weight: 500;">Terms</a>
                                            <a href="https://ipsepay.com/contact" style="display: inline-block; padding: 8px 16px; color: #605bff; text-decoration: none; font-size: 14px; font-weight: 500;">Support</a>
                                        </div>
                                        <p style="margin: 0 0 8px; font-size: 14px; color: #64748b; font-weight: 500;">
                                            © ${new Date().getFullYear()} IpsePay. All rights reserved.
                                        </p>
                                        <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 20px;">
                                            This is an automated message. Please do not reply to this email.<br>
                                            IpsePay Inc. • Baghdad, Iraq
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Additional Footer Text -->
                <table role="presentation" style="width: 100%; max-width: 600px; border: none; border-spacing: 0; text-align: center; margin-top: 24px;">
                    <tr>
                        <td style="padding: 0;">
                            <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 20px;">
                                Please add <span style="color: #1e293b; font-weight: 500;">${PRIVATE_EMAIL_FROM}</span> to your address book<br>
                                to ensure our emails reach your inbox.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', result.messageId);

        return json({
            success: true,
            messageId: result.messageId,
            message: 'Verification code sent successfully'
        });

    } catch (error) {
        console.error('Failed to send verification email:', error);
        return json({
            success: false,
            error: 'Failed to send verification code',
            details: error.message
        }, { status: 500 });
    }
}

// Verification endpoint
export async function PUT({ request }) {
    try {
        const { email, code } = await request.json();
        console.log('Verifying code for:', email);

        const storedData = verificationCodes.get(email);
        
        if (!storedData) {
            return json({ 
                success: false,
                error: 'No verification code found. Please request a new code.' 
            }, { status: 400 });
        }

        // Check if code is expired (3 minutes)
        if (Date.now() - storedData.timestamp > 180000) {
            verificationCodes.delete(email);
            return json({ 
                success: false,
                error: 'Verification code has expired. Please request a new code.' 
            }, { status: 400 });
        }

        // Verify code
        if (storedData.code !== code) {
            return json({ 
                success: false,
                error: 'Invalid verification code.' 
            }, { status: 400 });
        }

        // Code is valid - remove it from storage
        verificationCodes.delete(email);

        return json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error('Verification error:', error);
        return json({
            success: false,
            error: 'Verification failed',
            details: error.message
        }, { status: 500 });
    }
}

// Add this test function
async function testZohoConnection() {
    try {
        console.log('Testing Zoho Mail configuration...');
        console.log('Email User:', PRIVATE_EMAIL_USER);
        console.log('Email From:', PRIVATE_EMAIL_FROM);
        console.log('Password exists:', !!PRIVATE_EMAIL_PASS);

        const testTransporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: PRIVATE_EMAIL_USER,
                pass: PRIVATE_EMAIL_PASS
            },
            debug: true // Enable debug logging
        });

        console.log('Testing SMTP connection...');
        const verifyResult = await testTransporter.verify();
        console.log('SMTP Verification result:', verifyResult);
        
        return {
            success: true,
            message: 'Zoho Mail configuration is valid'
        };
    } catch (error) {
        console.error('Zoho Mail configuration error:', {
            name: error.name,
            message: error.message,
            code: error.code,
            command: error.command
        });
        return {
            success: false,
            error: error.message,
            details: {
                name: error.name,
                code: error.code,
                command: error.command
            }
        };
    }
}

// Try this alternative configuration if the current one isn't working
const alternativeTransporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false, // Try false for TLS
    auth: {
        user: PRIVATE_EMAIL_USER,
        pass: PRIVATE_EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Only use this in development
    }
});

// Test both configurations
async function testBothConfigurations() {
    try {
        console.log('Testing SSL configuration (port 465)...');
        const sslResult = await testZohoConnection();
        console.log('SSL test result:', sslResult);

        console.log('Testing TLS configuration (port 587)...');
        const tlsResult = await alternativeTransporter.verify();
        console.log('TLS test result:', tlsResult);

        return {
            ssl: sslResult,
            tls: tlsResult
        };
    } catch (error) {
        console.error('Configuration test error:', error);
        return {
            error: error.message,
            details: {
                name: error.name,
                code: error.code
            }
        };
    }
}

// Update the GET endpoint to test both configurations
export async function GET() {
    const testResults = await testBothConfigurations();
    return json(testResults);
} 