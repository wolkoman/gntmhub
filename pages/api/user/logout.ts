import {NextApiRequest, NextApiResponse} from 'next';
import {removeAuthorizationCookie} from '../../../util/authorization';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  removeAuthorizationCookie(res);
  res.json({ status: "done" });
};
