import { injectable } from 'inversify';
import { Collection, FilterQuery, FindOneOptions, MongoClient, MongoClientOptions, UpdateQuery, } from 'mongodb';

const DATABASE_URL = 'mongodb+srv://PolyDessin:log2990@polydessin-zhlk9.mongodb.net/test?retryWrites=true&w=majority ';
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
        useUnifiedTopology : true
    };


    constructor(){
        MongoClient.connect(DATABASE_URL, this.options)
        .then((client: MongoClient) => {
            this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
        })
        .catch(() => {
            console.error('CONNECTION ERROR. EXITING PROCESS');
            process.exit(1);
        });
    }

    SendData() {
        this.collection.insertOne({name: 'Tim'})
    }
}