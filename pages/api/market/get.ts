import {NextApiRequest, NextApiResponse} from 'next';
import {getUserFromRequest} from '../../../util/authorization';
import {
  CandidateEntity,
  DatabaseService, MessageEntity, QuestionEntity, StockRecordEntity, TradingBlockEntity,
  UserEntity,
} from '../../../util/DatabaseService';
import {MarketService} from '../../../util/MarketService';
import {calculatePrice, calculateStockPrice} from '../../../util/market';
import equal from 'deep-equal';

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
export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

export type GetDto = UnPromisify<ReturnType<typeof calculateGetInfo>>;

export const calculateGetInfo = async (user?: UserEntity) => {
  const candidateCollection = await DatabaseService.getCollection(CandidateEntity);
  const candidates = await candidateCollection.find({}).toArray();

  const questionCollection = await DatabaseService.getCollection(QuestionEntity);
  const questions = await questionCollection.find({}).toArray();

  const userCollection = await DatabaseService.getCollection(UserEntity);
  const users = await userCollection.find({active: true}).toArray();

  const tradingBlockCollection = await DatabaseService.getCollection(TradingBlockEntity);
  const tradingBlocks = await tradingBlockCollection.find({end: {$gte: new Date()}}).toArray();

  const messageCollection = await DatabaseService.getCollection(MessageEntity);
  const messages = await messageCollection.find({userId: user._id}).toArray();

  const stockRecordCollection = await DatabaseService.getCollection(StockRecordEntity);
  const stockRecords = await stockRecordCollection.find().toArray();

  const stocks = await MarketService.getStocks();
  const stockDeadline = new Date().getTime() - 3600 * 1000 * 24 * 9;

  return {
    stockRecords: stockRecords
      .filter(record => record.timestamp > stockDeadline)
      .map((r,i,a) => equal(r.stocks, a[i-1]?.stocks ?? "") && equal(r.stocks, a[i-2]?.stocks ?? "") ? null : r)
      .filter(r => !!r)
      .map(r => ({
        ...r,
        stocks:
          Object.fromEntries(
            Object.entries(r.stocks).map(([candidateId, stock]) => [candidateId, calculateStockPrice(stock + 1).toFixed(2)])
          )
      })),
    messages: messages.reverse(),
    questions: questions.map(question => ({
      _id: question._id,
      correct: question.correct,
      pot: question.pot,
      options: question.options,
      deadline: question.deadline,
      question: question.question,
      answer: question.answers[user._id.toString()],
    })),
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
    tradingBlocks: tradingBlocks
      .map(({start, end}) => ({start, end}))
      .sort((a,b) => a.start.getTime() - b.start.getTime()),
    user: {name: user.name, stocks: user.stocks, points: user.points, admin: user.admin, pushEnabled: !!user.pushSubscriptions},
    candidates: candidates.map(candidate => ({
      ...candidate,
      _id: candidate._id.toString(),
    })),
  };
}