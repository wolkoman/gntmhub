import { hash } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { sendVerifyMessage } from "../../../util/verifyMessage";
import { setAuthorizationCookie } from "../../../util/authorization";
import {
  CandidateEntity,
  DatabaseService,
  UserEntity,
} from "../../../util/DatabaseService";

async function loadInitialCandidateStocking() {
  const candidatesCollection = await DatabaseService.getCollection(
    CandidateEntity
  );
  const candidates = await candidatesCollection.find({}).toArray();
  return Object.fromEntries(candidates.map(candidate => [candidate._id, 0]));
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.passwordRetype ||
    !req.body.phone
  ) {
    res
      .status(400)
      .json({ err: true, msg: "Bitte füllen Sie alle Felder aus." });
  } else if (req.body.password !== req.body.passwordRetype) {
    res.status(400).json({
      errorMessage: "Die angegebenen Passwörter stimmen nicht überein.",
    });
  } else if (req.body.phone[0] !== "+") {
    res.status(400).json({
      errorMessage: "Die Telefonnummer muss mit einem Plus beginnen.",
    });
  } else if (req.body.password.length < 8) {
    res.status(400).json({
      errorMessage: "Das Passwort muss mindestens 8 Zeichen lang sein.",
    });
  } else if (
    req.body.phone.length < 13 ||
    isNaN(req.body.phone.substr(1)) ||
    (!req.body.phone.startsWith("+43") && !req.body.phone.startsWith("+49"))
  ) {
    res.status(400).json({
      errorMessage:
        "Die Telefonnummer muss eine valide österreichische oder deutsche Telefonnummer sein.",
    });
  } else {
    const userCollection = await DatabaseService.getCollection(UserEntity);
    const userResult = await userCollection.findOne({
      $or: [{ name: req.body.username }, { phone: req.body.phone }],
    });
    if (userResult) {
      res.status(400).json({ errorMessage: "Diese Daten existieren schon." });
    } else {
      const verifyToken = (Math.random() * 899999 + 100000).toFixed(0);
      const user = {
        active: false,
        hash: await hash(req.body.password, 1),
        name: req.body.username,
        admin: false,
        phone: req.body.phone,
        verifyToken,
        points: 1000,
        stocks: await loadInitialCandidateStocking(),
      } as UserEntity;
      await userCollection.insertOne(user);
      setAuthorizationCookie(res, user._id);
      sendVerifyMessage(req.body.phone, verifyToken);
      res.json({});
    }

    await DatabaseService.close();
  }
};
