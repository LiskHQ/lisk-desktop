import React from 'react';
import { translate } from 'react-i18next';
import styles from './transactions.css';

const TransactionsHeader = ({ tableStyle, t }) => (
  <thead>
    <tr>
      <th className={`${tableStyle.headCell} ${styles.centerText}`}>{t('Time')}</th>
      <th className={`${tableStyle.headCell} ${styles.centerText} ${styles.hiddenXs}`}>
        {t('Transaction ID')}
      </th>
      <th className={`${tableStyle.headCell} ${styles.centerText}`}>{t('From / To')}</th>
      <th className={`${tableStyle.headCell} ${styles.centerText}`}></th>
      <th className={`${tableStyle.headCell} ${styles.centerText}`}>{t('Amount')}</th>
      <th className={`${tableStyle.headCell} ${styles.centerText}`}>{t('Fee')}</th>
    </tr>
  </thead>);

export default translate()(TransactionsHeader);
