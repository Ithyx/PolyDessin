import * as assert from 'assert';
import {DatabaseService} from './databse.service';

describe('Test constructeur', () =>{
    it('constructeur doit etre bien defini', (done: Mocha.Done) => {
        assert.ok(new DatabaseService());
        done();
    });
});
