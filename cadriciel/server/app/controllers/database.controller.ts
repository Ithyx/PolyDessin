import { NextFunction, Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { DatabaseService } from '../services/databse.service';
import Types from '../types';

const ERROR_STRING = 'ERREUR: impossible d\'envoyer le dessin au serveur!';
const SUCCESS_STRING = 'Dessin envoyé au serveur avec succès';

@injectable()
export class DatabaseController {
    router: Router;

    constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.get('/listDrawings', async (req: Request, res: Response, next: NextFunction) => {
            res.send(await this.databaseService.getDrawings());
        });
        this.router.post('/addNewDrawing', async (req: Request, res: Response, next: NextFunction) => {
            try {
                this.databaseService.SendData(req.body);
                res.status(HttpStatus.OK).send(SUCCESS_STRING);
            } catch {
                console.log('ERROR DETECTED');
                res.status(HttpStatus.BAD_REQUEST).send(ERROR_STRING);
            }
        });
    }
}
