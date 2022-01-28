import type {AppProps} from 'next/app'
import {UserProvider} from '@auth0/nextjs-auth0';
import '../styles/globals.css'
import nightwind from "nightwind/helper"
import {useEffect, useState} from 'react';

function MyApp({Component, pageProps}: AppProps) {
    const [word, setWord] = useState("darkmoda");
    useEffect(() => {
        if(word === "darkmode") nightwind.toggle();
    },[word])
    useEffect(() => {
        const keydown = (event: KeyboardEvent) => setWord(w => w.substring(1) + event.key);
        window.addEventListener("keydown", keydown);
        return () => window.removeEventListener("keydown", keydown);
    }, []);

    return <UserProvider>
        <script dangerouslySetInnerHTML={{ __html: nightwind.init() }} />
        <Component {...pageProps} />
    </UserProvider>
}

export default MyApp
