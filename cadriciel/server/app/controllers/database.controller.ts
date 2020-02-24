import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DatabaseService } from '../services/databse.service';
import Types from '../types';

@injectable()
export class DatabaseController {
    router: Router;

    constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter() {
        this.router = Router();
        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.SendData();
        })
    }
}
