import * as assert from 'assert';
import { DatabaseService } from '../services/database.service';
import { DatabaseController } from './database.controller';

// tslint:disable: no-string-literal

describe('Test constructeur database.controller', () => {
    it('constructeur doit etre bien defini', (done: Mocha.Done) => {
        assert.ok(new DatabaseService());
        done();
    });

    it('constructeur devrait appeler configureRouter', () => {
        const controller: DatabaseController = new DatabaseController(new DatabaseService());
        assert.call(controller, controller['configureRouter']);
    });
});

describe('Tests configureRouter database.controller', () => {
    // TODO
});
