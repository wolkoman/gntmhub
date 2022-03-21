import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';
import {calculatePrice} from '../../../util/market';

export default withApiAuthRequired(async function test(req, res) {

    const {user: authUser} = getSession(req, res)!;
    const prisma = new PrismaClient();

    if (!req.body.winnerPhrase) {
        res
            .status(402)
            .json({error: 'Please provide a winner phrase'});
        return;
    }

    await prisma.user.update({where: {mail: authUser.email}, data: {winnerPhrase: req.body.winnerPhrase.substring(0,100)}});
    res.status(200).json({});

});
