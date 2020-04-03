import * as assert from 'assert';
import { expect } from 'chai';
import { request, response, Router } from 'express';
import { DatabaseService } from '../services/database.service';
import { DatabaseController } from './database.controller';

import * as sinon from 'sinon';

// tslint:disable: no-string-literal

describe('Tests de database.controller', () => {
    let controller: DatabaseController;
    const sinonSandbox = sinon.createSandbox();

    before(() => {
        controller = new DatabaseController(new DatabaseService());
    });

    after(async () => {
        if (controller['databaseService'].mongoClient.isConnected()) {
            await controller['databaseService'].mongoClient.close();
        }
    });

    afterEach(() => sinonSandbox.restore());

    context('constructor', () => {

        it('constructeur devrait appeler configureRouter', (done: Mocha.Done) => {
            assert.call(controller, controller['configureRouter']);
            done();
        });
    });

    context('listDrawingCallback', async () => {
        // it('#listDrawingCallback devrait appeler getDrawingWithTags si la requête possède des tags', () => {
        //     const spy = sinonSandbox.spy(controller['databaseService'], 'getDrawingWithTags');
        //     request.query = {tags: encodeURIComponent(JSON.stringify(['tag1']))};
        //     controller['listDrawingCallback'](request, response);
        //     expect(spy.called).to.equal(true);
        // });
    });

    context('configureRouter', () => {

        it('#configureRouter devrait bind la route "/listDrawings" à la fonction listDrawingCallback avec la méthode get', () => {
            const spy = sinonSandbox.spy(controller.router, 'get');
            controller['configureRouter']();
            expect(spy.calledWithExactly('/listDrawings', controller['listDrawingCallback'].bind(controller)));
        });

        it('#configureRouter devrait bind la route "/saveDrawing" à la fonction saveDrawingCallback avec la méthode post', () => {
            const spy = sinonSandbox.spy(controller.router, 'post');
            controller['configureRouter']();
            expect(spy.calledWithExactly('/saveDrawing', controller['saveDrawingCallback'].bind(controller)));
        });

        it('#configureRouter devrait bind la route "/deleteDrawing" à la fonction deleteDrawingCallback avec la méthode delete', () => {
            const spy = sinonSandbox.spy(controller.router, 'delete');
            controller['configureRouter']();
            expect(spy.calledWithExactly('/deleteDrawing', controller['deleteDrawingCallback'].bind(controller)));
        });
    });

});
