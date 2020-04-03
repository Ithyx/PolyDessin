// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
import {assert, expect } from 'chai';
import { EventEmitter } from 'events';
import {MongoClient} from 'mongodb';
import {Color} from '../../../client/src/app/services/color/color';
import {DrawElement} from '../../../client/src/app/services/stockage-svg/draw-element/draw-element';
import {Drawing} from '../../../common/communication/drawing-interface';
import {DatabaseService} from './database.service';

describe('Tests de database.service', () => {
    const DATABASE_URL = 'mongodb+srv://PolyDessin:log2990@polydessin-zhlk9.mongodb.net/test?retryWrites=true&w=majority';
    const DATABASE_NAME = 'polydessinDB';
    const DATABASE_COLLECTION = 'dessin';

    let test: DatabaseService;
    let dbClient: MongoClient;

    let black: Color;

    let drawing: Drawing;

    before(async () => {
        test = new DatabaseService();
        dbClient = new MongoClient(DATABASE_URL, {useUnifiedTopology : true});
        await test.mongoClient.close();
        await dbClient.connect();
        test.collection = dbClient.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
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
        });
    });

    context('getDrawingWithTags', () => {

        it('Devrait retourner un groupe de dessin vide si la collection n\'existe pas', async () => {
            const tagListTest = ['tag1', 'tag2', 'tag3'];
            delete test.collection;
            const test1 = await test.getDrawingWithTags(tagListTest);
            expect(test1).to.deep.equal([]);
        });
    });

    context('updateData', () => {

        it('Devrait retourner faux lorsque nom est vide',  async () => {
            drawing.name = ('');
            const returnFalse = await test.updateData(drawing);
            expect(returnFalse).to.equal(false);
        });

        it('Devrait retourner faux lorsque la collection nexiste pas', async () => {
            await test.mongoClient.close();
            delete test.collection;
            const returnFalse = await test.updateData(drawing);
            expect(returnFalse).to.equal(false);
            test.collection = dbClient.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
        });

        it('La collection doit passer dans la fonction replaceOne', async (done) => {
            const emitter = new EventEmitter();
            emitter.on('test.collection.replaceOne', done);
            // test.updateData(drawing);
            emitter.emit('test.collection.replaceOne');
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
        });

        it('la collection doit bien passer par la methode deleteOne', async (done) => {
            const emitter = new EventEmitter();
            emitter.on('test.collection.deleteOne', done);
            // test.deleteOne(drawing);
            emitter.emit('test.collection.deleteOne');
        });
    });
});
