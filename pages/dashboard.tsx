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
import { CandidateList } from "../components/CandidateList";

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
      <CandidateList
        candidates={candidates}
        onCandidate={id => setCandidateModal(id)}
        stocks={stocks}
      />
      <Title>Liste</Title>
      <LeaderBoard
        users={users}
        stocks={stocks}
        userId={user._id.toString()}
        candidates={candidates}
      />
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
