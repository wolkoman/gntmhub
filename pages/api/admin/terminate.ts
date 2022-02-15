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

    res.status(200).json({});

});