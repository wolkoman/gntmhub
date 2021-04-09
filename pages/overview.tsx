import React from 'react';
import {Site} from '../components/Site';
import Overview from '../components/Overview';
import {Administrator} from '../components/Administrator';

export default function Home() {
  return (
    <Site>
      <Overview/>
      <Administrator/>
    </Site>
  );
}
