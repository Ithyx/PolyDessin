import { Container } from 'inversify';
import { Application } from './app';
import { DatabaseController } from './controllers/database.controller';
import { EmailController } from './controllers/email.controller';
import { Server } from './server';
import { DatabaseService } from './services/database.service';
import { EmailService } from './services/email.service';
import Types from './types';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.DatabaseController).to(DatabaseController);
container.bind(Types.DatabaseService).to(DatabaseService);

container.bind(Types.EmailController).to(EmailController);
container.bind(Types.EmailService).to(EmailService);

export { container };
