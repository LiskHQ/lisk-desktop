import React from 'react';
import { Route, Link } from 'react-router-dom';
import Header from '../header';
import Account from '../account';
import Login from '../login';
import Transactions from '../transactions';
import Voting from '../voting';
import Forging from '../forging';
import styles from './app.css';
import Metronome from '../../utils/metronome';
import Dialog from '../dialog';
  // temporary, will be deleted with #347

const App = () => {
  // start dispatching sync ticks
  const metronome = new Metronome();
  metronome.init();

  return (
    <section className={styles['body-wrapper']}>
      <Header />
      <main className=''>
        <Route path="/main" render={({ match }) => (
          <main className=''>
            <Account />
            <Link to='/main/transactions'>Transactions</Link>
            <Link to='/main/voting'>Voting</Link>
            <Link to='/main/forging'>Forging</Link>
            <Route path={`${match.url}/transactions`} component={Transactions}/>
            <Route path={`${match.url}/voting`} component={Voting}/>
            <Route path={`${match.url}/forging`} component={Forging}/>
          </main>
        )} />
        <Route exact path="/" component={Login} />
      </main>

      <Dialog />
    </section>
  );
};

export default App;
