import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, UserEntity } from "../../../util/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
    return;
  } else if (!req.body.username || !req.body.password) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const db = await getCollection(UserEntity);
  const user = await db.findOne({ name: req.body.username as string });
  console.log("found user", user);
  const valid = await compare(req.body.password, user?.hash ?? "");
  console.log("valid", valid);
  res.json(valid);
  res.end();
  db.close();
  return;

  if (valid) {
    const jwt = sign(
      { ...user, hash: "", active: true, verifyToken: "" },
      process.env.JWT_SECRET
    );
    console.log("jwt", jwt);
    res.statusCode = 200;
    res.json({ jwt });
  } else {
    res.statusCode = 401;
    res.json({ errorMessage: "Die Zugangsdaten sind falsch." });
  }
  res.end();
};
