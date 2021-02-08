import { Collection, MongoClient, ObjectId as MongoObjectId } from "mongodb";

export class Entity {
  _collectionName: string;
  _id: string;
}
export class UserEntity extends Entity {
  _collectionName = "users";
  name: string;
  hash: string;
  phone: string;
  verifyToken: string;
  active: boolean;
  admin: boolean;
  points: number;
  stocks: Record<string, number>;
}
export class CandidateEntity extends Entity {
  _collectionName = "candidates";
  name: string;
  terminated: boolean;
  imageUrl: string;
}

export class DatabaseService {
  static client: MongoClient;
  static collections: Record<string, Collection> = {};

  private static async getClient(): Promise<MongoClient> {
    if (!DatabaseService.client) {
      const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
      const mongoClient = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      DatabaseService.client = await mongoClient.connect();
    }
    return DatabaseService.client;
  }

  static async getCollection<E extends Entity>(entity: {
    new (): E;
  }): Promise<Collection<E>> {
    const collectionName = new entity()._collectionName;
    if (!DatabaseService.collections[collectionName]) {
      const client = await DatabaseService.getClient();
      const collection = client
        .db(process.env.MONGO_DB)
        .collection<E>(collectionName);
      DatabaseService.collections[collectionName] = collection;
    }
    return DatabaseService.collections[collectionName];
  }

  static async close() {
    if (DatabaseService.client && DatabaseService.client.isConnected) {
      await DatabaseService.client.close();
    }
  }
}

export function ObjectId(id: string) {
  let moi = MongoObjectId as any;
  return moi(id);
}
