import React from 'react';
import { connect } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Transactions from './../transactions';
import Send from '../send';
import styles from './transactionDasboard.css';

class TransactionsDashboard extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return <div className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-md-4']}`}>
        <Send {...this.props}/>
      </div>
      <div className={`${grid['col-sm-12']} ${styles.transactions} ${grid['col-md-8']}`}>
        <Transactions {...this.props} />
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  address: state.account.address,
  balance: state.account.balance,
  account: state.account,
  pendingTransactions: state.transactions.pending,
});

export default connect(mapStateToProps)(TransactionsDashboard);
