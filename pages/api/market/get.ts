import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "../../../util/authorization";
import {
  CandidateEntity,
  DatabaseService,
  UserEntity,
} from "../../../util/DatabaseService";
import { MarketService } from "../../../util/MarketService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const candidateCollection = await DatabaseService.getCollection(
    CandidateEntity
  );
  const candidates = await candidateCollection.find({}).toArray();

  console.log("before");
  const userCollection = await DatabaseService.getCollection(UserEntity).catch(x => {console.log("/get [native] collection",x);return x});
  const users = await userCollection.find({}).toArray().catch(x => {console.log("/get [native] userfind",x);return x});
  const user = await getUserFromRequest(req).catch(x => {console.log("/get [native] getuserrequest",x);return x});

  if (!user) {
    res.status(401).json({ errorMessage: "Sie sind nicht angemeldet." });
  } else {
    res.json({
      users: users.map(user => ({ ...user, _id: user._id.toString() })),
      stocks: await MarketService.getStocks().catch(x => {console.log("/get [native] getsocks",x);return x}),
      user: { ...user, _id: user._id.toString() },
      candidates: candidates.map(candidate => ({
        ...candidate,
        _id: candidate._id.toString(),
      })),
    });
  }
  console.log("before close");
  //await DatabaseService.close();
  console.log("after close");
};
