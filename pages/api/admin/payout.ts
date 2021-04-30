import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {
  CandidateEntity,
  DatabaseService,
  MessageEntity,
  PayoutMessageEntity,
  UserEntity,
} from '../../../util/DatabaseService';
import {sendPushNotification} from '../../../util/push';

export const dividendsTotal = 100;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const messageCollection = await DatabaseService.getCollection(MessageEntity);
  const candidateCollection = await DatabaseService.getCollection(CandidateEntity);
  const userCollection = await DatabaseService.getCollection(UserEntity);
  const candidates = await candidateCollection.find({}).toArray();
  let users = await userCollection.find({}).toArray();
  const user = await getUserFromRequest(req);
  const messages: { userId: string, candidateId: string, amount: number }[] = [];

  if (!user.admin) {
    res.status(401).json({errorMessage: 'Sie müssen Administrator sein.'});
  } else {
    candidates.forEach(candidate => {
      let total = users.map(user => user.stocks[candidate._id]).reduce((p, c) => p + c, 0);
      if (total === 0) return;
      if (candidate.terminated) return;
      users = users.map(user => {
        const stock = user.stocks[candidate._id];
        const amount = dividendsTotal * stock / total;
        if (amount !== 0) {
          user.points += amount;
          console.log(`${user.name} gets ${amount} for candidate a share of ${stock / total} on ${candidate.name}`);
          messages.push({userId: user._id, candidateId: candidate._id, amount});
        }
        return user;
      });
    });

    await userCollection.bulkWrite(users.map(user => ({
      'updateOne': {
        'filter': {_id: Object(user._id)},
        'update': {'$set': {points: user.points}}
      }
    })));

    const affectedUsers = messages
      .map(message => message.userId)
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(userId => users.find(u => u._id === userId));
    await messageCollection.insertMany(affectedUsers.map(user => ({
        userId: user._id,
        type: 'PAYOUT',
        date: new Date().toISOString(),
        unread: true,
        payouts: messages
          .filter(message => message.userId === user._id)
          .map(message => ({
            candidateId: message.candidateId,
            amount: message.amount
          }))
      }) as PayoutMessageEntity)
    );
    await Promise.all(affectedUsers.map(user =>
      sendPushNotification(user, 'Dividenden wurden ausgeschüttet', `Sie erhalten dadurch ${
        messages
          .filter(message => message.userId === user._id)
          .reduce((p, c) => p + c.amount, 0)
          .toFixed(2)
      } gpoints.`, userCollection)
    ));
  }

  await DatabaseService.close();
}
