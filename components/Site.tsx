import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import {Footer} from './Footer';
import {Navigation} from './Navigation';
import {useStore} from '../util/store';

export function Site({children, navigation = true, responsive = true}: {
  navigation?: boolean;
  children: any;
  responsive?: boolean;
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
        {responsive ? <Responsive><div className="my-20">{children}</div></Responsive> : children}
        {navigation ? <Footer/> : null}</>}
    </div>
  );
}

export const Responsive = ({children}) => {
  return <main className="w-full max-w-4xl px-4 mx-auto mt-4">{children}</main>;
}

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setProgress(p => p === 1 ? 0 : p+1), 700);
    return () => clearInterval(interval);
  }, [setProgress])
  return <div className="w-screen h-screen flex justify-center items-center">
    <div className={`font-serif font-bold ${progress ? 'text-2xl' : 'text-4xl'} transition-all duration-1000`}>g</div>
  </div>;
}