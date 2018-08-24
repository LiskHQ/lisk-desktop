import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import React from 'react';
import { FontIcon } from '../fontIcon';
import Box from '../box';
import { loadTransactions } from '../../actions/transactions';
import TransactionList from './../transactions/transactionList';
import CurrencyGraph from './currencyGraph';
import routes from '../../constants/routes';
import FollowedAccounts from '../followedAccounts/index';
import QuickTips from '../quickTips';
import NewsFeed from '../newsFeed';

import styles from './dashboard.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    const isLoggedIn = props.account.address;

    if (isLoggedIn) {
      props.loadTransactions({
        address: props.account.address,
        publicKey: props.account.publicKey,
      });
    }
  }

  render() {
    const {
      transactions, t, account, loading, history,
    } = this.props;

    const isLoggedIn = account.address;

    return <div className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-md-8']} ${grid['col-xs-12']} ${styles.main}`}>
        {isLoggedIn ? <Box className={`${styles.latestActivity}`}>
          <header>
            <h2 className={styles.title}>
              {t('Latest activity')}
              <Link to={`${routes.wallet.path}`} className={`${styles.seeAllLink} seeAllLink`}>
                {t('See all transactions')}
                <FontIcon value='arrow-right'/>
              </Link>
            </h2>
          </header>
          <TransactionList {...{
            transactions,
            t,
            address: account.address,
            dashboard: true,
            loading,
            history,
            onClick: props => history.push(`${routes.wallet.path}?id=${props.value.id}`),
          }} />
        </Box> :
        <QuickTips />}
        <div className={`${grid.row} ${styles.bottomModuleWrapper} `}>
          <div className={`${grid['col-md-6']} ${grid['col-lg-6']} ${grid['col-xs-6']}`} style={{ paddingLeft: '0px', overflowY: 'auto' }}>
            <Box className={`${styles.following}`}>
              <FollowedAccounts history={history}/>
            </Box>
          </div>
          <div className={`${grid['col-md-6']} ${grid['col-lg-6']}  ${grid['col-xs-6']}`} style={{ paddingRight: '0px' }}>
            <Box className={`${styles.graph}`}>
              <CurrencyGraph />
            </Box>
          </div>
        </div>
      </div>
      <div className={`${grid['col-md-4']} ${grid['col-xs-12']} ${styles.sendWrapper}`}>
        <NewsFeed />
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  transactions: [...state.transactions.pending, ...state.transactions.confirmed].slice(0, 5),
  pendingTransactions: state.transactions.pending,
  account: state.account,
  loading: state.loading.length > 0,
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  loadTransactions: data => dispatch(loadTransactions(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Dashboard));
