import { Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { EmailService } from '../services/email.service';
import Types from '../types';

@injectable()
export class EmailController {
    router: Router;

    constructor(@inject(Types.EmailService) private emailService: EmailService) {
        this.router = Router();
        this.configureRouter();
    }

    private async sendDrawing(req: Request, res: Response): Promise<void> {
        let data: Buffer;
        if (req.body.extension as string === 'svg') { data = Buffer.from(req.body.payload as string, 'utf-8'); } else {
            const array = (req.body.payload as string).split(',');
            data = Buffer.from(array[1], 'base64');
        }
        res.status(HttpStatus.OK).send(this.emailService.sendEmail(req.body.to as string, data,
        req.body.filename as string, req.body.extension as string));
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.post('/sendDrawing', this.sendDrawing.bind(this));
    }
}
