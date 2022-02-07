import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';
import is from '@sindresorhus/is';
import undefined = is.undefined;
import {payout} from '../../../util/market';
import {getCurrentTimeBlock} from '../../../util/timeBlock';

export default withApiAuthRequired(async function test(req, res) {

    if (req.body.name === undefined) {
        res.status(400).json({});
        return;
    }

    const {user: authUser} = getSession(req, res)!;
    const prisma = new PrismaClient();

    // check admin rights
    const user = await prisma.user.findUnique({where: {mail: authUser.email}, select: {admin: true}});
    if (!user || !user.admin) {
        res.status(402).json({});
        return;
    }

    // terminate candidate
    await prisma.candidate.update({where: {name: req.body.name}, data: {terminated: true}});
    await prisma.stock.updateMany({where: {candidateName: req.body.name}, data: {active: false}});

    // calculate dividends and user payout
    const dividendPot = 1;
    const activeStocks = await prisma.stock.findMany({where: {active: {equals: true}, amount: {gt: 0}},});
    const totalStocks = sumCollection(activeStocks, 'candidateName', 'amount');
    const dividends = activeStocks.map(stock => {
        const total = totalStocks.find(total => stock.candidateName === total.candidateName)!.total;
        return ({
            candidateName: stock.candidateName,
            userMail: stock.userMail,
            dividend: dividendPot * stock.amount / total
        });
    });
    const userPayout = sumCollection(dividends, 'userMail', 'dividend');

    // update users and record to their history and record to dividend
    const users = await prisma.$transaction(userPayout.map(payout => prisma.user.update({
        where: {mail: payout.userMail},
        data: {points: {increment: payout.total}}
    })));
    await prisma.$transaction(users.map(user => prisma.userHistory.upsert({
        where: {userMail_time: {time: getCurrentTimeBlock(), userMail: user.mail}},
        create: {userMail: user.mail, time: getCurrentTimeBlock(), points: user.points },
        update: {points: user.points}
    })));
    await prisma.$transaction(dividends.map(dividend => prisma.dividend.create({
        data: {
            userMail: dividend.userMail,
            candidateName: dividend.candidateName,
            time: getCurrentTimeBlock(),
            points: dividend.dividend
        }
    })));

    res.status(200).json({});


});



function sumCollection<Item extends Record<any, any>,
    Sum extends Item[Sum] extends number ? keyof Item : never>
(collection: Item[], crit: keyof Item, sum: Sum) {
    return collection.reduce<(Item & { total: number })[]>((agg, item) => [
        ...agg.filter(item2 => item2[crit] !== item[crit]),
        {...item, total: (agg.find(item2 => item2[crit] === item[crit])?.total ?? 0) + (item[sum] as number)}
    ], []);
}