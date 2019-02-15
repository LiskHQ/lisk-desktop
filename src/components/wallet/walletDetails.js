import React from 'react';
import { translate } from 'react-i18next';
import BoxV2 from '../boxV2';
import styles from './walletDetails.css';
import LiskAmount from '../liskAmount';
import svg from '../../utils/svgIcons';
import transactionTypes from '../../constants/transactionTypes';

class walletDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      lastTx: {
        tx: { id: null, amount: 0 },
        pre: '',
      },
    };
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.lastTransaction.id && nextProps.lastTransaction.id !== this.state.lastTx.tx.id) {
      const tx = nextProps.lastTransaction;
      let pre = tx.senderId !== this.props.address ? '+' : '';
      if (tx.type === transactionTypes.send &&
          tx.recipientId !== this.props.address) {
        pre = '-';
      }
      this.setState({ lastTx: { tx, pre } });
    }

    if (nextProps.balance !== this.props.balance) {
      this.props.loadLastTransaction(this.props.address);
      return false;
    }
    return true;
  }

  render() {
    const {
      balance, t, address, wallets, className = '',
    } = this.props;
    const { lastTx } = this.state;

    const lastVisitDifference = balance -
      ((wallets[address] && wallets[address].lastBalance) || balance);

    return (
      <BoxV2 className={`${className} ${styles.wrapper}`}>
        <header>
          <h1>{t('Wallet overview')}</h1>
        </header>
        <div className={`${styles.content}`}>
          <div className={`${styles.details} account-balance`}>
            <img className={`${styles.icon}`} src={svg.icon_chart} />
            <div className={`${styles.info}`}>
              <span className={`${styles.label}`}>{t('Account Balance')}</span>
              <span className={`${styles.value}`}>
                <LiskAmount val={balance} />
                <span className={`${styles.currency}`}> {t('LSK')}</span>
              </span>
            </div>
          </div>
          <div className={`${styles.details} last-transaction`}>
            <img className={`${styles.icon}`} src={svg.icon_last_tx} />
            <div className={`${styles.info}`}>
              <span className={`${styles.label}`}>{t('Last Transaction')}</span>
              <span className={`${styles.value}`}>
                {lastTx.pre}<LiskAmount val={lastTx.tx.amount} />
                <span className={`${styles.currency}`}> {t('LSK')}</span>
              </span>
            </div>
          </div>
          <div className={`${styles.details} last-visit`}>
            <img className={`${styles.icon}`} src={svg.icon_cal} />
            <div className={`${styles.info}`}>
              <span className={`${styles.label}`}>{t('Since Last Visit')}</span>
              <span className={`${styles.value}`}>
                {lastVisitDifference > 0 ? '+' : ''}<LiskAmount val={lastVisitDifference} />
                <span className={`${styles.currency}`}> {t('LSK')}</span>
              </span>
            </div>
          </div>
        </div>
      </BoxV2>
    );
  }
}

export default translate()(walletDetails);
