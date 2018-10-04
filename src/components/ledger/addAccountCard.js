import React from 'react';
import { FontIcon } from '../fontIcon';

import styles from './accountCard.css';

const AddAccountCard = ({ addAccount }) => (
  <div className={`${styles.card} ${styles.addAccountCard}`} onClick={() => { addAccount(); }}>
    <FontIcon className={styles.addIcon} value='add' />
  </div>);

export default AddAccountCard;
