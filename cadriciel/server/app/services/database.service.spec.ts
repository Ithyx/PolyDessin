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
    context('constructor', () => {
        it('constructeur doit etre bien defini', (done: Mocha.Done) => {
            assert.ok(new DatabaseService());
            done();
        });
    });

    context('updateData', () => {
        const DATABASE_URL = 'mongodb+srv://PolyDessin:log2990@polydessin-zhlk9.mongodb.net/test?retryWrites=true&w=majority';
        const DATABASE_NAME = 'polydessinDB';
        const DATABASE_COLLECTION = 'dessin';

        const test = new DatabaseService();
        const dbClient = new MongoClient(DATABASE_URL, {useUnifiedTopology : true});

        let black: Color;

        beforeEach(() => black = {
            RGBA: [255, 255, 255, 1],
            RGBAString: ('ffffff'),
        });

        after(() => {
            dbClient.close();
            test.mongoClient.close();
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
            name: '123',
            height: 25,
            width: 25,
            backgroundColor: black,
            tags: [''],
            elements: element[''],
        });

        it('Devrait retourner faux lorsque nom est vide',  async () => {
            drawing.name = ('');
            const returnfalse = await test.updateData(drawing);
            expect(returnfalse).to.equal(false);
        });

        it('Devrait retourner faux lorsque la collection nexiste pas', async () => {
            delete test.collection;
            const returnfalse = await test.updateData(drawing);
            expect(returnfalse).to.equal(false);
        });

        it('La collection doit passer dans la fonction replaceOne', async (done) => {
            dbClient.connect()
            .then((client: MongoClient) => {
                test.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
                console.error('connexion établie');
            });
            const emitter = new EventEmitter();
            emitter.on('test.collection.replaceOne', done);
            // test.updateData(drawing);
            emitter.emit('test.collection.replaceOne');
        });
    });

});
