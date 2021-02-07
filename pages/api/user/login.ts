import { compare } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { setAuthorizationCookie } from "../../../util/authorization";
import { DatabaseService, UserEntity } from "../../../util/DatabaseService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405);
    return;
  } else if (!req.body.username || !req.body.password) {
    res.status(400);
    return;
  }

  const db = await DatabaseService.getCollection(UserEntity);
  const user = await db.findOne({ name: req.body.username as string });
  const valid = await compare(req.body.password, user?.hash ?? "");

  if (valid) {
    setAuthorizationCookie(res, user._id);
    res.json({ active: user.active });
  } else {
    res.status(401).json({ errorMessage: "Die Zugangsdaten sind falsch." });
  }

  await DatabaseService.close();
};
