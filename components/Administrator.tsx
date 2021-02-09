import {Title} from './Title';
import React from 'react';
import {fetchJson} from '../util/fetchJson';

export function Administrator(){
  const release = () => {
    if(!confirm("Wollen Sie das wirklich tun?")) return;
    fetchJson("/api/market/payout");
  }
  return <div>
    <Title>Administrator</Title>
    <button className="bg-pohutukawa-300 p-2 text-white rounded" onClick={release}>Dividenden ausschütten</button>
  </div>;
}