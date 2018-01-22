import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import React from 'react';
import { transactionsFilterSet } from '../../actions/transactions';
import txFilters from './../../constants/transactionFilters';
import { FontIcon } from '../fontIcon';
import Box from '../box';
import TransactionList from './../transactions/transactionList';
import Send from '../send';
import CurrencyGraph from './currencyGraph';
import styles from './styles.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.transactions.filter !== txFilters.all) {
      this.props.transactionsFilterSet({ filter: txFilters.all });
    }
  }

  render() {
    const { transactions, t } = this.props;
    return <div className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-md-8']} ${grid['col-xs-12']}`}>
        <Box className={`${styles.graph}`}>
          <CurrencyGraph />
        </Box>
        <Box className={`${styles.latestActivity}`}>
          <header>
            <h2 className={styles.title}>
              {t('Latest activity')}
              <Link to='/main/transactions' className={styles.seeAllLink}>
                {t('See all transactions')}
                <FontIcon value='arrow-right'/>
              </Link>
            </h2>
          </header>
          <TransactionList {...{ transactions, t }} loadMore={() => {}}/>
        </Box>
      </div>
      <div className={`${grid['col-md-4']} ${styles.sendWrapper}`}>
        <Send/>
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  transactions: [...state.transactions.pending, ...state.transactions.confirmed].slice(0, 3),
});

const mapDispatchToProps = dispatch => ({
  transactionsFilterSet: data => dispatch(transactionsFilterSet(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(translate()(Dashboard));
