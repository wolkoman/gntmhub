import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {PrismaClient} from "@prisma/client";
import {calculatePrice, payout} from '../../../util/market';
import {getCurrentTimeBlock} from "../../../util/timeBlock";

export default withApiAuthRequired(async (req, res) => {

    const {user: authUser} = getSession(req, res)!;
    const prisma = new PrismaClient();

    const reqCandidateName = req.body.candidateName;
    const reqAmount = req.body.amount;
    const reqPrice = req.body.price;

    const user = (await prisma.user.findUnique({
        where: {mail: authUser.email},
        include: {Stock: {where: {candidate: {name: reqCandidateName}}}}
    }))!;
    const now = new Date();
    const lockup = await prisma.lockup.findMany({where: {AND:{start: {lt: now}, end: {gt: now}}}});
    const candidate = await prisma.candidate.findUnique({
        where: {name: reqCandidateName},
        select: {terminated: true, locked: true}
    });
    const stocks = await prisma.stock.groupBy({
        by: ['candidateName'],
        _sum: {amount: true},
        where: {candidateName: reqCandidateName}
    });
    const stockAmount = stocks[0]._sum.amount!;
    const price = calculatePrice(stockAmount, reqAmount);

    if (!candidate || candidate.terminated) {
        res
            .status(402)
            .json({error: "Die Aktie ist eingefroren"});
        return;
    }
    if (candidate.locked) {
        res
            .status(402)
            .json({error: "Die Aktie ist spontan gesperrt"});
        return;
    }
    if (lockup.length > 0) {
        res
            .status(402)
            .json({error: "Es besteht eine Aktiensperre", newStock: stockAmount});
        return;
    }
    if (reqPrice !== price) {
        res
            .status(402)
            .json({error: "Der Preis hat sich geändert", newStock: stockAmount});
        return;
    }
    if (price - (user.points.toNumber() + payout()) > 0.0001) {
        res
            .status(402)
            .json({error: "Zu wenig Geld für den Handel"});
        return;
    }
    if (user.Stock[0].amount + reqAmount < 0) {
        res
            .status(402)
            .json({error: "Zu wenig Aktien für den Handel"});
        return;
    }

    const newPoints = user.points.toNumber() - price;
    const newStock = stockAmount + reqAmount;
    await prisma.user.update({
        where: {mail: user.mail},
        data: {points: newPoints}
    });
    await prisma.stock.update({
        where: {userMail_candidateName: {userMail: user.mail, candidateName: reqCandidateName}},
        data: {amount: {increment: reqAmount}}
    });

    const time = getCurrentTimeBlock();
    await prisma.candidateHistory.upsert({
        where: {candidateName_time: {candidateName: reqCandidateName, time}},
        create: {candidateName: reqCandidateName, amount: newStock, time},
        update: {amount: newStock, time}
    });
    await prisma.userHistory.upsert({
        where: {userMail_time: {userMail: user.mail, time}},
        create: {userMail: user.mail, time, points: newPoints},
        update: {points: newPoints}
    });

    res.json({newStock, newPoints});
});
