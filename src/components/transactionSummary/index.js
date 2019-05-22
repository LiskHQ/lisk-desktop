import React from 'react';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import PassphraseInputV2 from '../passphraseInputV2/passphraseInputV2';
import styles from './transactionSummary.css';

const checkSecondPassphrase = () => {};

const TransactionSummary = ({
  title, children, confirmButton, cancelButton, account, t,
}) => (
  <div className={styles.wrapper}>
    <header className='summary-header'>
      <h1>{title}</h1>
    </header>
    <div className={styles.content}>
      {children}
      {account.secondPublicKey ?
        <section className='summary-second-passphrase'>
            <label>{t('Second passphrase')}</label>
            <PassphraseInputV2
              isSecondPassphrase={true}
              secondPPFeedback={''}
              inputsLength={12}
              maxInputsLength={24}
              onFill={checkSecondPassphrase} />
        </section>
        : null
      }
    </div>
    <footer className='summary-footer'>
      <PrimaryButtonV2
        className={`${styles.confirmBtn} confirm-button`}
        onClick={confirmButton.onClick}>
        {confirmButton.label}
      </PrimaryButtonV2>
      <TertiaryButtonV2
        className={`${styles.editBtn} cancel-button`}
        onClick={cancelButton.onClick}>
        {cancelButton.label}
      </TertiaryButtonV2>
    </footer>
  </div>
);

export default TransactionSummary;

