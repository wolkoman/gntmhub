import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest,} from '../../../util/authorization';
import {DatabaseService, ObjectId, UserEntity} from '../../../util/DatabaseService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({errorMessage: 'Sie müssen angemeldet sein.'});
    return;
  }

  const collection = await DatabaseService.getCollection(UserEntity);
  await collection.updateOne({_id: ObjectId(user._id)}, {$set: {pushSubscriptions: req.body.pushSubscription}})
  res.json({status: "done"});

  await DatabaseService.close();
};
