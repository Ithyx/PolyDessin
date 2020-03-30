import {assert, expect } from 'chai';
import {Drawing} from '../../../common/communication/drawing-interface';
import {DatabaseService} from './database.service';
import {Color, DrawElement} from '../../../client/src/app/services/stockage-svg/draw-element';

describe('Test constructeur database.service', () => {
    it('constructeur doit etre bien defini', (done: Mocha.Done) => {
        assert.ok(new DatabaseService());
        done();
    });
});

/*describe('#updateData devrait retourner false, si le nom de la du dessin est vide ou collection non existant', () => {

    const red: Color = {
        RGBA: [255, 255, 255, 1],
        RGBAString: ('ffffff'),
    };

    const drawing: Drawing = {
        _id: 123,
        name: '',
        height: 25,
        width: 25,
        backgroundColor: red,
        tags: [''],
        elements:,
    };

    context('nom du dessin est vide', () => {
        it('Doit retourner faux', async (done: Mocha.Done) => {
            drawing.name('');
            expect(name).to.be('');
            done();
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
