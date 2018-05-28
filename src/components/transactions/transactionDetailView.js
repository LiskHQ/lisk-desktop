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
    let data = this.props.transaction.votesName && this.props.transaction.votesName[dataName];

    data = data ? data.map((delegate, key) => (
      <Link className={`${styles.addressLink} ${styles.clickable} voter-address`}
        to={`${routes.explorer.path}${routes.accounts.path}/${delegate.address}`}
        key={`${key}-${dataName}`}>
        {`${delegate.username} `}
      </Link>
    )) : '';

    // putting <span>•</span> inbetween array objects
    const intersperse = data && data
      .reduce((arr, val) => [...arr, val, <span className={styles.dot} key={`span-${val.props.children}`}>• </span>], [])
      .slice(0, -1);
    return intersperse;
  }

  getFirstRow(isDelegateVote) {
    const secondColumn = isDelegateVote ?
      (
        <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
          <div className={styles.label}>{this.props.t('Date')}</div>
          <div className={styles.value}>
            { this.props.transaction.timestamp ?
              <span>
                <DateFromTimestamp
                  time={this.props.transaction.timestamp} /> - <TimeFromTimestamp
                  time={this.props.transaction.timestamp}/>
              </span> :
              <span>{this.props.t('Pending')}</span>
            }
          </div>
        </div>
      ) : (
        <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.column}`}>
          <div className={styles.label}>{this.props.t('Recipient')}</div>
          {
            this.props.transaction.recipientId ?
              <figure className={styles.accountVisual}>
                <AccountVisual address={this.props.transaction.recipientId} size={43} />
              </figure> : null
          }
          <div className={styles.value}>
            {
              this.props.transaction.recipientId ?
                <Link className={`${styles.addressLink} ${styles.clickable}`} id='receiver-address'
                  to={`${routes.explorer.path}${routes.accounts.path}/${this.props.transaction.recipientId}`}>
                  {this.props.transaction.recipientId}
                </Link> : '-'
            }
          </div>
        </div>
      );
    return (
      <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
        <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.column}`}>
          <div className={styles.label}>{this.props.t('Sender')}</div>
          {
            this.props.transaction.senderId ?
              <figure className={styles.accountVisual}>
                <AccountVisual address={this.props.transaction.senderId} size={43} />
              </figure> : null
          }
          <div className={`${styles.value} ${styles.sender} `}>
            <Link className={`${styles.addressLink} ${styles.clickable}`} id='sender-address'
              to={`${routes.explorer.path}${routes.accounts.path}/${this.props.transaction.senderId}`}>
              {this.props.transaction.senderId}
            </Link>
          </div>
        </div>
        {secondColumn}
      </div>
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
          {
            !this.props.match.params.id ?
              <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
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
              </div> : null
          }
          {this.getFirstRow(isDelegateVote)}
          {
            this.props.transaction.type === 0 ?
              <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
                <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
                  <div className={styles.label}>{this.props.t('Date')}</div>
                  <div className={styles.value}>
                    { this.props.transaction.timestamp ?
                      <span>
                        <DateFromTimestamp
                          time={this.props.transaction.timestamp} /> - <TimeFromTimestamp
                          time={this.props.transaction.timestamp}/>
                      </span> :
                      <span>{this.props.t('Pending')}</span>
                    }
                  </div>
                </div>
                <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
                  {
                    this.props.transaction.type === 0 ?
                      <div>
                        <div className={styles.label}>{this.props.t('Amount (LSK)')}</div>
                        <div className={`${styles.value} ${styles.amount}`}>
                          <Amount
                            value={this.props.transaction}
                            address={this.props.address}>
                          </Amount>
                        </div>
                      </div> :
                      <div>
                        <div className={styles.label}>{this.props.t('Type')}</div>
                        <div className={styles.value}>
                          <TransactionType
                            {...this.props.transaction}
                            address={this.props.transaction.senderId} />
                        </div>
                      </div>
                  }
                </div>
              </div> : ''
          }
          {
            this.props.transaction.amount === 0 ?
              <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
                <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
                  <div className={styles.label}>{this.props.t('Added votes')}</div>
                  <div className={`${styles.value} voters`}>{addedVoters}</div>
                </div>
                <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
                  <div className={styles.label}>{this.props.t('Removed votes')}</div>
                  <div className={styles.value}>{deletedVoters}</div>
                </div>
              </div>
              : null
          }
          <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
            <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
              <div className={styles.label}>{this.props.t('Additional fee')}</div>
              <div className={styles.value}><LiskAmount val={this.props.transaction.fee} /></div>
            </div>
            <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
              <div className={styles.label}>{this.props.t('Confirmations')}</div>
              <div className={styles.value}>
                <span>{this.props.transaction.confirmations}</span>
              </div>
            </div>
          </div>
          <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
            {this.props.prevStep && <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
              <div className={styles.label}>{this.props.t('Transaction ID')}</div>
              <div className={styles.value}><CopyToClipboard
                value={this.props.transaction.id}
                text={this.props.transaction.id}
                copyClassName={`${styles.copy}`} /></div>
            </div>}
            <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
            </div>
          </div>
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

