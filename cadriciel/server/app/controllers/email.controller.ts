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
        // on supprime le warning pour l'instant, pour éviter les erreurs de retour à la ligne et de tabulation
        // (source: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript)
        // tslint:disable-next-line: max-line-length
        const emailChecker = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailChecker.test(req.body.to as string)) {
            res.status(HttpStatus.BAD_REQUEST).send('Mauvaise Adresse email!');
            return;
        }
        let data: Buffer;
        if (req.body.extension as string === 'svg') { data = Buffer.from(req.body.payload as string, 'utf-8'); } else {
            const array = (req.body.payload as string).split(',');
            data = Buffer.from(array[1], 'base64');
        }
        res
        .status(await this.emailService.sendEmail(req.body.to as string, data, req.body.filename as string, req.body.extension as string))
        .end();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.post('/sendDrawing', this.sendDrawing.bind(this));
    }
}
