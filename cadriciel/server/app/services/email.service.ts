import { Request } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

import * as http from 'http';

export const MAIL_API_URL = 'https://log2990.step.polymtl.ca/email';

@injectable()
export class EmailService {

    sendEmail(request: Request): void {
        const options = {
            url: MAIL_API_URL,
            headers: {
                'X-Team-Key': process.env.MAIL_API_KEY,
                'Content-Type': 'multipart/form-data;'
            }
        };
        http.request(options);
    }
}
