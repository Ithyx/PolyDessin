import * as Axios from 'axios';
import * as FormData from 'form-data';
import { injectable } from 'inversify';
import 'reflect-metadata';

export const MAIL_API_URL = 'https://log2990.step.polymtl.ca/email?quick_return=1';

@injectable()
export class EmailService {

    async sendEmail(address: string, image: Buffer, fileName: string, fileExtension: string): Promise<number> {
        if (fileName === '') { fileName = 'image'; }
        const type = (fileExtension === 'svg') ? 'svg+xml' : fileExtension;
        const appendOptions = {filename: fileName + '.' +  fileExtension, contentType: 'image/' + type,
        knownLength: image.byteLength};
        const form = new FormData();
        form.append('to', address);
        form.append('payload', image, appendOptions);
        // la clé est temporaire, elle devra être déplacée dans une variable d'environnement
        const formHeaders = form.getHeaders();
        const config = {
            headers: {
                'X-Team-Key': process.env.MAIL_API_KEY,
                'content-type': 'multipart/form-data',
                ...formHeaders
            }
        };
        return (await Axios.default.post(MAIL_API_URL, form, config)).status;
    }
}
