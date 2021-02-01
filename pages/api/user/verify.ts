import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, UserEntity } from "../../../util/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.token || !req.body.username) {
    res
      .status(400)
      .json({ err: true, msg: "Bitte füllen Sie alle Felder aus." });
  } else {
    const db = await getCollection(UserEntity);
    const user = await db.findOne({
      name: req.body.username,
      verifyToken: req.body.token,
    });
    if (user) {
      db.updateOne({ name: req.body.username }, { $set: { active: true } });
      const jwt = sign(
        { ...user, hash: "", active: true, verifyToken: "" },
        process.env.JWT_SECRET
      );
      res.json({ jwt });
    } else {
      res
        .status(401)
        .json({ errorMessage: "Der angegebene Code ist nicht korrekt." });
    }
    db.close();
  }
};
