import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';

export default withApiAuthRequired(async function test(req, res) {

    const { user } = getSession(req, res)!;
    const prisma = new PrismaClient();
    const candidates = await prisma.candidate.findMany();
    const stocks = await prisma.stock.groupBy({by: ['candidateName'], _sum: {amount: true}});
    const dividends = await prisma.dividend.findMany({where: {userMail: user.email}});
    const now = new Date();
    const lockups = await prisma.lockup.findMany({where: {end: {gt: now}}});

    res.json({
        lockups,
        candidates: candidates.map(candidate => ({
            ...candidate,
            stock: stocks.find(stock => stock.candidateName === candidate.name)!._sum.amount,
            dividends: dividends
                .filter(dividend => dividend.candidateName === candidate.name)
                .map(dividend => ({...dividend, points: +dividend.points}))
        }))
    });
});
