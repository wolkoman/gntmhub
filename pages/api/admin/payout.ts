import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {
  CandidateEntity,
  DatabaseService, MessageEntity, PayoutMessageEntity,
  UserEntity,
} from '../../../util/DatabaseService';

export const dividendsTotal = 60;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const messageCollection = await DatabaseService.getCollection(MessageEntity);
  const candidateCollection = await DatabaseService.getCollection(CandidateEntity);
  const userCollection = await DatabaseService.getCollection(UserEntity);
  const candidates = await candidateCollection.find({}).toArray();
  let users = await userCollection.find({}).toArray();
  const user = await getUserFromRequest(req);
  const messages: {userId: string, candidateId: string, amount: number}[] = [];

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
        'update': {"$set": {points: user.points}}
      }
    })));

    await messageCollection.insertMany(messages
      .map(message => message.userId)
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(userId => ({
        userId,
        type: "PAYOUT",
        date: new Date().toISOString(),
        unread: true,
        payouts: messages
          .filter(message => message.userId === userId)
          .map(message => ({
            candidateId: message.candidateId,
            amount: message.amount
          }))
      }) as PayoutMessageEntity)
    );
  }

  await DatabaseService.close();
}
