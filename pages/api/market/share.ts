import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, UserEntity } from "../../../util/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const userCollection = await getCollection(UserEntity);
  const data = await userCollection
    .aggregate([
      { $project: { item: 1, stocks: { $objectToArray: "$stocks" } } },
      { $unwind: "$stocks" },
      { $group: { _id: "$stocks.k", total: { $sum: "$stocks.v" } } },
    ])
    .toArray();
  res.setHeader("Content-Type", "application/json");
  res.json(data);
  userCollection.close();
};
