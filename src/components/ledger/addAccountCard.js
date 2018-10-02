import React from 'react';

import styles from './accountCard.css';

const AddAccountCard = ({ addAccount }) => (
  <div className={styles.card} onClick={() => { addAccount(account); }}>
    +
  </div>);
  // AddAccount currentAccounts length + 1, differentation on servers

export default AddAccountCard;
