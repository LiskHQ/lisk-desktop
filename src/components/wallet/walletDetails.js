import React from 'react';
import { translate } from 'react-i18next';
import AccountVisual from '../accountVisual';
import Box from '../box';
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
      <Box className={styles.wrapper}>
        <header>
          <h1>{t('Wallet Details')}</h1>
        </header>
        <section className={styles.row}>
          <AccountVisual
            address={address}
            size={40}
          />
          <div>
            <label>{t('Address')}</label>
            <div className={styles.value}>
              <CopyToClipboard
                value={address}
                className="account-address"
              />
            </div>
          </div>
        </section>
        <section className={styles.row}>
          <Icon name="balance" />
          <div>
            <label>{t('Balance')}</label>
            <div className={styles.value}>
              <LiskAmount val={balance} />
              {' '}
              {activeToken}
            </div>
          </div>
        </section>
      </Box>
    );
  }
}

export default translate()(WalletDetails);
