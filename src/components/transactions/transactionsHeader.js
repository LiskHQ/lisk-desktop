import React from 'react';
import { translate } from 'react-i18next';
import styles from './transactions.css';

const TransactionsHeader = ({ tableStyle, t }) => (
  <thead>
    <tr>
      <th className={`${tableStyle.headCell} ${styles.leftText}`}>{t('Address')}</th>
      <th className={`${tableStyle.headCell} ${styles.rightText}`}>{t('Time')}</th>
      <th className={`${tableStyle.headCell} ${styles.rightText}`}>{t('Amount')}</th>
      <th className={`${tableStyle.headCell}`}></th>
    </tr>
  </thead>);

export default translate()(TransactionsHeader);
