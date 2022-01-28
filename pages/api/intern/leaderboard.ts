import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import {PrismaClient} from "@prisma/client";

export default withApiAuthRequired(async function test(req, res) {

    const prisma = new PrismaClient();



});
