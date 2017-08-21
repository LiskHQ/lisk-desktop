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
import Dialog from '../dialog';
import Toaster from '../toaster';
import Tabs from '../tabs';
import LoadingBar from '../loadingBar';
import OfflineWrapper from '../offlineWrapper';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';

const App = () => (
  <OfflineWrapper>
    <section className={styles['body-wrapper']}>
      <Header />
      <main>
        <PrivateRoutes path='/main' render={ ({ match }) => (
          <main className={offlineStyle.disableWhenOffline}>
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
    </section>
  </OfflineWrapper>
);

export default App;
