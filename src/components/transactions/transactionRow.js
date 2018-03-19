import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import TransactionType from './transactionType';
import styles from './transactions.css';
import Amount from './amount';
import Spinner from '../spinner';
import { DateFromTimestamp } from './../timestamp/index';
import { FontIcon } from '../fontIcon';

class TransactionRow extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  shouldComponentUpdate(nextProps) {
    return nextProps.value.id !== this.props.value.id || nextProps.value.confirmations <= 1000;
  }

  render() {
    const { props } = this;
    const nextStep = props.nextStep || (() => {});
    return (
      <div className={`${grid.row} ${styles.rows} ${styles.clickable} transactionsRow`} onClick={nextStep.call({ ...props })}>
        <div className={`${styles.leftText} ${grid['col-xs-6']} ${grid['col-sm-6']} transactions-cell`}>
          <div className={`${styles.mainRow} ${styles.address}`}>
            <TransactionType {...props.value} address={props.address}></TransactionType>
          </div>
        </div>
        <div className={`${styles.rightText} ${grid['col-xs-0']} ${grid['col-sm-2']} transactions-cell`}>
          <div className={`${styles.mainRow} ${styles.hiddenXs}`}>
            {props.value.confirmations ? <DateFromTimestamp time={props.value.timestamp} />
              : <Spinner />}
          </div>
        </div>
        <div className={`${styles.rightText} ${grid['col-xs-5']} ${grid['col-sm-3']} transactions-cell`}>
          <div className={styles.mainRow}><Amount {...props}></Amount></div>
        </div>
        <div className={`${styles.rightText} ${grid['col-xs-1']} ${grid['col-sm-1']} transactions-cell`}>
          { props.nextStep ?
            <div className={`${styles.mainRow} `} >
              <FontIcon value='arrow-right'/>
            </div> :
            null
          }
        </div>
      </div>
    );
  }
}

export default translate()(TransactionRow);
