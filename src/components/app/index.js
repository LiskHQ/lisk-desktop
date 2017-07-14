import React from 'react';
import { BrowserRouter as Router, Route, browserHistory, Link } from 'react-router-dom';
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

// temporarily hard-coded
const network = {
  address: 'http://localhost:4000',
  testnet: true,
  nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
};

const accountInfo = {
  account: {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-nano',
    passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
    publicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
  },
  address: '16313739661670634666L',
  peers: {
    online: true,
    active: {
      currentPeer: 'localhost',
      port: 4000,
      options: {
        name: 'Custom Node',
      },
    },
  },
  balance: '99992689.6',
};

const App = (props) => {
  // start dispatching sync ticks
  const metronome = new Metronome();
  metronome.init();

  // temporarily
  props.store.dispatch(accountUpdated(accountInfo));
  setActivePeer(props.store, network);

  const state = props.store.getState();
  return (
    <Router history={browserHistory}>
      <section className={styles['body-wrapper']}>
        <Header account={state.account.account} />
        <main className=''>
          <Route path="/main" render={({ match }) => (
            <main className=''>
              <Account {...state.account}></Account>
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
