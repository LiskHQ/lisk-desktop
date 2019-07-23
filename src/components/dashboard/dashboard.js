// istanbul ignore file
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import throttle from 'lodash.throttle';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../constants/routes';
import BookmarksList from '../bookmarks/bookmarksList';
import NewsFeed from '../newsFeed';
import WalletDetails from '../walletDetails';
import Piwik from '../../utils/piwik';
import links from '../../constants/externalLinks';
import { fromRawLsk } from '../../utils/lsk';
import breakpoints from '../../constants/breakpoints';
import fees from '../../constants/fees';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import Banner from '../toolbox/banner/banner';
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
    this.shouldShowInitializatiion = this.shouldShowInitializatiion.bind(this);
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

  shouldShowInitializatiion() {
    const { account, transactions, settings } = this.props;
    const activeToken = settings.token.active;
    const needsNoAccountInit = (account.info && account.info.LSK.serverPublicKey)
      || (account.info && account.info.LSK.balance === 0)
      || (transactions.pending && transactions.pending.length > 0)
      || activeToken === 'BTC';
    return !needsNoAccountInit;
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
        { isLoggedIn && this.shouldShowInitializatiion()
          && (
          <div className={`${grid.row} ${styles.bannerWrapper}`}>
            <Banner
              className={`${grid['col-xs-12']} initialize-banner`}
              title={t('Initialize Lisk ID')}
              footer={(
                <Fragment>
                  <Link to={`${routes.send.path}?recipient=${account.address}&amount=0.1&reference=Account initialization`}>
                    <SecondaryButtonV2 className="light">{t('Create First Transaction')}</SecondaryButtonV2>
                  </Link>
                  <a
                    className={styles.initLink}
                    target="_blank"
                    href={links.accountInitialization}
                    /* istanbul ignore next */
                    onClick={() => Piwik.trackingEvent('AccountInit', 'link', 'Initialize my lisk account')}
                    rel="noopener noreferrer"
                  >
                    {this.props.t('Learn more about Lisk ID initialization')}
                  </a>
                </Fragment>
)}
            >
              <p>{t('It is recommended that you initialize your Lisk ID.')}</p>
              <p>{t('The easiest way to do this is to send LSK to yourself by clicking this button.')}</p>
              <p>{t('It will cost you only the usual {{fee}} LSK transaction fee.', { fee: fromRawLsk(fees.send) })}</p>
            </Banner>
          </div>
          )
        }
        <div className={`${styles.wrapper} dashboard-container`}>
          <header>
            <h1>{t('Dashboard')}</h1>
            <h2>{t('All important information at a glance')}</h2>
          </header>

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
