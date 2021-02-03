import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, UserEntity } from "../../../util/mongo";
import { setAuthorizationCookie } from "../../../util/authorization";

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
  const valid = await compare(req.body.password, user?.hash ?? "");
  db.close();

  if (valid) {
    setAuthorizationCookie(res, user._id);
    res.json({ active: user.active });
  } else {
    res.status(401).json({ errorMessage: "Die Zugangsdaten sind falsch." });
  }
};
