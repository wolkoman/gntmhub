import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {DatabaseService, MessageEntity,} from '../../../util/DatabaseService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({errorMessage: 'Sie sind nicht angemeldet.'});
  } else {
    const messageCollection = await DatabaseService.getCollection(MessageEntity);
    const messages = await messageCollection.find({userId: user._id}).toArray();
    res.json({messages});
  }
  await DatabaseService.close();
};
