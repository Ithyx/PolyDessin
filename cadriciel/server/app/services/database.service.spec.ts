// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
import {assert, expect } from 'chai';
import {Collection, Cursor, MongoClient} from 'mongodb';
import {Color} from '../../../client/src/app/services/color/color';
import {DrawElement} from '../../../client/src/app/services/stockage-svg/draw-element/draw-element';
import {Drawing} from '../../../common/communication/drawing-interface';
import {DatabaseService} from './database.service';

import * as sinon from 'sinon';

describe('Tests de database.service', () => {
    const DATABASE_URL = 'mongodb+srv://PolyDessin:log2990@polydessin-zhlk9.mongodb.net/test?retryWrites=true&w=majority';
    const DATABASE_NAME = 'polydessinDB';
    const DATABASE_COLLECTION = 'dessin';
    const sinonSandbox = sinon.createSandbox();

    let test: DatabaseService;
    let dbClient: MongoClient;
    let collection: Collection<Drawing>;

    let black: Color;

    let drawing: Drawing;

    before(async () => {
        test = new DatabaseService();
        dbClient = new MongoClient(DATABASE_URL, {useUnifiedTopology : true});
        await test.mongoClient.close();
        await dbClient.connect();
        collection = dbClient.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
    });

    beforeEach(() => {
        sinonSandbox.restore();
    });

    beforeEach(() => drawing = {
        _id: 123,
        name: '123',
        height: 25,
        width: 25,
        backgroundColor: black,
        tags: [''],
        elements: element[''],
    });
    beforeEach(() => {
        test.collection = collection;
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

    beforeEach(() => black = {
        RGBA: [255, 255, 255, 1],
        RGBAString: ('ffffff'),
    });

    after(async () => {
        await dbClient.close();
    });

    context('constructor', () => {
        it('constructeur doit etre bien defini', (done: Mocha.Done) => {
            assert.ok(new DatabaseService());
            done();
        });
    });

    context('getDrawing', () => {

        it('Si la collection nexiste pas elle retourne un array vide', async () => {
            delete test.collection;
            const returnArray = await test.getDrawingWithTags(drawing['']);
            expect(returnArray).to.deep.equal([]);
            test.collection = dbClient.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
        });

        it('la methode doit bien retrouver larray', () => {
            const spy = sinonSandbox.stub(collection, 'find');
            test.getDrawings();
            sinonSandbox.assert.calledOnce(spy);
        });
    });

    context('getDrawingWithTags', () => {

        it('Devrait retourner un groupe de dessin vide si la collection n\'existe pas', async () => {
            const tagListTest = ['tag1', 'tag2', 'tag3'];
            delete test.collection;
            const test1 = await test.getDrawingWithTags(tagListTest);
            expect(test1).to.deep.equal([]);
            test.collection = dbClient.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
        });

        it('Devrait continuer dans le for lorsque le tag est vide', async () => {
            const tagList = [''];
            const spy = sinonSandbox.stub(collection, 'find');
            test.getDrawingWithTags(tagList);
            sinonSandbox.assert.notCalled(spy);
        });

        it ('Si le taglist nest pas vide elle doit appeler la methode find', async () => {
            const tagList = ['tag1', 'tag2'];
            const spy = sinonSandbox.stub(collection, 'find');
            test.getDrawingWithTags(tagList);
            sinonSandbox.assert.calledOnce(spy);
        });

        it('Devrait trouver un array de drawing', async () => {
            const tagList = ['tag1', 'tag2'];
            const spy = sinonSandbox.stub(Cursor.prototype, 'toArray').callsFake(() => [drawing]);
            test.getDrawingWithTags(tagList);
            sinonSandbox.assert.calledOnce(spy);
        });

        it('Doit retourner le Array<Drawing>', async () => {
            const tagList = ['tag1', 'tag2'];
            sinonSandbox.stub(Cursor.prototype, 'toArray').callsFake(() => [drawing]);
            /*const array = new Array<Drawing>();
            array.push(drawing);*/
            expect(test.getDrawingWithTags(tagList)).to.equal(drawing['']);
        });
    });

    context('updateData', () => {

        it('Devrait retourner faux lorsque nom est vide',  async () => {
            drawing.name = ('');
            const returnFalse = await test.updateData(drawing);
            expect(returnFalse).to.equal(false);
        });

        it('Devrait retourner faux lorsque la collection nexiste pas', async () => {
            delete test.collection;
            const returnFalse = await test.updateData(drawing);
            expect(returnFalse).to.equal(false);
            test.collection = dbClient.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
        });

        it('La collection doit passer dans la fonction replaceOne', () => {
            const spy = sinonSandbox.stub(collection, 'replaceOne');
            test.updateData(drawing);
            sinonSandbox.assert.calledOnce(spy);
        });

        it('la fonction doit retourner vrai lorsquelle a passer par la methode replaceOne', async () => {
            const returnTrue = await test.updateData(drawing);
            expect(returnTrue).to.equal(true);
        });

    });

    context('deleteData', () => {

        it('si la collection nexiste pas elle doit sortir de la fonction', async () => {
            delete test.collection;
            const test1 = await test.deleteData(drawing._id);
            expect(test1).to.equal(undefined);
            test.collection = dbClient.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
        });

        it('la collection doit bien passer par la methode deleteOne', async () => {
            const spy = sinonSandbox.stub(collection, 'deleteOne');
            await test.deleteData(0);
            expect(spy.called).to.equal(true);
        });
    });
});
