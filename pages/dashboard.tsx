import React, { useState } from "react";
import { Site } from "../components/Site";
import { Title } from "../components/Title";
import { CandidateEntity, getCollection, UserEntity } from "../util/mongo";
import { CandidateModal } from "../components/CandidateModal";
import { NextPageContext } from "next";
import { getUserFromRequest } from "../util/authorization";
import { MarketService } from "../util/MarketService";
import LeaderBoard from "../components/leaderboard";
import { calculatePrice } from "../util/market";

export default function Home({ candidates, user, users, stocks }) {
  const [activeCandidate, setCandidateModal] = useState<string | null>(null);
  return (
    <Site>
      <Title>Kandidatinnen</Title>
      {activeCandidate ? (
        <CandidateModal
          onClose={() => {
            setCandidateModal(null);
          }}
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
            className="w-28 h-28 md:w-36 md:h-36 rounded md:m-2 m-1 cursor-pointer flex flex-col justify-between"
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
            <div className="font-serif text-5xl text-white text-right m-1">
              {calculatePrice(stocks, candidate._id, 1).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <Title>Rangliste</Title>
      <LeaderBoard users={users} stocks={stocks} userId={user._id.toString()} />
    </Site>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const candidateCollection = await getCollection(CandidateEntity);
  const candidates = await candidateCollection.find({}).toArray();
  candidateCollection.close();

  const userCollection = await getCollection(UserEntity);
  const users = await userCollection.find({}).toArray();
  userCollection.close();

  const user = await getUserFromRequest(context.req);
  if (!user) {
    context.res.statusCode = 302;
    context.res.setHeader("Location", "/");
    context.res.end();
    return;
  }
  return {
    props: {
      users: users.map(user => ({ ...user, _id: user._id.toString() })),
      stocks: await MarketService.getStocks(),
      user: { ...user, _id: user._id.toString() },
      candidates: candidates.map(candidate => ({
        ...candidate,
        _id: candidate._id.toString(),
      })),
    },
  };
}
