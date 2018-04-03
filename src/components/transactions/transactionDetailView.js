import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import { TimeFromTimestamp, DateFromTimestamp } from './../timestamp/index';
import CopyToClipboard from '../copyToClipboard';
import AccountVisual from '../accountVisual';
import styles from './transactionDetailView.css';
import { FontIcon } from '../fontIcon';
import TransactionType from './transactionType';
import LiskAmount from '../liskAmount';
import Amount from './amount';
import routes from './../../constants/routes';

const TransactionsDetailView = props => (
  <div className={`${styles.details}`}>
    {
      props.prevStep ?
        <header>
          <h3>
            <small className={`${styles.backButton}`} onClick={() => {
              props.history.push(props.history.location.pathname);
              props.prevStep();
            }} id='transactionDetailsBackButton'>
              <FontIcon className={`${styles.arrow}`} value='arrow-left'/>
              <span className={`${styles.text}`}>{props.t('Back to overview')}</span>
            </small>
          </h3>
        </header> : null
    }
    <div>
      <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
        <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} ${styles.column}`}>
          <div className={styles.label}>{props.t('Sender')}</div>
          {
            props.value.senderId ?
              <figure className={styles.accountVisual}>
                <AccountVisual address={props.value.senderId} size={43} />
              </figure> : null
          }
          <div className={`${styles.value} ${styles.sender} `}>
            <Link className={`${styles.addressLink} ${styles.clickable}`} id='sender-address'
              to={`${routes.explorer.path}${routes.account.path}/${props.value.senderId}`}>
              {props.value.senderId}
            </Link>
          </div>
        </div>
        <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} ${styles.column}`}>
          <div className={styles.label}>{props.t('Recipient')}</div>
          {
            props.value.recipientId ?
              <figure className={styles.accountVisual}>
                <AccountVisual address={props.value.recipientId} size={43} />
              </figure> : null
          }
          <div className={styles.value}>
            {
              props.value.recipientId ?
                <Link className={`${styles.addressLink} ${styles.clickable}`} id='receiver-address'
                  to={`${routes.explorer.path}${routes.account.path}/${props.value.recipientId}`}>
                  {props.value.recipientId}
                </Link> : '-'
            }
          </div>
        </div>
      </div>
      <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
        <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} ${styles.column}`}>
          <div className={styles.label}>{props.t('Date')}</div>
          <div className={styles.value}>
            { props.value.timestamp ?
              <span>
                <DateFromTimestamp
                  time={props.value.timestamp} /> - <TimeFromTimestamp
                  time={props.value.timestamp}/>
              </span> :
              <span>{props.t('Pending')}</span>
            }
          </div>
        </div>
        <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} ${styles.column}`}>
          {
            props.value.type === 0 ?
              <div>
                <div className={styles.label}>{props.t('Amount (LSK)')}</div>
                <div className={`${styles.value} ${styles.amount}`}><Amount {...props}></Amount></div>
              </div> :
              <div>
                <div className={styles.label}>{props.t('Type')}</div>
                <div className={styles.value}>
                  <TransactionType {...props.value} address={props.value.senderId} />
                </div>
              </div>
          }
        </div>
      </div>
      <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
        <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} ${styles.column}`}>
          <div className={styles.label}>{props.t('Additional fee')}</div>
          <div className={styles.value}><LiskAmount val={props.value.fee} /></div>
        </div>
        <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} ${styles.column}`}>
          <div className={styles.label}>{props.t('Confirmations')}</div>
          <div className={styles.value}>
            <span>{props.value.confirmations}</span>
          </div>
        </div>
      </div>
      <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
        {props.prevStep && <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} ${styles.column}`}>
          <div className={styles.label}>{props.t('Transaction ID')}</div>
          <div className={styles.value}><CopyToClipboard
            value={props.value.id}
            text={props.value.id}
            copyClassName={`${styles.copy}`} /></div>
        </div>}
        <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} ${styles.column}`}>
        </div>
      </div>
    </div>
    <footer>
    </footer>
  </div>
);

export default TransactionsDetailView;
