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
        res.status(HttpStatus.OK).send(this.emailService.sendEmail(req.body.to, req.body.payload as File));
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.post('/sendDrawing', this.sendDrawing.bind(this));
    }
}
