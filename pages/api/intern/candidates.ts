import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';
import {calculateStockPrice} from '../../../util/market';

export default withApiAuthRequired(async function test(req, res) {

    const {user} = getSession(req, res)!;
    const prisma = new PrismaClient();
    const candidates = await prisma.candidate.findMany();
    const candidateHistory = await prisma.candidateHistory.findMany();
    const stocks = await prisma.stock.groupBy({by: ['candidateName'], _sum: {amount: true}});
    const dividends = await prisma.dividend.findMany({where: {userMail: user.email}});
    const now = new Date();
    const lockups = await prisma.lockup.findMany({where: {end: {gt: now}}});
    const remaining = candidates.filter(c => !c.terminated).length;

    res.json({
        lockups,
        candidates: candidates.map(candidate => ({
            ...candidate,
            history: candidateHistory
                .filter(history => history.candidateName === candidate.name)
                .sort((a, b) => a.time - b.time)
                .map(history => ({x: calculateStockPrice(history.amount, remaining), y: history.time - 456640})),
            stock: stocks.find(stock => stock.candidateName === candidate.name)!._sum.amount,
            dividends: dividends
                .filter(dividend => dividend.candidateName === candidate.name)
                .map(dividend => ({...dividend, points: +dividend.points}))
                .slice(-3)
        }))
    });
});
