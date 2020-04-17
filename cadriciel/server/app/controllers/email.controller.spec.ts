import * as assert from 'assert';
import { expect } from 'chai';
import { request, response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { EmailService } from '../services/email.service';
import { EmailController } from './email.controller';

import * as sinon from 'sinon';

// tslint:disable: no-string-literal

describe('Tests de demail.controller', () => {
    let controller: EmailController;
    const sinonSandbox = sinon.createSandbox();

    before(() => controller = new EmailController(new EmailService()));

    afterEach(() => sinonSandbox.restore());

    context('constructor', () => {
        it('#constructor devrait appeller configureRouter', (done) => {
            assert.call(controller, controller['configureRouter']);
            done();
        });
    });

    context('sendDrawing', () => {
        afterEach(() => sinonSandbox.restore());
        it('#sendDrawing devrait retourner un code de status d\'erreur si l\'addresse est invalide', (done) => {
            request.body = {to: 'non-conform email address'};
            controller['sendDrawing'](request, response).then(() => {
                expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
            });
            done();
        });
        it('#sendDrawing devrait copier le contenu des données tel quel si le format est svg', (done) => {
            request.body = {to: 'example@example.com', payload: 'rawData', filename: 'fileName',  extension: 'svg'};
            const spy = sinonSandbox.spy(controller['emailService'], 'sendEmail');
            controller['sendDrawing'](request, response).then(() => {
                expect(spy.calledOnceWithExactly('example@example.com', Buffer.from('rawData', 'utf-8'), 'fileName', 'svg'));
            });
            done();
        });
        it('#sendDrawing devrait copier le contenu des formatées si le format n\'est pas svg', (done) => {
            request.body = {to: 'example@example.com', payload: 'mimetype,rawData', filename: 'fileName',  extension: 'png'};
            const spy = sinonSandbox.spy(controller['emailService'], 'sendEmail');
            controller['sendDrawing'](request, response).then(() => {
                expect(spy.calledOnceWithExactly('example@example.com', Buffer.from('rawData', 'base64'), 'fileName', 'svg'));
            });
            done();
        });
    });

    context('configureRouter', () => {
        afterEach(() => sinonSandbox.restore());
        it('#configureRouter devrait bind la route "/sendDrawing" à la fonction sendDrawing avec la méthode post', () => {
            const spy = sinonSandbox.spy(controller.router, 'post');
            controller['configureRouter']();
            expect(spy.calledWithExactly('/sendDrawing', controller['sendDrawing'].bind(controller)));
        });
    });
});
