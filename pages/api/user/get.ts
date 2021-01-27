// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as bcrypt from "bcrypt";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getCollection, UserEntity } from "../../../util/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end();
    return;
  }
  console.log(req.body);
  const db = await getCollection(UserEntity);
  const values = await db.find({}).toArray();
  res.statusCode = 200;
  res.json(values);
  db.close();
};
