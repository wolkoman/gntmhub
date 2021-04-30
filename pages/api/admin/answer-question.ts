import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {
  DatabaseService,
  ObjectId,
  QuestionEntity,
  QuestionMessageEntity,
  UserEntity,
} from '../../../util/DatabaseService';
import {sendPushNotification} from '../../../util/push';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.questionId || req.body.optionId === undefined) {
    res.status(400).json({errorMessage: 'Unvollständige Anfrage!'});
    return;
  }
  const user = await getUserFromRequest(req);

  if (!user.admin) {
    res.status(401).json({errorMessage: 'Sie müssen Administrator sein.'});
  } else {
    const messageCollection = await DatabaseService.getCollection(QuestionMessageEntity);
    const userCollection = await DatabaseService.getCollection(UserEntity);
    const users = await userCollection.find().toArray();
    const questionCollection = await DatabaseService.getCollection(QuestionEntity);
    const question = await questionCollection.findOne({_id: ObjectId(req.body.questionId)});
    let correctOptionId = +req.body.optionId;
    const correctUserIds = Object.entries(question.answers)
      .filter(([userId, optionId]) => optionId === correctOptionId)
      .map(([userId]) => userId);
    await questionCollection.updateOne({_id: ObjectId(question._id)}, {$set: {correct: correctOptionId}});

    if(correctUserIds.length !== 0){
      const payout = question.pot / correctUserIds.length;
      const result = await userCollection.bulkWrite(correctUserIds.map(userId => ({
        'updateOne': {
          'filter': {_id: ObjectId(userId)},
          'update': {'$inc': {points: payout}}
        }
      })));
      await messageCollection.insertMany(correctUserIds
        .map(userId => ({
          userId: ObjectId(userId),
          type: 'QUESTION',
          questionId: question._id,
          date: new Date().toISOString(),
          payout,
          unread: true
        }) as QuestionMessageEntity)
      );
      await Promise.all(correctUserIds
        .map(userId => users.find(user => user._id.toString() === userId))
        .map(user => sendPushNotification(user, 'Frage richtig beantwortet', question.question, userCollection))
      );
    }
  }
  await DatabaseService.close();
}
