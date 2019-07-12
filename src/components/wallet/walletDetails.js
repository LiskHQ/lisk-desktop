import React from 'react';
import { translate } from 'react-i18next';
import AccountVisual from '../accountVisual';
import BoxV2 from '../boxV2';
import Icon from '../toolbox/icon';
import LiskAmount from '../liskAmount';
import CopyToClipboard from '../toolbox/copyToClipboard';
import styles from './walletDetails.css';

class WalletDetails extends React.Component {
  render() {
    const {
      balance, t, address, activeToken,
    } = this.props;

    return (
      <BoxV2 className={styles.wrapper}>
        <header>
          <h1>{t('Wallet details')}</h1>
        </header>
        <section className={styles.row}>
          <AccountVisual
            address={address}
            size={35}
            />
          <div>
            <label>{t('Address')}</label>
            <div className={styles.value} >
            <CopyToClipboard
              value={address}
              className='account-address'
              copyClassName={styles.copyIcon}
            />
            </div>
          </div>
        </section>
        <section className={styles.row}>
          <Icon name='balance' />
          <div>
            <label>{t('Balance')}</label>
            <div className={styles.value} ><LiskAmount val={balance} /> {activeToken}</div>
          </div>
        </section>
      </BoxV2>
    );
  }
}

export default translate()(WalletDetails);
