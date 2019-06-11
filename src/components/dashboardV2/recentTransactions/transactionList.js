import React from 'react';
import { Link } from 'react-router-dom';
import TransactionTypeFigure from '../../transactions/typeFigure/TransactionTypeFigure';
import TransactionAddress from '../../transactions/address/TransactionAddress';
import TransactionAmount from '../../transactions/amount/TransactionAmount';
import { SecondaryButtonV2 } from '../../toolbox/buttons/button';
import routes from '../../../constants/routes';
import styles from './recentTransactions.css';

const TransactionList = ({
  account,
  bookmarks,
  activeToken,
  t,
  transactions,
}) => (
  <div className={`${styles.wrapper} recent-transactions-list-container`}>
    <header>
      <label>{t('Transactions')}</label>
      <label>{t('Amount')}</label>
    </header>
    <div className={styles.list}>
    {
      transactions.map((tx, index) =>
        <Link
          key={index}
          to={`${routes.transactions.pathPrefix}${routes.transactions.path}/${tx.id}`}
          className={styles.listRow}
        >
          <TransactionTypeFigure
            address={tx.recipientId}
            transactionType={tx.type}
          />
          <TransactionAddress
            address={tx.recipientId}
            bookmarks={bookmarks}
            t={t}
            token={activeToken}
            transactionType={tx.type}
          />
          <TransactionAmount
            address={account.address}
            token={activeToken}
            transaction={tx}
          />
        </Link>)
    }
    </div>
    <Link to={routes.wallet.path}>
      <SecondaryButtonV2>{t('View All')}</SecondaryButtonV2>
    </Link>
  </div>
);

export default TransactionList;
