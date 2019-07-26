// istanbul ignore file
import React from 'react';
import throttle from 'lodash.throttle';
import BookmarksList from '../bookmarks/bookmarksList';
import NewsFeed from '../newsFeed';
import WalletDetails from '../walletDetails';
import PageHeader from '../toolbox/pageHeader';
import breakpoints from '../../constants/breakpoints';
import ExtensionPoint from '../extensionPoint';
import LiskHubExtensions from '../../utils/liskHubExtensions';
import RecentTransactions from './recentTransactions';
import styles from './dashboard.css';
import Onboarding from '../toolbox/onboarding/onboarding';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDesktop: window.innerWidth > breakpoints.m,
    };

    this.resizeWindow = this.resizeWindow.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', throttle(this.resizeWindow, 10));
  }

  componentDidUpdate(prevProps) {
    const { account, settings, loadTransactions } = this.props;
    const oldToken = prevProps.settings.token.active;
    const activeToken = settings.token.active;

    if (account.info && account.info[activeToken] && account.info[activeToken].address
      && (oldToken !== activeToken
      || !prevProps.account.info[activeToken])) {
      loadTransactions({
        address: account.info[activeToken].address,
        publicKey: account.publicKey,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
  }

  resizeWindow() {
    this.setState({ isDesktop: window.innerWidth > breakpoints.m });
  }

  getOnboardingSlides() {
    const { t } = this.props;
    return [{
      title: t('Lisk Hub is ready to go!'),
      content: t('Your new Lisk Wallet enables you to take full control of your LSK tokens. Secure, intuitive and robust Hub is your ultimate gateway to Lisk Ecosystem.'),
      illustration: 'hubReadyToGo',
    }, {
      title: t('Built around community'),
      content: t('The  dashboard lets you track updates not only from Lisk, but also delegates. You can now explore delegate profile pages and follow them to get all the updates.'),
      illustration: 'builtAroundCommunity',
    }, {
      title: t('Easily send and receive LSK tokens'),
      content: t('Lisk Hub enables you to attach a personal message to each outgoing LSK transaction and to see the value of the LSK tokens you’re about to send in a currency of your chocie.'),
      illustration: 'sendLSKTokens',
    }, {
      title: t('It’s your time to contribute'),
      content: t('Search, view and vote for Lisk delegates on the network. Lisk Hub gives you the opportunity to request a Lisk feature and allows you to register to become a delegate.'),
      illustration: 'timeToContribute',
    }];
  }

  render() {
    const {
      account,
      history,
      t,
    } = this.props;
    const { isDesktop } = this.state;

    const isLoggedIn = account.address;

    return (
      <React.Fragment>
        {
          isLoggedIn
            ? (
              <Onboarding
                slides={this.getOnboardingSlides()}
                actionButtonLabel={t('Got it, thanks!')}
                name="dashboardOnboarding"
              />
            )
            : null
        }
        <div className={`${styles.wrapper} dashboard-container`}>
          <PageHeader
            title={t('Dashboard')}
            subtitle={t('All important information at a glance')}
          />
          <div className={`${styles.main}`}>
            <div className={styles.subContainer}>
              {
                isLoggedIn
                  ? <WalletDetails className={styles.marginFix} />
                  : null
              }

              <RecentTransactions className={styles.marginFix} isLoggedIn={isLoggedIn} />

              {
                !isDesktop
                  ? (
                    <div className={`${styles.bookmarks} bookmarks`}>
                      <BookmarksList history={history} limit={5} />
                      <ExtensionPoint identifier={LiskHubExtensions.identifiers.dashboardColumn1} />
                    </div>
                  )
                  : null
              }
            </div>

            <div className={`${styles.community} community-feed`}>
              <NewsFeed />
              <ExtensionPoint identifier={LiskHubExtensions.identifiers.dashboardColumn3} />
            </div>

            {
              isDesktop
                ? (
                  <div className={`${styles.bookmarks} bookmarks`}>
                    <BookmarksList history={history} limit={5} />
                    <ExtensionPoint identifier={LiskHubExtensions.identifiers.dashboardColumn1} />
                  </div>
                )
                : null
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
