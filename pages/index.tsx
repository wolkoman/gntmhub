import {useUser} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client'
import type {NextPage} from 'next'
import Link from 'next/link';
import {Site} from '../components/Site';

const Home: NextPage<{ posts: any }> = (props: { posts: any }) => {
    return <Site>
        <main className="bg-red-400">
            <Link href="/api/auth/login">Login</Link>
            <Link href="/api/auth/logout">Logout</Link>
        </main>
    </Site>
}

export default Home
