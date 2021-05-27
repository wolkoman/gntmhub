import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {
  CandidateEntity,
  DatabaseService,
  HoardMessageEntity,
  ObjectId,
  UserEntity,
} from '../../../util/DatabaseService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.candidateId) {
    res.status(400).json({errorMessage: 'Unvollständige Anfrage!'});
    return;
  }
  const user = await getUserFromRequest(req);

  if (!user.admin) {
    res.status(401).json({errorMessage: 'Sie müssen Administrator sein.'});
  } else {
    const candidateCollection = await DatabaseService.getCollection(CandidateEntity);
    const result = await candidateCollection.updateOne({_id: ObjectId(req.body.candidateId)}, {$set: {terminated: true}});

    const userCollection = await DatabaseService.getCollection(UserEntity);
    const users = await userCollection.find({}).toArray();
    const messageCollection = await DatabaseService.getCollection(HoardMessageEntity);
    await messageCollection.insertMany(users.map(user => ({
        userId: user._id,
        type: 'HOARD_DEDUCTION',
        date: new Date().toISOString(),
        unread: true,
        amount: user.points * 0.2
      }) as HoardMessageEntity)
    );
    await userCollection.updateMany({ points: {$gt: 0} }, {$mul: {points: 0.8}});

    res.json({status: "works", result});
  }
  await DatabaseService.close();
}
