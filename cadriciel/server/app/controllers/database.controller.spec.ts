import * as assert from 'assert';
import { DatabaseService } from '../services/database.service';
import { DatabaseController } from './database.controller';

// tslint:disable: no-string-literal

describe('Tests de database.controller', () => {
    let controller: DatabaseController;

    before(() => {
        controller = new DatabaseController(new DatabaseService());
    });

    after(async () => {
        await controller['databaseService'].mongoClient.close();
    });

    context('constructor', () => {

        it('constructeur devrait appeler configureRouter', (done: Mocha.Done) => {
            assert.call(controller, controller['configureRouter']);
            done();
        });
    });

    context('configureRouter', () => {
        // TODO
    });

});
