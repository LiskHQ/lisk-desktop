import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import TransactionType from './transactionType';
import styles from './transactions.css';
import LiskAmount from '../liskAmount';
import Amount from './amount';
import Spinner from '../spinner';
import { TimeFromTimestamp, DateFromTimestamp } from './../timestamp/index';
import angle from './../../assets/images/darkblue_angle_down.svg';
import copy from './../../assets/images/icons/copy.svg';

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

  toggleRow() {
    this.setState({ isOpen: !this.state.isOpen });
    this.forceUpdate();
  }

  render() {
    const props = this.props;
    return (
      <div className={`${grid.row} ${styles.rows} ${styles.paddingLeft} transactionsRow`}>
        <div className={`${styles.leftText} ${grid['col-xs-6']}`}>
          <div className={`${styles.mainRow} ${styles.address}`}>
            <TransactionType {...props.value} address={props.address}></TransactionType>
          </div>
          {this.state.isOpen ? <div className={styles.subRow}> {props.t('Transaction ID: ')}
            <a href="#">{props.value.id} <img src={copy} className={styles.rows__copyIcon} /></a></div> : ''}
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
        <div className={`${styles.centerText} ${grid['col-xs-1']}`}>
          <div className={`${styles.mainRow} ${styles.clickable}`} onClick={this.toggleRow.bind(this)}>
            <img src={angle} className={this.state.isOpen ? styles.turnArrow : ''}/>
          </div>
        </div>
      </div>
    );
  }
}

export default translate()(TransactionRow);
