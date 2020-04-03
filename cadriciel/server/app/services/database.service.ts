import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';

import { Drawing } from '../../../common/communication/drawing-interface';

const DATABASE_URL = 'mongodb+srv://PolyDessin:log2990@polydessin-zhlk9.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'polydessinDB';
const DATABASE_COLLECTION = 'dessin';

@injectable()
export class DatabaseService {

    collection: Collection<Drawing>;
    mongoClient: MongoClient;

    private options: MongoClientOptions = {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    };

    constructor() {
        this.mongoClient = new MongoClient(DATABASE_URL, this.options);
        this.connect();
    }

    async connect(): Promise<void> {
        await this.mongoClient.connect()
        .then((client: MongoClient) => {
            this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
            console.error('connexion établie');
        }).catch(() => {
            process.exit(1);
        });
    }

    async getDrawings(): Promise<Drawing[]> {
        if (!this.collection) { return []; }
        return await this.collection.find().toArray();
    }

    async getDrawingWithTags(tagList: string[]): Promise<Drawing[]> {
        if (!this.collection) { return []; }
        const result = new Map<number, Drawing>();
        for (const tag of tagList) {
            if (tag === '') { continue; }
            const query = await this.collection.find({tags: tag}).toArray();
            for (const drawing of query) {
                if (!result.has(drawing._id)) { result.set(drawing._id, drawing); }
            }
        }
        return Array<Drawing>(...result.values());
    }

    async updateData(drawing: Drawing): Promise<boolean> {
        if (!this.collection || drawing.name === '') { return false; }
        await this.collection.replaceOne({_id: drawing._id}, drawing, {upsert: true});
        return true;
    }

    async deleteData(id: number): Promise<void> {
        if (!this.collection) { return; }
        await this.collection.deleteOne({_id: Number(id)});
    }
}
