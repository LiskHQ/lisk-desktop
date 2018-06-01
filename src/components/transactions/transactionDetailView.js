import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { loadTransaction } from '../../actions/transactions';
import { TimeFromTimestamp, DateFromTimestamp } from './../timestamp/index';
import CopyToClipboard from '../copyToClipboard';
import AccountVisual from '../accountVisual';
import styles from './transactionDetailView.css';
import { FontIcon } from '../fontIcon';
import TransactionType from './transactionType';
import LiskAmount from '../liskAmount';
import Amount from './amount';
import routes from './../../constants/routes';
import transactions from './../../constants/transactionTypes';
import TransactionDetailViewField from './transactionDetailViewField';
import TransactionDetailViewRow from './transactionDetailViewRow';

class TransactionsDetailView extends React.Component {
  constructor(props) {
    super(props);

    const { search } = this.props.location || window.location;
    const params = new URLSearchParams(search);
    const transactionId = params.get('id');

    if (props.peers.data && transactionId) {
      this.props.loadTransaction({
        activePeer: props.peers.data,
        id: transactionId,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location && !nextProps.location.search) this.props.prevStep();
  }

  getVoters(dataName) {
    const data = this.props.transaction.votesName && this.props.transaction.votesName[dataName];

    return data ? data
      .sort((delegate1, delegate2) => delegate1.username - delegate2.username)
      .map((delegate, key) => (
        <Link className={`${styles.addressLink} ${styles.clickable} voter-address`}
          to={`${routes.explorer.path}${routes.accounts.path}/${delegate.address}`}
          key={`${key}-${dataName}`}>
          {`${delegate.username} `}
        </Link>
      )) : '';
  }

  getDateField() {
    return (
      <TransactionDetailViewField
        label={this.props.t('Date')}
        value={ this.props.transaction.timestamp ?
          <span>
            <DateFromTimestamp
              time={this.props.transaction.timestamp} /> - <TimeFromTimestamp
              time={this.props.transaction.timestamp}/>
          </span> :
          <span>{this.props.t('Pending')}</span>
        } />
    );
  }

  getFirstRow() {
    const isSendTransaction = this.props.transaction.type === transactions.send;

    return (
      <TransactionDetailViewRow>
        <TransactionDetailViewField
          label={this.props.t('Sender')}
          value={
            <Link className={`${styles.addressLink} ${styles.clickable}`} id='sender-address'
              to={`${routes.explorer.path}${routes.accounts.path}/${this.props.transaction.senderId}`}>
              {this.props.transaction.senderId}
            </Link>
          }
          column>
          {this.props.transaction.senderId ?
            <figure className={styles.accountVisual}>
              <AccountVisual address={this.props.transaction.senderId} size={43} />
            </figure> : null}
        </TransactionDetailViewField>

        {!isSendTransaction ? this.getDateField() :
          <TransactionDetailViewField
            shouldShow={this.props.transaction.recipientId}
            label={this.props.t('Recipient')}
            style={styles.sender}
            value={
              <Link className={`${styles.addressLink} ${styles.clickable}`} id='receiver-address'
                to={`${routes.explorer.path}${routes.accounts.path}/${this.props.transaction.recipientId}`}>
                {this.props.transaction.recipientId}
              </Link>
            }
            column>
            {this.props.transaction.recipientId ?
              <figure className={styles.accountVisual}>
                <AccountVisual address={this.props.transaction.recipientId} size={43} />
              </figure> : null
            }
          </TransactionDetailViewField>
        }
      </TransactionDetailViewRow>
    );
  }

  render() {
    return (
      <div className={`${styles.details}`}>
        {
          this.props.prevStep ?
            <header>
              <h3>
                <small className={`${styles.backButton} transaction-details-back-button`}
                  onClick={() => this.props.history.push(this.props.history.location.pathname)}>
                  <FontIcon className={`${styles.arrow}`} value='arrow-left'/>
                  <span className={`${styles.text}`}>{this.props.t('Back to overview')}</span>
                </small>
              </h3>
            </header> : null
        }
        <div>
          <TransactionDetailViewRow shouldShow={!this.props.match.params.id}>
            <div className={`${grid['col-xs-12']} ${grid['col-sm-7']} ${grid['col-md-7']} ${styles.columnNarrow}`}>
              <header>
                <h2 className={styles.title}>
                  <TransactionType
                    {...this.props.transaction}
                    address={this.props.transaction.senderId}
                    showTransaction />
                </h2>
              </header>
            </div>
          </TransactionDetailViewRow>

          {this.getFirstRow()}

          <TransactionDetailViewRow shouldShow={this.props.transaction.type === 0}>
            {this.getDateField()}
            <TransactionDetailViewField
              label={this.props.t('Amount (LSK)')}
              value={
                <Amount
                  value={this.props.transaction}
                  address={this.props.address}>
                </Amount>
              }
              style={styles.amount} />
          </TransactionDetailViewRow>

          <TransactionDetailViewRow shouldShow={
            this.props.transaction.amount === 0 &&
            this.props.transaction.recipientId}>
            <TransactionDetailViewField
              label={this.props.t('Added votes')}
              value={this.getVoters('added')} />
            <TransactionDetailViewField
              label={this.props.t('Removed votes')}
              value={this.getVoters('deleted')} />
          </TransactionDetailViewRow>

          <TransactionDetailViewRow>
            <TransactionDetailViewField
              label={this.props.t('Additional fee')}
              value={<LiskAmount val={this.props.transaction.fee} />} />
            <TransactionDetailViewField
              label={this.props.t('Confirmations')}
              value={<span>{this.props.transaction.confirmations}</span>} />
          </TransactionDetailViewRow>

          <TransactionDetailViewRow>
            {this.props.prevStep &&
              <TransactionDetailViewField
                label={this.props.t('Transaction ID')}
                value={
                  <CopyToClipboard
                    value={this.props.transaction.id}
                    text={this.props.transaction.id}
                    copyClassName={`${styles.copy}`} />
                } />
            }
            <TransactionDetailViewField label='' value='' />
          </TransactionDetailViewRow>
        </div>
        <footer>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  loadTransaction: data => dispatch(loadTransaction(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TransactionsDetailView));

