import React from "react";
import { Site } from "../components/Site";
import Link from "next/link";

export default function Home() {
  const test = () => {
    fetch("/api/user/auth", {
      method: "POST",
      body: JSON.stringify({ username: "wolkoman", password: "wolkoman" }),
      headers: { "Content-Type": "application/json" },
    }).then(console.log);
  };

  return (
    <Site>
      <div className="p-4 border border-black">
        <div className="text-4xl font-serif">
          GNTM<span className="text-brand">HUB</span>
        </div>
      </div>
      <main className="flex justify-center items-center mt-32">
        <div className="w-full max-w-2xl px-4">
          <div className="font-serif text-6xl md:text-8xl">
            There can only be one.
            <div className="opacity-60">
              Show the world that you know her already!
            </div>
          </div>
          <div className="flex mt-8">
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
    </Site>
  );
}
