import React from 'react';
import { Route } from 'react-router-dom';
import DefaultLayout from '../defaultLayout';
import Header from '../header';
import Login from '../login';
import Transactions from '../transactions';
import Voting from '../voting';
import Forging from '../forging';
import styles from './app.css';
import Metronome from '../../utils/metronome';
import Dialog from '../dialog';
  // temporary, will be deleted with #347

// start dispatching sync ticks
const metronome = new Metronome();
metronome.init();

const App = () => (
  <section className={styles['body-wrapper']}>
    <Header />
    <main>
      <DefaultLayout path='/transactions' component={Transactions} />
      <DefaultLayout path='/voting' component={Voting} />
      <DefaultLayout path='/forging' component={Forging} />
      <Route exact path="/" component={Login} />
    </main>
    <Dialog />
  </section>
);

export default App;
