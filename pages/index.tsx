import React from "react";
import { Site } from "../components/Site";
import Link from "next/link";
import { Navigation } from "../components/Navigation";
import { Route } from "../util/routes";

export default function Home({test}) {
  return (
    <Site>
      <Navigation />
      <main className="flex justify-center items-center my-16 mt-32">
        <div className="w-full max-w-2xl px-4">
          <div className="text-5xl md:text-7xl font-bold">
            Es kann nur eine geben!{" "}
            <span className="opacity-60">Weißt du wer sie ist?</span>
          </div>
          <div className="flex my-8">
            <Link href={Route.LOGIN}>
              <div className="px-4 py-2 text-lg border border-brand text-brand font-bold rounded mr-4 cursor-pointer">
                Login
              </div>
            </Link>
            <Link href={Route.SIGNUP}>
              <div className="px-4 py-2 text-lg text-black font-bold bg-brand rounded cursor-pointer">
                Registrieren {test}
              </div>
            </Link>
          </div>
        </div>
      </main>
      <div>
        <div></div>
      </div>
    </Site>
  );
}

export function getServerSideProps(){
  return {props: {test: new Date().toDateString()}};
}