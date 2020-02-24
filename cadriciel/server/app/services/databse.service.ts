import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions, } from 'mongodb';
import 'reflect-metadata'

const DATABASE_URL = 'mongodb+srv://PolyDessin:log2990@polydessin-zhlk9.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'polydessinDB';
const DATABASE_COLLECTION = 'dessin';

export interface Test1 {
    name: string;
    id?: number;
}

@injectable()
export class DatabaseService {

    collection: Collection<Test1>;

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
        this.collection.insertOne({name: 'Tim'});
        this.collection.insertOne({name: 'Sam', id: 7});
    }
}
