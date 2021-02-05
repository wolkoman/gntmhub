import Link from "next/link";
import React from "react";
import { useStore } from "../util/store";

export function Navigation() {
  const isLoggedIn = useStore(state => state.isLoggedIn());
  return (
    <div className="p-4 border-b border-black flex items-end justify-between">
      <Link href="/">
        <div className="text-2xl font-serif font-bold cursor-pointer">
          gntmhub
        </div>
      </Link>
      {isLoggedIn ? (
        <div className="flex">
          <Link href="/dashboard">
            <div className="text-md cursor-pointer px-4 uppercase">
              Kandidatinnen
            </div>
          </Link>
          <Link href="/leaderboard">
            <div className="text-md cursor-pointer px-4 uppercase">
              Rangliste
            </div>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
