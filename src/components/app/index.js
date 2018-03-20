import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Joyride from 'react-joyride';
import PrivateRoutes from '../privateRoute';
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
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import AccountVisualDemo from '../accountVisual/demo';
import routes from '../../constants/routes';
import onboardingSteps from './../app/onboardingSteps';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: [],
      run: false,
    };
  }

  componentDidMount() {
    const onboarding = window.localStorage.getItem('onboarding');
    const run = onboarding !== 'false';
    this.setState({ steps: onboardingSteps, run });
  }

  markAsLoaded() {
    this.main.classList.add(styles.loaded);
    this.main.classList.add('appLoaded');
  }

  // eslint-disable-next-line class-methods-use-this
  onboardingCallback(data) {
    if (data.type === 'finished') {
      window.localStorage.setItem('onboarding', 'false');
    }
  }

  render() {
    return (
      <OfflineWrapper>
        <Joyride
          ref={(c) => { this.joyride = c; }}
          steps={this.state.steps}
          run={this.state.run}
          locale={{
            skip: (<span>Click here to skip</span>),
            close: (<span>Close</span>),
            last: (<span>Complete</span>),
            next: (<span>Next</span>),
          }}
          callback={this.onboardingCallback}
          showOverlay={true}
          showSkipButton={true}
          autoStart={true}
          type='continuous'
        />
        <main className={`${styles.bodyWrapper}`} ref={(el) => { this.main = el; }}>
          <MainMenu />
          <Route path={routes.accounts.path} component={SavedAccounts} />
          <section>
            <div className={styles.mainBox}>
              <Header/>
              <Switch>
                <PrivateRoutes path={routes.main.path} render={ ({ match }) => (
                  <main className={offlineStyle.disableWhenOffline}>
                    <Switch>
                      <Route path={`${match.url}${routes.accountVisualDemo.path}`} component={AccountVisualDemo} />
                      <Route path={`${match.url}${routes.dashboard.path}`} component={Dashboard} />
                      <Route path={`${match.url}${routes.wallet.path}`} component={TransactionDashboard} />
                      <Route path={`${match.url}${routes.voting.path}`} component={Voting} />
                      <Route path={`${match.url}${routes.sidechains.path}`} component={Sidechains} />
                      <Route path={`${match.url}${routes.secondPassphrase.path}`} component={SecondPassphrase} />
                      <Route path='*' component={NotFound} />
                    </Switch>
                  </main>
                )} />
                <Route path={routes.explorer.path} render={ ({ match }) => (
                  <main>
                    <Route path={`${match.url}${routes.search.path}`} component={Search} />
                    <Route path={`${match.url}${routes.searchResult.path}/:query?`} component={SearchResult} />
                    <Route path={`${match.url}${routes.account.path}/:address?`} component={AccountTransactions} />
                    <Route path={`${match.url}${routes.transaction.path}/:id`} component={SingleTransaction} />
                  </main>
                )} />
                <Route path={routes.register.path} component={Register} />
                <Route path={routes.addAccount.path} component={Login} />
                <Route exact path={routes.login.path} component={Login} />
                <Route path='*' component={NotFound} />
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
