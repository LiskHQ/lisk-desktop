import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { TimeFromTimestamp, DateFromTimestamp } from './../timestamp/index';
import styles from './transactions.css';
import { FontIcon } from '../fontIcon';
import LiskAmount from '../liskAmount';
import Amount from './amount';

class TransactionsDetailView extends React.Component {
  render() {
    return (
      <div className={`${styles.details}`}>
        <header>
          <small>
            <FontIcon value='arrow-left' onClick={() => this.props.prevStep()}/> Back to overview
          </small>
        </header>
        <div>
          <div className={`${grid.row} ${styles.row}`}>
            <div className={`${grid['col-xs-6']} ${grid['col-sm-4']} ${grid['col-md-4']}`}>
              <div className={styles.label}>Sender</div>
              <div style={{ fontWeight: '500' }}>{this.props.value.senderId}</div>
            </div>
            <div className={`${grid['col-xs-6']} ${grid['col-sm-4']} ${grid['col-md-4']}`}>
              <div className={styles.label}>Recipient</div>
              <div>{this.props.value.recipientId ? this.props.value.recipientId : '-'}</div>
            </div>
            <div className={`${grid['col-xs-6']} ${grid['col-sm-4']} ${grid['col-md-4']}`}>
              <div className={styles.label}>Date</div>
              <div>
                <DateFromTimestamp
                  time={this.props.value.timestamp} /> - <TimeFromTimestamp
                  time={this.props.value.timestamp}/>
              </div>
            </div>
          </div>
          <div className={`${grid.row} ${styles.row}`}>
            <div className={`${grid['col-md-4']}`}>
              <div className={styles.label}>Amount (LSK)</div>
              <div><Amount {...this.props}></Amount></div>
            </div>
            <div className={`${grid['col-md-4']}`}>
              <div className={styles.label}>Additional fee</div>
              <div><LiskAmount val={this.props.value.fee} /></div>
            </div>
            <div className={`${grid['col-md-4']}`}>
              <div className={styles.label}>Confirmations</div>
              <div>{this.props.value.confirmations}</div>
            </div>
          </div>
          <div className={`${grid.row} ${styles.row}`}>
            <div className={`${grid['col-md-4']}`}>
              <div className={styles.label}>Transaction ID</div>
              <div>{this.props.value.id}</div>
            </div>
            <div className={`${grid['col-md-4']}`}>
              <div className={styles.label}></div>
              <div></div>
            </div>
            <div className={`${grid['col-md-4']}`}>
              <div className={styles.label}></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TransactionsDetailView;
