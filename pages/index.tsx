import type {NextPage} from 'next'
import Link from 'next/link';
import {useUser} from '@auth0/nextjs-auth0';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

const Home: NextPage = () => {

    const router = useRouter();
    const {user} = useUser();
    const [timeLeft, setTimeLeft] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const func = () => {
            const secondsLeft = Math.round((new Date(2022,0,29,19).getTime() - new Date().getTime())/1000);
            const minutesLeft = Math.floor(secondsLeft / 60);
            const hoursLeft = Math.floor(minutesLeft / 60);
            setTimeLeft(`${hoursLeft.toString().padStart(2, '0')}:${(minutesLeft  % 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`);
            setOpen(secondsLeft < 0);
        };
        func();
        const interval = setInterval(func, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (user) router.push('/app');
    }, [user]);

    return <div className="bg-light text-dark min-h-screen p-12 text-center">

        <div className="font-display font-bold text-3xl ">GNTMHUB</div>

        <div className="max-w-xl mx-auto font-display my-4">
            Die virtuelle, just-for-fun Plattform zu der Casting-Serie „Germanys Next Topmodel“ mit Aktienhandel, Bonusfragen und Ranglisten.
        </div>

        {!open &&<div className="bg-dark text-white font-display font-bold px-4 py-2 inline-block opacity-50"> Start in {timeLeft}</div>}
        {open && <Link href="/api/auth/login"><a className="bg-dark text-white font-display font-bold px-4 py-2 inline-block">Login</a></Link>}
    </div>
}

export default Home
