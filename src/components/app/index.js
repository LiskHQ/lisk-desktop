import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoutes from '../privateRoute';
import Dashboard from '../dashboard';
import Sidechains from '../sidechains';
import Header from '../header';
import Login from '../login';
import Register from '../register';
import Search from '../search';
import SearchResult from '../search/searchResult';
import TransactionDashboard from '../transactionDashboard';
import AccountTransactions from '../accountTransactions';
import Voting from '../voting';
import SingleTransaction from './../singleTransaction';
import styles from './app.css';
import Dialog from '../dialog';
import Toaster from '../toaster';
import MainMenu from '../mainMenu';
import LoadingBar from '../loadingBar';
import NotFound from '../notFound';
import OfflineWrapper from '../offlineWrapper';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import AccountVisualDemo from '../accountVisual/demo';
import routes from '../../constants/routes';

class App extends React.Component {
  markAsLoaded() {
    this.main.classList.add(styles.loaded);
    this.main.classList.add('appLoaded');
  }

  render() {
    return (
      <OfflineWrapper>
        <main className={`${styles.bodyWrapper}`} ref={(el) => { this.main = el; }}>
          <MainMenu />
          <section>
            <div className={styles.mainBox}>
              <Header />
              <Switch>
                <PrivateRoutes path={routes.main} render={ ({ match }) => (
                  <main className={offlineStyle.disableWhenOffline}>
                    <Switch>
                      <Route path={`${match.url}${routes.accountVisualDemo.path}/:dialog?`} component={AccountVisualDemo} />
                      <Route path={`${match.url}${routes.dashboard.path}/:dialog?`} component={Dashboard} />
                      <Route path={`${match.url}${routes.wallet.path}/:dialog?`} component={TransactionDashboard} />
                      <Route path={`${match.url}${routes.voting.path}/:dialog?`} component={Voting} />
                      <Route path={`${match.url}${routes.sidechains.path}/:dialog?`} component={Sidechains} />
                      <Route path='*' component={NotFound} />
                    </Switch>
                  </main>
                )} />
                <Route path={routes.explorer} render={ ({ match }) => (
                  <main>
                    <Route path={`${match.url}${routes.search.path}/:dialog?`} component={Search} />
                    <Route path={`${match.url}${routes.searchResult.path}/:query?`} component={SearchResult} />
                    <Route path={`${match.url}${routes.account.path}/:address?`} component={AccountTransactions} />
                    <Route path={`${match.url}${routes.transaction.path}/:id`} component={SingleTransaction} />
                  </main>
                )} />
                <Route path={`${routes.register.path}:dialog?`} component={Register} />
                <Route path={`${routes.addAccount.path}:dialog?`} component={Login} />
                <Route exact path={routes.login.path} component={Login} />
                <Route path='*' component={NotFound} />
              </Switch>
            </div>
            <Dialog />
            <Toaster />
            <LoadingBar markAsLoaded={this.markAsLoaded.bind(this)} />
          </section>
        </main>
      </OfflineWrapper>
    );
  }
}

export default App;
