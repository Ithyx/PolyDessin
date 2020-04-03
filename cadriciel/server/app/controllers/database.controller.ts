import { Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { DatabaseService } from '../services/database.service';
import Types from '../types';

@injectable()
export class DatabaseController {
    router: Router;

    constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) {
        this.router = Router();
        this.configureRouter();
    }

    private async listDrawingCallback(req: Request, res: Response): Promise<void> {
        if (req.query.tags) {
            res.send(await this.databaseService.getDrawingWithTags(JSON.parse(decodeURIComponent(req.query.tags))));
        } else {
            res.send(await this.databaseService.getDrawings());
        }
    }

    private async saveDrawingCallback(req: Request, res: Response): Promise<void> {
        try {
            if ( await this.databaseService.updateData(req.body)) {
                res.status(HttpStatus.OK).end();
            } else {
                res.status(HttpStatus.BAD_REQUEST).end();
            }
        } catch (err) {
            res.status(HttpStatus.BAD_REQUEST).send(err);
        }
    }

    private async deleteDrawingCallback(req: Request, res: Response): Promise<void> {
        try {
            await this.databaseService.deleteData(req.query.id);
            res.status(HttpStatus.OK).end();
        } catch (err) {
            res.status(HttpStatus.BAD_REQUEST).send(err);
        }
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.get('/listDrawings', this.listDrawingCallback.bind(this));
        this.router.post('/saveDrawing', this.saveDrawingCallback.bind(this));
        this.router.delete('/deleteDrawing', this.deleteDrawingCallback.bind(this));
    }
}
