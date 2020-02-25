import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions, } from 'mongodb';
import 'reflect-metadata'

import { Drawing } from '../../../common/communication/DrawingInterface';

const DATABASE_URL = 'mongodb+srv://PolyDessin:log2990@polydessin-zhlk9.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'polydessinDB';
const DATABASE_COLLECTION = 'dessin';

@injectable()
export class DatabaseService {

    collection: Collection<Drawing>;

    private options: MongoClientOptions = {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
        .then((client: MongoClient) => {
            this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
            console.error('connexion établie');
        })
        .catch((err) => {
            console.error('CONNECTION ERROR. EXITING PROCESS');
            console.error(err);
            process.exit(1);
        });
    }

    async getDrawings(): Promise<Drawing[]> {
        if (!this.collection) { return []; };
        return await this.collection.find().toArray();
    }

    SendData(drawing: Drawing) {
        console.log('tried to send: ', drawing);
        if (!this.collection) { return; };
    }
}
