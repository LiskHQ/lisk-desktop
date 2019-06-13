import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import TransactionTypeFigure from '../transactions/typeFigure/TransactionTypeFigure';
import TransactionAddress from '../transactions/address/TransactionAddress';
import TransactionAmount from '../transactions/amount/TransactionAmount';
import TransactionDetailV2 from './transactionDetailV2';
import styles from './transactionRowV2.css';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import LiskAmount from '../liskAmount';
import { DateTimeFromTimestamp } from './../timestamp/index';
import TableRow from '../toolbox/table/tableRow';
import Icon from '../toolbox/icon';

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
    const { value, token } = props;
    const onClick = props.onClick || (() => {});
    const hasConfirmations = props.value.confirmations && props.value.confirmations > 0;
    const { isConfirmed } = this.state;
    return (
      <TableRow className={`${grid.row} ${styles.row} ${!hasConfirmations ? styles.pending : ''} transactions-row`} onClick={() => onClick(props)}>
        <div className={`${grid['col-sm-4']} ${grid['col-lg-3']} transactions-cell`}>
          <Icon name={props.address === value.senderId ? 'outgoing' : 'incoming' } className={styles.inOutIcon} />
          <TransactionTypeFigure
            address={props.address === value.senderId ? value.recipientId : value.senderId }
            transactionType={value.type}
          />
          <TransactionAddress
            address={props.address === value.senderId ? value.recipientId : value.senderId }
            bookmarks={props.bookmarks}
            t={props.t}
            token={token}
            transactionType={value.type}
          />
        </div>
        <div className={`${grid['col-sm-2']} ${grid['col-lg-2']} transactions-cell`}>
          <div className={`${styles.status} ${!isConfirmed ? styles.showSpinner : styles.showDate}`}>
            <SpinnerV2 completed={hasConfirmations} label={props.t('Pending...')} />
            <DateTimeFromTimestamp time={props.value.timestamp} token={token} />
          </div>
        </div>
        <div className={`${grid['col-sm-1']} ${grid['col-lg-2']} transactions-cell`}>
          <LiskAmount val={props.value.fee}/>&nbsp;{token}
        </div>
          <div className={`${grid['col-sm-3']} ${grid['col-lg-3']} transactions-cell`}>
            <TransactionDetailV2
              t={props.t}
              transaction={props.value} />
          </div>
        <div className={`${grid['col-sm-2']} ${grid['col-lg-2']} transactions-cell`}>
          <TransactionAmount
            address={props.address}
            token={token}
            transaction={props.value}
          />
        </div>
      </TableRow>
    );
  }
}

export default translate()(TransactionRowV2);
