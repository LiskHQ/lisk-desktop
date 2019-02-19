// istanbul ignore file
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import TransactionType from './transactionType';
import styles from './transactionRow.css';
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
    const onClick = !props.onClick ? (() => {}) : () => props.onClick(this.props);
    return (
      <div className={`${grid.row} ${styles.rows} ${styles.clickable} transactions-row`} onClick={onClick}>
        <div className={`${styles.leftText} ${grid['col-xs-6']} ${grid['col-sm-4']} transactions-cell`}>
          <div className={`${styles.address} transaction-address`}>
            <TransactionType {...props.value} address={props.address}></TransactionType>
          </div>
        </div>
          <div className={`${styles.rightText} ${grid['col-sm-3']} transactions-cell`}>
            <div className={`${styles.hiddenXs} ${styles.reference} transaction-reference`}>
                {props.value.asset && props.value.asset.data ?
                  <span>{props.value.asset.data}</span>
                : '-'}
            </div>
          </div>
        <div className={`${styles.rightText} ${grid['col-sm-2']} transactions-cell`}>
          <div className={`${styles.hiddenXs}`}>
            {props.value.confirmations ? <DateFromTimestamp time={props.value.timestamp} />
              : <Spinner />}
          </div>
        </div>
        <div className={`${styles.rightText} ${grid['col-xs-5']} ${grid['col-sm-2']} transactions-cell`}>
          <Amount {...props}></Amount>
        </div>
        <div className={`${grid['col-xs-1']} ${grid['col-sm-1']} ${styles.arrowRow} transactions-cell`}>
          <FontIcon value='arrow-right'/>
        </div>
      </div>
    );
  }
}

export default translate()(TransactionRow);
