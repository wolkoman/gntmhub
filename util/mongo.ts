import { Collection, MongoClient } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

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
}
export class CandidateEntity extends Entity {
  _collectionName = "candidates";
  name: string;
  terminated: boolean;
  imageUrl: string;
}

export async function getCollection<E extends Entity>(entity: {
  new (): E;
}): Promise<Collection<E> & { close: () => {} }> {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const collection = client
    .db(process.env.MONGO_DB)
    .collection<E>(new entity()._collectionName);
  collection["close"] = () => client.close();
  return collection as Collection<E> & { close: () => {} };
}
