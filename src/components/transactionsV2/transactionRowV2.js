import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import TransactionTypeV2 from './transactionTypeV2';
import styles from './transactionRowV2.css';
import Amount from './amount';
import Spinner from '../spinner';
import LiskAmount from '../liskAmount';
import { DateFromTimestamp } from './../timestamp/index';

class TransactionRow extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  shouldComponentUpdate(nextProps) {
    return nextProps.value.id !== this.props.value.id || nextProps.value.confirmations <= 1000;
  }

  render() {
    const { props } = this;
    const onClick = !props.onClick ? (() => {}) : () => props.onClick(this.props);
    return (
      <div className={`${grid.row} ${styles.row} ${styles.clickable} transactions-row`} onClick={onClick}>
        <div className={`${grid['col-xs-6']} ${grid['col-sm-3']} transactions-cell`}>
          <div className={`${styles.address} transaction-address`}>
            <TransactionTypeV2 {...props.value} address={props.address} />
          </div>
        </div>
          <div className={`${styles.hiddenXs} ${grid['col-sm-3']} transactions-cell`}>
            <div className={`${styles.reference} transaction-reference`}>
                {props.value.asset && props.value.asset.data ?
                  <span>{props.value.asset.data}</span>
                : '-'}
            </div>
          </div>
        <div className={`${styles.hiddenXs} ${grid['col-sm-2']} transactions-cell`}>
          {props.value.confirmations ? <DateFromTimestamp time={props.value.timestamp} />
            : <Spinner />}
        </div>
        <div className={`${styles.hiddenXs} ${grid['col-sm-2']} transactions-cell`}>
          <LiskAmount val={props.value.fee}/> {props.t('LSK')}
        </div>
        <div className={`${grid['col-xs-6']} ${grid['col-sm-2']} transactions-cell`}>
          <Amount {...props}></Amount>
        </div>
      </div>
    );
  }
}

export default translate()(TransactionRow);
