import {NextApiRequest, NextApiResponse} from 'next';
import {MarketService} from '../../../util/MarketService';
import {CandidateEntity, DatabaseService, StockRecordEntity} from '../../../util/DatabaseService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const rawStocks = await MarketService.getStocks();
  const candidatesCollection = await DatabaseService.getCollection(CandidateEntity);
  const candidates = await candidatesCollection.find({}).toArray();

  const stocks = Object.fromEntries(Object.entries(rawStocks).filter(([id, stock]) => !candidates.find(c => c._id.toString() === id).terminated));

  const stockRecordCollection = await DatabaseService.getCollection(StockRecordEntity);
  await stockRecordCollection.insertOne({stocks, timestamp: new Date().getTime()} as StockRecordEntity);
  res.json({status: "done"});
}