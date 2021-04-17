import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {DatabaseService, UserEntity} from '../../../util/DatabaseService';
import webpush from 'web-push';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserFromRequest(req);

  if (!user.admin) {
    res.status(401).json({errorMessage: 'Sie müssen Administrator sein.'});
  } else if (req.body.message && req.body.message.length < 10) {
    res.status(400).json({errorMessage: 'Sie müssen eine Nachricht angeben.'});
  } else {

    webpush.setVapidDetails('mailto:superwolko@gmail.com', process.env.PUSH_PUBLIC, process.env.PUSH_PRIVATE);

    const userCollection = await DatabaseService.getCollection(UserEntity);
    const users = await userCollection.aggregate([
      {$unwind: "$pushSubscriptions"},
      {$project: {_id: 0, pushSubscriptions: 1}}
    ]).toArray();

    await Promise.all(users.map(user =>
      webpush.sendNotification(user.pushSubscriptions, JSON.stringify({
        notification: {
          title: 'Beispiel Titel',
          body: 'Das ist der Textkörper. Hallo!',
          icon: 'https://gntmhub.com/favicon.ico.png',
          badge: 'https://gntmhub.com/favicon.ico.png',
          badgeEnabled: true
        }
      })).catch(async (err) => {
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log('Subscription has expired or is no longer valid: ', err);
          await userCollection.updateOne({_id: Object(user._id)}, {$set: {pushSubscriptions: null}});
        } else {
          console.log('ERR');
          throw err;
        }
      })));

    res.json({status: "done"});
  }

  await DatabaseService.close();
}
