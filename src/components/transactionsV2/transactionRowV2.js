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
import TableRow from '../toolbox/table/tableRow';

class TransactionRowV2 extends React.Component {
  constructor() {
    super();

    this.state = {
      isConfirmed: false,
    };

    this.setIsConfirmed = this.setIsConfirmed.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!this.state.isConfirmed && nextProps.value.confirmations) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.setIsConfirmed, 2000);
    }

    return (!this.state.isConfirmed && nextState.isConfirmed)
      || nextProps.value.id !== this.props.value.id
      || nextProps.value.confirmations <= 1000;
  }

  componentDidMount() {
    if (this.props.value.confirmations && this.props.value.confirmations > 0) {
      this.setIsConfirmed();
    }
  }

  setIsConfirmed() {
    this.setState({
      isConfirmed: true,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { props } = this;
    const onClick = props.onClick || (() => {});
    const hasConfirmations = props.value.confirmations && props.value.confirmations > 0;
    const { isConfirmed } = this.state;
    return (
      <TableRow className={`${grid.row} ${styles.row} ${!hasConfirmations ? styles.pending : ''} transactions-row`} onClick={() => onClick(props)}>
        <div className={`${grid['col-xs-6']} ${grid['col-sm-4']} ${grid['col-lg-3']} transactions-cell`}>
          <TransactionTypeV2 {...props.value}
            followedAccounts={props.followedAccounts}
            address={props.address} />
        </div>
          <div className={`${styles.hiddenXs} ${grid['col-sm-3']} ${grid['col-lg-3']} transactions-cell`}>
            <TransactionDetailV2
              t={props.t}
              transaction={props.value} />
          </div>
        <div className={`${styles.hiddenXs} ${grid['col-sm-2']} ${grid['col-lg-2']} transactions-cell`}>
          <div className={`${styles.status} ${!isConfirmed ? styles.showSpinner : styles.showDate}`}>
            <SpinnerV2 completed={hasConfirmations} label={props.t('Pending...')} />
            <DateTimeFromTimestamp time={props.value.timestamp} />
          </div>
        </div>
        <div className={`${styles.hiddenXs} ${grid['col-sm-1']} ${grid['col-lg-2']} transactions-cell`}>
          <LiskAmount val={props.value.fee}/> {props.t('LSK')}
        </div>
        <div className={`${grid['col-xs-6']} ${grid['col-sm-2']} ${grid['col-lg-2']} transactions-cell`}>
          <AmountV2 {...props}/>
        </div>
      </TableRow>
    );
  }
}

export default translate()(TransactionRowV2);
