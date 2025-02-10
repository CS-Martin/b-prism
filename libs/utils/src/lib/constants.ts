export const EMAIL_TEMPLATES = {
    forgotPassword: (userName: string, code: string) => `
        <html>
            <body>
                <h2>Password Reset Request</h2>
                <p>Hello <strong>${userName}</strong>,</p>
                <p>You recently requested to reset your password for your HARIBON account.</p>
                <p>Use the verification code below to proceed:</p>
                <h3 style="color: #007bff; text-align: center; font-size: 24px;">${code}</h3>
                <p><strong>Note:</strong> This code will expire in 3 minutes.</p>
                <p>If you did not request this, please change your account password immediately.</p>
                <p>Best Regards, <br> <strong>HARIBON Team</strong></p>
            </body>
        </html>
    `,

    resetPasswordAlert: (userName: string) => `
        <html>
            <body>
                <h2>Reset Your Password</h2>
                <p>Hello <strong>${userName}</strong>,</p>
                <p>We received a request to reset your password for your account.</p>
                <p>Please click the button below to set a new password:</p>
                <div style="text-align: center;">
                    <a href="${process.env['NEXTAUTH_URL']}" 
                        style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                        color: white; text-decoration: none; font-size: 18px; border-radius: 5px;">
                        Reset Password
                    </a>
                </div>
                <p>If you didn’t request this, please ignore this email.</p>
                <p>Best Regards, <br> <strong>HARIBON Team</strong></p>
            </body>
        </html>
    `,
};
