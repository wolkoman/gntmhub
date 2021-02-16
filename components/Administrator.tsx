import {Title} from './Title';
import React, {useState} from 'react';
import {fetchJson} from '../util/fetchJson';
import {useStore} from '../util/store';

export function Administrator(){
  const user = useStore(state => state.user);
  const release = () => {
    if(!confirm("Wollen Sie das wirklich tun?")) return;
    fetchJson("/api/admin/payout");
  }
  return user?.admin ? <div>
    <Title>Administrator</Title>
    <button className="bg-pohutukawa-300 p-2 text-white rounded" onClick={release}>Dividenden ausschütten</button>
  </div> : null;
}