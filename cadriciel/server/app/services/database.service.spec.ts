import * as assert from 'assert';
import {DatabaseService} from './databse.service';

describe('Test constructeur', () => {
    it('constructeur doit etre bien defini', (done: Mocha.Done) => {
        assert.ok(new DatabaseService());
        done();
    });
});

/*describe('#updateData()', function() {
    context('sans nom et doit exister', function(){
        it('doit retourner faux', function(){
        })
    })
}) */
