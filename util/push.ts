import webpush from 'web-push';
import {DatabaseService, UserEntity} from './DatabaseService';
import {Collection} from 'mongodb';

export function sendPushNotification(user: UserEntity, title: string, body: string, userCollection: Collection<UserEntity>) {
  if(!user.pushSubscriptions) return Promise.resolve();
  return webpush.sendNotification(user.pushSubscriptions, JSON.stringify({
    notification: {
      title,
      body,
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
  });
}

export async function broadcastPushNotification(title: string, description: string) {
  webpush.setVapidDetails('mailto:superwolko@gmail.com', process.env.PUSH_PUBLIC, process.env.PUSH_PRIVATE);

  const userCollection = await DatabaseService.getCollection(UserEntity);
  const users = await userCollection.aggregate([
    {$unwind: '$pushSubscriptions'},
    {$project: {_id: 0, pushSubscriptions: 1}}
  ]).toArray();

  await Promise.all(users.map(user => {
    return sendPushNotification(user, title, description, userCollection);
  }));
}