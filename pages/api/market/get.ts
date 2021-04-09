import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {
  CandidateEntity,
  DatabaseService, QuestionEntity,
  UserEntity,
} from '../../../util/DatabaseService';
import {MarketService} from '../../../util/MarketService';
import {calculatePrice} from '../../../util/market';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserFromRequest(req);

  if (!user) {
    res.status(401).json({errorMessage: 'Sie sind nicht angemeldet.'});
  } else {
    res.json(await calculateGetInfo(user));
  }
  await DatabaseService.close();
};

type UnPromisify<T> = T extends Promise<infer U> ? U : T;

export type GetDto = UnPromisify<ReturnType<typeof calculateGetInfo>>;

export const calculateGetInfo = async (user?: UserEntity) => {
  const candidateCollection = await DatabaseService.getCollection(CandidateEntity);
  const candidates = await candidateCollection.find({}).toArray();

  const questionCollection = await DatabaseService.getCollection(QuestionEntity);
  const questions = await questionCollection.find({}).toArray();

  const userCollection = await DatabaseService.getCollection(UserEntity);
  const users = await userCollection.find({active: true}).toArray();

  const stocks = await MarketService.getStocks();

  return {
    questions: questions,
    users: users
        .map(user => ({
          name: user.name,
          total: user.points + Object.entries(user.stocks).reduce(
            (accumulator, [candidateId, amount]) => {
              return accumulator +
                -calculatePrice(stocks, candidateId, -amount) *
                (candidates.find(
                  candidate => candidate._id.toString() === candidateId
                ).terminated
                  ? 0
                  : 1);
            },
            0
          ),
        }))
        .sort((a, b) => b.total - a.total),
    stocks,
    user: { name: user.name, stocks: user.stocks, points: user.points, admin: user.admin, _id: user._id},
    candidates: candidates.map(candidate => ({
      ...candidate,
      _id: candidate._id.toString(),
    })),
  };
}