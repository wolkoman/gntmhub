import React, { useEffect, useState } from "react";
import { Site } from "../components/Site";
import { Title } from "../components/Title";
import { fetchJson } from "../util/fetchJson";
import { useJwt } from "../util/jwt";
import { CandidateEntity, getCollection } from "../util/mongo";
import { Route } from "../util/routes";

export default function Home({ candidates }) {
  const jwt = useJwt({ dontRedirectTo: Route.DASHBOARD });
  return (
    <Site>
      <Title>Kandidatinnen</Title>
      <div className="flex flex-wrap">
        {candidates.map(candidate => (
          <div
            key={candidate._id}
            className="w-28 h-28 md:w-36 md:h-36 rounded m-2 cursor-default justify-center"
            style={{
              backgroundImage: `url(${candidate.imageUrl})`,
              filter: candidate.terminated ? "grayscale(1)" : "",
              opacity: candidate.terminated ? 0.7 : 1,
              backgroundSize: "cover",
            }}
          >
            <div
              className={
                "p-1 text-white" + (candidate.terminated ? " line-through" : "")
              }
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

  return {
    props: {
      candidates: candidates.map(candidate => ({
        ...candidate,
        _id: candidate._id.toString(),
      })),
    },
  };
}
