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
  const sendBulk = () => {
    let message = prompt("Welche Nachricht wollen Sie senden?");
    if(message.length === 0) return;
    if(!confirm(`Wollen Sie die Nachricht "${message}" (${message.length} Zeichen) senden?`)) return;
    fetchJson("/api/admin/info", {message});
  }
  const money = () => {
    let money = +prompt("Wieviel Geld wollen Sie auszahlen");
    if(money === 0) return;
    if(!confirm(`Wollen Sie wirklich ${money} gpoints senden?`)) return;
    fetchJson("/api/admin/money", {money});
  }
  return user?.admin ? <div>
    <Title>Administrator</Title>
    <button className="bg-pohutukawa-300 p-2 m-2 text-white rounded" onClick={release}>Dividenden ausschütten</button>
    <button className="bg-pohutukawa-300 p-2 m-2 text-white rounded" onClick={sendBulk}>Nachricht schicken</button>
    <button className="bg-pohutukawa-300 p-2 m-2 text-white rounded" onClick={money}>Geld ausschütten</button>
  </div> : null;
}