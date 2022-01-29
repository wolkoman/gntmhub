import type {NextPage} from 'next'
import Link from 'next/link';
import {useUser} from '@auth0/nextjs-auth0';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {Brand} from "../components/Brand";

const Home: NextPage = () => {

    const router = useRouter();
    const {user} = useUser();
    const [timeLeft, setTimeLeft] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const func = () => {
            const secondsLeft = Math.round((new Date(2022, 0, 29, 19).getTime() - new Date().getTime()) / 1000);
            const minutesLeft = Math.floor(secondsLeft / 60);
            const hoursLeft = Math.floor(minutesLeft / 60);
            setTimeLeft(`${hoursLeft.toString().padStart(2, '0')}:${(minutesLeft % 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`);
            setOpen(secondsLeft < 0);
        };
        func();
        const interval = setInterval(func, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (user) router.push('/app');
    }, [user]);

    return <>
        <Head>
            <title>GNTMHUB</title>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link rel="icon" type="image/png" href="/g.png"/>
        </Head>
        <div className="h-screen w-screen">
            <video autoPlay={true} muted className="object-cover absolute top-0 left-0 w-screen h-screen" loop={true}>
                <source src="https://data.eni.wien/storage/uploads/2022/01/29/gntm_uid_61f56bcd970bb.mp4" />
            </video>
            <div
                className="inline-block shadow-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-dark p-12 text-center relative z-10">
                <div className="flex justify-center">
                <Brand/></div>
                <div className="max-w-xl mx-auto font-display my-4">
                    Die virtuelle, just-for-fun Plattform zu der Casting-Serie „Germanys Next Topmodel“ mit
                    Aktienhandel,
                    Bonusfragen und Ranglisten.
                </div>

                {!open &&
                    <div className="bg-dark text-white font-display font-bold px-4 py-2 inline-block opacity-50"> Start
                        in {timeLeft}</div>}
                {open && <Link href="/api/auth/login"><a
                    className="bg-primary text-white font-display font-bold px-4 py-2 inline-block">Login</a></Link>}
            </div>
        </div>
    </>
}

export default Home
