import Head from 'next/head';
import {ReactNode} from 'react';
import {MobileTop, Navigation} from './Navigation';

export function Site(props: { children: ReactNode }) {

    return <><Head>
        <title>GNTMHUB</title>
        <meta name="description" content="Hub for Germany's Next Topmodel"/>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#eee"/>
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#222"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link rel="icon" type="image/png" href="/g.png"/>
        <link rel="manifest" href="js13kpwa.webmanifest"/>
    </Head>
        <div className="flex flex-col-reverse lg:flex-row mx-auto max-w-[800px] lg:mx-0 lg:max-w-none h-screen text-dark bg-smudge">
            <Navigation/>
            <div className="w-full h-full relative overflow-y-hidden">
                <div className="h-full overflow-y-overlay overlay lg:p-6 px-4">
                    {props.children}
                </div>
            </div>
            <MobileTop/>
        </div>
    </>;
}