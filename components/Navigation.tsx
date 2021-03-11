import Link from "next/link";
import React from "react";
import { useStore } from "../util/store";
import {Route} from '../util/routes';

export function Navigation() {
  const [isLoggedIn, loading] = useStore(state => [
    state.isLoggedIn(),
    state.loading,
  ]);
  return (
    <div className="p-4 bg-gray-100 flex items-end justify-between">
      <Link href="/">
        <div className="text-2xl font-serif font-bold cursor-pointer">
          gntmhub
        </div>
      </Link>
      {isLoggedIn ? (
        <div className="flex flex-col md:flex-row">
          <Link href={Route.OVERVIEW}>
            <div className="text-md cursor-pointer px-1 md:px-4 uppercase">
              Übersicht
            </div>
          </Link>
          <Link href={Route.TRADE}>
            <div className="text-md cursor-pointer px-1 md:px-4 uppercase">
              Handel
            </div>
          </Link>
          <Link href={Route.QUESTION}>
            <div className="text-md cursor-pointer px-1 md:px-4 uppercase">
              Fragen
            </div>
          </Link>
          <Link href={Route.LEADERBOARD}>
            <div className="text-md cursor-pointer px-1 md:px-4 uppercase">
              Rangliste
            </div>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
