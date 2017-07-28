import React from 'react';
import { Route } from 'react-router-dom';
import PrivateRoutes from '../privateRoute';
import Account from '../account';
import Header from '../header';
import Login from '../login';
import Transactions from '../transactions';
import Voting from '../voting';
import Forging from '../forging';
import styles from './app.css';
import Metronome from '../../utils/metronome';
import Dialog from '../dialog';
import Tabs from '../tabs';
import LoadingBar from '../loadingBar';

// start dispatching sync ticks
const metronome = new Metronome();
metronome.init();

const App = () => (
  <section className={styles['body-wrapper']}>
    <Header />
    <main>
      <PrivateRoutes path='/main' render={ ({ match }) => (
        <main>
          <Account />
          <Tabs />
          <Route path={`${match.url}/transactions`} component={Transactions} />
          <Route path={`${match.url}/voting`} component={Voting} />
          <Route path={`${match.url}/forging`} component={Forging} />
        </main>
      )} />
      <Route exact path="/" component={Login} />
    </main>
    <Dialog />
    <LoadingBar />
  </section>
);

export default App;
