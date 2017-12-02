import React from 'react';
import { Route } from 'react-router-dom';
import Account from '../account';
import PrivateRoutes from '../privateRoute';
import Header from '../header';
import Login from '../login';
import Register from '../register';
import TransactionDashboard from '../transactionDashboard';
import Voting from '../voting';
import Forging from '../forging';
import styles from './app.css';
import BackgroundMaker from '../backgroundMaker';
import Dialog from '../dialog';
import Toaster from '../toaster';
import Tabs from '../tabs';
import MenuBar from '../menuBar';
import LoadingBar from '../loadingBar';
import OfflineWrapper from '../offlineWrapper';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import AccountVisualDemo from '../accountVisual/demo';

const App = () => (
  <OfflineWrapper>
    <BackgroundMaker />
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
              <Route path={`${match.url}/account-visual-demo/:dialog?`} component={AccountVisualDemo} />
              <Route path={`${match.url}/transactions/:dialog?`} component={TransactionDashboard} />
              <Route path={`${match.url}/voting/:dialog?`} component={Voting} />
              <Route path={`${match.url}/forging/:dialog?`} component={Forging} />
              <Route path={`${match.url}/add-account/:dialog?`} component={Login} />
            </main>
          )} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/" component={Login} />
        </div>
        <Dialog />
        <Toaster />
        <LoadingBar />
        <MenuBar />
      </section>
    </main>
  </OfflineWrapper>
);

export default App;
