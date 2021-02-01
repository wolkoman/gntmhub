import Head from "next/head";
import React from "react";
import { Footer } from "./Footer";
import { Navigation } from "./Navigation";

export function Site({
  children,
  navigation = true,
}: {
  navigation?: boolean;
  children: any;
}) {
  return (
    <div className="min-h-screen text-black">
      <Head>
        <title>GntmHub</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#c0fd00" />
      </Head>
      {navigation ? <Navigation /> : null}
      <main className="w-full max-w-4xl px-4 mx-auto mt-4">{children}</main>
      <Footer />
    </div>
  );
}
