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
            if (req.query.tags) {
                res.send(await this.databaseService.getDrawingWithTags(JSON.parse(decodeURIComponent(req.query.tags))));
            } else {
                res.send(await this.databaseService.getDrawings());
            }
        });
        this.router.post('/saveDrawing', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.databaseService.updateData(req.body);
                res.status(HttpStatus.OK).end();
            } catch (err) {
                res.status(HttpStatus.BAD_REQUEST).send(err);
            }
        });
        this.router.delete('/deleteDrawing', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.databaseService.deleteData(req.query.id);
                res.status(HttpStatus.OK).end();
            } catch (err) {
                res.status(HttpStatus.BAD_REQUEST).send(err);
            }
        });
    }
}
