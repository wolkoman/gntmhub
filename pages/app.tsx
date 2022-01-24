import {useUser} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client'
import type {NextPage} from 'next'
import Link from 'next/link';
import {Site} from '../components/Site';

const Home: NextPage<{ posts: any }> = (props: { posts: any }) => {

    const {user, error, isLoading} = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return <Site>
        <main className="bg-red-400">
            Test {JSON.stringify(props)}
            <Link href="/api/auth/login">Login</Link>
            <Link href="/api/auth/logout">Logout</Link>
        </main>

        {(
            user && (
                <div>
                    <img src={user.picture!} alt={user.name!}/>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                </div>
            ))}
    </Site>
}

export async function getServerSideProps() {
    const prisma = new PrismaClient();
    return {props: {posts: (await prisma.user.findMany()).map(x => ({...x, createdAt: null}))}};
}

export default Home
