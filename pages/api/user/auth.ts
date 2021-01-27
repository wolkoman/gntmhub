import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, UserEntity } from "../../../util/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }
  if (!req.body.username || !req.body.password) {
    res.statusCode = 400;
    res.end();
    return;
  }
  console.log(req.body);
  const db = await getCollection(UserEntity);
  const value = await db.findOne({ name: req.body.username as string });
  const valid = false; //await compare(req.body.password, value.hash);
  if (!valid) {
    res.statusCode = 401;
    res.end();
    return;
  }
  res.statusCode = 200;
  res.json(value);
  db.close();
};
