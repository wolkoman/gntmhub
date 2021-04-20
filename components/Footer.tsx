import Link from "next/link";
import React from "react";
import { Route } from "../util/routes";

export function Footer() {
  return (
    <div className="flex justify-center mt-32 pb-8 font-bold opacity-50">
      <Link href={Route.IMPRESSUM}>
        <div className="cursor-pointer">Impressum</div>
      </Link>
    </div>
  );
}