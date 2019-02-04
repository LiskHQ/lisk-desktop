import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import TransactionTypeV2 from './transactionTypeV2';
import TransactionDetailV2 from './transactionDetailV2';
import styles from './transactionRowV2.css';
import AmountV2 from './amountV2';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import LiskAmount from '../liskAmount';
import { DateTimeFromTimestamp } from './../timestamp/index';

class TransactionRowV2 extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  shouldComponentUpdate(nextProps) {
    return nextProps.value.id !== this.props.value.id || nextProps.value.confirmations <= 1000;
  }

  render() {
    const { props } = this;
    const onClick = props.onClick || (() => {});
    return (
      <div className={`${grid.row} ${styles.row} transactions-row`} onClick={() => onClick(props)}>
        <div className={`${grid['col-xs-6']} ${grid['col-sm-4']} ${grid['col-lg-3']} transactions-cell`}>
          <TransactionTypeV2 {...props.value}
            followedAccounts={props.followedAccounts}
            address={props.address} />
        </div>
          <div className={`${styles.hiddenXs} ${grid['col-sm-2']} ${grid['col-lg-3']} transactions-cell`}>
            <TransactionDetailV2
              t={props.t}
              type={props.value.type}
              asset={props.value.asset} />
          </div>
        <div className={`${styles.hiddenXs} ${grid['col-sm-2']} ${grid['col-lg-2']} transactions-cell`}>
          {props.value.confirmations ? <DateTimeFromTimestamp time={props.value.timestamp} />
            : <SpinnerV2 label={props.t('Pending...')} />}
        </div>
        <div className={`${styles.hiddenXs} ${grid['col-sm-2']} ${grid['col-lg-2']} transactions-cell`}>
          <LiskAmount val={props.value.fee}/> {props.t('LSK')}
        </div>
        <div className={`${grid['col-xs-6']} ${grid['col-sm-2']} ${grid['col-lg-2']} transactions-cell`}>
          <AmountV2 {...props}/>
        </div>
      </div>
    );
  }
}

export default translate()(TransactionRowV2);
