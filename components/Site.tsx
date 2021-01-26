import Head from "next/head";
import React from "react";

export function Site({ children }) {
  return (
    <div className="min-h-screen bg-gray-darkest text-white">
      <Head>
        <title>GntmHub</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#c0fd00" />
      </Head>

      <main>{children}</main>
    </div>
  );
}
