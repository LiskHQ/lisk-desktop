import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Header from '../header';
import Account from '../account';
import Login from '../login';
import Transactions from '../transactions';
import Voting from '../voting';
import Forging from '../forging';
import styles from './app.css';
import Metronome from '../../utils/metronome';
import { setActivePeer } from '../../utils/api/peers';
import { accountUpdated } from '../../actions/account';
import Dialog from '../dialog';
  // temporary, will be deleted with #347
import { getAccount } from '../../utils/api/account';

  // temporary, will be deleted with #347
const network = {
  address: 'http://localhost:4000',
  testnet: true,
  nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
};

const App = (props) => {
  // start dispatching sync ticks
  const metronome = new Metronome();
  metronome.init();

  // temporary, will be deleted with #347
  setActivePeer(network);
  getAccount(props.store.getState().peers.data, '16313739661670634666L').then((result) => {
    props.store.dispatch(accountUpdated(Object.assign({}, result, {
      passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
    })));
  });

  return (
    <Router>
      <section className={styles['body-wrapper']}>
        <Header />
        <main className=''>
          <Route path="/main" render={({ match }) => (
            <main className=''>
              <Account></Account>
              <Route path={`${match.url}/transactions`} component={Transactions}/>
              <Route path={`${match.url}/voting`} component={Voting}/>
              <Route path={`${match.url}/forging`} component={Forging}/>
            </main>
          )} />
          <Route exact path="/" component={Login} />
        </main>

        <Link to='/'>Login</Link>
        <Link to='/main/transactions'>Transactions</Link>
        <Link to='/main/voting'>Voting</Link>
        <Link to='/main/forging'>Forging</Link>
        <Dialog />
      </section>
    </Router>
  );
};

export default App;
