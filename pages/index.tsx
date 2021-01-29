import React from "react";
import { Site } from "../components/Site";
import Link from "next/link";
import { Navigation } from "../components/Navigation";

export default function Home() {
  return (
    <Site>
      <Navigation />
      <main className="flex justify-center items-center my-16 mt-32">
        <div className="w-full max-w-2xl px-4">
          <div className="text-8xl md:text-7xl font-bold">
            Es kann nur eine geben!{" "}
            <span className="opacity-60">Weißt du wer sie ist?</span>
          </div>
          <div className="flex my-8">
            <Link href="/login">
              <div className="px-4 py-2 text-lg border border-brand text-brand font-bold rounded mr-4 cursor-pointer">
                Login
              </div>
            </Link>
            <Link href="/signup">
              <div className="px-4 py-2 text-lg text-black font-bold bg-brand rounded cursor-pointer">
                Registrieren
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
