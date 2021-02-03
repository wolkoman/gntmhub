import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, UserEntity } from "../../../util/mongo";
import {setAuthorizationCookie} from "../../../util/authorization";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405);
    return;
  } else if (!req.body.username || !req.body.password) {
    res.status(400);
    return;
  }

  const db = await getCollection(UserEntity);
  const user = await db.findOne({ name: req.body.username as string });
  console.log("found user", user);
  const valid = await compare(req.body.password, user?.hash ?? "");
  db.close();
  console.log("valid", valid);

  if (valid) {
    const jwt = sign(
      { ...user, hash: "", active: true, verifyToken: "" },
      process.env.JWT_SECRET
    );
    setAuthorizationCookie(res, jwt);
    res.status(200).json({ jwt });
  } else {
    res.status(401).json({ errorMessage: "Die Zugangsdaten sind falsch." });
  }
};
