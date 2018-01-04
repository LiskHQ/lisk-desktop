import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import styles from './transactions.css';

const TransactionsHeader = ({ t }) => (
  <div className={`${grid.row}  ${styles.rows} ${styles.paddingLeft}`} id="transactionsHeader">
    <div className={`${styles.leftText} ${grid['col-xs-6']} ${styles.header}`}>{t('Address')}</div>
    <div className={`${styles.rightText} ${grid['col-xs-2']} ${styles.header}`}>{t('Date')}</div>
    <div className={`${styles.rightText} ${grid['col-xs-3']} ${styles.header}`}>{t('Amount (LSK)')}</div>
    <div className={`${grid['col-xs-1']}`}></div>
  </div>);

export default translate()(TransactionsHeader);
