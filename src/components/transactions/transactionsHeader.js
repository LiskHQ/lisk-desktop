import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import styles from './transactionRow.css';

const TransactionsHeader = ({ t }) => (
  <div className={`${grid.row}  ${styles.rows} ${styles.paddingLeft}`} id="transactionsHeader">
    <div className={`${styles.leftText} ${grid['col-xs-6']} ${grid['col-sm-6']} ${styles.header} transactions-header`}>{t('Address')}</div>
    <div className={`${styles.rightText} ${grid['col-xs-0']} ${grid['col-sm-2']} ${styles.header} transactions-header ${styles.hiddenXs}`}>{t('Date')}</div>
    <div className={`${styles.rightText} ${grid['col-xs-5']} ${grid['col-sm-3']} ${styles.header} transactions-header`}>{t('Amount (LSK)')}</div>
    <div className={`${grid['col-xs-1']} ${grid['col-sm-1']}`}></div>
  </div>);

export default translate()(TransactionsHeader);
