import React from 'react';
import { connect } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import WalletTransactions from './../transactions/walletTransactions';

import styles from './transactionDasboard.css';

class TransactionsDashboard extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return <div className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-xs-10']} ${grid['col-sm-12']} ${grid['col-md-12']} ${grid['col-lg-12']} ${styles.transactions}`}>
        <WalletTransactions {...this.props} />
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  address: state.account.address,
  balance: state.account.balance,
  account: state.account,
  settings: state.settings,
  pendingTransactions: state.transactions.pending,
});

export default connect(mapStateToProps)(TransactionsDashboard);
