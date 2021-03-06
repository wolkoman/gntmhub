import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {DatabaseService} from '../../../util/DatabaseService';
import {broadcastPushNotification} from '../../../util/push';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserFromRequest(req);

  if (!user.admin) {
    res.status(401).json({errorMessage: 'Sie müssen Administrator sein.'});
  } else if (req.body.message && req.body.message.length < 10) {
    res.status(400).json({errorMessage: 'Sie müssen eine Nachricht angeben.'});
  } else {

    await broadcastPushNotification("Test", "Dies ist eine Test-Nachricht");
    res.json({status: "done"});
  }

  await DatabaseService.close();
}
