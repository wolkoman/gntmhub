import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, UserEntity } from "../../../util/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
  } else if (!req.body.username || !req.body.password) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const db = await getCollection(UserEntity);
  const user = await db.findOne({ name: req.body.username as string });
  const valid = await compare(req.body.password, user?.hash ?? "");

  if (valid) {
    const jwt = sign({ ...user, hash: "" }, process.env.JWT_SECRET);
    res.statusCode = 200;
    res.json({ jwt });
  } else {
    res.statusCode = 401;
    res.json({ errorMessage: "Die Zugangsdaten sind falsch." });
  }
  res.end();
  db.close();
};
