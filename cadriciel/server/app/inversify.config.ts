import { Container } from 'inversify';
import { Application } from './app';
import { DatabaseController } from './controllers/database.controller';
import { DateController } from './controllers/date.controller';
import { IndexController } from './controllers/index.controller';
import { Server } from './server';
import { DatabaseService } from './services/databse.service';
import { DateService } from './services/date.service';
import { IndexService } from './services/index.service';
import Types from './types';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.IndexController).to(IndexController);
container.bind(Types.IndexService).to(IndexService);

container.bind(Types.DateController).to(DateController);
container.bind(Types.DateService).to(DateService);

container.bind(Types.DatabaseController).to(DatabaseController);
container.bind(Types.DatabaseService).to(DatabaseService);

export { container };
