import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';

export default withApiAuthRequired(async function test(req, res) {

    if(req.body.locked === undefined) {
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

    await prisma.candidate.updateMany({
        where: {terminated: false},
        data: {locked: !!req.body.locked}
    });

    res.status(200).json({});

});
