// istanbul ignore file
import React from 'react';
import throttle from 'lodash.throttle';
import BookmarksList from '../bookmarks/bookmarksList';
import NewsFeed from './newsFeed';
import WalletDetails from '../../walletDetails';
import PageHeader from '../../toolbox/pageHeader';
import breakpoints from '../../../constants/breakpoints';
import ExtensionPoint from '../../extensionPoint';
import LiskHubExtensions from '../../../utils/liskHubExtensions';
import RecentTransactions from './recentTransactions';
import styles from './dashboard.css';
import Onboarding from '../../toolbox/onboarding/onboarding';

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
    const { account, settings, getTransactions } = this.props;
    const oldToken = prevProps.settings.token.active;
    const activeToken = settings.token.active;

    if (account.info && account.info[activeToken] && account.info[activeToken].address
      && (oldToken !== activeToken
      || !prevProps.account.info[activeToken])) {
      getTransactions({
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
      title: t('Ready to go!'),
      content: t('The ultimate gateway to the ecosystem. Hub’s new design lets you easily manage your tokens (and much, much more).'),
      illustration: 'hubReadyToGo',
    }, {
      title: t('Stay Informed'),
      content: t('Keep up-to-date with announcements from the Lisk Foundation. Check what network delegates have been up to with dedicated profile pages.'),
      illustration: 'builtAroundCommunity',
    }, {
      title: t('Send LSK and BTC'),
      content: t('Personalize each transaction with a custom message. Look up its value in a fiat currency of your choice.'),
      illustration: 'sendLSKTokens',
    }, {
      title: t('Get Involved'),
      content: t('Community is key. Vote for delegates, or register as one yourself. Feel like a feature is missing? Request it directly from the Hub.'),
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
    const isLoggedIn = !!(account.address);

    return (
      <React.Fragment>
        <div className={`${styles.wrapper} dashboard-container`}>
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
