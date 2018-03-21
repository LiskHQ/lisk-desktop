import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import React from 'react';
import { FontIcon } from '../fontIcon';
import Box from '../box';
import TransactionList from './../transactions/transactionList';
import Send from '../send';
import CurrencyGraph from './currencyGraph';
import routes from '../../constants/routes';
import styles from './dashboard.css';

class Dashboard extends React.Component {
  render() {
    const { transactions, t, history, accountAddress, loading } = this.props;
    return <div className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-md-8']} ${grid['col-xs-12']} ${styles.main}`}>
        <Box className={`${styles.graph}`}>
          <CurrencyGraph />
        </Box>
        <Box className={`${styles.latestActivity}`}>
          <header>
            <h2 className={styles.title}>
              {t('Latest activity')}
              <Link to={`${routes.main.path}${routes.transaction.path}`} className={`${styles.seeAllLink} seeAllLink`}>
                {t('See all transactions')}
                <FontIcon value='arrow-right'/>
              </Link>
            </h2>
          </header>
          <TransactionList {...{
            transactions,
            t,
            address: accountAddress,
            dashboard: true,
            loading,
          }} />
        </Box>
      </div>
      <div className={`${grid['col-md-4']} ${styles.sendWrapper}`}>
        <Send history={history} />
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  transactions: [...state.transactions.pending, ...state.transactions.confirmed].slice(0, 3),
  accountAddress: state.account.address,
  loading: state.loading.length > 0,
});

export default connect(mapStateToProps)(translate()(Dashboard));
