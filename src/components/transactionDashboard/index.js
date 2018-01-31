import React from 'react';
import { connect } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Transactions from './../transactions';
import Send from '../send';
import styles from './styles.css';

class TransactionsDashboard extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return <div className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-md-4']} ${styles.gridPadding}`}>
        <Send/>
      </div>
      <div className={`${grid['col-sm-12']} ${styles.transactions} ${grid['col-md-8']}`}>
        <Transactions address={this.props.accountAddress} />
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  accountAddress: state.account.address,
});

export default connect(mapStateToProps)(TransactionsDashboard);
