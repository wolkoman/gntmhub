import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';

export default withApiAuthRequired(async function test(req, res) {

    if(req.body.questionId === undefined || req.body.answerIndex === undefined) {
        res.status(400).json({});
        return;
    }

    const {user: authUser} = getSession(req, res)!;
    const prisma = new PrismaClient();

    const question = await prisma.question.findUnique({where: {id: req.body.questionId } });

    if(!question || question.deadline.getTime() < new Date().getTime()){
        res.status(402).json({});
        return;
    }

    await prisma.answer.upsert({
        where: {userMail_questionId: {userMail: authUser.email, questionId: req.body.questionId}},
        create: {questionId: req.body.questionId, userMail: authUser.email, answerIndex: req.body.answerIndex },
        update: {answerIndex: req.body.answerIndex }
    });

    res.status(200).json({});

});
