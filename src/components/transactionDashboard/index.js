import React from 'react';
import { connect } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Transactions from './../transactions';
import { transactionsAddressSet } from '../../actions/transactions';
import Send from '../send';
import styles from './styles.css';

class TransactionsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.props.transactionsAddressSet({ address: this.props.accountAddress });
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return <div className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-md-4']} ${styles.gridPadding}`}>
        <Send/>
      </div>
      <div className={`${grid['col-sm-12']} ${styles.transactions} ${grid['col-md-8']}`}>
        <Transactions></Transactions>
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  accountAddress: state.account.address,
});


const mapDispatchToProps = dispatch => ({
  transactionsAddressSet: data => dispatch(transactionsAddressSet(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsDashboard);
