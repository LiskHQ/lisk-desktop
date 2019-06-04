// istanbul ignore file
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import throttle from 'lodash.throttle';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../constants/routes';
import BookmarksList from '../bookmarksList';
import NewsFeed from '../newsFeedV2';
import Piwik from '../../utils/piwik';
import links from '../../constants/externalLinks';
import { fromRawLsk } from '../../utils/lsk';
import breakpoints from './../../constants/breakpoints';
import fees from './../../constants/fees';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import Banner from '../toolbox/banner/banner';
import ExtensionPoint from '../extensionPoint';
import LiskHubExtensions from '../../utils/liskHubExtensions';
import RecentTransactions from './recentTransactions';
import styles from './dashboard.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMore: false,
      isDesktop: window.innerWidth > breakpoints.m,
    };

    const isLoggedIn = props.account.address;

    if (isLoggedIn) {
      props.loadTransactions({
        address: props.account.address,
        publicKey: props.account.publicKey,
      });
    }

    this.resizeWindow = this.resizeWindow.bind(this);
    this.shouldShowInitializatiion = this.shouldShowInitializatiion.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', throttle(this.resizeWindow, 10));
  }

  shouldShowInitializatiion() {
    const { account, transactions } = this.props;
    const needsNoAccountInit = (account.info && account.info.LSK.serverPublicKey)
      || (account.info && account.info.LSK.balance === 0)
      || (transactions.pending && transactions.pending.length > 0);
    return !needsNoAccountInit;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
  }

  resizeWindow() {
    this.setState({ isDesktop: window.innerWidth > breakpoints.m });
  }

  onShowMoreToggle() {
    this.setState({ showMore: !this.state.showMore });
  }

  render() {
    const {
      account,
      history,
      t,
    } = this.props;

    const isLoggedIn = account.address;

    return (
      <React.Fragment>
        { isLoggedIn && this.shouldShowInitializatiion() &&
          <div className={`${grid.row} ${styles.bannerWrapper}`}>
            <Banner
              className={`${grid['col-xs-12']} initialize-banner`}
              title={t('Initialize Lisk ID')}
              footer={(
                <Fragment>
                  <Link to={`${routes.send.path}?recipient=${account.address}&amount=0.1&reference=Account initialization`}>
                    <SecondaryButtonV2 className={'light'}>{t('Create First Transaction')}</SecondaryButtonV2>
                  </Link>
                  <a
                    className={styles.initLink}
                    target='_blank'
                    href={links.accountInitialization}
                    /* istanbul ignore next */
                    onClick={() => Piwik.trackingEvent('AccountInit', 'link', 'Initialize my lisk account')}
                    rel='noopener noreferrer'
                  >
                    {this.props.t('Learn more about Lisk ID initialization')}
                  </a>
                </Fragment>)}>
              <p>{t('It is recommended that you initialize your Lisk ID.')}</p>
              <p>{t('The easiest way to do this is to send LSK to yourself by clicking this button.')}</p>
              <p>{t('It will cost you only the usual {{fee}} LSK transaction fee.', { fee: fromRawLsk(fees.send) })}</p>
            </Banner>
          </div>
        }
        <div className={`${styles.wrapper} dashboard-container`}>
          <header>
            <h1>{t('Dashboard')}</h1>
            <h2>{t('All important information at a glance')}</h2>
          </header>

          <div className={`${styles.main}`}>
            <RecentTransactions />

            {
            <div className={`${styles.newsFeedWrapper}`}>
              <NewsFeed />
              <ExtensionPoint identifier={LiskHubExtensions.identifiers.dashboardColumn3} />
            </div>
            }

            <div className={`${styles.bookmarks} bookmarks`}>
              <BookmarksList className={styles.bookmarkList} history={history}/>
              <ExtensionPoint identifier={LiskHubExtensions.identifiers.dashboardColumn1} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
