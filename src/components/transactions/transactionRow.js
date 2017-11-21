import React from 'react';
import moment from 'moment';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import TransactionType from './transactionType';
import styles from './transactions.css';
import Amount from './amount';
import Spinner from '../spinner';
import { _convertTimeFromFirstBlock } from './../timestamp/index';

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
  }

  render() {
    const props = this.props;
    const day = moment(_convertTimeFromFirstBlock(props.value.timestamp));

    return (
      <div className={`${grid.row} ${styles.rows}`}>
        <div className={`${styles.leftText} ${grid['col-xs-6']} ${grid['col-sm-6']} ${grid['col-md-6']}`}>
          <div className={`${styles.mainRow} ${styles.address}`}>
            <TransactionType {...props.value} address={props.address}></TransactionType>
          </div>
          {this.state.isOpen ? <div className={styles.subRow}> Transaction ID: <a href="#">{props.value.id}</a></div> : ''}
        </div>
        <div className={`${styles.rightText} ${grid['col-xs-2']} ${grid['col-sm-2']} ${grid['col-md-2']}`}>
          {props.value.confirmations ? <div className={styles.mainRow}> {day.format('ll')}</div> : <Spinner />}
          {this.state.isOpen ? <div className={styles.subRow}>{day.format('LTS')}</div> : ''}
        </div>
        <div className={`${styles.rightText} ${grid['col-xs-2']} ${grid['col-sm-2']} ${grid['col-md-2']}`}>
          <div className={styles.mainRow}><Amount {...props}></Amount></div>
        </div>
        <div className={`${styles.centerText} ${grid['col-xs-2']} ${grid['col-sm-2']} ${grid['col-md-2']}`}>
          <div className={`${styles.mainRow} ${styles.clickable}`} onClick={this.toggleRow.bind(this)}>
            <img src="./../../assets/images/darkblue_angle_down.svg" className={this.state.isOpen ? styles.turnArrow : ''}/>
          </div>
        </div>
      </div>
    );
  }
}

export default translate()(TransactionRow);
