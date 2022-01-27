import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {PrismaClient} from "@prisma/client";

export default withApiAuthRequired(async function test(req, res) {

    const {user: authUser} = getSession(req, res)!;
    const prisma = new PrismaClient();

    async function getUser() {
        return await prisma.user.findFirst({
            where: {mail: authUser.email},
            include: {Stock: {select: {amount: true, candidateName: true}}}
        });
    }

    let user = await getUser();

    if (!user) {
        await prisma.user.create({data: {mail: authUser.email, points: 0, image: 'https://images.weserv.nl/?w=100&h=100&url='+authUser.picture, rawImage: authUser.picture, admin: false}});
        const candidates = await prisma.candidate.findMany();
        await prisma.stock.createMany({
            data: candidates.map(candidate => ({amount: 0, userMail: authUser.email, candidateName: candidate.name}))
        });
        user = await getUser();
    }

    res.json({user});
});
