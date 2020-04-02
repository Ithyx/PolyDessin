// tslint:disable: no-magic-numbers
import {assert, expect } from 'chai';
import {Color} from '../../../client/src/app/services/color/color';
import {DrawElement} from '../../../client/src/app/services/stockage-svg/draw-element';
import {Drawing} from '../../../common/communication/drawing-interface';
import {DatabaseService} from './database.service';

describe('Test constructeur database.service', () => {
    it('constructeur doit etre bien defini', (done: Mocha.Done) => {
        assert.ok(new DatabaseService());
        done();
    });
});

/*describe('#updateData devrait retourner false, si le nom de la du dessin est vide ou collection non existant', () => {

    var test = ('../databaseService');
    let collection: Collection<Drawing>;

    let black: Color;
    beforeEach(() => black = {
        RGBA: [255, 255, 255, 1],
        RGBAString: ('ffffff'),
    });

    const element: DrawElement = {
    svg: '',
    svgHtml: '',
    trueType: 0,
    points: [],
    isSelected: false,
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 0], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    translate: {x: 0, y: 0},
    draw: () => { return; },
    updatePosition: () => { return; },
    updatePositionMouse: () => { return; },
    updateParameters: () => { return; },
    translateAllPoints: () => { return; }
    };

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
            assert.equal(test(), 1);
         });
    });

    context('collection nexiste pas', () => {
        it('Doit retourner faux', () => {
            collection.insertOne(drawing);
            expect(collection).to.be.empty('');
        });
    });

    context('nom du dessin nest pas vide', () => {
        it('Doit retourner vrai', async () => {
            drawing.name = ('test1');
            expect(drawing.name).to.equal('test1');
        });
    });
}); */

describe('updateData', () => {

    let test: DatabaseService;
    let black: Color;
    beforeEach(() => black = {
        RGBA: [255, 255, 255, 1],
        RGBAString: ('ffffff'),
    });

    const element: DrawElement = {
        svg: '',
        svgHtml: '',
        trueType: 0,
        points: [],
        isSelected: false,
        erasingEvidence: false,
        erasingColor: {RGBA: [0, 0, 0, 0], RGBAString: ''},
        pointMin: {x: 0, y: 0},
        pointMax: {x: 0, y: 0},
        translate: {x: 0, y: 0},
        draw: () => { return; },
        updatePosition: () => { return; },
        updatePositionMouse: () => { return; },
        updateParameters: () => { return; },
        translateAllPoints: () => { return; }
        };

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

    it('Devrait retourner faux lorsque nom est vide', () => {
        drawing.name = ('');
        const returnfalse = test.updateData(drawing) ;
        expect(returnfalse).to.equal(false);
    });
});
