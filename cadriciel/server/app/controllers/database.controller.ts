import { NextFunction, Request, Response, Router } from 'express';
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

    private configureRouter() {
        this.router = Router();
        this.router.get('/listDrawings', async (req: Request, res: Response, next: NextFunction) => {
            res.send(await this.databaseService.getDrawings());
        })
        this.router.post('/addNewDrawing', async (req: Request, res: Response, next: NextFunction) => {
            try {
                this.databaseService.SendData(req.body);
                res.send(SUCCESS_STRING);
            } catch {
                res.status(400).send(ERROR_STRING)
            }
        })
    }
}
