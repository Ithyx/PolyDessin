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

    SendData() {
        this.collection.insertOne({name: 'test1', height: 25, width: 25, backgroundColor: 'blue'});
        this.collection.insertOne({name: 'mon bo déss1', height: 7254.5, width: 0, backgroundColor: 'rgba(255, 0, 255, 255)'});
    }
}
