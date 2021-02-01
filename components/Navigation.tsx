import Link from "next/link";
import React from "react";

export function Navigation() {
  return (
    <div className="p-4 border-b font-bold border-black">
      <Link href="/">
        <div className="text-2xl font-serif cursor-pointer">
          gntm<span className="text-brand">hub</span>
        </div>
      </Link>
    </div>
  );
}
