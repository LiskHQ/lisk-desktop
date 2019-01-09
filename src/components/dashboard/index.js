import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import React from 'react';
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

import styles from './dashboard.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMore: false,
    };

    const isLoggedIn = props.account.address;

    if (isLoggedIn) {
      props.loadTransactions({
        address: props.account.address,
        publicKey: props.account.publicKey,
      });
    }
  }

  onShowMoreToggle() {
    this.setState({ showMore: !this.state.showMore });
  }

  render() {
    const {
      transactions, t, account, loading, history,
    } = this.props;

    const isLoggedIn = account.address;
    const showMore = this.state.showMore ? styles.onShowMoreToggle : '';

    return (
      <div className={`${styles.wrapper}`}>

        {
          isLoggedIn
          ? <Box className={`${styles.latestActivity} ${showMore}`}>
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
                transactions,
                t,
                address: account.address,
                dashboard: true,
                loading,
                history,
                onClick: props => history.push(`${routes.wallet.path}?id=${props.value.id}`),
              }} />
              <div
                className={`${styles.showMore}`}
                onClick={() => this.onShowMoreToggle()}
              >
              {this.state.showMore ? t('Show Less') : t('Show More')}
              </div>
            </Box>
          : <QuickTips />
        }

        <div className={`${styles.bookmarks}`} style={{ paddingLeft: '0px' }}>
          <Box className={`${styles.following}`}>
            <FollowedAccounts history={history}/>
          </Box>
        </div>

        <div className={`${styles.graphs}`} style={{ paddingRight: '0px' }}>
          <Box className={`${styles.graph}`}>
            <CurrencyGraph />
          </Box>
        </div>

        <div className={`${styles.newsFeedWrapper}`}>
          <NewsFeed />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  transactions: removeDuplicateTransactions(
    state.transactions.pending,
    state.transactions.confirmed,
  ).slice(0, 5),
  pendingTransactions: state.transactions.pending,
  account: state.account,
  loading: state.loading.length > 0,
  settings: state.settings,
});

const mapDispatchToProps = {
  loadTransactions,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Dashboard));
