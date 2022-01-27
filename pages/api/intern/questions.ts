import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';

export default withApiAuthRequired(async function test(req, res) {

    const {user: authUser} = getSession(req, res)!;
    const prisma = new PrismaClient();

    const questions = await prisma.question.findMany({
        select: {
            id: true,
            text: true,
            option: true,
            deadline: true,
            answerId: true,
            Answer: {where: {user: {mail: {equals: authUser.email}}}}
        },
    });

    res.status(200).json({questions});

});
