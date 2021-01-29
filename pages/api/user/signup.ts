import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, UserEntity } from "../../../util/mongo";
import { sendVerifyMessage } from "../../../util/verifyMessage";

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
    const userResult = await users.findOne({
      $or: [{ name: req.body.username }, { phone: req.body.phone }],
    });
    if (userResult) {
      res.json({
        err: true,
        msg: "Diese Daten existieren schon.",
      });
    } else {
      const verifyToken = (Math.random() * 899999 + 100000).toFixed(0);
      const user = {
        active: false,
        hash: await hash(req.body.password, 1),
        name: req.body.username,
        admin: false,
        phone: req.body.phone,
        verifyToken,
      } as UserEntity;
      users.insertOne(user);
      const jwt = sign(
        { ...user, hash: "", verifyToken: "" },
        process.env.JWT_SECRET
      );
      res.json({ err: false, msg: jwt });
      sendVerifyMessage(req.body.phone, verifyToken);
    }
  }
  res.end();
};
