import React from 'react';
import { Link } from 'react-router-dom';
import TransactionTypeFigure from '../../../transactions/typeFigure/TransactionTypeFigure';
import TransactionAddress from '../../../transactions/address/TransactionAddress';
import TransactionAmount from '../../../transactions/amount/TransactionAmount';
import { SecondaryButton } from '../../../toolbox/buttons/button';
import routes from '../../../../constants/routes';
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
      transactions.map(tx => (
        <Link
          key={tx.id}
          to={`${routes.transactions.pathPrefix}${routes.transactions.path}/${tx.id}`}
          className={`${styles.listRow} transactions-row`}
        >
          <div className={styles.avatarAndAddress}>
            <TransactionTypeFigure
              address={account.address === tx.recipientId ? tx.senderId : tx.recipientId}
              transactionType={tx.type}
            />
            <TransactionAddress
              address={account.address === tx.recipientId ? tx.senderId : tx.recipientId}
              bookmarks={bookmarks}
              t={t}
              token={activeToken}
              transactionType={tx.type}
            />
          </div>
          <TransactionAmount
            address={account.address}
            token={activeToken}
            transaction={tx}
            roundTo={2}
          />
        </Link>
      ))
    }
    </div>
    <Link to={routes.wallet.path} className="view-all">
      <SecondaryButton size="s">{t('View All')}</SecondaryButton>
    </Link>
  </div>
);

export default TransactionList;
