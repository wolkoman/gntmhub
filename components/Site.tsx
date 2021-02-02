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
        <meta name="theme-color" content="#ffffff" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico.png" />
      </Head>
      {navigation ? <Navigation /> : null}
      <main className="w-full max-w-4xl px-4 mx-auto mt-4">{children}</main>
      {navigation ? <Footer /> : null}
    </div>
  );
}
