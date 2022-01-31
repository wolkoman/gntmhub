import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';
import {calculatePrice} from '../../../util/market';

export default withApiAuthRequired(async function test(req, res) {

    const {user: authUser} = getSession(req, res)!;
    const prisma = new PrismaClient();


    const users = await prisma.user.findMany({
        select: {
            username: true,
            image: true,
            points: true,
            Stock: {select: {candidate: {select: {name: true}}, amount: true, active: true}}
        }
    });

    const candidates = users[0].Stock.map(stock => stock.candidate.name)!;
    const stocks = users.reduce<{ name: string, amount: number }[]>((stocks, user) => [...stocks, ...user.Stock.filter(stock => stock.active).map(stock => ({
        amount: stock.amount,
        name: stock.candidate.name
    }))], []);
    const candidatesStock = candidates.map(name => ({
        name, stock:
            stocks
                .filter(stock => stock.name === name && stock)
                .reduce<number>((x, a) => x + a.amount, 0)
    }))!;

    const leaderboards = await prisma.user.findUnique({
        where: {mail: authUser.email},
        include: {Membership: {include: {Leaderboard: {include: {Membership: {include: {User: {select: {image: true}}}}}}}}}
    });

    res.json({leaderboards: leaderboards!.Membership.map(membership => ({
        owner: membership.owner,
        name: membership.Leaderboard.name,
        code: membership.Leaderboard.code,
        users: membership.Leaderboard.Membership.map(membership => {
                const user = users.find(u => membership.User.image === u.image)!;
                return ({
                    name: user.username,
                    image: user.image,
                    score: user.points.toNumber() + user.Stock.filter(stock => stock.active)
                        .map(stock => -calculatePrice(
                            candidatesStock.find(candidatesStock => candidatesStock.name === stock.candidate.name)!.stock,
                            -stock.amount
                        ))
                        .reduce((x, a) => x + a, 0)
                });
            }
        )
    }))});

});
