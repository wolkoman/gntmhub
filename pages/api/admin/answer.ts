import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';
import is from '@sindresorhus/is';
import undefined = is.undefined;
import {payout} from '../../../util/market';
import {getCurrentTimeBlock} from '../../../util/timeBlock';

export default withApiAuthRequired(async function test(req, res) {

    if (req.body.questionId === undefined || req.body.answerIndex === undefined) {
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

    // answer question
    await prisma.question.update({where: {id: req.body.questionId}, data:{ answerId: req.body.answerIndex}});

    // give price
    const price = 1;
    const correctAnswers = await prisma.answer.findMany({where: {questionId: req.body.questionId, answerIndex: req.body.answerIndex}});
    const users = await prisma.$transaction(correctAnswers.map(answer => prisma.user.update({
        where: {mail: answer.userMail},
        data: {points: {increment: price}}
    })));
    await prisma.$transaction(users.map(user => prisma.userHistory.upsert({
        where: {userMail_time: {time: getCurrentTimeBlock(), userMail: user.mail}},
        create: {userMail: user.mail, time: getCurrentTimeBlock(), points: user.points },
        update: {points: user.points}
    })));


    res.status(200).json({});


});
