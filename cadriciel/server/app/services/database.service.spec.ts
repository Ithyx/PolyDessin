// tslint:disable: no-magic-numbers
import {assert, expect } from 'chai';
import {Color, DrawElement} from '../../../client/src/app/services/stockage-svg/draw-element';
import {Drawing} from '../../../common/communication/drawing-interface';
import {DatabaseService} from './database.service';

describe('Test constructeur database.service', () => {
    it('constructeur doit etre bien defini', (done: Mocha.Done) => {
        assert.ok(new DatabaseService());
        done();
    });
});

describe('#updateData devrait retourner false, si le nom de la du dessin est vide ou collection non existant', () => {

    let black: Color;
    beforeEach(() => black = {
        RGBA: [255, 255, 255, 1],
        RGBAString: ('ffffff'),
    });

    let element: DrawElement;
    beforeEach(() => element = {
        svg: '',
        svgHtml: '',
        points: [{x: 90, y: 90}, {x: 76, y: 89 }],
        isSelected: false,
        erasingEvidence: false,
        erasingColor: {RGBA: [0, 0, 0, 1], RGBAString: ''},
        pointMin: {x: 0, y: 0},
        pointMax: {x: 0, y: 0},
        translate: {x: 0, y: 0},
        draw: () => { return; },
        updatePosition: () => { return; },
        updatePositionMouse: () => { return; },
        updateParameters: () => { return; },
        translateAllPoints: () => { return; }
      }
      );

    let drawing: Drawing;
    beforeEach(() => drawing = {
        _id: 123,
        name: '',
        height: 25,
        width: 25,
        backgroundColor: black,
        tags: [''],
        elements: element[''],
    });

    context('nom du dessin est vide', () => {
        it('Doit retourner faux', async () => {
            drawing.name = ('');
            expect(drawing.name).to.equal('');
         });
    });

   /*context('collection nexiste pas', () => {
        it('Doit retourner faux', () => {
        });
    }); */

    context('nom du dessin nest pas vide', () => {
        it('Doit retourner vrai', async () => {
            drawing.name = ('test1');
            expect(drawing.name).to.equal('test1');
        });
    });
});
