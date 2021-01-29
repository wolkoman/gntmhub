import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, UserEntity } from "../../../util/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.passwordRetype ||
    !req.body.phone
  ) {
    res.json({ err: true, msg: "Bitte füllen Sie alle Felder aus." });
  } else if (req.body.password !== req.body.passwordRetype) {
    res.json({
      err: true,
      msg: "Die angegebenen Passwörter stimmen nicht überein.",
    });
  } else if (req.body.phone[0] !== "+") {
    res.json({
      err: true,
      msg: "Die Telefonnummer muss mit einem Plus beginnen.",
    });
  } else if (
    req.body.phone.length !== 13 ||
    isNaN(req.body.phone.substr(1)) ||
    (!req.body.phone.startsWith("+43") && !req.body.phone.startsWith("+49"))
  ) {
    res.json({
      err: true,
      msg:
        "Die Telefonnummer muss eine valide österreichische oder deutsche Telefonnummer sein.",
    });
  } else {
    const users = await getCollection(UserEntity);
    const user = await users.findOne({
      $or: [{ name: req.body.username }, { phone: req.body.phone }],
    });
    if (user) {
      res.json({
        err: true,
        msg: "Diese Daten existieren schon.",
      });
    } else {
      // users.insertOne({});
    }
  }
  res.end();
};
