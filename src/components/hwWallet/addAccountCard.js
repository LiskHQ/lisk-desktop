import React from 'react';
import { FontIcon } from '../fontIcon';

import styles from './accountCard.css';

const AddAccountCard = ({ addAccount, t }) => (
  <div className={`${styles.card} ${styles.addAccountCard}`} onClick={() => { addAccount(); }}>
    <div><FontIcon className={styles.addIcon} value='add' /></div>
    <div className={styles.addLabel}>{t('Add new')}</div>
  </div>);

export default AddAccountCard;
