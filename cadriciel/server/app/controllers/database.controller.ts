import { NextFunction, Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { DatabaseService } from '../services/databse.service';
import Types from '../types';

// const ERROR_STRING = 'ERREUR: impossible d\'envoyer le dessin au serveur!';
// const SUCCESS_STRING = 'Dessin envoyé au serveur avec succès';

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
                const id = await this.databaseService.sendData(req.body);
                console.log('id: ', id);
                res.status(HttpStatus.OK).send(id);
            } catch (err) {
                console.log('ERROR DETECTED');
                res.status(HttpStatus.BAD_REQUEST).send(err);
            }
        });
        this.router.put('/updateDrawing', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = await this.databaseService.updateData(req.body);
                console.log('id: ', id);
                res.status(HttpStatus.OK).send(id);
            } catch (err) {
                console.log('ERROR DETECTED', err);
                res.status(HttpStatus.BAD_REQUEST).send(err);
            }
        });
    }
}
