import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "../../../util/authorization";
import { MarketService } from "../../../util/MarketService";
import {
  CandidateEntity,
  getCollection,
  UserEntity,
} from "../../../util/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const candidateCollection = await getCollection(CandidateEntity);
  const candidates = await candidateCollection.find({}).toArray();
  candidateCollection.close();

  const userCollection = await getCollection(UserEntity);
  const users = await userCollection.find({}).toArray();
  userCollection.close();

  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ errorMessage: "Sie sind nicht angemeldet." });
    return;
  }
  res.json({
    users: users.map(user => ({ ...user, _id: user._id.toString() })),
    stocks: await MarketService.getStocks(),
    user: { ...user, _id: user._id.toString() },
    candidates: candidates.map(candidate => ({
      ...candidate,
      _id: candidate._id.toString(),
    })),
  });
};
