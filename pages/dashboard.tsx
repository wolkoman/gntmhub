import React, { useEffect, useState } from "react";
import { Site } from "../components/Site";
import { Title } from "../components/Title";
import { fetchJson } from "../util/fetchJson";
import { useJwt } from "../util/jwt";
import {CandidateEntity, getCollection, UserEntity} from "../util/mongo";
import { Route } from "../util/routes";
import {Modal} from "../components/Modal";
import {NextPageContext} from "next";
import {parse} from "cookie";
import {verify} from "jsonwebtoken";
import {ObjectId} from "bson";

export default function Home({ candidates, user }) {
  const jwt = useJwt({ dontRedirectTo: Route.DASHBOARD });
  const [activeCandidate, setCandidateModal] = useState<string>();

  function openModal(id: string) {
    setCandidateModal(id);
  }

  return (
    <Site>
      <Title>Kandidatinnen</Title>
      { activeCandidate ? <Modal candidate={candidates.find(candidate => candidate._id === activeCandidate)} user={user}/> : null}
      <div className="flex flex-wrap justify-center">
        {candidates.map(candidate => (
          <div
            key={candidate._id}
            className="w-28 h-28 md:w-36 md:h-36 rounded md:m-2 m-1 cursor-default justify-center cursor-pointer"
            style={{
              backgroundImage: `url(${candidate.imageUrl})`,
              filter: candidate.terminated ? "grayscale(1)" : "",
              opacity: candidate.terminated ? 0.7 : 1,
              backgroundSize: "cover",
            }}
            onClick={() =>{openModal(candidate._id)}}
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

export async function getServerSideProps(context: NextPageContext) {
  const db = await getCollection(CandidateEntity);
  const candidates = await db.find({}).toArray();
  db.close();

  const jwt = parse(context.req.headers.cookie).jwt;
  const jwtContent = verify(JSON.parse(jwt), process.env.JWT_SECRET);
  if(!jwtContent){
    return {};
  }

  const userCollection = await getCollection(UserEntity);
  const user = await userCollection.findOne({_id: ObjectId(jwtContent._id)});
  userCollection.close();

  return {
    props: {
      user: {...user, _id: user._id.toString()},
      candidates: candidates.map(candidate => ({
        ...candidate,
        _id: candidate._id.toString(),
      })),
    },
  };
}
