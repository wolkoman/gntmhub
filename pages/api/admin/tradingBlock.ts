import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {DatabaseService, GeneralInformationEntity} from '../../../util/DatabaseService';
import {broadcastPushNotification} from '../../../util/push';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserFromRequest(req);

  if (!user.admin) {
    res.status(401).json({errorMessage: 'Sie müssen Administrator sein.'});
  } else {

    const active = req.body.active;
    //await broadcastPushNotification("Spontane Handelsperre", "Dies ist eine Test-Nachricht");

    const infoCollection = await DatabaseService.getCollection(GeneralInformationEntity);
    await infoCollection.updateOne({name: "tradingBlock"}, {$set: {value: active}});

    res.json({status: "done"});
  }

  await DatabaseService.close();
}
