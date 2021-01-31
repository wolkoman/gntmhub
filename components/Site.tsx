import Head from "next/head";
import React from "react";
import { Navigation } from "./Navigation";

export function Site({ children }) {
  return (
    <div className="min-h-screen bg-gray-darkest text-white">
      <Head>
        <title>GntmHub</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#c0fd00" />
      </Head>
      <Navigation />
      <main className="w-full max-w-4xl px-4 mx-auto mt-4">{children}</main>
    </div>
  );
}
