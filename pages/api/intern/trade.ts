import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {PrismaClient} from "@prisma/client";
import {calculatePrice, calculateStockPrice, payout} from '../../../util/market';

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
    const candidate = await prisma.candidate.findUnique({where: {name: reqCandidateName}, select: {terminated: true}});
    const stocksResult = await prisma.stock.groupBy({
        by: ['candidateName'],
        _sum: {amount: true},
        where: {candidateName: reqCandidateName}
    });
    const stocks = stocksResult[0]._sum.amount!;

    const price = calculatePrice(stocks, reqAmount);
    if (!candidate || candidate.terminated) {
        res
            .status(402)
            .json({error: "Die Aktie ist eingefroren"});
        return;
    }
    if (reqPrice !== price) {
        res
            .status(402)
            .json({error: "Der Preis hat sich geändert", newStock: stocks});
        return;
    }
    if (price > user.points.toNumber() + payout()) {
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

    const newPoints = Math.round((user.points.toNumber() - price)*100000)/100000;
    await prisma.user.update({
        where: {mail: user.mail},
        data: {points: newPoints}
    });
    await prisma.stock.updateMany({
        where: {
            candidate: {name: reqCandidateName},
            user: {mail: user.mail}
        },
        data: {amount: {increment: reqAmount}}
    });

    res.json({newStock: stocks + reqAmount, newPoints});
});
