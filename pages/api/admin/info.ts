import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {CustomMessageEntity, DatabaseService, ObjectId, UserEntity} from '../../../util/DatabaseService';
import {broadcastPushNotification} from '../../../util/push';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserFromRequest(req);

  if (!user.admin) {
    res.status(401).json({errorMessage: 'Sie müssen Administrator sein.'});
  } else if (req.body.message && req.body.message.length < 10) {
    res.status(400).json({errorMessage: 'Sie müssen eine Nachricht angeben.'});
  } else {

    const userCollection = await DatabaseService.getCollection(UserEntity);
    const users = await userCollection.find({active: true}).toArray();

    const collection = await DatabaseService.getCollection(CustomMessageEntity);
    await collection.insertMany(users
      .map(user => ({
        userId: ObjectId(user._id.toString()),
        type: 'CUSTOM',
        date: new Date().toISOString(),
        unread: true,
        content: req.body.message
      }) as CustomMessageEntity));

    await broadcastPushNotification('Neue Nachricht', req.body.message);
  }

  await DatabaseService.close();
}
