import React from 'react';
import { translate } from 'react-i18next';
import BoxV2 from '../boxV2';
import styles from './walletDetails.css';
import LiskAmount from '../liskAmount';
import svg from '../../utils/svgIcons';
import { getNetworkIdentifier } from '../../utils/getNetwork';
import transactionTypes from '../../constants/transactionTypes';

class walletDetails extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.balance !== this.props.balance) {
      this.props.loadLastTransaction(this.props.address);
      return false;
    }
    return true;
  }

  // eslint-disable-next-line complexity
  render() {
    const {
      balance, t, address, wallets, className = '',
      peers, lastTransaction,
    } = this.props;

    const lastTx = {
      tx: { ...lastTransaction },
      pre: lastTransaction.senderId && lastTransaction.senderId !== address ? '+' : '',
      totalAmount: lastTransaction.senderId && lastTransaction.senderId !== address
        ? lastTransaction.amount || 0
        : parseInt(lastTransaction.amount, 10) + parseInt(lastTransaction.fee, 10),
    };
    lastTx.pre = lastTransaction.type === transactionTypes.send
      && lastTransaction.recipientId !== address ? '-' : lastTx.pre;

    const networkIdentifier = getNetworkIdentifier(peers);
    const networkWallet = wallets[networkIdentifier] && wallets[networkIdentifier][address];
    const lastBalance = networkWallet && networkWallet.lastBalance;
    const lastVisitDifference = lastBalance
      ? parseInt(balance, 10) - parseInt(lastBalance, 10)
      : '-';

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
              {lastTx.tx && lastTx.tx.id ? (
                <React.Fragment>
                  {lastTx.pre}<LiskAmount val={lastTx.totalAmount} />
                  <span className={`${styles.currency}`}> {t('LSK')}</span>
                </React.Fragment>
              ) : '-'}
              </span>
            </div>
          </div>
          <div className={`${styles.details} last-visit`}>
            <img className={`${styles.icon}`} src={svg.icon_cal} />
            <div className={`${styles.info}`}>
              <span className={`${styles.label}`}>{t('Since Last Visit')}</span>
              <span className={`${styles.value}`}>
              {lastVisitDifference !== '-' ? (
                <React.Fragment>
                  {lastVisitDifference > 0 ? '+' : ''}<LiskAmount val={lastVisitDifference} />
                  <span className={`${styles.currency}`}> {t('LSK')}</span>
                </React.Fragment>
              ) : '-'}
              </span>
            </div>
          </div>
        </div>
      </BoxV2>
    );
  }
}

export default translate()(walletDetails);
