import { expect } from 'chai';
import { EmailService } from './email.service';

import * as FormData from 'form-data';
import * as sinon from 'sinon';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('Tests de EmailService', () => {
    const sinonSandbox = sinon.createSandbox();

    let service: EmailService;
    before(() => service = new EmailService());
    afterEach(() => sinonSandbox.restore());

    context('sendEmail', () => {
        afterEach(() => sinonSandbox.restore());
        it('#sendEmail devrait post avec les bonnes options (si un nom de fichier a été donné)', (done) => {
            const buffer = Buffer.from('rawData');
            const appendSpy = sinonSandbox.spy(FormData.prototype, 'append');
            service.sendEmail('example@example.com', buffer, 'fileName', 'png').then(() => {
                expect(appendSpy.calledWith('payload', buffer,
                {filename: 'fileName.png', contentType: 'image/png', knownLength: buffer.byteLength}));
            });
            done();
        });
        it('#sendEmail devrait post avec les bonnes options (si aucun nom de fichier n\'a été donné)', (done) => {
            const buffer = Buffer.from('rawData');
            const appendSpy = sinonSandbox.spy(FormData.prototype, 'append');
            service.sendEmail('example@example.com', buffer, '', 'png').then(() => {
                expect(appendSpy.calledWith('payload', buffer,
                {filename: 'image.png', contentType: 'image/png', knownLength: buffer.byteLength}));
            });
            done();
        });
        it('#sendEmail devrait post avec les bonnes options (si un le type de fichier est svg)', (done) => {
            const buffer = Buffer.from('rawData');
            const appendSpy = sinonSandbox.spy(FormData.prototype, 'append');
            service.sendEmail('example@example.com', buffer, 'fileName', 'svg').then(() => {
                expect(appendSpy.calledWith('payload', buffer,
                {filename: 'fileName.svg', contentType: 'image/svg+xml', knownLength: buffer.byteLength}));
            });
            done();
        });
    });
});
