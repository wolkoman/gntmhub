import Link from "next/link";
import React from "react";
import { useStore } from "../util/store";

export function Navigation() {
  const [isLoggedIn, loading] = useStore(state => [
    state.isLoggedIn(),
    state.loading,
  ]);
  return (
    <div className="p-4 border-b border-black flex items-end justify-between">
      <Link href="/">
        <div className="text-2xl font-serif font-bold cursor-pointer">
          gntmhub
        </div>
      </Link>
      {loading ? (
        <div className="bg-gray-200 p-1 px-2 rounded text-gray-600 uppercase text-sm">
          LÄDT
        </div>
      ) : null}
      {isLoggedIn ? (
        <div className="flex flex-col md:flex-row">
          <Link href="/overview">
            <div className="text-md cursor-pointer px-1 md:px-4 uppercase">
              Übersicht
            </div>
          </Link>
          <Link href="/candidates">
            <div className="text-md cursor-pointer px-1 md:px-4 uppercase">
              Kandidatinnen
            </div>
          </Link>
          <Link href="/leaderboard">
            <div className="text-md cursor-pointer px-1 md:px-4 uppercase">
              Rangliste
            </div>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
