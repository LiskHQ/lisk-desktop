import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { transactionsAddressSet } from '../../actions/transactions';
import Transactions from './../transactions';
import Send from '../send';
import styles from './accountTransactions.css';

class accountTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.setAddressAndLoadTransactions(this.props.match.params.address);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.address !== this.props.match.params.address) {
      this.setAddressAndLoadTransactions(nextProps.match.params.address);
    }
  }

  setAddressAndLoadTransactions(address) {
    this.props.transactionsAddressSet({ address });
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

const mapDispatchToProps = dispatch => ({
  transactionsAddressSet: data => dispatch(transactionsAddressSet(data)),
});


export default connect(null, mapDispatchToProps)(translate()(accountTransactions));
