import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';

export default withApiAuthRequired(async function test(req, res) {

    if(!req.body.question || !req.body.options) {
        res.status(400).json({});
        return;
    }

    const {user: authUser} = getSession(req, res)!;
    const prisma = new PrismaClient();

    await prisma.questionSubmission.create({data: {
        text: req.body.question,
        option: req.body.options,
        accepted: false,
        handled: false,
        userMail: authUser.email
    }});

    res.status(200).json({});

});
