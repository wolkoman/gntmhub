import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {DatabaseService, FreeMoneyEntity, UserEntity} from '../../../util/DatabaseService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserFromRequest(req);

  if (!user.admin) {
    res.status(401).json({errorMessage: 'Sie müssen Administrator sein.'});
  } else if (req.body.money && req.body.money === 0) {
    res.status(400).json({errorMessage: 'Sie müssen einen positiven Betrag angeben.'});
  } else {

    const freeMoneyCollection = await DatabaseService.getCollection(FreeMoneyEntity);
    await freeMoneyCollection.insertOne({money: req.body.money} as FreeMoneyEntity)

    const userCollection = await DatabaseService.getCollection(UserEntity);
    let users = await userCollection.find({}).toArray();

    users = users.map(user => ({...user, points: user.points + req.body.money}));

    await userCollection.bulkWrite(users.map(user => ({
      'updateOne': {
        'filter': {_id: Object(user._id)},
        'update': {"$set": {points: user.points}}
      }
    })));

  }

  await DatabaseService.close();
}
