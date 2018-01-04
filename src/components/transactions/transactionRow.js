import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import CopyToClipboard from '../copyToClipboard';
import TransactionType from './transactionType';
import styles from './transactions.css';
import LiskAmount from '../liskAmount';
import Amount from './amount';
import Spinner from '../spinner';
import { TimeFromTimestamp, DateFromTimestamp } from './../timestamp/index';
import { FontIcon } from '../fontIcon';

class TransactionRow extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
    };
  }
  // eslint-disable-next-line class-methods-use-this
  shouldComponentUpdate(nextProps) {
    return nextProps.value.confirmations <= 1000;
  }

  render() {
    const { props } = this;
    return (
      <div className={`${grid.row} ${styles.rows} ${styles.paddingLeft} transactionsRow`}>
        <div className={`${styles.leftText} ${grid['col-xs-6']}`}>
          <div className={`${styles.mainRow} ${styles.address}`}>
            <TransactionType {...props.value} address={props.address}></TransactionType>
          </div>
          {this.state.isOpen ? <div className={styles.subRow}> {props.t('Transaction ID: ')}
            <a href="#">{props.value.id}</a>
            <CopyToClipboard value={props.value.id} text=' ' className={styles.copyIcon}/>
          </div> : ''}
        </div>
        <div className={`${styles.rightText} ${grid['col-xs-2']}`}>
          <div className={styles.mainRow}>
            {props.value.confirmations ? <DateFromTimestamp time={props.value.timestamp} />
              : <Spinner />}
          </div>
          {this.state.isOpen ? <div className={styles.subRow}><TimeFromTimestamp time={props.value.timestamp}/></div> : ''}
        </div>
        <div className={`${styles.rightText} ${grid['col-xs-3']}`}>
          <div className={styles.mainRow}><Amount {...props}></Amount></div>
          {this.state.isOpen ? <div className={styles.subRow}> {props.t('Additional fee:')} <LiskAmount val={props.value.fee} /></div> : ''}
        </div>
        <div className={`${styles.rightText} ${grid['col-xs-1']}`}>
          <div className={`${styles.mainRow} ${styles.clickable}`} onClick={props.nextStep.bind(this, { ...props })}>
            <FontIcon value='arrow-right'/>
          </div>
        </div>
      </div>
    );
  }
}

export default translate()(TransactionRow);
