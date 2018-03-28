import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../dashboard';
import Sidechains from '../sidechains';
import Header from '../header';
import Login from '../login';
import Register from '../register';
import SecondPassphrase from '../secondPassphrase';
import Search from '../search';
import SearchResult from '../search/searchResult';
import TransactionDashboard from '../transactionDashboard';
import AccountTransactions from '../accountTransactions';
import Voting from '../voting';
import SavedAccounts from '../savedAccounts';
import SingleTransaction from './../singleTransaction';
import styles from './app.css';
import Toaster from '../toaster';
import MainMenu from '../mainMenu';
import LoadingBar from '../loadingBar';
import NotFound from '../notFound';
import OfflineWrapper from '../offlineWrapper';
import AccountVisualDemo from '../accountVisual/demo';
import CustomRoute from '../customRoute';
import routes from '../../constants/routes';
import Onboarding from '../onboarding';

class App extends React.Component {
  markAsLoaded() {
    this.main.classList.add(styles.loaded);
    this.main.classList.add('appLoaded');
    this.appLoaded = true;
  }

  startOnboarding() {
    this.onboarding.setState({ start: true });
  }

  render() {
    const privateRoutes = [
      {
        name: 'accountVisualDemo',
        path: `${routes.accountVisualDemo.path}`,
        component: AccountVisualDemo,
        isPrivate: true,
      },
      {
        name: 'dashboard',
        path: `${routes.dashboard.path}`,
        component: Dashboard,
        isPrivate: true,
      },
      {
        name: 'wallet',
        path: `${routes.wallet.path}`,
        component: TransactionDashboard,
        isPrivate: true,
      },
      {
        name: 'delegates',
        path: `${routes.delegates.path}`,
        component: Voting,
        isPrivate: true,
      },
      {
        name: 'sidechains',
        path: `${routes.sidechains.path}`,
        component: Sidechains,
        isPrivate: true,
      },
      {
        name: 'secondPassphrase',
        path: `${routes.secondPassphrase.path}`,
        component: SecondPassphrase,
        isPrivate: true,
      },
      {
        name: 'register',
        path: `${routes.register.path}`,
        component: Register,
        isPrivate: false,
      },
      {
        name: 'addAccount',
        path: `${routes.addAccount.path}`,
        component: Login,
        isPrivate: false,
      },
      {
        name: 'login',
        path: `${routes.login.path}`,
        component: Login,
        isPrivate: false,
        exact: true,
      },
      {
        name: 'login',
        path: '*',
        component: NotFound,
        isPrivate: false,
      },
      {
        name: 'search',
        pathPrefix: 'explorer',
        path: `${routes.search.path}`,
        component: Search,
        isPrivate: false,
      },
      {
        name: 'searchResult',
        pathPrefix: 'explorer',
        path: `${routes.searchResult.path}`,
        pathSuffix: '/:query?',
        component: SearchResult,
        isPrivate: false,
      },
      {
        name: 'account',
        pathPrefix: 'explorer',
        path: `${routes.account.path}`,
        pathSuffix: '/:address?',
        component: AccountTransactions,
        isPrivate: false,
      },
      {
        name: 'wallet',
        pathPrefix: 'explorer',
        path: `${routes.wallet.path}`,
        pathSuffix: '/:address?',
        component: SingleTransaction,
        isPrivate: false,
      },
    ];

    return (
      <OfflineWrapper>
        <Onboarding appLoaded={this.appLoaded} ref={(el) => {
          if (el) { this.onboarding = el.getWrappedInstance().getWrappedInstance(); }
        }} />
        <main className={`${styles.bodyWrapper}`} ref={(el) => { this.main = el; }}>
          <MainMenu startOnboarding={this.startOnboarding.bind(this)}/>
          <Route path={routes.accounts.path} component={SavedAccounts} />
          <section>
            <div className={styles.mainBox}>
              <Header/>
              <div id='onboardingAnchor'></div>
              <Switch>
                <Route path={routes.explorer.path} render={ ({ match }) => (
                  <main>
                    <Route path={`${match.url}${routes.search.path}`} component={Search} />
                    <Route path={`${match.url}${routes.searchResult.path}/:query?`} component={SearchResult} />
                    <Route path={`${match.url}${routes.account.path}/:address?`} component={AccountTransactions} />
                    <Route path={`${match.url}${routes.wallet.path}/:id`} component={SingleTransaction} />
                  </main>
                )} />
                {privateRoutes.map((route, key) => (
                  <CustomRoute
                    path={route.path}
                    component={route.component}
                    isPrivate={route.isPrivate}
                    exact={route.exact}
                    key={key} />
                ))}
              </Switch>
            </div>
            <Toaster />
            <LoadingBar markAsLoaded={this.markAsLoaded.bind(this)} />
          </section>
        </main>
      </OfflineWrapper>
    );
  }
}

export default App;
