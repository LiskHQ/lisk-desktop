import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { transactionLoadRequested } from '../../actions/transactions';
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
    if (props.peers.data) {
      this.props.transactionLoadRequested({ id: this.props.value.id });
    }
  }

  getVoters() {
    let deleted = this.props.transaction.votesName && this.props.transaction.votesName.deleted;
    let added = this.props.transaction.votesName && this.props.transaction.votesName.added;

    deleted = deleted ? deleted.map((delegate, key) => (
      <Link className={`${styles.addressLink} ${styles.clickable} voter-address`}
        to={`${routes.explorer.path}${routes.accounts.path}/${delegate.address}`}
        key={`${key}-deleted`}>
        {`${delegate.username} `}
      </Link>
    )) : '';
    added = added ? added.map((delegate, key) => (
      <Link className={`${styles.addressLink} ${styles.clickable} voter-address`}
        to={`${routes.explorer.path}${routes.accounts.path}/${delegate.address}`}
        key={`${key}-added`}>
        {`${delegate.username} `}
      </Link>
    )) : '';

    return { deleted, added };
  }

  render() {
    const voters = this.getVoters();
    return (
      <div className={`${styles.details}`}>
        {
          this.props.prevStep ?
            <header>
              <h3>
                <small className={`${styles.backButton}`} onClick={() => {
                  this.props.history.push(this.props.history.location.pathname);
                  this.props.prevStep();
                }} id='transactionDetailsBackButton'>
                  <FontIcon className={`${styles.arrow}`} value='arrow-left'/>
                  <span className={`${styles.text}`}>{this.props.t('Back to overview')}</span>
                </small>
              </h3>
            </header> : null
        }
        <div>

          <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
            <header>
              <h2 className={styles.title}>
                <TransactionType {...this.props.value} address={this.props.value.senderId} />
              </h2>
            </header>
          </div>
          <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
            <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.column}`}>
              <div className={styles.label}>{this.props.t('Sender')}</div>
              {
                this.props.value.senderId ?
                  <figure className={styles.accountVisual}>
                    <AccountVisual address={this.props.value.senderId} size={43} />
                  </figure> : null
              }
              <div className={`${styles.value} ${styles.sender} `}>
                <Link className={`${styles.addressLink} ${styles.clickable}`} id='sender-address'
                  to={`${routes.explorer.path}${routes.accounts.path}/${this.props.value.senderId}`}>
                  {this.props.value.senderId}
                </Link>
              </div>
            </div>
            <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.column}`}>
              <div className={styles.label}>{this.props.t('Recipient')}</div>
              {
                this.props.value.recipientId ?
                  <figure className={styles.accountVisual}>
                    <AccountVisual address={this.props.value.recipientId} size={43} />
                  </figure> : null
              }
              <div className={styles.value}>
                {
                  this.props.value.recipientId ?
                    <Link className={`${styles.addressLink} ${styles.clickable}`} id='receiver-address'
                      to={`${routes.explorer.path}${routes.accounts.path}/${this.props.value.recipientId}`}>
                      {this.props.value.recipientId}
                    </Link> : '-'
                }
              </div>
            </div>
          </div>
          <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
            <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
              <div className={styles.label}>{this.props.t('Date')}</div>
              <div className={styles.value}>
                { this.props.value.timestamp ?
                  <span>
                    <DateFromTimestamp
                      time={this.props.value.timestamp} /> - <TimeFromTimestamp
                      time={this.props.value.timestamp}/>
                  </span> :
                  <span>{this.props.t('Pending')}</span>
                }
              </div>
            </div>
            <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
              {
                this.props.value.type === 0 ?
                  <div>
                    <div className={styles.label}>{this.props.t('Amount (LSK)')}</div>
                    <div className={`${styles.value} ${styles.amount}`}><Amount {...this.props}></Amount></div>
                  </div> :
                  <div>
                    <div className={styles.label}>{this.props.t('Type')}</div>
                    <div className={styles.value}>
                      <TransactionType {...this.props.value} address={this.props.value.senderId} />
                    </div>
                  </div>
              }
            </div>
          </div>
          <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
            <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
              <div className={styles.label}>{this.props.t('Added votes')}</div>
              <div className={styles.value}>{voters.added}</div>
            </div>
            <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
              <div className={styles.label}>{this.props.t('Removed votes')}</div>
              <div className={styles.value}>{voters.deleted}</div>
            </div>
          </div>
          <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
            <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
              <div className={styles.label}>{this.props.t('Additional fee')}</div>
              <div className={styles.value}><LiskAmount val={this.props.value.fee} /></div>
            </div>
            <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
              <div className={styles.label}>{this.props.t('Confirmations')}</div>
              <div className={styles.value}>
                <span>{this.props.value.confirmations}</span>
              </div>
            </div>
          </div>
          <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
            {this.props.prevStep && <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${styles.columnNarrow}`}>
              <div className={styles.label}>{this.props.t('Transaction ID')}</div>
              <div className={styles.value}><CopyToClipboard
                value={this.props.value.id}
                text={this.props.value.id}
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
  transaction: state.transaction,
  peers: state.peers,
  votes: state.voting.votes,
});

const mapDispatchToProps = dispatch => ({
  transactionLoadRequested: data => dispatch(transactionLoadRequested(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TransactionsDetailView));

