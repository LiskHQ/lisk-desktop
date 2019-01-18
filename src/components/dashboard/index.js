// istanbul ignore file
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import React from 'react';
import throttle from 'lodash.throttle';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { FontIcon } from '../fontIcon';
import Box from '../box';
import { loadTransactions } from '../../actions/transactions';
import TransactionsList from '../transactions/transactionsList';
import CurrencyGraph from './currencyGraph';
import routes from '../../constants/routes';
import FollowedAccounts from '../followedAccounts/index';
import QuickTips from '../quickTips';
import NewsFeed from '../newsFeed';
import removeDuplicateTransactions from '../../utils/transactions';
import { fromRawLsk } from '../../utils/lsk';
import breakpoints from './../../constants/breakpoints';
import fees from './../../constants/fees';
import ShowMore from '../showMore';
import { SecondaryLightButton } from '../toolbox/buttons/button';
import Banner from '../toolbox/banner/banner';

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
    window.addEventListener('resize', throttle(this.resizeWindow, 1000));
  }

  shouldShowInitializatiion() {
    const { account, transactions } = this.props;
    const needsNoAccountInit = account.serverPublicKey
      || account.balance === 0
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
      loading,
      t,
      transactions,
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
                <Link to={`${routes.send.path}?initializeAccount`}>
                  <SecondaryLightButton>{t('Create First Transaction')}</SecondaryLightButton>
                </Link>)}>
              <p>{t('It is recommended that you initialize your Lisk ID.')}</p>
              <p>{t('The easiest way to do this is to send LSK to yourself by clicking this button.')}</p>
              <p>{t('It will cost you only the usual {{fee}} LSK transaction fee.', { fee: fromRawLsk(fees.send) })}</p>
            </Banner>
          </div>
        }
        <div className={`${grid.row} ${styles.wrapper}`}>
          <div className={`${grid['col-md-8']} ${grid['col-xs-12']} ${styles.main}`}>
            {
              isLoggedIn
              ? <Box className={`${styles.latestActivity}`}>
                <header>
                  <h2 className={styles.title}>
                    {t('Latest activity')}
                    <Link to={`${routes.wallet.path}`} className={`${styles.seeAllLink} seeAllLink`}>
                      {t('See all transactions')}
                      <FontIcon value='arrow-right'/>
                    </Link>
                  </h2>
                </header>
                <TransactionsList {...{
                  address: account.address,
                  dashboard: true,
                  history,
                  loading,
                  onClick: props => history.push(`${routes.wallet.path}?id=${props.value.id}`),
                  showMore: this.state.showMore,
                  t,
                  transactions,
                }} />
                {
                  transactions.length > 3 &&
                  <ShowMore
                    className={styles.showMore}
                    onClick={() => this.onShowMoreToggle()}
                    text={this.state.showMore ? t('Show Less') : t('Show More')}
                  />
                }
              </Box>
              : <QuickTips />
            }
            <div className={`${grid.row} ${styles.bottomModuleWrapper} `}>
              <div className={`${grid['col-md-6']} ${grid['col-lg-6']} ${grid['col-xs-6']}`} style={{ paddingLeft: '0px' }}>
                <Box className={`${styles.following} bookmarks`}>
                  <FollowedAccounts history={history}/>
                </Box>
              </div>
              <div className={`${grid['col-md-6']} ${grid['col-lg-6']} ${grid['col-xs-6']}`} style={{ paddingRight: '0px' }}>
                <Box className={`${styles.graph}`}>
                  <CurrencyGraph />
                </Box>
              </div>
            </div>
            {
              !this.state.isDesktop &&
              <div className={`${grid['col-md-4']} ${grid['col-xs-12']} ${styles.newsFeedWrapper}`}>
                <NewsFeed />
              </div>
            }
          </div>
          {
            this.state.isDesktop &&
            <div className={`${grid['col-md-4']} ${grid['col-xs-12']} ${styles.newsFeedWrapper}`}>
              <NewsFeed />
            </div>
          }
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  transactions: removeDuplicateTransactions(
    state.transactions.pending,
    state.transactions.confirmed,
  ),
  pendingTransactions: state.transactions.pending,
  account: state.account,
  loading: state.loading.length > 0,
  settings: state.settings,
});

const mapDispatchToProps = {
  loadTransactions,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Dashboard));
