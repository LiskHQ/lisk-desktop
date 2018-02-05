import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { transactionLoadRequested } from '../../actions/transactions';
import TransactionDetails from './../transactions/transactionDetailView';
import CopyToClipboard from '../copyToClipboard';
import Box from '../box';
import styles from './transaction.css';

class SingleTransaction extends React.Component {
  constructor(props) {
    super(props);
    if (props.peers.data) {
      this.props.transactionLoadRequested({ id: this.props.match.params.id });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.peers.data !== this.props.peers.data) {
      this.props.transactionLoadRequested({ id: this.props.match.params.id });
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.transaction !== this.props.transaction;
  }

  render() {
    return <Box className={styles.transaction}>
      <header>
        <h2>Transaction ID</h2>
        <CopyToClipboard
          value={this.props.match.params.id}
          text={this.props.transaction.id}
          className={styles.copyLabel}
          copyClassName={`${styles.copyIcon}`} />
      </header>
      {this.props.transaction.id
        ? <div className={styles.detailsWrapper}>
          <TransactionDetails value={this.props.transaction} t={this.props.t}/>
        </div>
        : <small style={{ textAlign: 'center' }}>Transaction not found</small>
      }
    </Box>;
  }
}

const mapStateToProps = state => ({
  transaction: state.transaction,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  transactionLoadRequested: data => dispatch(transactionLoadRequested(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(SingleTransaction));
