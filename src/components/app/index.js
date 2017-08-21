import React from 'react';
import { Route } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import PrivateRoutes from '../privateRoute';
import Account from '../account';
import Header from '../header';
import Login from '../login';
import Transactions from '../transactions';
import Voting from '../voting';
import Forging from '../forging';
import styles from './app.css';
import Dialog from '../dialog';
import Toaster from '../toaster';
import Tabs from '../tabs';
import LoadingBar from '../loadingBar';

const App = () => (
  <section className={`${grid.row} ${styles['body-wrapper']}`}>
    <div className={`${grid['col-xs-12']} ${grid['col-sm-12']} ${grid['col-md-10']} ${grid['col-md-offset-1']}`}>
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
      <Toaster />
      <LoadingBar />
    </div>
  </section>
);

export default App;
