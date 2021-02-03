import React, { useState } from "react";
import { Site } from "../components/Site";
import { Title } from "../components/Title";
import { CandidateEntity, getCollection, UserEntity } from "../util/mongo";
import { Modal } from "../components/Modal";
import { NextPageContext } from "next";
import { getUserFromRequest } from "../util/authorization";

export default function Home({ candidates, user, stocks }) {
  const [activeCandidate, setCandidateModal] = useState<string>();

  return (
    <Site>
      <Title>Kandidatinnen</Title>
      {activeCandidate ? (
        <Modal
          candidate={candidates.find(
            candidate => candidate._id === activeCandidate
          )}
          user={user}
          stocks={stocks}
        />
      ) : null}
      <div className="flex flex-wrap justify-center">
        {candidates.map(candidate => (
          <div
            key={candidate._id}
            className="w-28 h-28 md:w-36 md:h-36 rounded md:m-2 m-1 justify-center cursor-pointer"
            style={{
              backgroundImage: `url(${candidate.imageUrl})`,
              filter: candidate.terminated ? "grayscale(1)" : "",
              opacity: candidate.terminated ? 0.7 : 1,
              backgroundSize: "cover",
            }}
            onClick={() => setCandidateModal(candidate._id)}
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
  const candidateCollection = await getCollection(CandidateEntity);
  const candidates = await candidateCollection.find({}).toArray();
  candidateCollection.close();

  const user = await getUserFromRequest(context.req);
  if (!user) {
    context.res.statusCode = 302;
    context.res.setHeader("Location", "/");
    context.res.end();
  }

  return {
    props: {
      stocks: await getStocks(),
      user: { ...user, _id: user._id.toString() },
      candidates: candidates.map(candidate => ({
        ...candidate,
        _id: candidate._id.toString(),
      })),
    },
  };
}

async function getStocks() {
  const userCollection = await getCollection(UserEntity);
  const data = await userCollection
    .aggregate([
      { $project: { item: 1, stocks: { $objectToArray: "$stocks" } } },
      { $unwind: "$stocks" },
      { $group: { _id: "$stocks.k", total: { $sum: "$stocks.v" } } },
    ])
    .toArray();
  userCollection.close();
  return data;
}
