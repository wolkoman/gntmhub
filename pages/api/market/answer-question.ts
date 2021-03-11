import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "../../../util/authorization";
import {DatabaseService, ObjectId, QuestionEntity} from '../../../util/DatabaseService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.questionId || req.body.optionId === undefined) {
    res.status(400).json({ errorMessage: "Unvollständige Anfrage!" });
    return;
  }
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ errorMessage: "Bitte melden Sie sich an!" });
    return;
  }

  const collection = await DatabaseService.getCollection(QuestionEntity);
  const question = await collection.findOne({_id: ObjectId(req.body.questionId)});
  if(new Date(question.deadline).getTime() < new Date().getTime()){
    res.status(400).json({ errorMessage: "Über der Deadline!" });
  }else{
    const result = await collection.updateOne({_id: ObjectId(req.body.questionId)}, {$set: { [`answers.${user._id}`]: +req.body.optionId }});
    res.status(result.modifiedCount === 1 ? 200 : 200).json({modified: result.modifiedCount});
  }
  await DatabaseService.close();
};
