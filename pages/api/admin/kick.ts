import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {CandidateEntity, DatabaseService, ObjectId,} from '../../../util/DatabaseService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.candidateId) {
    res.status(400).json({errorMessage: 'Unvollständige Anfrage!'});
    return;
  }
  const user = await getUserFromRequest(req);

  if (!user.admin) {
    res.status(401).json({errorMessage: 'Sie müssen Administrator sein.'});
  } else {
    const candidateCollection = await DatabaseService.getCollection(CandidateEntity);
    const result = await candidateCollection.updateOne({_id: ObjectId(req.body.candidateId)}, {$set: {terminated: true}});
    res.json({status: "works", result})
  }
  await DatabaseService.close();
}
