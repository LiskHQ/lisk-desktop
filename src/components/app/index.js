import React from 'react';
import { BrowserRouter as Router, Route, browserHistory, Link } from 'react-router-dom';
import Header from '../header';
import Account from '../account';
import Login from '../login';
import Transactions from '../transactions';
import Voting from '../voting';
import Forging from '../forging';
import styles from './app.css';

const App = (props) => {
  const state = props.store.getState();
  return (
    <Router history={browserHistory}>
      <section className={styles['body-wrapper']}>
        <Header />
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
      </section>
    </Router>
  );
};

export default App;
