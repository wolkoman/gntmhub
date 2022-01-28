import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';
import {calculatePrice} from '../../../util/market';

export default withApiAuthRequired(async function test(req, res) {

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

    res.json({
        users: users.map(user => ({
                name: user.username,
                image: user.image,
                score: user.points.toNumber() + user.Stock.filter(stock => stock.active)
                    .map(stock => -calculatePrice(
                        candidatesStock.find(candidatesStock => candidatesStock.name === stock.candidate.name)!.stock,
                        -stock.amount
                    ))
                    .reduce((x, a) => x + a, 0)
            })
        )
    })


});
