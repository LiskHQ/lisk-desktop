import React from 'react';
import { Route } from 'react-router-dom';
import Account from '../account';
import PrivateRoutes from '../privateRoute';
import Header from '../header';
import Login from '../login';
import Transactions from '../transactions';
import Voting from '../voting';
import Forging from '../forging';
import styles from './app.css';
import Dialog from '../dialog';
import Toaster from '../toaster';
import Tabs from '../tabs';
import Register from '../register';
import LoadingBar from '../loadingBar';
import OfflineWrapper from '../offlineWrapper';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';

const App = () => (
  <OfflineWrapper>
    <div className={styles.stageStripes}>
      <span className={styles.stageStripe}></span>
      <span className={styles.stageStripe}></span>
      <span className={styles.stageStripe}></span>
      <span className={styles.stageStripe}></span>
      <span className={styles.stageStripe}></span>
      <span className={styles.stageStripe}></span>
      <span className={styles.stageStripe}></span>
      <span className={styles.stageStripe}></span>
      <span className={styles.stageStripe}></span>
      <span className={styles.stageStripe}></span>
      <span className={styles.stageStripe}></span>
      <span className={styles.stageStripe}></span>
    </div>
    <main className={`${styles.bodyWrapper}`}>
      <aside>
        <Tabs />
      </aside>
      <section>
        <div className={styles.mainBox}>
          <Header />
          <PrivateRoutes path='/main' render={ ({ match }) => (
            <main className={offlineStyle.disableWhenOffline}>
              <Account />
              <Route path={`${match.url}/transactions/:dialog?`} component={Transactions} />
              <Route path={`${match.url}/voting/:dialog?`} component={Voting} />
              <Route path={`${match.url}/forging/:dialog?`} component={Forging} />
            </main>
          )} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/" component={Login} />
        </div>
        <Dialog />
        <Toaster />
        <LoadingBar />
      </section>
    </main>
  </OfflineWrapper>
);

export default App;
