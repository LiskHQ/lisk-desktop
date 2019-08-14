import React from 'react';
import { translate } from 'react-i18next';
import AccountVisual from '../accountVisual';
import Box from '../toolbox/box';
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
        <Box.Header>
          <h1>{t('Wallet details')}</h1>
        </Box.Header>
        <Box.Row className={styles.row}>
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
        </Box.Row>
        <Box.Row className={styles.row}>
          <Icon name="balance" />
          <div>
            <label>{t('Balance')}</label>
            <div className={styles.value}>
              <LiskAmount val={balance} />
              {' '}
              {activeToken}
            </div>
          </div>
        </Box.Row>
      </Box>
    );
  }
}

export default translate()(WalletDetails);
