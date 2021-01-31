import React, { useEffect, useState } from "react";
import { Site } from "../components/Site";
import { fetchJson } from "../util/fetchJson";
import { useJwt } from "../util/jwt";
import { CandidateEntity, getCollection } from "../util/mongo";
import { Route } from "../util/routes";

export default function Home({ candidates }) {
  const jwt = useJwt({ dontRedirectTo: Route.DASHBOARD });
  return (
    <Site>
      <div className="font-serif text-4xl">
        Hallo <span className="text-brand">{jwt?.name}!</span>
      </div>
      <div className="font-serif text-4xl">Kandidatinnen</div>
      <div className="flex flex-wrap">
        {candidates.map(candidate => (
          <div
            key={candidate._id}
            className="w-36 h-36 rounded m-2"
            style={{
              backgroundImage: candidate.terminated
                ? ""
                : `url(${candidate.imageUrl})`,
              backgroundSize: "cover",
            }}
          >
            <div
              className={"p-1" + (candidate.terminated ? " line-through" : "")}
            >
              {candidate.name}
            </div>
          </div>
        ))}
      </div>
    </Site>
  );
}

export async function getServerSideProps() {
  const db = await getCollection(CandidateEntity);
  const candidates = await db.find({}).toArray();
  db.close();

  console.log(candidates);

  return {
    props: {
      candidates: candidates.map(candidate => ({
        ...candidate,
        _id: candidate._id.toString(),
      })),
    },
  };
}
