import React from 'react';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import styles from './transactionSummary.css';

const TransactionSummary = ({
  title, children, confirmButton, cancelButton,
}) => (
  <div className={styles.wrapper}>
    <header className='summary-header'>
      <h1>{title}</h1>
    </header>
    <div className={styles.content}>
     {children}
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

