import { NextApiRequest, NextApiResponse } from "next";
import {
  getUserFromRequest,
  setAuthorizationCookie,
} from "../../../util/authorization";
import { DatabaseService, UserEntity } from "../../../util/DatabaseService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.token) {
    res.status(400).json({ errorMessage: "Bitte füllen Sie alle Felder aus." });
  } else {
    const user = await getUserFromRequest(req, false);
    if (user && user.verifyToken === req.body.token) {
      const userCollection = await DatabaseService.getCollection(UserEntity);
      await userCollection.updateOne(
        { _id: Object(user._id) },
        { $set: { active: true } }
      );
      setAuthorizationCookie(res, user._id);
      res.json({});
    } else {
      res
        .status(401)
        .json({ errorMessage: "Der angegebene Code ist nicht korrekt." });
    }
    await DatabaseService.close();
  }
};
