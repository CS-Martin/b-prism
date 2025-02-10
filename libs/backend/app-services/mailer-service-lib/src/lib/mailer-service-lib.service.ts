import { MailerMongodbLibService } from '@b-prism/mailer-mongodb-lib';
import { MailerDto, UserDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailType } from '@b-prism/types';
import { EMAIL_TEMPLATES } from '@b-prism/lib-utils';

@Injectable()
export class MailerServiceLibService {
    private readonly logger = new Logger(MailerServiceLibService.name);

    private transporter: nodemailer.Transporter;

    constructor(private readonly mailerMongodbLibService: MailerMongodbLibService) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            service: 'gmail',
            auth: {
                user: process.env['NEXT_PUBLIC_NODEMAILER_USER'],
                pass: process.env['NEXT_PUBLIC_NODEMAILER_PASS'],
            },
        });
    }

    async sendVerificationCode(userDto: UserDto, mailerDto: MailerDto) {
        this.logger.log('Sending verification code:', mailerDto);

        try {
            await this.transporter.sendMail({
                from: 'projectharibon@gmail.com',
                to: userDto.email,
                subject: 'Reset Your HARIBON Account Password',
                html: EMAIL_TEMPLATES.forgotPassword(userDto.given_name + ' ' + userDto.family_name, mailerDto.code),
            });

            this.logger.log('Verification code sent successfully!');
        } catch (error) {
            console.error('Error sending email', error);
            throw new Error('Failed to send email');
        }
    }

    async sendResetPasswordAlert(userDto: UserDto) {
        this.logger.log('Sending reset password alert:', userDto.given_name + ' ' + userDto.family_name);

        try {
            await this.transporter.sendMail({
                from: 'projectharibon@gmail.com',
                to: userDto.email,
                subject: 'HARIBON Account Password Reset Alert',
                html: EMAIL_TEMPLATES.resetPasswordAlert(userDto.given_name + ' ' + userDto.family_name),
            });

            this.logger.log('Reset password alert sent successfully!');
        } catch (error) {
            console.error('Failed to reset password alert email', error);

            throw new Error('Failed to reset password alert email');
        }
    }
}
