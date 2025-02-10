import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerServiceLibService {
    private transporter: nodemailer.Transporter;
}
