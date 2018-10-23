import React from 'react';
import { translate } from 'react-i18next';
import { ActionButton, Button } from './../toolbox/buttons/button';

import ledgerNano from '../../assets/images/ledger-nano-s.png';
import styles from './unlockWallet.css';

const UnlockWallet = ({ handleOnClick, cancelLedgerLogin, t }) => (
  <div>
    <h1 className={styles.title}>{t('Open the Lisk App')}</h1>
    <div className={styles.image}><img src={ledgerNano} width={300} height={80} /></div>
    <div className={styles.description}>{t('Open the Lisk App with your Ledger Nano S')}</div>
    <div className={styles.buttonWrapper}>
      <Button className={styles.button} onClick={() => { cancelLedgerLogin(); }} >{t('Cancel')}</Button>
      <ActionButton className={styles.button} onClick={() => { handleOnClick(); }}>{t('Try Again')}</ActionButton>
    </div>
  </div>
);

export default translate()(UnlockWallet);
