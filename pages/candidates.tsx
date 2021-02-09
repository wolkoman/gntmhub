import React, { useState } from "react";
import { Site } from "../components/Site";
import { Title } from "../components/Title";
import { CandidateModal } from "../components/CandidateModal";
import { CandidateList } from "../components/CandidateList";
import { Portfolio } from '../components/Portfolio';

export default function Home() {
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null);
  return (
    <Site>
      <Title>Portfolio</Title>
      <Portfolio onSelect={id => setActiveCandidate(id)}/>
      <Title>Kandidatinnen</Title>
      {activeCandidate ? (
        <CandidateModal
          onClose={() => setActiveCandidate(null)}
          candidateId={activeCandidate}
        />
      ) : null}
      <CandidateList onCandidate={id => setActiveCandidate(id)} />
    </Site>
  );
}
