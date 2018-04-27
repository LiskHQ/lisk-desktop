import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { transactionLoadRequested } from '../../actions/transactions';
import TransactionDetails from './../transactions/transactionDetailView';
import CopyToClipboard from '../copyToClipboard';
import Box from '../box';
import EmptyState from '../emptyState';
import TransactionType from '../transactions/transactionType';
import styles from './singleTransaction.css';

class SingleTransaction extends React.Component {
  constructor(props) {
    super(props);
    if (props.peers.data) {
      this.props.transactionLoadRequested({ id: this.props.match.params.id });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.peers.data !== this.props.peers.data
      || nextProps.match.params.id !== this.props.match.params.id) {
      this.props.transactionLoadRequested({ id: nextProps.match.params.id });
    }
  }

  render() {
    return <Box className={styles.transaction}>
      { this.props.transaction.id && !this.props.transaction.error ?
        <Fragment>
          <header>
            <h2>
              <TransactionType
                {...this.props.transaction}
                address={this.props.transaction.senderId}
                showTransaction />
            </h2>
            <CopyToClipboard
              value={this.props.match.params.id}
              text={this.props.match.params.id}
              className={`${styles.copyLabel} transaction-id`}
              copyClassName={`${styles.copyIcon}`} />
          </header>
          <div className={styles.content}>
            <div className={styles.detailsWrapper}>
              <TransactionDetails
                value={this.props.transaction}
                t={this.props.t}
                match={this.props.match} />
            </div>
          </div>
        </Fragment> :
        <EmptyState title={this.props.t('No results')}
          message={this.props.t('Search for Lisk ID or Transaction ID')} />
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
