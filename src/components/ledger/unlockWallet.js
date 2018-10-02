import React from 'react';
import { translate } from 'react-i18next';
import { ActionButton, Button } from './../toolbox/buttons/button';

import styles from './unlockWallet.css';

const UnlockWallet = ({ history, handleOnClick }) => (<div>
  <h1 className={styles.title}>Open the Lisk App</h1>
  <div className={styles.description}>Open the Lisk App with your Ledger Nano S</div>
  <div className={styles.buttonWrapper}>
    <Button className={styles.button} onClick={() => { console.log('Cancel'); }} >Cancel</Button>
    <ActionButton className={styles.button} onClick={() => { handleOnClick(); }}>Try Again</ActionButton>
  </div>
</div>);

export default translate()(UnlockWallet);
