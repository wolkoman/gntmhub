import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import {Footer} from './Footer';
import {Navigation} from './Navigation';
import {useStore} from '../util/store';

export function Site({children, navigation = true}: {
  navigation?: boolean;
  children: any;
}) {
  const [loading] = useStore(state => [state.loading]);
  return (
    <div className="min-h-screen text-black">
      <Head>
        <title>GntmHub</title>
        <meta name="theme-color" content="#ffffff"/>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico.png"/>
      </Head>
      {loading ? <LoadingScreen/> : <>
        {navigation ? <Navigation/> : null}
        <main className="w-full max-w-4xl px-4 mx-auto mt-4">{children}</main>
        {navigation ? <Footer/> : null}</>}
    </div>
  );
}

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setProgress(p => p === 3 ? 0 : p+1), 500);
    return () => clearInterval(interval);
  }, [setProgress])
  return <div className="w-screen h-screen flex justify-center items-center"><div>loading{Array(progress).fill(".")}</div></div>;
}