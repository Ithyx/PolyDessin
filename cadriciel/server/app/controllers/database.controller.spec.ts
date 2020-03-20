import * as assert from 'assert';
import {DatabaseService} from '../services/database.service';

describe('Test constructeur database.controller', () => {
    it('constructeur doit etre bien defini', (done: Mocha.Done) => {
        assert.ok(new DatabaseService());
        done();
    });
});