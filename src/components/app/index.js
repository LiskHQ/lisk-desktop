import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Account from '../account';
import PrivateRoutes from '../privateRoute';
import Dashboard from '../dashboard';
import Sidechains from '../sidechains';
import Header from '../header';
import Login from '../login';
import Register from '../register';
import TransactionDashboard from '../transactionDashboard';
import accountTransactions from '../accountTransactions';
import Voting from '../voting';
import Forging from '../forging';
import styles from './app.css';
import BackgroundMaker from '../backgroundMaker';
import Dialog from '../dialog';
import Toaster from '../toaster';
import MainMenu from '../mainMenu';
import LoadingBar from '../loadingBar';
import NotFound from '../notFound';
import OfflineWrapper from '../offlineWrapper';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import routes from '../../constants/routes';

const App = () => (
  <OfflineWrapper>
    <BackgroundMaker />
    <main className={`${styles.bodyWrapper}`}>
      <MainMenu />
      <section>
        <div className={styles.mainBox}>
          <Header />
          <Switch>
            <PrivateRoutes path='/main' render={ ({ match }) => (
              <main className={offlineStyle.disableWhenOffline}>
                <Account />
                <Switch>
                  <Route path={`${match.url}/dashboard/:dialog?`} component={Dashboard} />
                  <Route path={`${match.url}${routes.wallet.short}/:dialog?`} component={TransactionDashboard} />
                  <Route path={`${match.url}/voting/:dialog?`} component={Voting} />
                  <Route path={`${match.url}/sidechains/:dialog?`} component={Sidechains} />
                  <Route path={`${match.url}/forging/:dialog?`} component={Forging} />
                  <Route path={`${match.url}/add-account/:dialog?`} component={Login} />
                  <Route path={`${match.url}${routes.account.short}/:address?`} component={accountTransactions} />
                  <Route path='*' component={NotFound} />
                </Switch>
              </main>
            )} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/' component={Login} />
            <Route path='*' component={NotFound} />
          </Switch>
        </div>
        <Dialog />
        <Toaster />
        <LoadingBar />
      </section>
    </main>
  </OfflineWrapper>
);

export default App;
