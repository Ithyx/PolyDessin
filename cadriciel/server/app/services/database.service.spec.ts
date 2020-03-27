import {assert, expect } from 'chai';
import {Drawing} from '../../../common/communication/DrawingInterface';
import {DatabaseService} from './database.service';

describe('Test constructeur database.service', () => {
    it('constructeur doit etre bien defini', (done: Mocha.Done) => {
        assert.ok(new DatabaseService());
        done();
    });
});

/*describe('#updateData devrait retourner false, si le nom de la du dessin est vide ou collection non existant', () => {

    context('nom du dessin est vide', () => {
        it('Doit retourner faux', () => { 

         });
    });

    context('collection nexiste pas', () => {
        it('Doit retourner faux', () => {
        });
    });

    context('nom du dessin nest pas vide', () =>{
        it('Doit retourner vrai', () =>{

        });
    });
}); */
