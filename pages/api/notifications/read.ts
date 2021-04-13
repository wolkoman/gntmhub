import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "../../../util/authorization";
import {DatabaseService, MessageEntity, ObjectId, QuestionEntity} from '../../../util/DatabaseService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.notificationId) {
    res.status(400).json({ errorMessage: "Unvollständige Anfrage!" });
    return;
  }
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ errorMessage: "Bitte melden Sie sich an!" });
    return;
  }

  const collection = await DatabaseService.getCollection(MessageEntity);
  await collection.updateOne({_id: ObjectId(req.body.notificationId)}, {$set: {unread: false}});

  res.json({done: true});

  await DatabaseService.close();
};
