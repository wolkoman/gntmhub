import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, UserEntity } from "../../../util/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.token || !req.body.username) {
    res.json({ err: true, msg: "Bitte füllen Sie alle Felder aus." });
  } else {
    const users = await getCollection(UserEntity);
    const user = await users.findOne({
      name: req.body.username,
      verifyToken: req.body.token,
    });
    if (user) {
      users.updateOne({ name: req.body.username }, { $set: { active: true } });
      const jwt = sign(
        { ...user, hash: "", active: true, verifyToken: "" },
        process.env.JWT_SECRET
      );
      res.json({
        err: false,
        msg: jwt,
      });
    } else {
      res.json({ err: true, msg: "Der angegebene Code ist nicht korrekt." });
    }
  }
  res.end();
};