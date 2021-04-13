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
  initalPoints: number;
  stocks: Record<string, number>;
}
export class FreeMoneyEntity extends Entity {
  _collectionName = "freemoney";
  money: number;
}
export class CandidateEntity extends Entity {
  _collectionName = "candidates";
  name: string;
  terminated: boolean;
  imageUrl: string;
}
export class TradingBlockEntity extends Entity {
  _collectionName = "tradingBlock";
  start: Date;
  end: Date;
}
export class QuestionEntity extends Entity {
  _collectionName = "questions";
  question: string;
  options: string[];
  deadline: string;
  answers: Record<string, number>
  correct: number | null;
  pot: number;
}
export class MessageEntity extends Entity{
  _collectionName = "messages";
  userId: string;
  type: string;
  date: string;
  unread: boolean;
}
export class PayoutMessageEntity extends MessageEntity {
  type = "PAYOUT";
  payouts: {candidateId: string, amount: number}[];
}
export class QuestionMessageEntity extends MessageEntity {
  type = "QUESTION";
  questionId: string;
  payout: number;
}
export class RefundMessageEntity extends MessageEntity {
  type = "REFUND";
  payout: number;
}
export class CustomMessageEntity extends MessageEntity {
  type = "CUSTOM";
  content: string;
}

export class DatabaseService {
  static client: MongoClient;
  static collections: Record<string, Collection> = {};

  private static async getClient(): Promise<MongoClient> {
    if (!DatabaseService.client) {
      console.log("Connecting");
      const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
      const mongoClient = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      DatabaseService.client = await mongoClient.connect().catch(x => {console.log("client connect",x);return x});
    }
    return DatabaseService.client;
  }

  static async getCollection<E extends Entity>(entity: {
    new (): E;
  }): Promise<Collection<E>> {
    const collectionName = new entity()._collectionName;
    if (!DatabaseService.collections[collectionName] || true) {
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
      await DatabaseService.client.close().catch(() => console.log("error closing"));
      DatabaseService.client = null;
    }else{
      console.error("Database not closing");
    }
  }
}

export function ObjectId(id: string) {
  let moi = MongoObjectId as any;
  return moi(id);
}
