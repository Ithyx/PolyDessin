import * as assert from 'assert';
import { DatabaseService } from '../services/database.service';
import { DatabaseController } from './database.controller';

// tslint:disable: no-string-literal

describe('Tests de database.controller', () => {

    context('constructor', () => {
        const controller: DatabaseController = new DatabaseController(new DatabaseService());

        after(() => {
            controller['databaseService'].mongoClient.close();
        });

        it('constructeur devrait appeler configureRouter', (done: Mocha.Done) => {
            assert.call(controller, controller['configureRouter']);
            done();
        });
    });

    context('configureRouter', () => {
        // TODO
    });

});
