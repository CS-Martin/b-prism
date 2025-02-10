export const EMAIL_TEMPLATES = {
    forgotPassword: (userName: string, code: string) => `
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
                    .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
                    .code-box { 
                        display: block; font-size: 28px; font-weight: bold; 
                        text-align: center; 
                        padding: 12px; border: 2px dashed 
                        margin: 20px auto; width: fit-content;
                        border-radius: 12px;
                    }
                    .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Password Reset Request</h2>
                    <p>Hello <strong>${userName}</strong>,</p>
                    <p>We received a request to reset the password for your HARIBON account.</p>
                    <p>Use the verification code below to proceed:</p>

                    <div class="code-box">${code}</div>

                    <p><strong>Important:</strong> This code will expire in **3 minutes** for security reasons.</p>
                    <p>If you did not request this, please **change your account password immediately** or contact our support team.</p>

                    <p>Best Regards, <br> <strong>The HARIBON Team</strong></p>

                    <hr>
                    <p class="footer">
                        This is an automated email from HARIBON. Please do not reply.  
                        If you need help, visit our support center.
                    </p>
                </div>
            </body>
        </html>
    `,

    resetPasswordAlert: (userName: string) => `
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; color: #333; }
                    .container { max-width: 600px; margin: auto; padding: 20px; }
                    .button { 
                        display: inline-block; padding: 14px 24px; 
                        background-color: #007bff; color: white; 
                        text-decoration: none; font-size: 16px; 
                        border-radius: 5px; font-weight: bold;
                    }
                    .footer { margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Password Reset Request</h2>
                    <p>Hello <strong>${userName}</strong>,</p>
                    <p>We received a request to reset the password for your HARIBON account.</p>
                    <p>To proceed, please click the button below:</p>

                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${process.env['NEXTAUTH_URL']}" class="button">Reset Password</a>
                    </div>

                    <p><strong>Security Notice:</strong> This reset link is valid for **only 30 minutes**. 
                    If you didn’t request this, please ignore this email, or contact our support immediately.</p>

                    <p>Best Regards, <br> <strong>The HARIBON Team</strong></p>

                    <hr>
                    <p class="footer">
                        This email was sent to you because a password reset request was made for your HARIBON account.
                        If this wasn't you, we recommend changing your password immediately.
                    </p>
                </div>
            </body>
        </html>
    `,
};
