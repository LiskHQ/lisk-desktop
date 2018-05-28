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

const TransactionsDetailViewField = ({ value, label, style, children, column }) =>
  <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${column ? styles.column : styles.columnNarrow}`}>
    <div className={styles.label}>{label}</div>
    {children}
    <div className={`${styles.value} ${style}`}>{value}</div>
  </div>;

const TransactionsDetailViewRow = ({ children, condition }) => (
  (condition === null || condition === false) ? null :
    <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
      {children}
    </div>);

class TransactionsDetailView extends React.Component {
  constructor(props) {
    super(props);

    const { search } = this.props.location || window.location;
    const params = new URLSearchParams(search);
    const transactionId = params.get('id');

    if (props.peers.data &&
      transactionId) {
      this.props.loadTransaction({
        activePeer: props.peers.data,
        id: transactionId,
      });
    }
  }

  getVoters(dataName) {
    const data = this.props.transaction.votesName && this.props.transaction.votesName[dataName];

    return data ? data.map((delegate, key) => (
      <Link className={`${styles.addressLink} ${styles.clickable} voter-address`}
        to={`${routes.explorer.path}${routes.accounts.path}/${delegate.address}`}
        key={`${key}-${dataName}`}>
        {`${delegate.username} `}
      </Link>
    )) : '';
  }

  getDateField() {
    return (
      <TransactionsDetailViewField
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

  getFirstRow(isDelegateVote) {
    return (
      <TransactionsDetailViewRow>
        <TransactionsDetailViewField
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
        </TransactionsDetailViewField>
        {isDelegateVote ? this.getDateField() :
          <TransactionsDetailViewField
            label={this.props.t('Recipient')}
            style={styles.sender}
            value={
              this.props.transaction.recipientId ?
                <Link className={`${styles.addressLink} ${styles.clickable}`} id='receiver-address'
                  to={`${routes.explorer.path}${routes.accounts.path}/${this.props.transaction.recipientId}`}>
                  {this.props.transaction.recipientId}
                </Link> : '-'
            }
            column>
            {this.props.transaction.recipientId ?
              <figure className={styles.accountVisual}>
                <AccountVisual address={this.props.transaction.recipientId} size={43} />
              </figure> : null
            }
          </TransactionsDetailViewField>
        }
      </TransactionsDetailViewRow>
    );
  }

  render() {
    const deletedVoters = this.getVoters('deleted');
    const addedVoters = this.getVoters('added');
    const isDelegateVote = this.props.transaction.type === 3;

    return (
      <div className={`${styles.details}`}>
        {
          this.props.prevStep ?
            <header>
              <h3>
                <small className={`${styles.backButton} transaction-details-back-button`} onClick={() => {
                  this.props.history.push(this.props.history.location.pathname);
                  this.props.prevStep();
                }}>
                  <FontIcon className={`${styles.arrow}`} value='arrow-left'/>
                  <span className={`${styles.text}`}>{this.props.t('Back to overview')}</span>
                </small>
              </h3>
            </header> : null
        }
        <div>
          <TransactionsDetailViewRow condition={!this.props.match.params.id}>
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
          </TransactionsDetailViewRow>

          {this.getFirstRow(isDelegateVote)}

          <TransactionsDetailViewRow condition={this.props.transaction.type === 0}>
            {this.getDateField()}
            <TransactionsDetailViewField
              label={this.props.t('Amount (LSK)')}
              value={
                <Amount
                  value={this.props.transaction}
                  address={this.props.address}>
                </Amount>
              }
              style={styles.amount} />
          </TransactionsDetailViewRow>

          <TransactionsDetailViewRow condition={this.props.transaction.amount === 0}>
            <TransactionsDetailViewField
              label={this.props.t('Added votes')}
              value={addedVoters} />
            <TransactionsDetailViewField
              label={this.props.t('Removed votes')}
              value={deletedVoters} />
          </TransactionsDetailViewRow>

          <TransactionsDetailViewRow>
            <TransactionsDetailViewField
              label={this.props.t('Additional fee')}
              value={<LiskAmount val={this.props.transaction.fee} />} />
            <TransactionsDetailViewField
              label={this.props.t('Confirmations')}
              value={<span>{this.props.transaction.confirmations}</span>} />
          </TransactionsDetailViewRow>

          <TransactionsDetailViewRow>
            {this.props.prevStep &&
              <TransactionsDetailViewField
                label={this.props.t('Transaction ID')}
                value={
                  <CopyToClipboard
                    value={this.props.transaction.id}
                    text={this.props.transaction.id}
                    copyClassName={`${styles.copy}`} />
                } />
            }
            <TransactionsDetailViewField label='' value='' />
          </TransactionsDetailViewRow>
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

