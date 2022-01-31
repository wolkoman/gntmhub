import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';
import {calculatePrice} from '../../../util/market';

export default withApiAuthRequired(async function test(req, res) {

    const {user: authUser} = getSession(req, res)!;
    const prisma = new PrismaClient();
    if (!req.body.name) {
        res.status(400).json({error: 'Wrong name'});
        return;
    }

    await prisma.leaderboard.create({
        data: {
            name: req.body.name,
            Membership: {create: {owner: true, userMail: authUser.email}},
            code: makeid()
        }
    });

    res.status(200).json({});

});
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}